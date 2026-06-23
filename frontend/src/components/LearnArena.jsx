import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const LearnArena = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [learnedIds, setLearnedIds] = useState([]);
  const [activeSubject, setActiveSubject] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLearnData = async () => {
      try {
        const questionResponse = await api.get('/assessments/learn-concepts/');
        const fetchedQuestions = questionResponse.data;
        setQuestions(fetchedQuestions);

        const uniqueSubjects = [...new Set(fetchedQuestions.map(q => q.subject))];
        setSubjects(uniqueSubjects);
        if (uniqueSubjects.length > 0) setActiveSubject(uniqueSubjects[0]);

        const progressResponse = await api.get('/assessments/learned/');
        setLearnedIds(progressResponse.data.learned_question_ids || []);
      } catch (error) {
        console.error("Failed to load Study Arena data.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLearnData();
  }, []);

  const handleToggleComplete = async (questionId) => {
    const isLearned = learnedIds.includes(questionId);
    if (isLearned) setLearnedIds(learnedIds.filter(id => id !== questionId));
    else setLearnedIds([...learnedIds, questionId]);

    try {
      await api.post('/assessments/learned/', { question_id: questionId });
    } catch (error) {
      alert("Failed to save progress. Are you logged in?");
    }
  };

  const currentQuestions = questions.filter(q => q.subject === activeSubject);
  const isSubjectComplete = currentQuestions.length > 0 && currentQuestions.every(q => learnedIds.includes(q.id));

  const handleTakeTest = async () => {
    try {
        const response = await api.get('/assessments/list/');
        const assessments = response.data.results || response.data;
        const targetAssessment = assessments.find(a => {
            const dbSubject = a.subject?.name || a.subject || a.title; 
            return dbSubject && dbSubject.includes(activeSubject); 
        });
        
        if (targetAssessment) {
            localStorage.setItem('careerlaunch_target_test_id', targetAssessment.id);
            navigate('/dashboard/assessment');
        } else {
            alert(`The Admin has not created a test for ${activeSubject} yet!`);
        }
    } catch (err) {
        alert(`Connection Failed: ${err.message}.`);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-500 animate-pulse w-1/2 rounded-full"></div>
      </div>
    </div>
  );

  if (questions.length === 0) return (
    <div className="max-w-4xl mx-auto p-12 text-center mt-12 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Awaiting Curriculum</h2>
      <p className="text-slate-500">The Admin hasn't uploaded data to the database yet.</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-10 border-b border-slate-200 pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Study Arena</h1>
        <p className="text-slate-500 font-medium text-lg">Master the concepts below to unlock your final assessment.</p>
      </div>

      {/* Clean Dynamic Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {subjects.map(subject => {
          const subjectQs = questions.filter(q => q.subject === subject);
          const isDone = subjectQs.length > 0 && subjectQs.every(q => learnedIds.includes(q.id));
          const isActive = activeSubject === subject;

          return (
            <button key={subject} onClick={() => setActiveSubject(subject)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border ${
                isActive 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {subject}
              {isDone && <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-emerald-500'}`}></span>}
            </button>
          );
        })}
      </div>

      {/* Target Test Trigger */}
      {isSubjectComplete && (
        <div className="mb-8 p-8 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between shadow-sm">
          <div className="text-center sm:text-left mb-6 sm:mb-0">
            <h3 className="text-2xl font-bold text-emerald-900 mb-1">Module Complete</h3>
            <p className="text-emerald-700 font-medium">You have mastered all {activeSubject} concepts.</p>
          </div>
          <button onClick={handleTakeTest} className="px-8 py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 hover:scale-105">
            Take Assessment
          </button>
        </div>
      )}

      {/* Live Database Questions */}
      <div className="space-y-4">
        {currentQuestions.map((question) => {
          const isLearned = learnedIds.includes(question.id);
          const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(question.text)}`;

          return (
            <div key={question.id} className={`p-6 rounded-2xl border transition-all duration-300 flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4 ${
              isLearned ? 'bg-slate-50/50 border-slate-200 opacity-70' : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
            }`}>
              <div className="flex-1">
                <p className={`text-lg font-bold mb-2 ${isLearned ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                  {question.text}
                </p>
                <a href={searchUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                  Research Concept →
                </a>
              </div>

              <label className="flex items-center cursor-pointer shrink-0">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" className="sr-only" checked={isLearned} onChange={() => handleToggleComplete(question.id)} />
                  <div className={`w-7 h-7 rounded-lg border-2 transition-colors flex items-center justify-center ${
                    isLearned ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-300 hover:border-indigo-400'
                  }`}>
                    {isLearned && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>}
                  </div>
                </div>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearnArena;
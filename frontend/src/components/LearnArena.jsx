import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const LearnArena = () => {
  const navigate = useNavigate();
  
  // State for live data
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [learnedIds, setLearnedIds] = useState([]);
  const [activeSubject, setActiveSubject] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. Fetch the data when the component loads
  useEffect(() => {
    const fetchLearnData = async () => {
      try {
        // FIX: Added 's' to assessments
        const questionResponse = await api.get('/assessments/learn-concepts/');
        const fetchedQuestions = questionResponse.data;
        
        setQuestions(fetchedQuestions);

        // Extract unique subjects to build the tabs dynamically
        const uniqueSubjects = [...new Set(fetchedQuestions.map(q => q.subject))];
        setSubjects(uniqueSubjects);
        if (uniqueSubjects.length > 0) setActiveSubject(uniqueSubjects[0]);

        // FIX: Added 's' to assessments
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

  // 2. Handle checking/unchecking a concept (Saves to Django instantly!)
  const handleToggleComplete = async (questionId) => {
    // Optimistic UI update for immediate feedback
    const isLearned = learnedIds.includes(questionId);
    if (isLearned) {
      setLearnedIds(learnedIds.filter(id => id !== questionId));
    } else {
      setLearnedIds([...learnedIds, questionId]);
    }

    try {
      // FIX: Added 's' to assessments
      await api.post('/assessments/learned/', { question_id: questionId });
    } catch (error) {
      alert("Failed to save progress. Are you logged in?");
    }
  };

  const currentQuestions = questions.filter(q => q.subject === activeSubject);
  const isSubjectComplete = currentQuestions.length > 0 && currentQuestions.every(q => learnedIds.includes(q.id));

// 3. Finding the Assessment ID and bridging to the Test Arena
 // 3. Finding the Assessment ID and bridging to the Test Arena
  const handleTakeTest = async () => {
    try {
        console.log("DEBUG: Firing API call to /assessments/list/...");
        
        const response = await api.get('/assessments/list/');
        const assessments = response.data.results || response.data;
        
        console.log("DEBUG: Received Assessments:", assessments);
        console.log("DEBUG: Looking for Target Subject:", activeSubject);
        
        const targetAssessment = assessments.find(a => {
            // Let's see exactly what the database is giving us
            const dbSubject = a.subject?.name || a.subject || a.title; 
            console.log(`DEBUG: Comparing DB '${dbSubject}' to Active '${activeSubject}'`);
            
            // We use .includes() just in case the name is slightly different
            return dbSubject && dbSubject.includes(activeSubject); 
        });
        
        if (targetAssessment) {
            console.log("DEBUG: Found target ID:", targetAssessment.id);
            localStorage.setItem('careerlaunch_target_test_id', targetAssessment.id);
            navigate('/dashboard/assessment');
        } else {
            alert(`The Admin has not created a test for ${activeSubject} yet!`);
        }
    } catch (err) {
        console.error("Take Test Crash:", err);
        alert(`Connection Failed: ${err.message}. Press F12 and check the Console tab!`);
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center mt-12">
        <h2 className="text-2xl font-bold text-gray-700">No Study Concepts Available</h2>
        <p className="text-gray-500 mt-2">The Admin hasn't uploaded any curriculum yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-800">Study Arena</h1>
        <p className="text-gray-600 mt-2">
          Select a subject below. Mark concepts as learned to unlock your assessment.
        </p>
      </div>

      {/* Dynamic Tabs based on the Database */}
      <div className="flex flex-wrap gap-3 mb-8">
        {subjects.map(subject => {
          const subjectQs = questions.filter(q => q.subject === subject);
          const isDone = subjectQs.length > 0 && subjectQs.every(q => learnedIds.includes(q.id));

          return (
            <button
              key={subject}
              onClick={() => setActiveSubject(subject)}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 shadow-sm flex items-center gap-2
                ${activeSubject === subject 
                  ? 'bg-blue-600 text-white shadow-blue-500/30' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
            >
              {subject}
              {isDone && <span className="flex items-center justify-center w-5 h-5 bg-green-500 rounded-full text-white text-xs">✓</span>}
            </button>
          );
        })}
      </div>

      {/* Target Test Trigger */}
      {isSubjectComplete && (
        <div className="mb-8 p-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg border border-green-400 flex flex-col sm:flex-row items-center justify-between animate-fade-in-down">
          <div className="text-white mb-4 sm:mb-0">
            <h3 className="text-xl font-bold">You are ready!</h3>
            <p className="text-green-100 text-sm mt-1">You have mastered the {activeSubject} concepts.</p>
          </div>
          <button 
            onClick={handleTakeTest}
            className="px-8 py-3 bg-white text-green-700 hover:bg-gray-50 font-black rounded-lg shadow-md transition-all hover:scale-105"
          >
            Take {activeSubject} Test &rarr;
          </button>
        </div>
      )}

      {/* Live Database Questions */}
      <div className="space-y-4">
        {currentQuestions.map((question) => {
          const isLearned = learnedIds.includes(question.id);
          const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(question.text)}`;

          return (
            <div 
              key={question.id} 
              className={`p-5 rounded-lg border transition-all duration-200 shadow-sm flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4
                ${isLearned ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:shadow-md'}`}
            >
              <div className="flex-1">
                <p className={`text-lg font-medium ${isLearned ? 'text-green-800 line-through opacity-70' : 'text-gray-800'}`}>
                  {question.text}
                </p>
                <a 
                  href={searchUrl} target="_blank" rel="noopener noreferrer"
                  className={`inline-flex items-center mt-2 text-sm font-semibold transition-colors
                    ${isLearned ? 'text-green-600 hover:text-green-800' : 'text-blue-600 hover:text-blue-800'}`}
                >
                  <span className="mr-1">🔍</span> Research Concept &rarr;
                </a>
              </div>

              <div className="flex items-center ml-2">
                <label className="flex items-center cursor-pointer space-x-3">
                  <span className={`text-sm font-medium ${isLearned ? 'text-green-700' : 'text-gray-500'}`}>
                    {isLearned ? 'Learned' : 'Mark as learned'}
                  </span>
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only"
                      checked={isLearned}
                      onChange={() => handleToggleComplete(question.id)}
                    />
                    <div className={`block w-8 h-8 rounded border-2 transition-colors flex items-center justify-center
                      ${isLearned ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`}>
                      {isLearned && (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                      )}
                    </div>
                  </div>
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearnArena;
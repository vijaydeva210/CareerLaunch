import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const TestArena = () => {
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      const assessmentId = localStorage.getItem('careerlaunch_target_test_id');
      if (!assessmentId || assessmentId === 'null' || assessmentId === 'undefined') {
        alert("Please select a subject from the Learning Hub first.");
        navigate('/dashboard/learn');
        return;
      }
      try {
        const response = await api.get(`/assessments/test/${assessmentId}/`);
        setAssessment(response.data);
      } catch (err) {
        console.error("Test Fetch Error:", err);
        navigate('/dashboard/learn');
      } finally {
        setLoading(false);
      }
    };
    fetchAssessment();
  }, [navigate]);

  const handleSelectOption = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const formattedAnswers = Object.keys(answers).map(qId => ({
      question_id: parseInt(qId),
      selected_option: answers[qId]
    }));

    try {
      const response = await api.post('/assessments/submit/', {
        assessment_id: assessment.id,
        answers: formattedAnswers
      });
      setSubmissionResult(response.data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error("Submission Error:", err);
      alert("Submission failed. Check your network connection.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-full min-h-[60vh]">
      <div className="w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-600 animate-pulse w-1/2 rounded-full"></div>
      </div>
    </div>
  );

  if (!assessment) return null;

  const progressPercentage = (Object.keys(answers).length / assessment.questions.length) * 100;

  // =========================================================
  // VIEW MODE 2: THE CLINICAL SCORECARD
  // =========================================================
  if (submissionResult) {
    const { score, passed, total_questions, correct_answers, review } = submissionResult;
    return (
      <div className="max-w-4xl mx-auto animate-fade-in pb-12">
        
        {/* Enterprise Score Hero */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-10 sm:p-14 mb-10 shadow-sm text-center relative overflow-hidden">
          
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-6 border ${
            passed ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : 'border-rose-200 text-rose-700 bg-rose-50'
          }`}>
            <span className={`w-2 h-2 rounded-full ${passed ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            {passed ? 'Assessment Cleared' : 'Standard Not Met'}
          </div>
          
          <h1 className="text-7xl sm:text-8xl font-black tracking-tight text-slate-900 mb-4">
            {score}<span className="text-3xl text-slate-400 font-bold">/{assessment.total_marks}</span>
          </h1>
          
          <p className="text-slate-600 font-medium text-lg mb-10">
            You answered <span className="text-slate-900 font-bold">{correct_answers}</span> out of {total_questions} questions correctly.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => { setAnswers({}); setSubmissionResult(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="px-8 py-3.5 rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold transition-all"
            >
              Retake Assessment
            </button>
            <button 
              onClick={() => navigate('/dashboard/progress')}
              className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-lg shadow-indigo-600/20"
            >
              View Analytics Dashboard
            </button>
          </div>
        </div>

        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6 px-2">Detailed Question Audit</h3>

        {/* Clinical Breakdown */}
        <div className="space-y-6">
          {review.map((item, idx) => {
            const isCorrect = item.is_correct;
            return (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                <div className="flex items-start gap-4 mb-6">
                  <span className={`flex items-center justify-center shrink-0 w-8 h-8 rounded-lg font-bold text-sm ${
                    isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {idx + 1}
                  </span>
                  <p className="text-lg font-bold text-slate-900 leading-snug mt-1">
                    {item.question_text}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-12">
                  {['A', 'B', 'C', 'D'].map(opt => {
                    const isStudentSelection = item.selected_option === opt;
                    const isCorrectAnswer = item.correct_option === opt;

                    let boxStyle = "border-slate-200 bg-slate-50 text-slate-500 opacity-60";
                    let indicator = null;

                    if (isCorrectAnswer) {
                      boxStyle = "border-emerald-200 bg-emerald-50 text-emerald-900 font-medium opacity-100 shadow-sm";
                      indicator = <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>;
                    } else if (isStudentSelection && !isCorrectAnswer) {
                      boxStyle = "border-rose-200 bg-rose-50 text-rose-900 font-medium opacity-100 shadow-sm";
                      indicator = <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>;
                    }

                    return (
                      <div key={opt} className={`p-4 rounded-xl border-2 flex justify-between items-center transition-all ${boxStyle}`}>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-black ${isCorrectAnswer || isStudentSelection ? 'opacity-100' : 'opacity-40'}`}>{opt}</span>
                          <span className="text-sm">{item[`option_${opt.toLowerCase()}`]}</span>
                        </div>
                        {indicator}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // =========================================================
  // VIEW MODE 1: THE TEST ARENA (High Readability)
  // =========================================================
  return (
    <div className="max-w-3xl mx-auto animate-fade-in pb-32">
      
      {/* Edge-to-Edge Top Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-200 z-50">
        <div 
          className="h-full bg-indigo-600 transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <header className="mb-10 border-b border-slate-200 pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
          {assessment.title}
        </h1>
        <p className="text-slate-500 font-medium text-lg">Select the most accurate response for each question below.</p>
      </header>
      
      <div className="space-y-8">
        {assessment.questions.map((q, index) => (
          <div key={q.id} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-slate-900 mb-6 leading-relaxed flex items-start gap-4">
              <span className="flex items-center justify-center shrink-0 w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-black text-sm">
                {index + 1}
              </span>
              <span className="mt-1">{q.question_text}</span>
            </h3>
            
            <div className="flex flex-col gap-3 pl-12">
              {['A', 'B', 'C', 'D'].map(opt => {
                const isSelected = answers[q.id] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelectOption(q.id, opt)}
                    className={`group relative flex items-center w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-4 ring-indigo-500/10 font-medium shadow-sm' 
                        : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <div className={`flex items-center justify-center shrink-0 w-6 h-6 rounded-md mr-4 text-xs font-black transition-colors ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500 group-hover:text-indigo-400 group-hover:bg-indigo-100'
                    }`}>
                      {opt}
                    </div>
                    <span>{q[`option_${opt.toLowerCase()}`]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Bottom Command Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-3xl bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between shadow-2xl shadow-slate-900/10 z-40 gap-4">
        <div className="flex items-center gap-3 px-2">
          <div className="text-sm font-bold text-slate-500">
            <span className="text-indigo-600 text-lg">{Object.keys(answers).length}</span> / {assessment.questions.length} Answered
          </div>
        </div>
        
        <button 
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < assessment.questions.length || submitting}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold transition-all ${
            Object.keys(answers).length < assessment.questions.length || submitting
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 active:scale-[0.98]'
          }`}
        >
          {submitting ? 'Processing Assessment...' : 'Submit Assessment'}
        </button>
      </div>

    </div>
  );
};

export default TestArena;
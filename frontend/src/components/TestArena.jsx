import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const TestArena = () => {
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // --- NEW: State to hold the grading receipt ---
  const [reviewData, setReviewData] = useState(null);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      const assessmentId = localStorage.getItem('careerlaunch_target_test_id');
      
      if (!assessmentId || assessmentId === 'null' || assessmentId === 'undefined') {
        alert("Please select a subject from the Study Arena first.");
        navigate('/dashboard/learn');
        return;
      }

      try {
        const response = await api.get(`/assessments/test/${assessmentId}/`);
        setAssessment(response.data);
      } catch (err) {
        console.error("Test Fetch Error:", err);
        alert("Failed to load test. Please return to the Learn Arena.");
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
      
      // --- NEW: Instead of navigating away, we save the results to trigger the Review UI! ---
      setTestResult({
        score: response.data.score,
        passed: response.data.passed,
        total_questions: response.data.total_questions,
        correct_answers: response.data.correct_answers,
        total_marks: assessment.total_marks
      });
      setReviewData(response.data.review);
      
    } catch (err) {
      console.error("Submission Error:", err);
      alert("Submission failed. Check your Django terminal.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!assessment) return null;

  // =========================================================================
  // NEW UI BLOCK: THE REVIEW SCREEN (Renders if reviewData exists)
  // =========================================================================
  if (reviewData) {
    return (
      <div className="max-w-3xl mx-auto p-6 animate-fade-in">
        {/* Results Header */}
        <div className={`p-8 rounded-xl text-center mb-8 shadow-sm border-2 ${
          testResult.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          <h1 className={`text-4xl font-bold mb-2 ${testResult.passed ? 'text-green-700' : 'text-red-700'}`}>
            {testResult.passed ? 'Assessment Passed!' : 'Assessment Failed'}
          </h1>
          <p className="text-xl font-medium text-gray-700 mb-4">
            You scored <span className="font-bold">{testResult.score}</span> out of {testResult.total_marks}
          </p>
          <p className="text-gray-600">
            Correct Answers: {testResult.correct_answers} / {testResult.total_questions}
          </p>
        </div>

        {/* Detailed Review Breakdown */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Review Your Answers</h2>
        <div className="space-y-6 mb-8">
          {reviewData.map((reviewItem, index) => (
            <div key={index} className={`p-6 rounded-xl border-2 ${
              reviewItem.is_correct ? 'border-green-300 bg-white' : 'border-red-300 bg-red-50/30'
            }`}>
              <p className="font-bold text-lg mb-4 text-gray-800">
                <span className="mr-2">{index + 1}.</span> 
                {reviewItem.question_text}
              </p>

              <div className="space-y-2">
                {['A', 'B', 'C', 'D'].map(opt => {
                  const isSelected = reviewItem.selected_option === opt;
                  const isCorrectAnswer = reviewItem.correct_option === opt;
                  
                  // Color Logic for the review
                  let optionClass = "bg-white border-gray-200 text-gray-600"; // Default
                  let badgeClass = "bg-gray-200 text-gray-600";

                  if (isCorrectAnswer) {
                    optionClass = "bg-green-100 border-green-500 text-green-800 font-bold shadow-sm";
                    badgeClass = "bg-green-500 text-white";
                  } else if (isSelected && !reviewItem.is_correct) {
                    optionClass = "bg-red-100 border-red-500 text-red-800 font-medium shadow-sm";
                    badgeClass = "bg-red-500 text-white";
                  }

                  return (
                    <div key={opt} className={`w-full text-left p-3 rounded-lg border-2 flex items-center ${optionClass}`}>
                      <span className={`inline-block w-6 h-6 text-center rounded text-sm mr-3 leading-6 ${badgeClass}`}>
                        {opt}
                      </span>
                      <span className="flex-grow">{reviewItem[`option_${opt.toLowerCase()}`]}</span>
                      
                      {/* Add icons to make it visually obvious */}
                      {isCorrectAnswer && <span className="ml-2 text-green-600 font-bold">✓ Correct</span>}
                      {(isSelected && !reviewItem.is_correct) && <span className="ml-2 text-red-600 font-bold">✗ Your Answer</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => navigate('/dashboard/progress')}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // =========================================================================
  // EXISTING UI BLOCK: THE TEST ARENA (Renders if test is currently active)
  // =========================================================================
  return (
    <div className="max-w-3xl mx-auto p-6 animate-fade-in">
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-800">{assessment.title}</h1>
        <p className="text-gray-500 mt-2">Answer all questions before submitting.</p>
      </div>
      
      <div className="space-y-8">
        {assessment.questions.map((q, index) => (
          <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <p className="font-bold text-lg mb-4 text-gray-800">
              <span className="text-blue-600 mr-2">{index + 1}.</span> 
              {q.question_text}
            </p>
            <div className="space-y-3">
              {['A', 'B', 'C', 'D'].map(opt => {
                const isSelected = answers[q.id] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelectOption(q.id, opt)}
                    className={`w-full text-left p-4 rounded-lg border-2 font-medium transition-all ${
                      isSelected 
                        ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' 
                        : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className={`inline-block w-6 h-6 text-center rounded text-sm mr-3 leading-6 ${
                      isSelected ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {opt}
                    </span>
                    {q[`option_${opt.toLowerCase()}`]}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 p-6 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-center">
        <div className="text-gray-600 font-medium">
          Answered: <span className="text-blue-600 font-bold">{Object.keys(answers).length}</span> / {assessment.questions.length}
        </div>
        <button 
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < assessment.questions.length || submitting}
          className={`py-3 px-8 rounded-lg font-bold text-white transition-all shadow-lg
            ${Object.keys(answers).length < assessment.questions.length || submitting
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-500 hover:scale-105 shadow-green-500/30'}`}
        >
          {submitting ? 'Grading...' : 'Submit Assessment'}
        </button>
      </div>
    </div>
  );
};

export default TestArena;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const TestArena = () => {
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessment = async () => {
      // 1. Grab the ID from memory
      const assessmentId = localStorage.getItem('careerlaunch_target_test_id');
      
      // SAFEGUARD: If memory is empty or null, send them back to pick a subject!
      if (!assessmentId || assessmentId === 'null' || assessmentId === 'undefined') {
        alert("Please select a subject from the Study Arena first.");
        navigate('/dashboard/learn');
        return;
      }

      try {
        // 2. Fetch the actual test from Django 
        // FIX: Changed to /assessments/test/ (Singular 'test' matches urls.py!)
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
    // Format the payload exactly how Django's SubmitAssessmentView expects it
    const formattedAnswers = Object.keys(answers).map(qId => ({
      question_id: parseInt(qId),
      selected_option: answers[qId]
    }));

    try {
      // FIX: Added 's' to assessments
      const response = await api.post('/assessments/submit/', {
        assessment_id: assessment.id,
        answers: formattedAnswers
      });
      
      // Navigate to Results page or show an alert for now
      alert(`Test Submitted! Score: ${response.data.score}/${assessment.total_marks}`);
      navigate('/dashboard/progress'); // Assuming this is your progress route
    } catch (err) {
      console.error("Submission Error:", err);
      alert("Submission failed. Check your Django terminal.");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!assessment) return null;

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
          disabled={Object.keys(answers).length < assessment.questions.length}
          className={`py-3 px-8 rounded-lg font-bold text-white transition-all shadow-lg
            ${Object.keys(answers).length < assessment.questions.length 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-500 hover:scale-105 shadow-green-500/30'}`}
        >
          Submit Assessment
        </button>
      </div>
    </div>
  );
};

export default TestArena;
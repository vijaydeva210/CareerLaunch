import React, { useState } from 'react';
// import api from '../utils/api'; <-- Ready for your partner's setup

// Temporary mock data to test the UI without the backend
const MOCK_ASSESSMENT = {
  id: 1,
  title: "Python Basics Assessment",
  questions: [
    {
      id: 1,
      text: "Which of the following is used to define a function in Python?",
      options: { A: "func", B: "def", C: "function", D: "define" }
    },
    {
      id: 2,
      text: "What data type is the result of: 5 / 2 in Python 3?",
      options: { A: "Integer", B: "Float", C: "String", D: "Boolean" }
    }
  ]
};

const TestArena = () => {
  // State to track which options the user selects: { questionId: "selectedOption" }
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState(null);

  // Handle radio button clicks
  const handleOptionSelect = (questionId, optionKey) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey
    }));
  };

  // Handle the final submission
  const handleSubmit = async () => {
    // 1. Check if they answered everything
    if (Object.keys(answers).length < MOCK_ASSESSMENT.questions.length) {
      alert("Please answer all questions before submitting!");
      return;
    }

    setIsSubmitting(true);

    // 2. Format the payload exactly how your Django backend expects it
    const payload = {
      assessment_id: MOCK_ASSESSMENT.id,
      answers: Object.entries(answers).map(([qId, selected]) => ({
        question_id: parseInt(qId),
        selected_option: selected
      }))
    };

    console.log("Payload ready for backend:", payload);

    try {
      /* // REAL API CALL (Uncomment when partner finishes api.js)
      const response = await api.post('/assessments/submit/', payload);
      setResults(response.data); 
      */

      // FAKE DELAY & RESULT FOR UI TESTING
      setTimeout(() => {
        setResults({
          score: 100,
          total_questions: 2,
          correct_answers: 2,
          message: "Assessment passed successfully!"
        });
        setIsSubmitting(false);
      }, 1500);

    } catch (error) {
      console.error("Submission Error:", error);
      alert("Failed to submit test. Please try again.");
      setIsSubmitting(false);
    }
  };

  // UI State 1: The Results Screen (Shows after submission)
  if (results) {
    return (
      <div className="max-w-3xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-lg text-center border-t-8 border-green-500">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Test Complete!</h2>
        <div className="text-6xl font-black text-blue-600 mb-6">{results.score}%</div>
        <p className="text-xl text-gray-600 mb-8">
          You got <span className="font-bold text-green-600">{results.correct_answers}</span> out of {results.total_questions} correct.
        </p>
        <button 
          onClick={() => window.location.reload()} // Temporary reset
          className="bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // UI State 2: The Active Test
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gray-800 text-white p-6 rounded-t-xl flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-2xl font-bold">{MOCK_ASSESSMENT.title}</h1>
          <p className="text-gray-300 text-sm mt-1">Answer all questions carefully.</p>
        </div>
      </div>

      {/* Questions List */}
      <div className="bg-white p-6 rounded-b-xl shadow-md border border-gray-100">
        <div className="space-y-8">
          {MOCK_ASSESSMENT.questions.map((q, index) => (
            <div key={q.id} className="p-5 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                <span className="text-blue-600 mr-2">{index + 1}.</span> {q.text}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(q.options).map(([key, value]) => {
                  const isSelected = answers[q.id] === key;
                  return (
                    <label 
                      key={key} 
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200
                        ${isSelected ? 'bg-blue-50 border-blue-500 shadow-sm' : 'bg-white border-gray-300 hover:border-blue-300'}`}
                    >
                      <input 
                        type="radio" 
                        name={`question-${q.id}`} 
                        value={key}
                        checked={isSelected}
                        onChange={() => handleOptionSelect(q.id, key)}
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className={`ml-3 font-medium ${isSelected ? 'text-blue-800' : 'text-gray-700'}`}>
                        <span className="font-bold mr-2">{key})</span> {value}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-10 flex justify-end">
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-8 py-3 rounded-lg font-bold text-white transition-all shadow-lg
              ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl'}`}
          >
            {isSubmitting ? 'Grading Test...' : 'Submit Assessment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestArena;
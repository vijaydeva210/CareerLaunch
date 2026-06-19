import React, { useState } from 'react';
// import api from '../utils/api'; <-- Commented out until your partner builds it

const STUDY_QUESTIONS = [
  { id: 1, text: "What are the core differences between Python lists and tuples?" },
  { id: 2, text: "Explain the concept of Django ORM and QuerySets." },
  { id: 3, text: "How does the virtual DOM work in React?" },
  { id: 4, text: "What is a JWT and how does it secure REST APIs?" },
];

const LearnArena = () => {
  const [learnedIds, setLearnedIds] = useState([]);

  const handleToggleComplete = (questionId) => {
    // Temporary UI toggle until backend is connected
    if (learnedIds.includes(questionId)) {
      setLearnedIds(learnedIds.filter(id => id !== questionId));
    } else {
      setLearnedIds([...learnedIds, questionId]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">Study Arena</h1>
        <p className="text-gray-600 mt-2">
          Research the concepts below. Once you understand them, mark them as complete to unlock your technical tests.
        </p>
      </div>

      <div className="space-y-4">
        {STUDY_QUESTIONS.map((question) => {
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
                  href={searchUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`inline-flex items-center mt-2 text-sm font-semibold transition-colors
                    ${isLearned ? 'text-green-600 hover:text-green-800' : 'text-blue-600 hover:text-blue-800'}`}
                >
                  <span className="mr-1">🔍</span> Research on Google &rarr;
                </a>
              </div>

              <div className="flex items-center ml-2">
                <label className="flex items-center cursor-pointer space-x-3">
                  <span className={`text-sm font-medium ${isLearned ? 'text-green-700' : 'text-gray-500'}`}>
                    {isLearned ? 'Completed' : 'Mark as learned'}
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
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
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
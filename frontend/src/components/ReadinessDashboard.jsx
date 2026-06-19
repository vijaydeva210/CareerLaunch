import React, { useState, useEffect } from 'react';
// import api from '../utils/api'; <-- Ready for your partner's setup

// Temporary mock data mimicking the exact JSON your Django backend returned earlier
const MOCK_PROGRESS_DATA = {
  student_id: 1,
  total_technical_progress_percentage: 45.0,
  breakdown: [
    { subject: "Python", weightage: 25.0, progress_earned: 25.0 },
    { subject: "JavaScript", weightage: 20.0, progress_earned: 10.0 },
    { subject: "React", weightage: 15.0, progress_earned: 10.0 },
    { subject: "Django", weightage: 20.0, progress_earned: 0.0 },
    { subject: "MySQL", weightage: 10.0, progress_earned: 0.0 }
  ]
};

const ReadinessDashboard = () => {
  const [progressData, setProgressData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating the API fetch process
    const fetchProgress = async () => {
      try {
        /* // REAL API CALL
        const response = await api.get('/assessments/my-progress/');
        setProgressData(response.data);
        */
        
        // Using mock data for UI testing
        setTimeout(() => {
          setProgressData(MOCK_PROGRESS_DATA);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Failed to load progress:", error);
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Top Section: Overall Progress */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Your Readiness Score</h1>
        <p className="text-gray-500 mb-8">Complete tests to fill your technical weightage and unlock interviews.</p>
        
        <div className="flex items-center gap-6">
          <div className="w-full bg-gray-200 rounded-full h-6">
            <div 
              className="bg-indigo-600 h-6 rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${progressData.total_technical_progress_percentage}%` }}
            ></div>
          </div>
          <span className="text-3xl font-black text-indigo-600">
            {progressData.total_technical_progress_percentage}%
          </span>
        </div>
      </div>

      {/* Bottom Section: Subject Breakdown */}
      <h2 className="text-xl font-bold text-gray-800 mb-6 px-2">Skill Breakdown</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {progressData.breakdown.map((item, index) => {
          // Calculate how full the individual subject bar should be
          const subjectPercentage = (item.progress_earned / item.weightage) * 100;
          const isComplete = subjectPercentage === 100;

          return (
            <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">{item.subject}</h3>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full 
                  ${isComplete ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {item.progress_earned} / {item.weightage} pts
                </span>
              </div>
              
              <div className="w-full bg-gray-100 rounded-full h-3 mt-auto">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ease-out
                    ${isComplete ? 'bg-green-500' : 'bg-blue-500'}`}
                  style={{ width: `${subjectPercentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReadinessDashboard;
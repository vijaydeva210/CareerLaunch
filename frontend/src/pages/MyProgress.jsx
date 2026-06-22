import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const MyProgress = () => {
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        // Hitting your Django Progress Engine (Plural 'assessments' matched!)
        const response = await api.get('/assessments/my-progress/');
        setProgressData(response.data);
      } catch (err) {
        console.error("Failed to load progress", err);
        setError("Could not load your progress data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-12 p-6 bg-red-50 border border-red-200 rounded-xl text-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">Sync Error</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!progressData || !progressData.breakdown || progressData.breakdown.length === 0) {
    return (
      <div className="max-w-4xl mx-auto mt-12 p-8 bg-white border border-gray-200 rounded-xl text-center shadow-sm">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
        <h2 className="text-2xl font-bold text-gray-800">No Data Available Yet</h2>
        <p className="text-gray-500 mt-2 mb-6">Complete assessments in the Study Arena to see your readiness score.</p>
        <button 
          onClick={() => navigate('/dashboard/learn')}
          className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Study Arena
        </button>
      </div>
    );
  }

  const totalScore = progressData.total_technical_progress_percentage || 0;

  return (
    <div className="max-w-5xl mx-auto p-6 animate-fade-in">
      <div className="mb-8 border-b border-gray-200 pb-5">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          Career Readiness Radar
        </h1>
        <p className="text-gray-500 mt-2">Your technical capability overview based on live assessments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT PANEL: Total Readiness Score (Circular Chart) */}
        <div className="lg:col-span-1 bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl shadow-xl p-8 text-center flex flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-10 rounded-full blur-2xl"></div>
          
          <h2 className="text-gray-300 font-bold tracking-widest uppercase text-sm mb-6">Overall Readiness</h2>
          
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-700"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Dynamic Foreground Circle (Math optimized for percentage) */}
              <path
                className={`${totalScore >= 80 ? 'text-green-400' : totalScore >= 50 ? 'text-blue-400' : 'text-orange-400'} transition-all duration-1000 ease-out`}
                strokeDasharray={`${totalScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-black text-white">{Math.round(totalScore)}%</span>
            </div>
          </div>
          
          <p className="mt-8 font-semibold text-gray-200">
            {totalScore >= 80 ? "🔥 Interview Ready!" : totalScore >= 50 ? "🚀 Making Great Progress!" : "📚 Keep Learning!"}
          </p>
        </div>

        {/* RIGHT PANEL: Subject Breakdown (Linear Progress Bars) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-2">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            Subject Mastery Breakdown
          </h2>

          <div className="space-y-8">
            {progressData.breakdown.map((item, index) => {
              // Calculate the true percentage of this specific subject
              const percentageOfSubject = (item.progress_earned / item.weightage) * 100 || 0;
              
              return (
                <div key={index} className="relative">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <span className="font-bold text-gray-800 text-lg">{item.subject}</span>
                      <span className="text-xs text-gray-500 ml-2">(Weight: {item.weightage}%)</span>
                    </div>
                    <span className={`text-sm font-bold ${percentageOfSubject >= 80 ? 'text-green-600' : 'text-blue-600'}`}>
                      {Math.round(percentageOfSubject)}% Mastered
                    </span>
                  </div>
                  
                  {/* Progress Bar Container */}
                  <div className="w-full bg-gray-100 rounded-full h-3.5 overflow-hidden">
                    {/* Progress Fill */}
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${percentageOfSubject >= 80 ? 'bg-green-500' : 'bg-blue-600'}`}
                      style={{ width: `${percentageOfSubject}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-12 pt-6 border-t border-gray-100 flex justify-end">
             <button 
                onClick={() => navigate('/dashboard/learn')}
                className="text-blue-600 font-bold hover:text-blue-800 transition-colors flex items-center gap-1"
             >
                Return to Study Arena
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MyProgress;
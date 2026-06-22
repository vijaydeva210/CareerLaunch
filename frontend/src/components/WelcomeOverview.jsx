import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api'; // Ensure this path matches your project structure

const WelcomeOverview = () => {
  const [hasResume, setHasResume] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Silently check if the user has uploaded a resume
    api.get('/accounts/resume/download/', { responseType: 'blob' })
      .then(() => setHasResume(true))
      .catch(() => setHasResume(false))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">
      
      {/* 1. Hero Banner (Your Original Code) */}
      <div className="relative bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-8 overflow-hidden shadow-2xl border border-blue-700/50">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
            Welcome to CareerLaunch
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl leading-relaxed mb-8">
            Your master blueprint for technical readiness. Master the concepts in the Learning Hub, test your knowledge in the Assessment Center, and track your readiness for the TCS NQT and Infosys exams.
          </p>
          <Link 
            to="/dashboard/learn" 
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg shadow-blue-500/30"
          >
            Start Learning
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
        </div>
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 right-32 -mb-16 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* 2. THE NEW SMART DASHBOARD BANNER */}
      {!loading && (
        <div className="mt-8 animate-fade-in">
          {hasResume ? (
            <div className="bg-blue-900/20 border border-blue-700/50 p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg backdrop-blur-sm">
              <div>
                <h3 className="font-bold text-blue-300 text-lg tracking-wide">Career Profile Active</h3>
                <p className="text-sm text-blue-200/70 mt-1">Your technical resume is locked in and ready for recruiter viewing.</p>
              </div>
              <Link to="/dashboard/profile" className="shrink-0 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg transition-all hover:-translate-y-0.5">
                View Profile ➔
              </Link>
            </div>
          ) : (
            <div className="bg-yellow-900/20 border border-yellow-700/50 p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg backdrop-blur-sm">
              <div>
                <h3 className="font-bold text-yellow-400 text-lg tracking-wide">Profile Incomplete</h3>
                <p className="text-sm text-yellow-200/70 mt-1">Upload your technical resume and academic details to unlock career placements.</p>
              </div>
              <Link to="/dashboard/profile" className="shrink-0 px-6 py-2 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg shadow-lg transition-all hover:-translate-y-0.5 shadow-yellow-600/20">
                Complete Profile ➔
              </Link>
            </div>
          )}
        </div>
      )}

      {/* 3. Quick Action Cards (Your Original Code) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-colors shadow-lg">
          <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">The Learn Phase</h3>
          <p className="text-gray-400 text-sm mb-4">Master Python, Full-Stack concepts, and core engineering principles.</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-500/50 transition-colors shadow-lg">
          <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">The Test Phase</h3>
          <p className="text-gray-400 text-sm mb-4">Take secure, timed assessments to validate your technical knowledge.</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-colors shadow-lg">
          <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">The Ready Phase</h3>
          <p className="text-gray-400 text-sm mb-4">Track your progress and calculate your overall exam readiness score.</p>
        </div>

      </div>
    </div>
  );
};

export default WelcomeOverview;
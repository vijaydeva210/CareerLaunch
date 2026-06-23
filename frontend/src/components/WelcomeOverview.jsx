import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { BookOpen, PenTool, TrendingUp, FileText, AlertCircle } from 'lucide-react';

const WelcomeOverview = () => {
  const [hasResume, setHasResume] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/accounts/resume/download/', { responseType: 'blob' })
      .then(() => setHasResume(true))
      .catch(() => setHasResume(false))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      
      {/* 1. Hero Banner (Matches the Login Right-Panel) */}
      <div className="rounded-[2rem] p-10 overflow-hidden relative mb-8 shadow-xl bg-slate-900">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-900"></div>
          <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-indigo-500/30 blur-[100px] rounded-full"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-violet-500/30 blur-[100px] rounded-full"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Master the concepts. <br/><span className="text-indigo-300 font-medium">Clear the interview.</span>
            </h1>
            <p className="text-indigo-100/80 text-lg leading-relaxed mb-8 font-medium">
              Your master blueprint for technical readiness. Complete the Learning Hub, validate in the Assessment Center, and track your TCS NQT trajectory.
            </p>
            <Link 
              to="/dashboard/learn" 
              className="inline-flex items-center gap-2 bg-white text-indigo-900 hover:bg-slate-100 font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg hover:scale-[1.02]"
            >
              Start Learning
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Profile Status Banner */}
      {!loading && (
        <div className="mb-8">
          {hasResume ? (
            <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg tracking-tight">Resume Uploaded</h3>
                  <p className="text-sm text-slate-500 font-medium">Your profile is active and ready for recruiter routing.</p>
                </div>
              </div>
              <Link to="/dashboard/profile" className="shrink-0 px-6 py-2.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition-colors text-sm">
                View Profile
              </Link>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-amber-900 text-lg tracking-tight">Profile Incomplete</h3>
                  <p className="text-sm text-amber-700/80 font-medium">Upload your resume and academic details to unlock placement features.</p>
                </div>
              </div>
              <Link to="/dashboard/profile" className="shrink-0 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-amber-500/20 text-sm">
                Complete Profile
              </Link>
            </div>
          )}
        </div>
      )}

      {/* 3. Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'The Learn Phase', desc: 'Master Python, Full-Stack concepts, and core engineering principles.', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'The Test Phase', desc: 'Take secure, timed assessments to validate your technical knowledge.', icon: PenTool, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { title: 'The Ready Phase', desc: 'Track your progress and calculate your overall exam readiness score.', icon: TrendingUp, color: 'text-violet-600', bg: 'bg-violet-50' }
        ].map((card, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 ${card.bg} ${card.color} rounded-xl flex items-center justify-center mb-6`}>
              <card.icon size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{card.title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WelcomeOverview;
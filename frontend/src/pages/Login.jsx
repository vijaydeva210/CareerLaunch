import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '', 
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/accounts/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: formData.username, 
          password: formData.password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);

        const badgeCheck = await fetch('http://127.0.0.1:8000/api/accounts/students/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${data.access}`
            }
        });

        if (badgeCheck.ok) {
            navigate('/admin/roster');
        } else {
            navigate('/dashboard');
        }

      } else {
        setError(data.detail || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Network error. Is the Django server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-8 font-sans">
      
      {/* The Main Split-Screen Container */}
      <div className="max-w-6xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex min-h-[600px] border border-slate-700">
        
        {/* LEFT SIDE: The Functional Form (Clean, White, Trustworthy) */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 md:p-16 flex flex-col justify-center">
          
          <div className="mb-10">
            {/* Logo perfectly matched to the video's Cyan/Blue flare */}
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-cyan-500/30">
                C
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900">CareerLaunch</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Welcome back
            </h2>
            <p className="text-slate-500 mt-3 text-lg font-medium">
              Initialize your session to access the dashboard.
            </p>
          </div>

          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-semibold mb-6 flex items-center gap-3">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              {successMessage}
            </div>
          )}

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm font-semibold mb-6 flex items-center gap-3">
              <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 text-slate-900 placeholder-slate-400 font-medium transition-all outline-none"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-slate-700">Password</label>
                {/* Ready to be wired to your Django reset flow */}
                <Link to="/forgot-password" className="text-sm font-bold text-cyan-600 hover:text-cyan-500 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 text-slate-900 placeholder-slate-400 font-medium transition-all outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold py-4 px-4 rounded-xl transition-all shadow-lg shadow-slate-900/20"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-slate-500 font-medium text-center">
            Don't have an account?{' '}
            <Link to="/signup" className="text-cyan-600 hover:text-cyan-700 font-bold transition-colors">
              Sign up for free
            </Link>
          </p>
        </div>

        {/* RIGHT SIDE: The Cinematic Match (Gritty Slate & Cyan Flares) */}
        <div className="hidden lg:flex w-1/2 bg-slate-950 relative items-center justify-center p-12 overflow-hidden">
          
          {/* Abstract Cinematic Background */}
          <div className="absolute inset-0 z-0">
            {/* Heavy metallic base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-950"></div>
            
            {/* Glowing Orbs mapping to the video's lens flares */}
            <div className="absolute top-[20%] right-[10%] w-96 h-96 bg-cyan-500/20 blur-[100px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-[10%] left-[10%] w-72 h-72 bg-blue-600/20 blur-[100px] rounded-full"></div>
            
            {/* Industrial Grid Pattern mimicking the scratches/tech vibe */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]"></div>
          </div>

          {/* Floating Glass Showcase Card */}
          <div className="relative z-10 w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl">
            <div className="flex gap-2 mb-8 opacity-50">
              <div className="w-3 h-3 rounded-full bg-slate-600"></div>
              <div className="w-3 h-3 rounded-full bg-slate-600"></div>
              <div className="w-3 h-3 rounded-full bg-slate-600"></div>
            </div>
            
            <h3 className="text-3xl font-black text-white leading-tight mb-4 tracking-tight drop-shadow-md">
              Prepare for launch.
            </h3>
            
            <p className="text-cyan-100/70 text-lg font-medium leading-relaxed mb-8">
              CareerLaunch provides the exact technical roadmaps and assessment engines you need to crack enterprise placements.
            </p>

            {/* Mock System Status */}
            <div className="flex items-center gap-4 pt-8 border-t border-white/10">
              <div className="w-12 h-12 rounded-full bg-slate-900/80 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <p className="text-white font-bold tracking-wide">System Online</p>
                <p className="text-cyan-400/80 text-sm font-medium">Servers fully operational</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
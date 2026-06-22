import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '', // Using username or email depending on your Django setup, usually SimpleJWT expects 'username'
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // If they just registered, show the success message from Signup.jsx
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
      // 1. Get the Keys
      const response = await fetch('http://127.0.0.1:8000/api/accounts/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // SimpleJWT usually expects the field to be called 'username', even if you type an email into it.
        body: JSON.stringify({ 
          username: formData.username, 
          password: formData.password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the tokens securely
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);

        // 2. The Badge Check (Traffic Cop)
        // We ping an admin-only endpoint to see what Django says
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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700">
        
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="text-gray-400 mt-2">Enter your credentials to access the portal</p>
        </div>

        {successMessage && (
          <div className="bg-green-500/10 border border-green-500 text-green-400 p-3 rounded-lg text-sm mb-6 text-center">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-colors"
              placeholder="Dev_210"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg shadow-blue-500/30"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Sign up as a student
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
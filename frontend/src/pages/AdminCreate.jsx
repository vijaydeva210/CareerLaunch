import React, { useState } from 'react';

const AdminCreate = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const token = localStorage.getItem('access');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/accounts/create-admin/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setFormData({ username: '', email: '', password: '' }); // Clear form
      } else {
        setError(data.error || data.detail || 'Failed to create Admin account.');
      }
    } catch (err) {
      setError('Network error. Is the Django backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
        
        {/* Header Section */}
        <div className="p-6 border-b border-gray-700 bg-gray-800/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Add New Admin
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Create a brand new administrative account. These credentials will bypass the student dashboard and grant full platform access.
          </p>
        </div>

        {/* Form Section */}
        <div className="p-6">
          {message && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-sm flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleCreateAdmin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">New Admin Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                placeholder="admin_dev"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                placeholder="staff@careerlaunch.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Temporary Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg"
            >
              {loading ? 'Forging Account...' : 'Create Admin Account'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AdminCreate;
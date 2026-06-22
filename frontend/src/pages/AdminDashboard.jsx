import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // In the future, we will clear the local storage tokens here
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname.includes(path) ? 'bg-gray-800 text-blue-400 border-l-4 border-blue-500' : 'text-gray-400 hover:bg-gray-800 hover:text-white';
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans">
      
      {/* Admin Sidebar */}
      <aside className="w-64 bg-gray-950 border-r border-gray-800 flex flex-col shadow-2xl">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent tracking-tight">
            Admin Console
          </h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">Command Center</p>
        </div>

        <nav className="flex-1 py-6 flex flex-col gap-2">
          {/* We will build these actual rooms next! */}
          <Link to="/admin/roster" className={`px-6 py-3 font-medium transition-all duration-200 ${isActive('/admin/roster')}`}>
            Student Roster
          </Link>
          <Link to="/admin/cargo" className={`px-6 py-3 font-medium transition-all duration-200 ${isActive('/admin/cargo')}`}>
            Upload Assessments
          </Link>
          <Link to="/admin/new-admin" className={`px-6 py-3 font-medium transition-all duration-200 ${isActive('/admin/new-admin')}`}>
            Add New Admin
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors border border-transparent hover:border-red-500/20"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area (The Outlet) */}
      <main className="flex-1 overflow-y-auto bg-gray-900">
        <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-10 px-8 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-200">System Administration</h2>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-blue-500/20">
              A
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* This is where the Cargo Bay and Promotion components will render */}
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default AdminDashboard;
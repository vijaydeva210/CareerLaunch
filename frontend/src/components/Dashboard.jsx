import { useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, PenTool, TrendingUp, LogOut } from 'lucide-react'; // Modern icons

export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* THE SIDEBAR */}
      <div className="w-64 bg-gray-900 text-white flex flex-col shadow-2xl">
        
        {/* Brand Header */}
        <div className="p-6 text-2xl font-bold border-b border-gray-800 tracking-wider">
          CareerLaunch
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/dashboard/learn" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white">
            <BookOpen size={20} /> Learn
          </Link>
          
          <Link to="/dashboard/assessment" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white">
            <PenTool size={20} /> Assessment
          </Link>
          
          <Link to="/dashboard/progress" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white">
            <TrendingUp size={20} /> Progress
          </Link>
          <Link to="/dashboard/profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            My Profile
          </Link>
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 p-3 w-full rounded-lg hover:bg-red-600/20 hover:text-red-500 transition-colors text-gray-400"
          >
            <LogOut size={20} /> Logout Portal
          </button>
        </div>

      </div>
      <div className="flex-1 overflow-y-auto p-10">
        <Outlet />
      </div>

    </div>
  );
}
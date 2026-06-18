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
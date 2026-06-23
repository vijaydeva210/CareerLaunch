import { useContext } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, PenTool, TrendingUp, LogOut, User } from 'lucide-react';

export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Learn', path: '/dashboard/learn', icon: BookOpen },
    { name: 'Assessment', path: '/dashboard/assessment', icon: PenTool },
    { name: 'Progress', path: '/dashboard/progress', icon: TrendingUp },
    { name: 'My Profile', path: '/dashboard/profile', icon: User },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* THE ENTERPRISE SIDEBAR (Dark anchor) */}
      <div className="w-64 bg-slate-900 flex flex-col z-20 shadow-2xl">
        
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30">
            C
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            CareerLaunch
          </span>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5 mt-2">
          {navLinks.map((link) => {
            const isActive = location.pathname.includes(link.path);
            const Icon = link.icon;
            return (
              <Link 
                key={link.name}
                to={link.path} 
                className={`flex items-center gap-3 p-3 rounded-xl font-bold transition-all duration-200 group ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300 transition-colors'} /> 
                {link.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 p-3 w-full rounded-xl hover:bg-rose-500/10 hover:text-rose-400 transition-colors text-slate-500 text-sm font-bold"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT WRAPPER (Light, breathable, clean) */}
      <div className="flex-1 overflow-y-auto bg-slate-50">
        <div className="p-8 sm:p-12 min-h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
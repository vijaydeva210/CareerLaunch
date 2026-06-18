import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock, User } from 'lucide-react'; 

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    try {
      await login(username, password); 
      navigate('/dashboard'); 
    } catch (err) {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white tracking-wider mb-2">CareerLaunch</h1>
          <p className="text-gray-400">Sign in to your assessment portal</p>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded mb-6 text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="text"  
              placeholder="Username" 
              className="w-full bg-black/30 border border-gray-600 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 transition-colors"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full bg-black/30 border border-gray-600 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Enter Portal
          </button>
        </form>
      </div>
    </div>
  );
}
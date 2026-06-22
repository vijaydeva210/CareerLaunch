import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './components/Dashboard';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import AdminCreate from './pages/AdminCreate';
import AdminCargo from './pages/AdminCargo';
import WelcomeOverview from './components/WelcomeOverview';
import LearnArena from './components/LearnArena';
import TestArena from './components/TestArena';
import AdminRoster from './pages/AdminRoster';
import MyProgress from './pages/MyProgress';
import Landing from './pages/Landing';
import Profile from './components/Profile';

export default function App() {
  return (
    <Routes>
      {/* The Gateway */}
      <Route path="/" element={<Landing />} />      {/* Cinematic Entry */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* The Dashboard Shell */}
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<WelcomeOverview />} />
        <Route path="profile" element={<Profile />} />
        <Route path="learn" element={<LearnArena />} />
        <Route path="assessment" element={<TestArena />} />
        <Route path="progress" element={<MyProgress />} />
        
      </Route>
      {/* The Admin Shell */}
      <Route path="/admin" element={<AdminDashboard />}>
        
        <Route path="roster" element={<AdminRoster />} />
        <Route path="cargo" element={<AdminCargo />} />
        <Route path="new-admin" element={<AdminCreate />} />
        
      </Route>
      
    </Routes>
  );
}
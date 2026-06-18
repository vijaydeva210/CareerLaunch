import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Import our temporary dummy rooms
import LearnStub from './pages/LearnStub';
import AssessmentStub from './pages/AssessmentStub';
import ProgressStub from './pages/ProgressStub';

export default function App() {
  return (
    <Routes>
      {/* The Gateway */}
      <Route path="/" element={<Login />} />
      
      {/* The Dashboard Shell */}
      <Route path="/dashboard" element={<Dashboard />}>
        {/* Nested Routes: These load INSIDE the Dashboard's <Outlet /> */}
        <Route path="learn" element={<LearnStub />} />
        <Route path="assessment" element={<AssessmentStub />} />
        <Route path="progress" element={<ProgressStub />} />
      </Route>
    </Routes>
  );
}
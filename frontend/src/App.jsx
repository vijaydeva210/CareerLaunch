import React, { useState } from 'react';
import LearnArena from './components/LearnArena';
import TestArena from './components/TestArena';
import ReadinessDashboard from './components/ReadinessDashboard';

function App() {
  // We create a state variable to track exactly which screen should be visible.
  // It defaults to 'learn' when the user first opens the app.
  const [currentView, setCurrentView] = useState('learn');

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Temporary Navigation Bar (Simulating your partner's future Router) */}
      <nav className="bg-white shadow-sm border-b px-6 py-4 mb-8">
        <div className="max-w-5xl mx-auto flex gap-4">
          <button 
            onClick={() => setCurrentView('learn')}
            className={`px-5 py-2 font-bold rounded-lg transition-colors ${
              currentView === 'learn' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            1. Learn
          </button>
          
          <button 
            onClick={() => setCurrentView('test')}
            className={`px-5 py-2 font-bold rounded-lg transition-colors ${
              currentView === 'test' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            2. Test
          </button>
          
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`px-5 py-2 font-bold rounded-lg transition-colors ${
              currentView === 'dashboard' 
                ? 'bg-green-600 text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            3. Progress
          </button>
        </div>
      </nav>

      {/* The Dynamic Content Area */}
      <div className="pb-10">
        {currentView === 'learn' && <LearnArena />}
        {currentView === 'test' && <TestArena />}
        {currentView === 'dashboard' && <ReadinessDashboard />}
      </div>

    </div>
  );
}

export default App;
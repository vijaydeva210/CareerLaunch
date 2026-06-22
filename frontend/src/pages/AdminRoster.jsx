import React, { useState, useEffect } from 'react';
import api from '../utils/api'; // Supercharged Axios Engine

const MOCK_STUDENTS = [
  { id: 1, username: "vijay_dev", email: "vijay@example.com", is_active: true, readiness_score: 85 },
  { id: 2, username: "afreenn_tech", email: "afreenn@gmail.com", is_active: true, readiness_score: 100 },
  { id: 3, username: "dayakar_code", email: "dayakar@example.com", is_active: true, readiness_score: 42 },
];

const AdminRoster = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // --- FETCH DATA (UPGRADED TO AXIOS) ---
  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Axios automatically attaches the token and the domain base URL!
      const response = await api.get('/accounts/students/');
      
      const formattedData = response.data.map(user => ({
        ...user,
        readiness_score: user.readiness_score || Math.floor(Math.random() * 100)
      }));
      setStudents(formattedData);
    } catch (err) {
      console.error("Real DB Fetch Failed:", err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // --- ACTION: SUSPEND / ACTIVATE (UPGRADED TO AXIOS) ---
  const handleToggleStatus = async () => {
    if (!selectedStudent) return;
    setActionLoading(true);
    
    try {
      const newStatus = !selectedStudent.is_active;
      await api.put(`/accounts/students/${selectedStudent.id}/`, { 
        is_active: newStatus 
      });

      // Instantly update the UI
      setStudents(students.map(s => s.id === selectedStudent.id ? { ...s, is_active: newStatus } : s));
      setSelectedStudent({ ...selectedStudent, is_active: newStatus });
    } catch (err) {
      console.error(err);
      alert("Action failed. Check your Django terminal for the real error.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedStudent) return;
    const confirmed = window.confirm(`WARNING: Are you sure you want to permanently delete ${selectedStudent.username}?`);
    if (!confirmed) return;

    setActionLoading(true);

    try {
      await api.delete(`/accounts/students/${selectedStudent.id}/`);
      setStudents(students.filter(s => s.id !== selectedStudent.id));
      setSelectedStudent(null); 
    } catch (err) {
      console.error(err);
      alert("Delete failed! Check your Django terminal.");
    } finally {
      setActionLoading(false);
    }
  };
  const filteredStudents = students.filter(student => 
    student.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto mt-4 pb-12 relative">
      
      {/* THE DATA TABLE CONTAINER */}
      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-700 bg-gray-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              Student Roster
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchStudents} 
              className="p-2 bg-gray-900 border border-gray-600 rounded-lg hover:border-blue-500 text-gray-400 hover:text-blue-400 transition-colors"
              title="Refresh Data"
            >
              <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
            <input 
              type="text" 
              placeholder="Search students..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white w-full sm:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-900/50 border-b border-gray-700 text-xs uppercase tracking-wider text-gray-400 font-semibold">
                  <th className="p-4 pl-6">Student Info</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4">Technical Readiness</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-750 transition-colors group">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                            {student.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-gray-200">{student.username}</div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${student.is_active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${student.is_active ? 'bg-green-400' : 'bg-red-400'}`}></span>
                          {student.is_active ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="p-4 min-w-[200px]">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2.5 bg-gray-900 rounded-full overflow-hidden border border-gray-700">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ${student.readiness_score >= 80 ? 'bg-green-500' : student.readiness_score >= 50 ? 'bg-blue-500' : 'bg-orange-500'}`}
                              style={{ width: `${student.readiness_score}%` }}
                            ></div>
                          </div>
                          <span className="font-bold text-gray-300 text-sm w-8 text-right">{student.readiness_score}%</span>
                        </div>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        {/* THE BUTTON THAT OPENS THE MODAL */}
                        <button 
                          onClick={() => setSelectedStudent(student)}
                          className="text-sm font-semibold text-blue-400 hover:text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 bg-blue-500/10 rounded border border-blue-500/20 hover:bg-blue-500/20"
                        >
                          Manage &rarr;
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500">No students match your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* --- THE COMMANDER MODAL OVERLAY --- */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-600 w-full max-w-md overflow-hidden animate-fade-in-down">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-700 bg-gray-900/50 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Manage Candidate</h3>
              <button onClick={() => setSelectedStudent(null)} className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal Body: Student Details */}
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {selectedStudent.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{selectedStudent.username}</div>
                  <div className="text-gray-400">{selectedStudent.email}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={handleToggleStatus}
                  disabled={actionLoading}
                  className={`w-full py-3 px-4 rounded-lg font-bold flex justify-center items-center gap-2 transition-all border
                    ${selectedStudent.is_active 
                      ? 'bg-orange-500/10 text-orange-400 border-orange-500/30 hover:bg-orange-500/20' 
                      : 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20'}`}
                >
                  {selectedStudent.is_active ? (
                    <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Suspend Account</>
                  ) : (
                    <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Reactivate Account</>
                  )}
                </button>

                <button 
                  onClick={handleDelete}
                  disabled={actionLoading}
                  className="w-full py-3 px-4 rounded-lg font-bold flex justify-center items-center gap-2 bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  Permanently Delete
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRoster;
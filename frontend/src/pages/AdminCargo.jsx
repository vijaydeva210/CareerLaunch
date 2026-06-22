import React, { useState } from 'react';
import api from '../utils/api'; // The Supercharged Engine

const AdminCargo = () => {
  // --- STATE MANAGEMENT ---
  const [subjects, setSubjects] = useState(["Python", "Django", "React", "Architecture", "webdev_basics"]);
  const [newSubject, setNewSubject] = useState('');
  
  const [uploadType, setUploadType] = useState('learn'); // 'learn' or 'test'
  const [selectedSubject, setSelectedSubject] = useState('');
  const [file, setFile] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [copiedLabel, setCopiedLabel] = useState(null);

  // --- HANDLERS ---
  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubject.trim()) return;
    
    setSubjects([...subjects, newSubject.trim()]);
    setMessage(`Successfully added new subject: ${newSubject}`);
    setNewSubject('');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCopyStructure = (type) => {
    const structure = type === 'learn' 
      ? "concept_text" 
      : "question_text,option_a,option_b,option_c,option_d,correct_answer";
    
    navigator.clipboard.writeText(structure);
    setCopiedLabel(type);
    setTimeout(() => setCopiedLabel(null), 2000);
  };

  // --- THE UPGRADED AXIOS ENGINE ---
  const handleUpload = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!selectedSubject) {
      setError("Please select a subject first.");
      return;
    }
    if (!file || !file.name.endsWith('.csv')) {
      setError("Please attach a valid .csv file.");
      return;
    }

    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('subject', selectedSubject);
      formData.append('type', uploadType);

      // FIX: Notice there are NO manual headers here. Axios handles the multipart boundary perfectly.
      const response = await api.post('/assessments/import-csv/', formData);

      // Display the actual success message from Django
      setMessage(response.data.message);
      setFile(null);
      document.getElementById('csv-upload').value = '';
    } catch (err) {
      console.error("Upload failed:", err);
      // Display the actual error message from Django
      setError(err.response?.data?.error || "Failed to upload CSV. Check your headers.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-4 space-y-6 pb-12">
      
      {/* SECTION 1: Add New Subject */}
      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
        <div className="p-5 border-b border-gray-700 bg-gray-800/50">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Create Subject Category
          </h2>
        </div>
        <div className="p-5">
          <form onSubmit={handleAddSubject} className="flex gap-4">
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="e.g., MySQL, AWS Basics, Docker..."
              className="flex-1 px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
            />
            <button 
              type="submit"
              disabled={!newSubject.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors whitespace-nowrap"
            >
              Add Subject
            </button>
          </form>
        </div>
      </div>

      {/* SECTION 2 & 3 CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: The Uploader */}
        <div className="lg:col-span-2 bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
          <div className="p-5 border-b border-gray-700 bg-gray-800/50">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              Data Import Hub
            </h2>
          </div>

          <div className="p-6">
            {message && <div className="mb-4 p-3 bg-green-500/10 border border-green-500 text-green-400 rounded-lg text-sm font-bold">{message}</div>}
            {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-400 rounded-lg text-sm font-bold">{error}</div>}

            <form onSubmit={handleUpload} className="space-y-5">
              
              {/* Type Selection */}
              <div className="flex gap-4">
                <label className={`flex-1 p-4 border rounded-xl cursor-pointer transition-all ${uploadType === 'learn' ? 'bg-purple-900/30 border-purple-500' : 'bg-gray-900 border-gray-700 hover:border-gray-500'}`}>
                  <input type="radio" name="type" className="hidden" checked={uploadType === 'learn'} onChange={() => setUploadType('learn')} />
                  <div className="font-bold text-white mb-1">Study Concepts</div>
                  <div className="text-xs text-gray-400">Questions for the Learn Arena</div>
                </label>
                <label className={`flex-1 p-4 border rounded-xl cursor-pointer transition-all ${uploadType === 'test' ? 'bg-purple-900/30 border-purple-500' : 'bg-gray-900 border-gray-700 hover:border-gray-500'}`}>
                  <input type="radio" name="type" className="hidden" checked={uploadType === 'test'} onChange={() => setUploadType('test')} />
                  <div className="font-bold text-white mb-1">Test Questions</div>
                  <div className="text-xs text-gray-400">Multiple choice for the Assessment Center</div>
                </label>
              </div>

              {/* Subject Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Target Subject</label>
                <select 
                  value={selectedSubject} 
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                >
                  <option value="" disabled>-- Select a subject to attach data to --</option>
                  {subjects.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              {/* File Dropzone */}
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-600 border-dashed rounded-xl cursor-pointer bg-gray-900/50 hover:bg-gray-800 transition-colors group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-2 text-gray-400 group-hover:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <p className="text-sm text-gray-400"><span className="font-semibold text-purple-400">Click to attach</span> CSV file</p>
                </div>
                <input id="csv-upload" type="file" accept=".csv" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
              </label>

              {file && (
                <div className="text-sm text-green-400 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Ready to upload: {file.name}
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg">
                {loading ? 'Importing Data...' : 'Start Import'}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: The Structure Blueprints */}
        <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-800">
            <h2 className="text-lg font-bold text-white">CSV Blueprints</h2>
            <p className="text-xs text-gray-500 mt-1">Headers must match exactly.</p>
          </div>
          
          <div className="p-5 space-y-6 flex-1 overflow-y-auto">
            {/* Learn Structure */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-blue-400">Study Concepts CSV</span>
                <button onClick={() => handleCopyStructure('learn')} className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded border border-gray-600 transition-colors">
                  {copiedLabel === 'learn' ? 'Copied!' : 'Copy Headers'}
                </button>
              </div>
              <div className="bg-black border border-gray-800 rounded-lg p-3 overflow-x-auto">
                <code className="text-xs text-green-400 whitespace-nowrap">concept_text</code>
                <div className="text-xs text-gray-500 mt-2 border-t border-gray-800 pt-2">
                  <p>Row 1: What is a tuple?</p>
                  <p>Row 2: Explain HTTP GET.</p>
                </div>
              </div>
            </div>

            {/* Test Structure */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-purple-400">Test Questions CSV</span>
                <button onClick={() => handleCopyStructure('test')} className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded border border-gray-600 transition-colors">
                  {copiedLabel === 'test' ? 'Copied!' : 'Copy Headers'}
                </button>
              </div>
              <div className="bg-black border border-gray-800 rounded-lg p-3 overflow-x-auto">
                <code className="text-xs text-green-400 whitespace-nowrap">question_text,option_a,option_b,option_c,option_d,correct_answer</code>
                <div className="text-xs text-gray-500 mt-2 border-t border-gray-800 pt-2">
                  <p className="whitespace-nowrap">Ex: "What is 2+2?", "1", "2", "3", "4", "D"</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminCargo;
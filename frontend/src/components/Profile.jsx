import React, { useState, useEffect } from 'react';
import api from '../utils/api'; 

const Profile = () => {
  // Profile Data State
  const [profileData, setProfileData] = useState({
    phone: '', college: '', branch: '', graduation_year: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);
  
  // Resume State
  const [selectedFile, setSelectedFile] = useState(null);
  const [resumeBlobUrl, setResumeBlobUrl] = useState(null);
  const [loadingResume, setLoadingResume] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchProfileDetails();
    fetchResume();
  }, []);

  const fetchProfileDetails = async () => {
    try {
      // Assuming your URL for UserProfileView is /accounts/profile/
      const res = await api.get('/accounts/profile/'); 
      setProfileData({
        phone: res.data.phone || '',
        college: res.data.college || '',
        branch: res.data.branch || '',
        graduation_year: res.data.graduation_year || ''
      });
    } catch (err) {
      console.log("Error fetching profile data");
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await api.patch('/accounts/profile/', profileData);
      setMessage({ type: 'success', text: 'Personal details updated!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setSavingProfile(false);
    }
  };

  const fetchResume = async () => {
    try {
      const response = await api.get('/accounts/resume/download/', { responseType: 'blob' });
      const fileUrl = URL.createObjectURL(response.data);
      setResumeBlobUrl(fileUrl);
    } catch (err) {
      // No resume found yet, which is fine!
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('resume', selectedFile);
    setLoadingResume(true);
    try {
      await api.post('/accounts/resume/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage({ type: 'success', text: 'Resume uploaded successfully!' });
      setSelectedFile(null); 
      fetchResume(); 
    } catch (err) {
      setMessage({ type: 'error', text: 'Upload failed. Ensure it is a valid PDF.' });
    } finally {
      setLoadingResume(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      
      {message && (
        <div className={`p-4 rounded-xl text-sm font-bold text-center ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Personal Details Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-xl font-extrabold text-gray-900 mb-4">Academic Profile</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">College / University</label>
              <input type="text" value={profileData.college} onChange={e => setProfileData({...profileData, college: e.target.value})} className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Branch / Major</label>
              <input type="text" value={profileData.branch} onChange={e => setProfileData({...profileData, branch: e.target.value})} className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Grad Year</label>
                <input type="number" value={profileData.graduation_year} onChange={e => setProfileData({...profileData, graduation_year: e.target.value})} className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Phone</label>
                <input type="text" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <button type="submit" disabled={savingProfile} className="w-full mt-4 py-2 bg-gray-900 text-white font-bold rounded-lg hover:bg-black transition-colors">
              {savingProfile ? 'Saving...' : 'Save Profile Details'}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: The Resume Engine */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">Career Document</h2>
              <p className="text-sm text-gray-500">Upload your PDF resume.</p>
            </div>
            <form onSubmit={handleUpload} className="flex gap-2 w-full sm:w-auto">
              <input type="file" accept="application/pdf" onChange={(e) => setSelectedFile(e.target.files[0])} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700" />
              <button type="submit" disabled={loadingResume || !selectedFile} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-300">
                Upload
              </button>
            </form>
          </div>

          <div className="bg-gray-900 rounded-2xl shadow-xl overflow-hidden h-[600px] border border-gray-800">
            <div className="bg-gray-950 p-3 border-b border-gray-800 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-400 font-mono text-xs ml-2">document_viewer.exe</span>
            </div>
            <div className="h-full flex items-center justify-center bg-gray-800 pb-10">
              {resumeBlobUrl ? (
                <object data={resumeBlobUrl} type="application/pdf" className="w-full h-full"><p>PDF not supported.</p></object>
              ) : (
                <p className="text-gray-500 font-medium">No resume uploaded yet.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
import React, { useState, useEffect } from 'react';
import api from '../utils/api'; 
import { UploadCloud, CheckCircle, FileText } from 'lucide-react';

const Profile = () => {
  const [profileData, setProfileData] = useState({ phone: '', college: '', branch: '', graduation_year: '' });
  const [savingProfile, setSavingProfile] = useState(false);
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
      const res = await api.get('/accounts/profile/'); 
      setProfileData({
        phone: res.data.phone || '', college: res.data.college || '',
        branch: res.data.branch || '', graduation_year: res.data.graduation_year || ''
      });
    } catch (err) {}
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await api.patch('/accounts/profile/', profileData);
      setMessage({ type: 'success', text: 'Profile details saved successfully.' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Error saving profile details.' });
    } finally {
      setSavingProfile(false);
    }
  };

  const fetchResume = async () => {
    try {
      const response = await api.get('/accounts/resume/download/', { responseType: 'blob' });
      setResumeBlobUrl(URL.createObjectURL(response.data));
    } catch (err) {}
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('resume', selectedFile);
    setLoadingResume(true);
    try {
      await api.post('/accounts/resume/upload/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMessage({ type: 'success', text: 'Resume uploaded successfully.' });
      setSelectedFile(null); 
      fetchResume(); 
    } catch (err) {
      setMessage({ type: 'error', text: 'Upload failed. Please use a PDF format.' });
    } finally {
      setLoadingResume(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      
      <div className="mb-10 border-b border-slate-200 pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">My Profile</h1>
        <p className="text-slate-500 font-medium text-lg">Manage your academic details and upload your resume.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-sm font-bold border mb-8 flex items-center gap-3 ${
          message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'
        }`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : null}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Personal Details */}
        <div className="lg:col-span-1 bg-white border border-slate-200 p-8 rounded-2xl shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Academic Details</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">College / University</label>
              <input type="text" value={profileData.college} onChange={e => setProfileData({...profileData, college: e.target.value})} className="w-full p-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Major / Branch</label>
              <input type="text" value={profileData.branch} onChange={e => setProfileData({...profileData, branch: e.target.value})} className="w-full p-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Grad Year</label>
                <input type="number" value={profileData.graduation_year} onChange={e => setProfileData({...profileData, graduation_year: e.target.value})} className="w-full p-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Phone</label>
                <input type="text" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} className="w-full p-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium" />
              </div>
            </div>
            <button type="submit" disabled={savingProfile} className="w-full mt-6 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-[0.98]">
              {savingProfile ? 'Saving...' : 'Save Details'}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: The Resume Engine */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">Resume Document</h2>
              <p className="text-sm text-slate-500 font-medium">Please upload your resume in PDF format.</p>
            </div>
            <form onSubmit={handleUpload} className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <label className="flex-1 w-full cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                <UploadCloud size={18} />
                {selectedFile ? selectedFile.name : 'Choose File'}
                <input type="file" accept="application/pdf" onChange={(e) => setSelectedFile(e.target.files[0])} className="hidden" />
              </label>
              <button type="submit" disabled={loadingResume || !selectedFile} className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-indigo-600/20">
                Upload
              </button>
            </form>
          </div>

          <div className="bg-slate-100 rounded-2xl overflow-hidden h-[600px] border border-slate-200 flex flex-col shadow-inner">
            <div className="bg-slate-200 px-4 py-3 border-b border-slate-300 flex items-center gap-3">
              <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-slate-400"></div><div className="w-3 h-3 rounded-full bg-slate-400"></div><div className="w-3 h-3 rounded-full bg-slate-400"></div></div>
              <span className="text-slate-500 font-medium text-xs ml-2">resume_viewer.pdf</span>
            </div>
            <div className="flex-1 flex items-center justify-center relative bg-slate-100/50">
              {resumeBlobUrl ? (
                <object data={resumeBlobUrl} type="application/pdf" className="w-full h-full relative z-10"><p>PDF not supported.</p></object>
              ) : (
                <div className="text-center text-slate-400">
                  <FileText size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="font-medium text-lg">No resume uploaded</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
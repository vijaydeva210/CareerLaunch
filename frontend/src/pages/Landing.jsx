import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-full bg-black flex flex-col items-center justify-center">
      {/* Cinematic Video */}
      <video 
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        autoPlay 
        muted 
        playsInline
        onEnded={() => navigate('/login')}
      >
        <source src="/background-video.mp4" type="video/mp4" />
      </video>

      {/* Cinematic Title (Centered to draw focus) */}
      <div className="relative z-10 text-center text-white space-y-4">
        <h1 className="text-7xl font-black tracking-tighter">CareerLaunch</h1>
        <p className="text-xl text-gray-400 font-light italic">Master technical skills. Launch your future.</p>
      </div>

      {/* ENTER BUTTON: Bottom Right, Small and Sleek */}
      <button 
        onClick={() => navigate('/login')}
        className="absolute bottom-12 right-10 z-10 px-8 py-5 bg-white/5 backdrop-blur-md border border-white/20 text-white font-bold text-sm rounded-lg hover:bg-white/20 transition-all shadow-xl"
      >
        Enter Portal &rarr;
      </button>
    </div>
  );
};

export default Landing;
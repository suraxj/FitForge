import React, { useState } from 'react';
import { Code2, ExternalLink, X, Sparkles, Terminal, Heart } from 'lucide-react';

const DeveloperBadge = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Developer Badge Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 left-6 z-40 px-3.5 py-2 rounded-full bg-slate-900/90 dark:bg-slate-800/90 hover:bg-emerald-600 dark:hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider shadow-xl backdrop-blur-md transition-all border border-slate-700 hover:scale-105 flex items-center space-x-2 animate__animated animate__fadeIn"
        title="View Developer Portfolio & Credits"
      >
        <Code2 className="w-4 h-4 text-emerald-400" />
        <span>Dev Portfolio</span>
      </button>

      {/* Developer Modal Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate__animated animate__fadeIn font-['Outfit',sans-serif]">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6 animate__animated animate__zoomIn text-slate-900 dark:text-white">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Dev Info Header */}
            <div className="text-center space-y-3 pt-2">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 mx-auto shadow-xl shadow-emerald-500/25 border-2 border-emerald-300">
                <Terminal className="w-8 h-8 text-slate-950" />
              </div>

              <div>
                <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-1">
                  <Sparkles className="w-3 h-3 text-emerald-500 animate-spin" />
                  <span>Lead Full Stack Architect</span>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                  SURAAJ (SURAXJ)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium pt-0.5">
                  Full-Stack Web Developer & UI/UX Specialist
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
              <p>
                Engineered <span className="font-bold text-emerald-600 dark:text-emerald-400">FitForge</span> with modern web standards, 24/7 biometric authentication simulation, real-time analytics, responsive glassmorphism design, and custom theme engines.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['React.js', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'Animate.css'].map((tech, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* External Link Action Button */}
            <div className="space-y-2">
              <a
                href="https://suraxj-portfolio.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02]"
              >
                <span>VISIT SURAAJ'S PORTFOLIO</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 rounded-full text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 transition-colors"
              >
                Close Window
              </button>
            </div>

            <div className="text-center text-[10px] text-slate-400 font-medium flex items-center justify-center space-x-1">
              <span>Crafted with</span>
              <Heart className="w-3 h-3 text-red-500 fill-red-500 inline animate-pulse" />
              <span>for FitForge Gym Platform</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeveloperBadge;

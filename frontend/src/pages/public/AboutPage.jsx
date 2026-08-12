import React from 'react';
import { Dumbbell, Shield, Target, Flame, Users } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">ABOUT FITFORGE</h1>
        <p className="text-slate-400 text-lg leading-relaxed">
          FitForge is a premium fitness ecosystem combining industrial-grade gym facilities with high-performance SaaS management software.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-4 h-4" />
            <span>Our Philosophy</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">TRANSFORMING FITNESS THROUGH TECHNOLOGY</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Founded in 2024, FitForge was built to eliminate the chaos of manual gym spreadsheets. By connecting gym admins, trainers, and athletes onto a unified SaaS platform, we enable seamless workout tracking, instant attendance logs, and transparent membership handling.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400"><Target className="w-6 h-6" /></div>
            <div>
              <h3 className="text-lg font-bold text-white">Precision Coaching</h3>
              <p className="text-xs text-slate-400 mt-1">Trainers assign tailored split routines and track progress metrics in real-time.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400"><Shield className="w-6 h-6" /></div>
            <div>
              <h3 className="text-lg font-bold text-white">Secure Memberships</h3>
              <p className="text-xs text-slate-400 mt-1">Automated expiry warnings and instant receipt generation ensure operational clarity.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

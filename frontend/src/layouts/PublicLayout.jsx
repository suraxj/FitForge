import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Dumbbell, Menu, X, ArrowRight, MapPin, Phone, Mail, Award, Compass, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PublicLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getDashboardRoute = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'trainer') return '/trainer/dashboard';
    return '/member/dashboard';
  };

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/', { replace: false });
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0d0620] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#6d28d9] selection:text-white">
      {/* Top Header Navbar - Anytime Fitness Dark Purple Theme */}
      <header className="sticky top-0 z-50 bg-[#190a38] border-b border-purple-900/40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => scrollToSection('top')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6d28d9] to-[#00d2c4] flex items-center justify-center text-white font-black shadow-lg shadow-purple-900/50">
              <Dumbbell className="w-6 h-6 transform -rotate-12" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-extrabold tracking-wider text-white">FIT<span className="text-[#00d2c4]">FORGE</span></span>
              <span className="block text-[9px] uppercase font-extrabold text-purple-300 tracking-widest">PREMIUM GYM PLATFORM</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            <button onClick={() => scrollToSection('top')} className="text-xs font-extrabold uppercase tracking-wider text-slate-200 hover:text-[#00d2c4] transition-colors">
              Find a Gym
            </button>
            <NavLink to="/about" className={({ isActive }) => `text-xs font-extrabold uppercase tracking-wider transition-colors ${isActive ? 'text-[#00d2c4]' : 'text-slate-200 hover:text-[#00d2c4]'}`}>
              Training
            </NavLink>
            <button onClick={() => scrollToSection('plans')} className="text-xs font-extrabold uppercase tracking-wider text-slate-200 hover:text-[#00d2c4] transition-colors">
              Membership Plans
            </button>
            <button onClick={() => scrollToSection('why-us')} className="text-xs font-extrabold uppercase tracking-wider text-slate-200 hover:text-[#00d2c4] transition-colors">
              Why Join
            </button>
            <NavLink to="/contact" className={({ isActive }) => `text-xs font-extrabold uppercase tracking-wider transition-colors ${isActive ? 'text-[#00d2c4]' : 'text-slate-200 hover:text-[#00d2c4]'}`}>
              Contact
            </NavLink>
          </nav>

          {/* Desktop CTA Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <button
                onClick={() => navigate(getDashboardRoute())}
                className="px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#6d28d9] hover:bg-[#5b21b6] text-white shadow-lg shadow-purple-900/40 transition-all flex items-center space-x-2"
              >
                <span>Console ({user.role})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <NavLink to="/login" className="text-xs font-extrabold uppercase tracking-wider text-slate-200 hover:text-[#00d2c4] px-3 py-2 transition-colors">
                  SIGN IN
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#6d28d9] hover:bg-[#5b21b6] text-white shadow-lg shadow-purple-900/40 transition-all border border-purple-400/30"
                >
                  TRY US FREE
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-purple-900/40"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#190a38] border-b border-purple-900/60 px-4 pt-3 pb-6 space-y-3 text-xs font-extrabold uppercase tracking-wider">
            <button onClick={() => scrollToSection('top')} className="block w-full text-left px-4 py-2 rounded-lg text-slate-200 hover:bg-purple-900/40">
              Find a Gym
            </button>
            <NavLink to="/about" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 rounded-lg text-slate-200 hover:bg-purple-900/40">
              Training
            </NavLink>
            <button onClick={() => scrollToSection('plans')} className="block w-full text-left px-4 py-2 rounded-lg text-slate-200 hover:bg-purple-900/40">
              Membership Plans
            </button>
            <button onClick={() => scrollToSection('why-us')} className="block w-full text-left px-4 py-2 rounded-lg text-slate-200 hover:bg-purple-900/40">
              Why Join
            </button>
            <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 rounded-lg text-slate-200 hover:bg-purple-900/40">
              Contact Us
            </NavLink>

            <div className="pt-4 border-t border-purple-900/40 space-y-2">
              {user ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(getDashboardRoute());
                  }}
                  className="w-full text-center px-4 py-2.5 rounded-full font-black bg-[#6d28d9] text-white"
                >
                  Go to Dashboard ({user.role})
                </button>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-2.5 rounded-full font-black bg-purple-950 text-white border border-purple-700/50"
                  >
                    SIGN IN
                  </NavLink>
                  <NavLink
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-2.5 rounded-full font-black bg-[#6d28d9] text-white"
                  >
                    TRY US FREE
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Outlet */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Anytime Fitness Footer */}
      <footer className="bg-[#140730] border-t border-purple-900/40 text-slate-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6d28d9] to-[#00d2c4] flex items-center justify-center text-white font-bold">
                <Dumbbell className="w-5 h-5 transform -rotate-12" />
              </div>
              <span className="text-xl font-extrabold text-white">FIT<span className="text-[#00d2c4]">FORGE</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              24/7 access to state-of-the-art gym facilities, supportive coaches, personalized workout routines, and body composition analytics worldwide.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4 text-[#00d2c4]">Quick Explore</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-300">
              <li><button onClick={() => scrollToSection('top')} className="hover:text-[#00d2c4] transition-colors">Find a Gym Location</button></li>
              <li><NavLink to="/about" className="hover:text-[#00d2c4] transition-colors">Personal Training & Coaching</NavLink></li>
              <li><button onClick={() => scrollToSection('plans')} className="hover:text-[#00d2c4] transition-colors">Membership Options</button></li>
              <li><NavLink to="/contact" className="hover:text-[#00d2c4] transition-colors">Contact Support</NavLink></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4 text-[#00d2c4]">System Portals</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-300">
              <li><NavLink to="/login" className="hover:text-[#00d2c4] transition-colors">Admin Dashboard</NavLink></li>
              <li><NavLink to="/login" className="hover:text-[#00d2c4] transition-colors">Trainer Console</NavLink></li>
              <li><NavLink to="/login" className="hover:text-[#00d2c4] transition-colors">Member Portal</NavLink></li>
              <li><NavLink to="/register" className="hover:text-[#00d2c4] transition-colors">Register New Account</NavLink></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4 text-[#00d2c4]">Gym Contact</h4>
            <p className="text-xs text-slate-400 mb-2 flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-[#00d2c4] flex-shrink-0" />
              <span>Plot No 11 & 12, I.P. Extension, Delhi 110092</span>
            </p>
            <p className="text-xs text-slate-400 mb-2 flex items-center space-x-2">
              <Phone className="w-4 h-4 text-[#00d2c4] flex-shrink-0" />
              <span>+91 9625166582, +91 7982746995</span>
            </p>
            <p className="text-xs text-slate-400 flex items-center space-x-2">
              <Mail className="w-4 h-4 text-[#00d2c4] flex-shrink-0" />
              <span>support@fitforge.com</span>
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-purple-900/40 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} FitForge Gym & SaaS Management System. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;

import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Dumbbell, Menu, X, ArrowRight, MapPin, Phone, Mail, Award, Compass, Sparkles, Clock, ShieldCheck, Instagram, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/common/ThemeToggle';
import FitnessChatbot from '../components/common/FitnessChatbot';
import WhatsAppButton from '../components/common/WhatsAppButton';
import ScrollToTopButton from '../components/common/ScrollToTopButton';
import DeveloperBadge from '../components/common/DeveloperBadge';

const PublicLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-['Outfit',sans-serif] selection:bg-emerald-500 selection:text-slate-950 transition-colors duration-400">
      {/* Glassmorphism Sticky Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-slate-900/85 dark:bg-slate-900/85 light:bg-white/90 backdrop-blur-xl shadow-2xl shadow-slate-950/40 border-b border-slate-800 dark:border-slate-800 light:border-slate-200'
            : 'bg-slate-900/95 dark:bg-slate-900/95 light:bg-white/95 backdrop-blur-md border-b border-slate-800 dark:border-slate-800 light:border-slate-200'
        }`}
        style={{
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'blur(12px)',
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'blur(12px)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => scrollToSection('top')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <Dumbbell className="w-6 h-6 transform -rotate-12 text-slate-950" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-wider text-white dark:text-white light:text-slate-900">FIT<span className="text-emerald-400">FORGE</span></span>
              <span className="block text-[9px] uppercase font-extrabold text-emerald-400 tracking-widest">PREMIUM GYM PLATFORM</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {[
              { label: 'Find a Gym', action: () => scrollToSection('top') },
              { label: 'Training', to: '/about' },
              { label: 'Membership Plans', action: () => scrollToSection('plans') },
              { label: 'Why Join', action: () => scrollToSection('why-us') },
              { label: 'Contact', to: '/contact' },
            ].map((item, i) =>
              item.to ? (
                <NavLink
                  key={i}
                  to={item.to}
                  className={({ isActive }) =>
                    `text-xs font-extrabold uppercase tracking-wider transition-all duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-emerald-400 after:transition-all after:duration-300 ${
                      isActive ? 'text-emerald-400 after:w-full' : 'text-slate-300 dark:text-slate-200 light:text-slate-700 hover:text-emerald-400 after:w-0 hover:after:w-full'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ) : (
                <button
                  key={i}
                  onClick={item.action}
                  className="text-xs font-extrabold uppercase tracking-wider text-slate-300 dark:text-slate-200 light:text-slate-700 hover:text-emerald-400 transition-all duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-emerald-400 after:transition-all after:duration-300 hover:after:w-full"
                >
                  {item.label}
                </button>
              )
            )}
          </nav>

          {/* Desktop CTA Action Buttons & Theme Switcher */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle showLabel={false} />
            {user ? (
              <button
                onClick={() => navigate(getDashboardRoute())}
                className="px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-900/30 transition-all flex items-center space-x-2"
              >
                <span>Console ({user.role})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <NavLink to="/login" className="text-xs font-extrabold uppercase tracking-wider text-slate-300 dark:text-slate-200 light:text-slate-700 hover:text-emerald-400 px-3 py-2 transition-colors">
                  SIGN IN
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-900/30 transition-all border border-emerald-400/30"
                >
                  TRY US FREE
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center space-x-3 lg:hidden">
            <ThemeToggle showLabel={false} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Panel */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-400 ease-in-out ${
            mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
          style={{
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          <div className="px-4 pt-3 pb-6 space-y-2 text-xs font-extrabold uppercase tracking-wider border-t border-slate-800">
            {[
              { label: 'Find a Gym', action: () => scrollToSection('top') },
              { label: 'Training', to: '/about' },
              { label: 'Membership Plans', action: () => scrollToSection('plans') },
              { label: 'Why Join', action: () => scrollToSection('why-us') },
              { label: 'Contact Us', to: '/contact' },
            ].map((item, i) =>
              item.to ? (
                <NavLink
                  key={i}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-slate-200 hover:bg-slate-800/60 hover:text-emerald-400 transition-all"
                >
                  {item.label}
                </NavLink>
              ) : (
                <button
                  key={i}
                  onClick={item.action}
                  className="block w-full text-left px-4 py-3 rounded-xl text-slate-200 hover:bg-slate-800/60 hover:text-emerald-400 transition-all"
                >
                  {item.label}
                </button>
              )
            )}

            <div className="pt-4 border-t border-slate-800 space-y-2">
              {user ? (
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate(getDashboardRoute()); }}
                  className="w-full text-center px-4 py-3 rounded-full font-black bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                >
                  Go to Dashboard ({user.role})
                </button>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-3 rounded-full font-black bg-slate-900 text-white border border-slate-700 hover:bg-slate-800 transition-colors"
                  >
                    SIGN IN
                  </NavLink>
                  <NavLink
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-3 rounded-full font-black bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                  >
                    TRY US FREE
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Outlet */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Floating Action Widgets */}
      <FitnessChatbot />
      <WhatsAppButton />
      <ScrollToTopButton />
      <DeveloperBadge />

      {/* ═══════════════════════════════════════════════════
          REDESIGNED PREMIUM FOOTER
          ═══════════════════════════════════════════════════ */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-100 border-t border-slate-800 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Top Newsletter CTA Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">JOIN FITFORGE TODAY</span>
              <h3 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
                CLAIM YOUR COMPLIMENTARY 1-DAY GYM PASS
              </h3>
              <p className="text-xs text-slate-300">Experience 24/7 biometric smart access, power racks, and cold saunas.</p>
            </div>
            <div className="flex items-center space-x-3 flex-shrink-0">
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition-all flex items-center space-x-2 animate__animated animate__pulse animate__infinite"
              >
                <span>GET TRIAL PASS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main 4-Column Footer Navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 text-xs">
            
            {/* Column 1 — Brand info */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-black shadow-lg">
                  <Dumbbell className="w-6 h-6 transform -rotate-12 text-slate-950" />
                </div>
                <div>
                  <span className="text-xl font-black text-white">FIT<span className="text-emerald-400">FORGE</span></span>
                  <span className="block text-[9px] uppercase font-extrabold text-emerald-400 tracking-widest">PREMIUM GYM PLATFORM</span>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed max-w-sm font-normal">
                Delhi's premier 24/7 biometric gym. State-of-the-art Rogue power cages, Eleiko competition bars, certified 1-on-1 coaches, and far-infrared recovery spa.
              </p>

              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Gym Open 24/7 • Biometric Gate Active</span>
              </div>
            </div>

            {/* Column 2 — Quick Links */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="font-black text-emerald-400 uppercase tracking-widest text-xs">Quick Links</h4>
              <ul className="space-y-2 font-semibold text-slate-300">
                <li><button onClick={() => scrollToSection('top')} className="hover:text-emerald-400 transition-colors flex items-center space-x-1"><span>• Find Gym Location</span></button></li>
                <li><NavLink to="/about" className="hover:text-emerald-400 transition-colors flex items-center space-x-1"><span>• Personal Training</span></NavLink></li>
                <li><button onClick={() => scrollToSection('plans')} className="hover:text-emerald-400 transition-colors flex items-center space-x-1"><span>• Membership Plans</span></button></li>
                <li><button onClick={() => scrollToSection('amenities')} className="hover:text-emerald-400 transition-colors flex items-center space-x-1"><span>• Equipment & Spa</span></button></li>
                <li><NavLink to="/contact" className="hover:text-emerald-400 transition-colors flex items-center space-x-1"><span>• Contact Support</span></NavLink></li>
              </ul>
            </div>

            {/* Column 3 — System Portals */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="font-black text-emerald-400 uppercase tracking-widest text-xs">Portals & SaaS</h4>
              <ul className="space-y-2 font-semibold text-slate-300">
                <li><NavLink to="/login" className="hover:text-emerald-400 transition-colors">Admin Dashboard</NavLink></li>
                <li><NavLink to="/login" className="hover:text-emerald-400 transition-colors">Trainer Workspace</NavLink></li>
                <li><NavLink to="/login" className="hover:text-emerald-400 transition-colors">Member Console</NavLink></li>
                <li><NavLink to="/register" className="hover:text-emerald-400 transition-colors">Register Account</NavLink></li>
                <li><NavLink to="/login" className="hover:text-emerald-400 transition-colors">SaaS Features</NavLink></li>
              </ul>
            </div>

            {/* Column 4 — Gym Location Card */}
            <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <h4 className="font-black text-emerald-400 uppercase tracking-widest text-xs flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Delhi Location & Contact</span>
              </h4>
              <div className="space-y-2 text-slate-300 font-medium">
                <p className="text-slate-200 font-bold">Plot No 11 & 12, LSC, I.P. Extension, Patparganj, New Delhi 110092</p>
                <div className="flex items-center space-x-2 text-emerald-400 font-bold pt-1">
                  <Phone className="w-3.5 h-3.5" />
                  <span>+91 9625166582 | +91 7982746995</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-400 text-[11px]">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <span>support@fitforge.com</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Copyright Bar */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 font-medium">
            <div>
              © {new Date().getFullYear()} FitForge Gym & SaaS Management Platform. All rights reserved.
            </div>
            <div className="flex items-center space-x-4">
              <span className="hover:text-slate-200 cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-slate-200 cursor-pointer">Terms of Service</span>
              <span>•</span>
              <span className="hover:text-slate-200 cursor-pointer">24/7 Security</span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Dumbbell, Users, Flame, Zap, Award, CheckCircle2 } from 'lucide-react';

const tabsData = [
  {
    id: 1,
    tag: '01 / FACILITY & ACCESS',
    badge: '24/7 BIOMETRIC ACCESS',
    heading: 'Round-The-Clock Smart Entry & Security',
    description: 'Step into FitForge at 2 AM or 2 PM. Our contactless biometric security gate guarantees seamless 24/7 entrance with instant app keypass verification.',
    features: ['Contactless Biometric Keypass', '24/7 Surveillance & Panic Response', 'Global Access Across All Clubs'],
    buttonText: 'GET ACCESS PASS',
    icon: Shield,
    posterUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80',
    stat: '24/7',
    statLabel: 'Unrestricted Access'
  },
  {
    id: 2,
    tag: '02 / HEAVY STRENGTH ZONE',
    badge: 'PRO HAMMER STRENGTH',
    heading: 'Calibrated Iron & Precision Power Racks',
    description: 'Forged for lifters. Olympic platforms, Eleiko competition bars, custom dumbbells up to 60kg, and ergonomic pin-loaded isolation gear.',
    features: ['Eleiko Competition Barbell Racks', 'Custom Dumbbells up to 60kg', 'Sled Turf & Deadlift Shock Pads'],
    buttonText: 'EXPLORE EQUIPMENT',
    icon: Dumbbell,
    posterUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200&auto=format&fit=crop&q=80',
    stat: '100+',
    statLabel: 'Pro Workstations'
  },
  {
    id: 3,
    tag: '03 / PERSONAL COACHING',
    badge: '1-ON-1 ELITE TRAINING',
    heading: 'Data-Driven Workout & Form Guidance',
    description: 'Custom programming tailored to your muscle biomechanics. Track progress, body composition, and 1RM metrics with certified fitness strategists.',
    features: ['1-on-1 Form Biomechanics Audit', 'Tailored Macro & Diet Coaching', '1RM Strength Progression Log'],
    buttonText: 'BOOK COACH SESSION',
    icon: Users,
    posterUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&auto=format&fit=crop&q=80',
    stat: '100%',
    statLabel: 'Custom Tailored'
  },
  {
    id: 4,
    tag: '04 / HIGH-OCTANE CLASSES',
    badge: 'HIIT & HYROX ARENA',
    heading: 'Pulse-Pounding Group Fitness Studios',
    description: 'Join explosive HIIT, spin, CrossFit, and Hyrox preparation classes led by high-energy instructors in acoustically calibrated ambient studios.',
    features: ['Heart-Rate Tracked HIIT Workouts', 'Dedicated Hyrox Competition Area', 'Sound & Light Ambient Studio'],
    buttonText: 'VIEW CLASS SCHEDULE',
    icon: Flame,
    posterUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&auto=format&fit=crop&q=80',
    stat: '40+',
    statLabel: 'Weekly Sessions'
  },
  {
    id: 5,
    tag: '05 / RECOVERY & WELLNESS',
    badge: 'LUXURY RECOVERY SPA',
    heading: 'Infrared Saunas & Cold Contrast Plunge',
    description: 'Speed up muscle repair and reduce fatigue. Complete recovery suite featuring far-infrared saunas, ice baths, and percussion therapy tools.',
    features: ['Far-Infrared Sauna Cabins', 'Controlled Cold Contrast Tubs', 'Theragun Percussion Therapy Zone'],
    buttonText: 'EXPLORE WELLNESS',
    icon: Zap,
    posterUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&auto=format&fit=crop&q=80',
    stat: '2x',
    statLabel: 'Faster Recovery'
  }
];

const InteractiveTabShowcase = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(1);
  const sectionRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (sectionRef.current) {
            const rect = sectionRef.current.getBoundingClientRect();
            const navbarOffset = 90;
            const scrollDistance = navbarOffset - rect.top;
            const maxScroll = rect.height - (window.innerHeight - navbarOffset);

            if (maxScroll > 0) {
              const rawProgress = scrollDistance / maxScroll;
              const progress = Math.max(0, Math.min(0.99, rawProgress));
              const currentStep = Math.min(tabsData.length, Math.floor(progress * tabsData.length) + 1);
              setActiveTab(currentStep);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('scroll', onScroll);
    };
  }, []);

  const handleTabClick = (tabId) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const sectionTop = scrollTop + rect.top - 90;
    const maxScroll = rect.height - (window.innerHeight - 90);
    const targetProgress = (tabId - 1) / (tabsData.length - 1);
    const targetY = sectionTop + (targetProgress * maxScroll);

    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative text-slate-900 dark:text-slate-100 bg-gradient-to-b from-slate-100 via-emerald-50/40 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-6 sm:py-8 transition-colors duration-300">
      {/* Intro Header Section */}
      <div className="flex flex-col justify-center items-center py-6 sm:py-8 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-widest animate__animated animate__backInDown">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>SCROLL TO EXPERIENCE FITFORGE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-tight animate__animated animate__backInLeft">
            ENGINEERED FOR <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-300 bg-clip-text text-transparent">PEAK PERFORMANCE</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed animate__animated animate__backInRight">
            Scroll down to explore how FitForge integrates 24/7 biometric smart access, heavy iron strength zones, elite 1-on-1 coaching, and luxury contrast recovery.
          </p>

          {/* Clean Horizontal Tab Row */}
          <div className="flex flex-wrap justify-center items-center gap-2.5 pt-6 animate__animated animate__backInUp">
            {tabsData.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30 scale-105 ring-2 ring-emerald-500/40'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-white border border-slate-200 dark:border-slate-700 shadow-sm'
                }`}
              >
                <span>0{tab.id}.</span>
                <span>{tab.badge.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Sticky Showcase Section */}
      <section ref={sectionRef} className="section_tabs tabs_height bg-transparent">
        <div className="tabs_sticky-wrapper">
          <div className="tabs_container h-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center h-[82vh]">
              
              {/* Left Content Card */}
              <div className="lg:col-span-5 h-full bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative shadow-2xl overflow-hidden backdrop-blur-xl animate__animated animate__backInLeft">
                {/* Emerald Glow Accent */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none" />

                <div className="relative h-full flex flex-col justify-between">
                  {tabsData.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const IconComponent = tab.icon;

                    return (
                      <div
                        key={tab.id}
                        className={`transition-all duration-500 flex flex-col justify-between h-full absolute inset-0 ${
                          isActive ? 'opacity-100 pointer-events-auto translate-y-0 animate__animated animate__backInUp' : 'opacity-0 pointer-events-none translate-y-5'
                        }`}
                      >
                        {/* Header Tag & Badge */}
                        <div className="space-y-3 text-left">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono tracking-widest text-emerald-600 dark:text-emerald-400 uppercase font-bold">
                              {tab.tag}
                            </span>
                            <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 animate__animated animate__backInDown">
                              {tab.badge}
                            </span>
                          </div>
                          
                          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white leading-tight pt-1">
                            {tab.heading}
                          </h3>
                          
                          <div className="h-0.5 w-full bg-gradient-to-r from-emerald-500/50 to-transparent my-3" />
                          
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                            {tab.description}
                          </p>

                          {/* Feature Bullet Points */}
                          <div className="space-y-2 pt-2">
                            {tab.features.map((feat, idx) => (
                              <div key={idx} className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Stat Highlight Box */}
                        <div className="my-3 p-4 rounded-2xl bg-emerald-50/80 dark:bg-slate-800/80 border border-emerald-200 dark:border-slate-700 flex items-center space-x-4">
                          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                            <IconComponent className="w-6 h-6 animate__animated animate__pulse animate__infinite" />
                          </div>
                          <div>
                            <div className="text-2xl font-black text-slate-900 dark:text-white">{tab.stat}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">{tab.statLabel}</div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div>
                          <button
                            onClick={() => navigate('/register')}
                            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 group animate__animated animate__pulse animate__infinite"
                          >
                            <span>{tab.buttonText}</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Step Indicator Bar */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 z-10">
                  <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    STEP <span className="text-emerald-600 dark:text-emerald-400 font-bold">0{activeTab}</span> / 0{tabsData.length}
                  </div>
                  <div className="flex items-center space-x-1.5">
                    {tabsData.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          activeTab === tab.id ? 'w-6 bg-emerald-600 dark:bg-emerald-400' : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                        }`}
                        aria-label={`Jump to tab ${tab.id}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Media Card Container */}
              <div className="lg:col-span-7 h-full rounded-3xl overflow-hidden relative border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-100 dark:bg-slate-900">
                <div className="w-full h-full relative">
                  {tabsData.map((tab) => {
                    const isActive = activeTab === tab.id;

                    return (
                      <div
                        key={tab.id}
                        className={`absolute inset-0 w-full h-full transition-all duration-700 ${
                          isActive ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'
                        }`}
                      >
                        <img
                          src={tab.posterUrl}
                          alt={tab.heading}
                          className="w-full h-full object-cover"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

                        <div className="absolute top-6 right-6 px-4 py-2 rounded-full bg-white/90 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold flex items-center space-x-2 shadow-lg">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>{tab.badge}</span>
                        </div>

                        <div className="absolute bottom-6 left-6 right-6 p-5 sm:p-6 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-2xl">
                          <div>
                            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                              FITFORGE EXPERIENCE
                            </div>
                            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                              {tab.heading}
                            </div>
                          </div>
                          <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-300 font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                            <span>0{tab.id}</span>
                            <span className="text-emerald-500">•</span>
                            <span>ACTIVE</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InteractiveTabShowcase;

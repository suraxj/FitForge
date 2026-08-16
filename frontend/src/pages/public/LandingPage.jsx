import React, { useState, useEffect, useRef, useCallback } from 'react';
import InteractiveTabShowcase from '../../components/common/InteractiveTabShowcase';
import { useNavigate, NavLink } from 'react-router-dom';
import {
  Dumbbell,
  Shield,
  Award,
  Users,
  CheckCircle,
  ArrowRight,
  Zap,
  TrendingUp,
  MapPin,
  Phone,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Heart,
  Clock,
  Megaphone,
  Flame,
  Layers,
  ShieldCheck,
  Star,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/* ── Reliable Scroll‑triggered InView hook ───────────────── */
const useInView = (options = {}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      setInView(true);
      return;
    }

    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.01, rootMargin: '0px 0px 100px 0px', ...options }
    );

    observer.observe(el);

    // Safety fallback timer to prevent hidden content
    const timer = setTimeout(() => setInView(true), 1200);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return [ref, inView];
};

/* ── Reusable animate.css scroll wrapper ──────────── */
const AnimatedSection = ({ children, className = '', animation = 'animate__fadeInUp' }) => {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={`${inView ? `animate__animated ${animation}` : 'opacity-0'} transition-opacity duration-500 ${className}`}>
      {children}
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeSlide, setActiveSlide] = useState(0);

  const heroImages = [
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80'
  ];

  /* Auto‑rotate hero carousel */
  useEffect(() => {
    const timer = setInterval(() => setActiveSlide(s => (s + 1) % heroImages.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = useCallback((sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div id="top" className="space-y-0 font-['Plus_Jakarta_Sans',sans-serif] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-400">

      {/* ═══════════════════════════════════════════════════
          SECTION 1 — HERO BANNER
          ═══════════════════════════════════════════════════ */}
      <section className="relative py-6 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800 overflow-hidden bg-gradient-to-br from-white via-emerald-50/60 to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 font-['Outfit',sans-serif]">
        {/* Ambient gradient orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full filter blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <div className="bg-white dark:bg-slate-900/95 rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 min-h-[420px] backdrop-blur-xl">
            {/* Left Content Column */}
            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between animate__animated animate__backInLeft">
              <div className="space-y-4">
                {/* Header Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[11px] font-black uppercase tracking-wider animate__animated animate__backInDown">
                    <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>OPEN 24/7 • BIOMETRIC GATE</span>
                  </div>
                  <div className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-extrabold border border-slate-200 dark:border-slate-700 animate__animated animate__backInDown">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>4.9 (250+ REVIEWS)</span>
                  </div>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase text-slate-900 dark:text-white tracking-tight leading-[1.05] animate__animated animate__backInLeft">
                  FITFORGE <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-300 bg-clip-text text-transparent">PREMIUM GYM</span>
                </h1>

                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  Delhi's premier 24/7 fitness facility located at I.P. Extension, Patparganj. Equipped with Rogue power cages, Eleiko bars, 1-on-1 coaching, and luxury contrast saunas.
                </p>

                <div className="p-3 rounded-2xl bg-emerald-50/80 dark:bg-slate-800/70 border border-emerald-200 dark:border-slate-700/80 space-y-1 text-xs text-slate-700 dark:text-slate-300 animate__animated animate__backInUp">
                  <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-white">
                    <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span>Plot 11 & 12, LSC, I.P. Extension, Patparganj, Delhi 110092</span>
                  </div>
                  <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 font-extrabold pt-0.5">
                    <Phone className="w-3.5 h-3.5 animate__animated animate__headShake animate__infinite" />
                    <span>+91 9625166582 | +91 7982746995</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <button
                  onClick={() => navigate(user ? `/${user.role}/dashboard` : '/register')}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all flex items-center space-x-2 animate__animated animate__pulse animate__infinite group"
                >
                  <span>CLAIM FREE TRIAL PASS</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="px-6 py-3 rounded-full border-2 border-emerald-600 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 text-xs font-black uppercase tracking-wider transition-all transform hover:scale-105"
                >
                  MEMBERSHIP INQUIRY
                </button>
              </div>
            </div>

            {/* Right Photo Carousel Column */}
            <div className="lg:col-span-6 relative min-h-[260px] sm:min-h-[300px] bg-slate-900 overflow-hidden group animate__animated animate__backInRight">
              {heroImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`FitForge Gym Training Floor ${i + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                    activeSlide === i ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              {/* Live Badge Overlay */}
              <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white text-xs font-bold flex items-center space-x-2 border border-slate-200 dark:border-slate-700 shadow-xl">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Live Floor Camera</span>
              </div>

              {/* Carousel Controls Overlay */}
              <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                <button
                  onClick={() => setActiveSlide(s => (s === 0 ? heroImages.length - 1 : s - 1))}
                  className="w-9 h-9 rounded-full bg-slate-900/80 hover:bg-emerald-600 text-white flex items-center justify-center backdrop-blur-sm transition-all shadow-lg"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveSlide(s => (s + 1) % heroImages.length)}
                  className="w-9 h-9 rounded-full bg-slate-900/80 hover:bg-emerald-600 text-white flex items-center justify-center backdrop-blur-sm transition-all shadow-lg"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Slide Thumbnail Dots */}
              <div className="absolute bottom-4 left-5 flex items-center space-x-1.5">
                {heroImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSlide(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeSlide === i ? 'w-6 bg-emerald-400' : 'w-2 bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 1.5 — TYPING MOTIVATION BANNER
          ═══════════════════════════════════════════════════ */}
      <section className="relative py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/80 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-widest animate__animated animate__bounceIn">
            <Flame className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate__animated animate__headShake animate__infinite" />
            <span>FITFORGE MANTRA</span>
          </div>

          <div className="flex justify-center">
            <h2 className="animate-typing text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase text-slate-900 dark:text-white tracking-tight">
              FORGE YOUR STRONGEST SELF.
            </h2>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto font-medium">
            Where iron discipline meets expert coaching. Every rep, every set — engineered for your transformation.
          </p>

          <AnimatedSection animation="animate__zoomIn">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 max-w-3xl mx-auto">
              {[
                { value: '500+', label: 'Active Members' },
                { value: '24/7', label: 'Biometric Access' },
                { value: '15+', label: 'Certified Coaches' },
                { value: '98%', label: 'Goal Retention' }
              ].map((stat, i) => (
                <div key={i} className="p-3 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 shadow-sm backdrop-blur-sm text-center transform hover:scale-105 transition-transform duration-300">
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">{stat.value}</div>
                  <div className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 2 — STICKY JUMP TO NAV
          ═══════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white py-2.5 px-4 shadow-xl sticky top-20 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-start sm:justify-around overflow-x-auto gap-4 sm:gap-6 text-xs font-black uppercase tracking-wider scrollbar-none">
          <span className="text-white font-black text-sm flex-shrink-0 flex items-center space-x-1">
            <Sparkles className="w-4 h-4 text-white animate-spin" />
            <span>JUMP TO</span>
          </span>
          {[
            { id: 'amenities', label: 'Equipment & Amenities' },
            { id: 'plans', label: 'Membership Plans' },
            { id: 'testimonials', label: 'Member Reviews' },
            { id: 'announcements', label: 'Announcements' },
            { id: 'why-us', label: 'Why FitForge' },
          ].map(item => (
            <button key={item.id} onClick={() => scrollToSection(item.id)} className="hover:text-emerald-200 transition-colors flex-shrink-0 hover:scale-105">
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 3 — WE OFFER MORE THAN MACHINES
          ═══════════════════════════════════════════════════ */}
      <section id="why-us" className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-400">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase text-slate-900 dark:text-white tracking-wider">
              WE OFFER MORE THAN MACHINES
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-xl mx-auto font-medium">
              Join a supportive community driven by expert coaches, personalized training programs, and 24/7 global gym access.
            </p>
          </div>

          <AnimatedSection animation="animate__fadeInUp">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  icon: Dumbbell,
                  img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
                  title: 'PERSONALIZED PLANS',
                  desc: "Hiking Kilimanjaro? Running a local 5K? Whatever you want to achieve, we've got a tailored workout plan to get you there."
                },
                {
                  icon: Users,
                  img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=80',
                  title: 'SUPPORTIVE COACHES',
                  desc: 'Our coaches meet you where you are, to get you where you want to be. Real people coming together to help you make real progress.'
                },
                {
                  icon: Clock,
                  img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
                  title: 'ANYTIME, ANYWHERE',
                  desc: "24/7 access to thousands of locations worldwide. And a new app, because you never know when fitness inspiration might strike."
                }
              ].map((card, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all duration-300 group hover:-translate-y-2">
                  <div className="h-48 sm:h-56 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 relative">
                    <img
                      src={card.img}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
                    <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-md text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 animate__animated animate__pulse animate__infinite">
                      <card.icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg sm:text-xl font-black uppercase text-slate-900 dark:text-white tracking-wide group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 3.5 — INTERACTIVE STICKY SCROLL SHOWCASE
          ═══════════════════════════════════════════════════ */}
      <InteractiveTabShowcase />

      {/* ═══════════════════════════════════════════════════
          SECTION 4 — EQUIPMENT & AMENITIES
          ═══════════════════════════════════════════════════ */}
      <section id="amenities" className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 animate__animated animate__fadeIn">STATE-OF-THE-ART FACILITY</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase text-slate-900 dark:text-white tracking-wider">
              EQUIPMENT & AMENITIES
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Everything you need for strength training, cardio endurance, HIIT, and recovery.
            </p>
          </div>

          <AnimatedSection animation="animate__zoomIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {[
                { icon: Dumbbell, title: 'Free Weights Zone', desc: 'Rogue Olympic power racks, bumpers, dumbbells up to 50kg, and kettlebells.' },
                { icon: Flame, title: 'Cardio & Rowing', desc: 'Treadmills, Concept2 rowers, stairmasters, and assault bikes with personal screens.' },
                { icon: Users, title: 'Functional Turf', desc: 'Dedicated sled push turf, battle ropes, plyo boxes, and TRX suspension systems.' },
                { icon: ShieldCheck, title: 'Sauna & Recovery', desc: 'Clean private showers, steam sauna, lockers, and massage therapy zones.' }
              ].map((item, i) => (
                <div key={i} className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 hover:border-emerald-500/40 transition-all hover:scale-105 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <item.icon className="w-6 h-6 animate__animated animate__pulse animate__infinite" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase">{item.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 4.5 — MEMBER REVIEWS & TESTIMONIALS
          ═══════════════════════════════════════════════════ */}
      <section id="testimonials" className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">REAL PROGRESS, REAL PEOPLE</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-slate-900 dark:text-white tracking-wider">
              MEMBER TRANSFORMATIONS
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Hear directly from our members who forged their dream physique at FitForge.
            </p>
          </div>

          <AnimatedSection animation="animate__fadeInUp">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: 'Rohan Sharma',
                  role: 'Member for 8 Months',
                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
                  quote: 'FitForge transformed my mindset. 24/7 biometric access means I can train at 6 AM before work with zero hassle!',
                  rating: 5
                },
                {
                  name: 'Priya Verma',
                  role: 'Member for 1 Year',
                  avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
                  quote: 'The coaches are genuinely supportive. My personal trainer designed a routine that helped me gain 6kg lean muscle.',
                  rating: 5
                },
                {
                  name: 'Aman Deep',
                  role: 'Member for 6 Months',
                  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
                  quote: 'The Rogue power racks and cold recovery sauna are unmatched in Delhi. Best gym investment I have ever made.',
                  rating: 5
                }
              ].map((t, i) => (
                <div key={i} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-lg hover:border-emerald-500/40 transition-all hover:-translate-y-1">
                  <div className="flex items-center space-x-1 text-emerald-500">
                    {[...Array(t.rating)].map((_, r) => (
                      <Star key={r} className="w-4 h-4 fill-emerald-500 text-emerald-500 animate__animated animate__bounceIn" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium italic">"{t.quote}"</p>
                  <div className="flex items-center space-x-3 pt-2">
                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-emerald-500/40" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 5 — DEMO ACCOUNTS CONSOLE
          ═══════════════════════════════════════════════════ */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto text-center space-y-10 sm:space-y-12">
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              WE'RE READY WHEN YOU ARE
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
              Test out our SaaS Gym Management system with instant role-based demo accounts.
            </p>
          </div>

          <AnimatedSection animation="animate__fadeInUp">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 max-w-4xl mx-auto">
              {[
                { icon: Shield, label: 'Admin Console', email: 'admin@gym.com', pass: 'Admin@123', role: 'Admin' },
                { icon: Users, label: 'Trainer Workspace', email: 'trainer@gym.com', pass: 'Trainer@123', role: 'Trainer' },
                { icon: Award, label: 'Member Portal', email: 'member@gym.com', pass: 'Member@123', role: 'Member' }
              ].map((card, i) => (
                <div key={i} className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 text-left hover:border-emerald-500/40 transition-all shadow-sm">
                  <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase">
                    <card.icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate__animated animate__pulse animate__infinite" />
                    <span>{card.label}</span>
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-300 font-bold">Email: {card.email}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Password: {card.pass}</p>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold uppercase transition-all shadow-md shadow-emerald-600/30 hover:scale-105"
                  >
                    Sign In as {card.role}
                  </button>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 6 — MEMBERSHIP PLANS
          ═══════════════════════════════════════════════════ */}
      <section id="plans" className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-slate-900 dark:text-white tracking-wider">
              MEMBERSHIP PLANS
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-widest font-bold">
              Flexible options designed to fit your fitness journey
            </p>
          </div>

          <AnimatedSection animation="animate__fadeInUp">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Basic */}
              <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-lg">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Basic Access</span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">1 Month Plan</h3>
                  <div className="my-6">
                    <span className="text-4xl font-black text-slate-900 dark:text-white">$49</span>
                    <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold"> / month</span>
                  </div>
                  <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300 font-medium">
                    <li className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> <span>Full Gym Access</span></li>
                    <li className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> <span>Locker & Shower Access</span></li>
                    <li className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> <span>Mobile App Access</span></li>
                  </ul>
                </div>
                <NavLink to="/register" className="w-full text-center py-3.5 rounded-full text-xs font-black uppercase bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition-colors">
                  Select Plan
                </NavLink>
              </div>

              {/* Standard — Featured */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-emerald-500 space-y-6 flex flex-col justify-between relative shadow-2xl transform hover:-translate-y-2 transition-all">
                <span className="absolute -top-4 right-6 sm:right-8 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-[10px] px-3.5 py-1 rounded-full uppercase tracking-wider shadow-lg animate__animated animate__bounceIn animate__repeat-2">
                  BEST VALUE
                </span>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Standard Tier</span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">3 Months Plan</h3>
                  <div className="my-6">
                    <span className="text-4xl font-black text-slate-900 dark:text-white">$129</span>
                    <span className="text-slate-600 dark:text-slate-300 text-xs font-semibold"> / 3 months</span>
                  </div>
                  <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-200 font-medium">
                    <li className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> <span>24/7 Unlimited Gym Access</span></li>
                    <li className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> <span>Personal Trainer Consultation</span></li>
                    <li className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> <span>Custom Diet & Meal Guide</span></li>
                    <li className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> <span>Body Composition Tracking</span></li>
                  </ul>
                </div>
                <NavLink to="/register" className="w-full text-center py-3.5 rounded-full text-xs font-black uppercase bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg transition-all animate__animated animate__pulse animate__infinite">
                  TRY US FREE
                </NavLink>
              </div>

              {/* Premium */}
              <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-lg">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">VIP Membership</span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">12 Months Plan</h3>
                  <div className="my-6">
                    <span className="text-4xl font-black text-slate-900 dark:text-white">$399</span>
                    <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold"> / year</span>
                  </div>
                  <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300 font-medium">
                    <li className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> <span>Worldwide 24/7 Access</span></li>
                    <li className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> <span>Dedicated Personal Coach</span></li>
                    <li className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> <span>Sauna & Recovery Zone</span></li>
                  </ul>
                </div>
                <NavLink to="/register" className="w-full text-center py-3.5 rounded-full text-xs font-black uppercase bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition-colors">
                  Select Plan
                </NavLink>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 7 — GYM ANNOUNCEMENTS
          ═══════════════════════════════════════════════════ */}
      <section id="announcements" className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 animate__animated animate__bounceIn">
              <Megaphone className="w-6 h-6 animate__animated animate__headShake animate__infinite" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-slate-900 dark:text-white tracking-wider">
              GYM ANNOUNCEMENTS
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">Stay up to date with club news, new equipment additions, and operating hours.</p>
          </div>

          <AnimatedSection animation="animate__fadeInUp">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
              {[
                {
                  tag: 'IMPORTANT', tagBg: 'bg-emerald-600', tagText: 'text-white',
                  title: '🏋️ New Power Racks & Dumbbell Zone!',
                  desc: 'We have upgraded our strength area with brand new Rogue power cages and dumbbells up to 50kg.'
                },
                {
                  tag: 'NOTICE', tagBg: 'bg-teal-600', tagText: 'text-white',
                  title: '⏰ Holiday Operating Hours',
                  desc: 'FitForge will operate on holiday schedule (8:00 AM - 6:00 PM) this Sunday.'
                },
                {
                  tag: 'WELLNESS', tagBg: 'bg-emerald-600', tagText: 'text-white',
                  title: '💧 Steam Sauna Sanitation',
                  desc: 'Sauna maintenance scheduled today between 2:00 PM - 4:00 PM. Thank you for your cooperation!'
                }
              ].map((item, i) => (
                <div key={i} className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:scale-105 shadow-sm">
                  <span className={`inline-block px-3 py-1 rounded-md text-[10px] font-black uppercase ${item.tagBg} ${item.tagText}`}>
                    {item.tag}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;

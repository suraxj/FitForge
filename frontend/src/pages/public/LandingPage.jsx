import React, { useState } from 'react';
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
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeSlide, setActiveSlide] = useState(0);

  const heroImages = [
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80'
  ];

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="top" className="space-y-0 bg-[#0d0620] font-['Plus_Jakarta_Sans',sans-serif]">
      {/* SECTION 1: Featured Hero Banner with Anytime Fitness Diagonal Pattern & White Split Card */}
      <section className="relative anytime-hero-bg py-12 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-purple-900/40">
        <div className="max-w-7xl mx-auto">
          {/* Main White & Image Split Card */}
          <div className="bg-white rounded-3xl overflow-hidden anytime-card-shadow grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
            {/* Left Content Column */}
            <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between text-[#1f0b4a] bg-white">
              <div className="space-y-5">
                <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#00d2c4]/15 border border-[#00d2c4]/40 text-[#190a38] text-[11px] font-black uppercase tracking-wider shimmer-badge">
                  <Activity className="w-3.5 h-3.5 text-[#00d2c4]" />
                  <span>OPEN TO MEMBERS 24/7</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-[#23125b] tracking-tight leading-tight">
                  FITFORGE GYM IN DELHI, I.P. EXTENSION
                </h1>

                <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                  <p className="font-semibold text-slate-800">Plot Number 11 and 12,</p>
                  <p>LSC, I.P. Extension, Patparganj, Delhi</p>
                  <p>New Delhi, Delhi 110092</p>
                  <p className="pt-2 text-[#6d28d9] font-bold flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>+91 9625166582, +91 7982746995</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-8">
                <button
                  onClick={() => navigate(user ? `/${user.role}/dashboard` : '/register')}
                  className="px-8 py-3.5 rounded-full bg-[#6d28d9] hover:bg-[#5b21b6] text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-purple-900/30 transition-all btn-glow-purple flex items-center space-x-2"
                >
                  <span>TRY US FREE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="px-8 py-3.5 rounded-full border-2 border-[#6d28d9] text-[#6d28d9] hover:bg-[#6d28d9]/10 text-xs font-black uppercase tracking-wider transition-all transform hover:scale-105"
                >
                  MEMBERSHIP INQUIRY
                </button>
              </div>
            </div>

            {/* Right Photo Column with Carousel Controls */}
            <div className="lg:col-span-6 relative min-h-[320px] bg-slate-900 overflow-hidden group">
              <img
                src={heroImages[activeSlide]}
                alt="FitForge Gym Training"
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

              {/* Live Badge Overlay */}
              <div className="absolute top-6 left-6 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold flex items-center space-x-2 border border-white/20">
                <span className="w-2 h-2 rounded-full bg-[#00d2c4] animate-ping" />
                <span>Live Gym Training Floor</span>
              </div>

              {/* Carousel Controls Overlay */}
              <div className="absolute bottom-6 right-6 flex items-center space-x-2">
                <button
                  onClick={() => setActiveSlide((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1))}
                  className="w-10 h-10 rounded-full bg-black/60 hover:bg-[#6d28d9] text-white flex items-center justify-center backdrop-blur-sm transition-all transform hover:scale-110"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveSlide((prev) => (prev + 1) % heroImages.length)}
                  className="w-10 h-10 rounded-full bg-black/60 hover:bg-[#6d28d9] text-white flex items-center justify-center backdrop-blur-sm transition-all transform hover:scale-110"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Sticky "JUMP TO" Sub-Navigation Strip */}
      <section className="bg-[#5b21b6] text-white py-4 px-4 shadow-xl sticky top-20 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between sm:justify-around overflow-x-auto gap-6 text-xs font-black uppercase tracking-wider scrollbar-none">
          <span className="text-[#00d2c4] font-black text-sm flex-shrink-0 flex items-center space-x-1">
            <Sparkles className="w-4 h-4 text-[#00d2c4] animate-spin" />
            <span>JUMP TO</span>
          </span>
          <button onClick={() => scrollToSection('amenities')} className="hover:text-[#00d2c4] transition-colors flex-shrink-0 hover:scale-105">Equipment & Amenities</button>
          <button onClick={() => scrollToSection('plans')} className="hover:text-[#00d2c4] transition-colors flex-shrink-0 hover:scale-105">Membership Plans</button>
          <button onClick={() => scrollToSection('announcements')} className="hover:text-[#00d2c4] transition-colors flex-shrink-0 hover:scale-105">Gym Announcements</button>
          <button onClick={() => scrollToSection('why-us')} className="hover:text-[#00d2c4] transition-colors flex-shrink-0 hover:scale-105">Why FitForge</button>
        </div>
      </section>

      {/* SECTION 3: "WE OFFER MORE THAN MACHINES" Showcase */}
      <section id="why-us" className="bg-[#f6f6f9] text-[#190a38] py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-[#23125b] tracking-wider">
              WE OFFER MORE THAN MACHINES
            </h2>
            <p className="text-sm text-slate-600 mt-3 max-w-xl mx-auto font-medium">
              Join a supportive community driven by expert coaches, personalized training programs, and 24/7 global gym access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-3xl p-6 shadow-xl space-y-5 border border-slate-200/80 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="h-56 rounded-2xl overflow-hidden bg-slate-100 relative">
                <img
                  src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80"
                  alt="Personalized Plans"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 p-2 rounded-xl bg-black/50 backdrop-blur-md text-[#00d2c4]">
                  <Dumbbell className="w-5 h-5" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-black uppercase text-[#23125b] tracking-wide group-hover:text-[#6d28d9] transition-colors">
                  PERSONALIZED PLANS
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Hiking Kilimanjaro? Running a local 5K? Whatever you want to achieve, we've got a tailored workout plan to get you there.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-3xl p-6 shadow-xl space-y-5 border border-slate-200/80 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="h-56 rounded-2xl overflow-hidden bg-slate-100 relative">
                <img
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=80"
                  alt="Supportive Coaches"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 p-2 rounded-xl bg-black/50 backdrop-blur-md text-[#00d2c4]">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-black uppercase text-[#23125b] tracking-wide group-hover:text-[#6d28d9] transition-colors">
                  SUPPORTIVE COACHES
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our coaches meet you where you are, to get you where you want to be. Real people coming together to help you make real progress.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-3xl p-6 shadow-xl space-y-5 border border-slate-200/80 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="h-56 rounded-2xl overflow-hidden bg-slate-100 relative">
                <img
                  src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80"
                  alt="Anytime, Anywhere"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 p-2 rounded-xl bg-black/50 backdrop-blur-md text-[#00d2c4]">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-black uppercase text-[#23125b] tracking-wide group-hover:text-[#6d28d9] transition-colors">
                  ANYTIME, ANYWHERE
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  24/7 access to thousands of locations worldwide. And a new app, because you never know when fitness inspiration might strike.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: EQUIPMENT & AMENITIES */}
      <section id="amenities" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#190a38] text-white border-t border-purple-900/40">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#00d2c4]">STATE-OF-THE-ART FACILITY</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white tracking-wider">
              EQUIPMENT & AMENITIES
            </h2>
            <p className="text-xs text-purple-200 max-w-xl mx-auto">
              Everything you need for strength training, cardio endurance, HIIT, and recovery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#261159] border border-purple-700/50 space-y-3 glass-card">
              <div className="w-12 h-12 rounded-2xl bg-[#00d2c4]/20 text-[#00d2c4] flex items-center justify-center font-bold">
                <Dumbbell className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white uppercase">Free Weights Zone</h3>
              <p className="text-xs text-slate-300">Rogue Olympic power racks, bumpers, dumbbells up to 50kg, and kettlebells.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#261159] border border-purple-700/50 space-y-3 glass-card">
              <div className="w-12 h-12 rounded-2xl bg-[#00d2c4]/20 text-[#00d2c4] flex items-center justify-center font-bold">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white uppercase">Cardio & Rowing</h3>
              <p className="text-xs text-slate-300">Treadmills, Concept2 rowers, stairmasters, and assault bikes with personal screens.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#261159] border border-purple-700/50 space-y-3 glass-card">
              <div className="w-12 h-12 rounded-2xl bg-[#00d2c4]/20 text-[#00d2c4] flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white uppercase">Functional Turf</h3>
              <p className="text-xs text-slate-300">Dedicated sled push turf, battle ropes, plyo boxes, and TRX suspension systems.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#261159] border border-purple-700/50 space-y-3 glass-card">
              <div className="w-12 h-12 rounded-2xl bg-[#00d2c4]/20 text-[#00d2c4] flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white uppercase">Sauna & Recovery</h3>
              <p className="text-xs text-slate-[#00d2c4]">Clean private showers, steam sauna, lockers, and massage therapy zones.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: "WE'RE READY WHEN YOU ARE" Header & Demo Login Cards */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0d0620] text-white border-t border-purple-900/40">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="space-y-3">
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-wider text-[#00d2c4] gradient-text-animated">
              WE'RE READY WHEN YOU ARE
            </h2>
            <p className="text-sm text-purple-200 max-w-xl mx-auto">
              Test out our SaaS Gym Management system with instant role-based demo accounts.
            </p>
          </div>

          {/* Quick Demo Credentials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl bg-[#190a38] border border-purple-700/50 space-y-3 text-left glass-card">
              <div className="flex items-center space-x-2 text-[#00d2c4] font-black text-xs uppercase">
                <Shield className="w-4 h-4 text-[#00d2c4]" />
                <span>Admin Console</span>
              </div>
              <p className="text-xs text-slate-300 font-bold">Email: admin@gym.com</p>
              <p className="text-xs text-slate-400">Password: Admin@123</p>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-2.5 rounded-full bg-[#6d28d9] hover:bg-[#5b21b6] text-white text-xs font-bold uppercase transition-all btn-glow-purple"
              >
                Sign In as Admin
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-[#190a38] border border-purple-700/50 space-y-3 text-left glass-card">
              <div className="flex items-center space-x-2 text-[#00d2c4] font-black text-xs uppercase">
                <Users className="w-4 h-4 text-[#00d2c4]" />
                <span>Trainer Workspace</span>
              </div>
              <p className="text-xs text-slate-300 font-bold">Email: trainer@gym.com</p>
              <p className="text-xs text-slate-400">Password: Trainer@123</p>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-2.5 rounded-full bg-[#6d28d9] hover:bg-[#5b21b6] text-white text-xs font-bold uppercase transition-all btn-glow-purple"
              >
                Sign In as Trainer
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-[#190a38] border border-purple-700/50 space-y-3 text-left glass-card">
              <div className="flex items-center space-x-2 text-[#00d2c4] font-black text-xs uppercase">
                <Award className="w-4 h-4 text-[#00d2c4]" />
                <span>Member Portal</span>
              </div>
              <p className="text-xs text-slate-300 font-bold">Email: member@gym.com</p>
              <p className="text-xs text-slate-400">Password: Member@123</p>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-2.5 rounded-full bg-[#6d28d9] hover:bg-[#5b21b6] text-white text-xs font-bold uppercase transition-all btn-glow-purple"
              >
                Sign In as Member
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: Membership Plans Showcase */}
      <section id="plans" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#190a38] text-white border-t border-purple-900/40">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-wider">
              MEMBERSHIP PLANS
            </h2>
            <p className="text-xs text-purple-300 uppercase tracking-widest font-bold">
              Flexible options designed to fit your fitness journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic */}
            <div className="bg-[#261159] rounded-3xl p-8 border border-purple-900/60 space-y-6 flex flex-col justify-between glass-card">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-purple-400">Basic Access</span>
                <h3 className="text-2xl font-black text-white mt-1">1 Month Plan</h3>
                <div className="my-6">
                  <span className="text-4xl font-black text-white">$49</span>
                  <span className="text-slate-400 text-xs font-semibold"> / month</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300 font-medium">
                  <li className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-[#00d2c4]" /> <span>Full Gym Access</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-[#00d2c4]" /> <span>Locker & Shower Access</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-[#00d2c4]" /> <span>Mobile App Access</span></li>
                </ul>
              </div>
              <NavLink to="/register" className="w-full text-center py-3.5 rounded-full text-xs font-black uppercase bg-purple-900/60 hover:bg-purple-800 text-white transition-colors">
                Select Plan
              </NavLink>
            </div>

            {/* Standard */}
            <div className="bg-[#261159] rounded-3xl p-8 border-2 border-[#00d2c4] space-y-6 flex flex-col justify-between relative shadow-2xl shadow-purple-950 transform hover:-translate-y-2 transition-all">
              <span className="absolute -top-4 right-8 bg-[#00d2c4] text-[#190a38] font-black text-[10px] px-3.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
                BEST VALUE
              </span>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#00d2c4]">Standard Tier</span>
                <h3 className="text-2xl font-black text-white mt-1">3 Months Plan</h3>
                <div className="my-6">
                  <span className="text-4xl font-black text-white">$129</span>
                  <span className="text-slate-300 text-xs font-semibold"> / 3 months</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-200 font-medium">
                  <li className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-[#00d2c4]" /> <span>24/7 Unlimited Gym Access</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-[#00d2c4]" /> <span>Personal Trainer Consultation</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-[#00d2c4]" /> <span>Custom Diet & Meal Guide</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-[#00d2c4]" /> <span>Body Composition Tracking</span></li>
                </ul>
              </div>
              <NavLink to="/register" className="w-full text-center py-3.5 rounded-full text-xs font-black uppercase bg-[#6d28d9] hover:bg-[#5b21b6] text-white shadow-lg transition-all btn-glow-purple">
                TRY US FREE
              </NavLink>
            </div>

            {/* Premium */}
            <div className="bg-[#261159] rounded-3xl p-8 border border-purple-900/60 space-y-6 flex flex-col justify-between glass-card">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-purple-400">VIP Membership</span>
                <h3 className="text-2xl font-black text-white mt-1">12 Months Plan</h3>
                <div className="my-6">
                  <span className="text-4xl font-black text-white">$399</span>
                  <span className="text-slate-400 text-xs font-semibold"> / year</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300 font-medium">
                  <li className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-[#00d2c4]" /> <span>Worldwide 24/7 Access</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-[#00d2c4]" /> <span>Dedicated Personal Coach</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-[#00d2c4]" /> <span>Sauna & Recovery Zone</span></li>
                </ul>
              </div>
              <NavLink to="/register" className="w-full text-center py-3.5 rounded-full text-xs font-black uppercase bg-purple-900/60 hover:bg-purple-800 text-white transition-colors">
                Select Plan
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: GYM ANNOUNCEMENTS */}
      <section id="announcements" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0d0620] text-white border-t border-purple-900/40">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#00d2c4]/20 text-[#00d2c4] flex items-center justify-center mx-auto border border-[#00d2c4]/30">
              <Megaphone className="w-6 h-6" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-wider">
              GYM ANNOUNCEMENTS
            </h2>
            <p className="text-xs text-purple-300">Stay up to date with club news, new equipment additions, and operating hours.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="p-6 rounded-2xl bg-[#190a38] border border-purple-800/60 space-y-3 glass-card">
              <span className="px-3 py-1 rounded-md text-[10px] font-black uppercase bg-[#00d2c4] text-[#190a38]">
                IMPORTANT
              </span>
              <h3 className="text-base font-bold text-white">🏋️ New Power Racks & Dumbbell Zone!</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                We have upgraded our strength area with brand new Rogue power cages and dumbbells up to 50kg.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#190a38] border border-purple-800/60 space-y-3 glass-card">
              <span className="px-3 py-1 rounded-md text-[10px] font-black uppercase bg-purple-600 text-white">
                NOTICE
              </span>
              <h3 className="text-base font-bold text-white">⏰ Holiday Operating Hours</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                FitForge will operate on holiday schedule (8:00 AM - 6:00 PM) this Sunday.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#190a38] border border-purple-800/60 space-y-3 glass-card">
              <span className="px-3 py-1 rounded-md text-[10px] font-black uppercase bg-[#00d2c4] text-[#190a38]">
                WELLNESS
              </span>
              <h3 className="text-base font-bold text-white">💧 Steam Sauna Sanitation</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sauna maintenance scheduled today between 2:00 PM - 4:00 PM. Thank you for your cooperation!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

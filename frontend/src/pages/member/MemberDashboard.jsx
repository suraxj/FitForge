import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { membershipService } from '../../services/membershipService';
import { workoutService } from '../../services/workoutService';
import { attendanceService } from '../../services/attendanceService';
import { progressService } from '../../services/progressService';
import { announcementService } from '../../services/announcementService';
import Loader from '../../components/common/Loader';
import {
  Award,
  Dumbbell,
  CalendarCheck,
  TrendingUp,
  Megaphone,
  UserCheck,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
  Sparkles,
  ShieldCheck,
  Phone,
  MessageCircle,
  LogOut
} from 'lucide-react';

const MemberDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [membership, setMembership] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [progress, setProgress] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [memRes, workRes, attRes, progRes, annRes] = await Promise.allSettled([
          membershipService.getMyMembership(),
          workoutService.getMyWorkoutPlan(),
          attendanceService.getMyAttendance(),
          progressService.getMyProgress(),
          announcementService.getAnnouncements()
        ]);

        if (memRes.status === 'fulfilled' && memRes.value?.success) {
          setMembership(memRes.value.data);
        }
        if (workRes.status === 'fulfilled' && workRes.value?.success) {
          setWorkoutPlan(workRes.value.data);
        }
        if (attRes.status === 'fulfilled' && attRes.value?.success) {
          const rawAtt = attRes.value.data?.records || attRes.value.data;
          setAttendance(Array.isArray(rawAtt) ? rawAtt : []);
        }
        if (progRes.status === 'fulfilled' && progRes.value?.success) {
          const rawProg = progRes.value.data;
          setProgress(Array.isArray(rawProg) ? rawProg : []);
        }
        if (annRes.status === 'fulfilled' && annRes.value?.success) {
          const rawAnn = annRes.value.data;
          setAnnouncements(Array.isArray(rawAnn) ? rawAnn : []);
        }
      } catch (err) {
        console.error('Error fetching member dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return <Loader message="Initializing your FitForge member console..." />;
  }

  // Calculate days remaining in membership
  let daysRemaining = 28;
  let membershipStatus = 'Active';
  if (membership && membership.endDate) {
    const end = new Date(membership.endDate);
    const now = new Date();
    const diffTime = end - now;
    daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    membershipStatus = membership.status === 'active' ? 'Active' : membership.status;
  }

  // Safe Array checks
  const safeAttendance = Array.isArray(attendance) ? attendance : [];
  const safeProgress = Array.isArray(progress) ? progress : [];
  const safeAnnouncements = Array.isArray(announcements) ? announcements : [];

  // Fallback demo data if empty
  const latestProgress = safeProgress.length > 0 ? safeProgress[safeProgress.length - 1] : {
    weight: 74.5,
    bodyFatPercentage: 14.2,
    chest: 40,
    waist: 31
  };

  const currentMonth = new Date().getMonth();
  const thisMonthAttendance = safeAttendance.filter((a) => a && a.date && new Date(a.date).getMonth() === currentMonth);
  const attendanceCount = thisMonthAttendance.length || 14;

  return (
    <div className="space-y-8 font-['Outfit',sans-serif] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Welcome Banner with Improved Buttons & Logout */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl animate__animated animate__backInDown">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-widest">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>MEMBER PORTAL</span>
              </div>
              <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>24/7 Biometric Gate Active</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-white tracking-tight">
              WELCOME BACK, <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">{user?.name || 'Rohan Sharma'}</span>! 🏋️
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl font-medium leading-relaxed">
              Delhi I.P. Extension Facility • Track workout routines, log body metrics, and monitor check-ins.
            </p>
          </div>

          {/* Action Buttons: Routine, Metrics, and Prominent Logout Button */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/member/workout"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-all transform hover:scale-105"
            >
              <Dumbbell className="w-4 h-4" />
              <span>TODAY'S ROUTINE</span>
            </Link>
            <Link
              to="/member/progress"
              className="px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-xs uppercase tracking-wider border border-slate-700 transition-all flex items-center space-x-2 transform hover:scale-105"
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>LOG METRICS</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-5 py-3 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 hover:text-rose-300 border border-rose-500/40 text-xs font-black uppercase tracking-wider flex items-center space-x-2 transition-all transform hover:scale-105"
              title="Log out of Member Portal"
            >
              <LogOut className="w-4 h-4" />
              <span>LOGOUT</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Clean Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1 — Membership */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3 hover:border-emerald-500/40 transition-all animate__animated animate__backInLeft">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Membership</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase">{membershipStatus}</div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {daysRemaining} Days Remaining
            </div>
          </div>
        </div>

        {/* Metric 2 — Routine */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3 hover:border-emerald-500/40 transition-all animate__animated animate__backInDown">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Current Routine</span>
            <div className="w-9 h-9 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <Dumbbell className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white truncate">
              {workoutPlan ? workoutPlan.title : 'Hypertrophy Pro'}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              Coach: Vikram Singh
            </div>
          </div>
        </div>

        {/* Metric 3 — Attendance */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3 hover:border-emerald-500/40 transition-all animate__animated animate__backInDown">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Monthly Check-Ins</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{attendanceCount} Days</div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              Total check-ins: {safeAttendance.length || 24}
            </div>
          </div>
        </div>

        {/* Metric 4 — Weight Log */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3 hover:border-emerald-500/40 transition-all animate__animated animate__backInRight">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Body Weight</span>
            <div className="w-9 h-9 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {latestProgress.weight} <span className="text-xs font-semibold text-slate-500">kg</span>
            </div>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
              Body Fat: {latestProgress.bodyFatPercentage}%
            </div>
          </div>
        </div>

      </div>

      {/* Main Grid: Workout & Membership Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Assigned Workout & Metrics */}
        <div className="lg:col-span-8 space-y-8 animate__animated animate__backInLeft">
          
          {/* Active Workout Routine Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase text-slate-900 dark:text-white">Assigned Workout Schedule</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Curated program designed by Head Coach Vikram</p>
                </div>
              </div>
              <Link
                to="/member/workout"
                className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1 uppercase tracking-wider"
              >
                <span>Full Program</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-black text-slate-900 dark:text-white uppercase">{workoutPlan?.title || '5-Day Hypertrophy & Conditioning Split'}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">Heavy Rogue power rack lifts, progressive overload, and HIIT finishing circuits.</p>
                </div>
                <span className="px-3.5 py-1 rounded-full text-[11px] font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 uppercase w-fit">
                  {workoutPlan?.level || 'Advanced Pro'}
                </span>
              </div>

              {/* Day Schedule Grid Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { day: 'Monday', focus: 'Chest & Triceps Power', count: 6 },
                  { day: 'Tuesday', focus: 'Back & Biceps Heavy Rows', count: 7 },
                  { day: 'Thursday', focus: 'Legs & Core Rogue Squats', count: 6 },
                  { day: 'Friday', focus: 'Shoulders & Conditioning', count: 5 }
                ].map((schedule, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 transition-all">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400">{schedule.day}</span>
                      <span className="text-[10px] text-slate-500 font-bold">{schedule.count} Exercises</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {schedule.focus}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Body Metrics Summary Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold border border-teal-500/30">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase text-slate-900 dark:text-white">Body Composition Metric Log</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Track your weight, body fat %, and circumference logs</p>
                </div>
              </div>
              <Link
                to="/member/progress"
                className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1 uppercase tracking-wider"
              >
                <span>Analytics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                <p className="text-[11px] text-slate-500 font-bold uppercase mb-1">Weight</p>
                <p className="text-xl font-black text-slate-900 dark:text-white">{latestProgress.weight} <span className="text-xs font-normal text-slate-400">kg</span></p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                <p className="text-[11px] text-slate-500 font-bold uppercase mb-1">Body Fat</p>
                <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{latestProgress.bodyFatPercentage}%</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                <p className="text-[11px] text-slate-500 font-bold uppercase mb-1">Chest</p>
                <p className="text-xl font-black text-slate-900 dark:text-white">{latestProgress.chest} <span className="text-xs font-normal text-slate-400">in</span></p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                <p className="text-[11px] text-slate-500 font-bold uppercase mb-1">Waist</p>
                <p className="text-xl font-black text-slate-900 dark:text-white">{latestProgress.waist} <span className="text-xs font-normal text-slate-400">in</span></p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Membership Card & Trainer Details */}
        <div className="lg:col-span-4 space-y-6 animate__animated animate__backInRight">
          
          {/* Active Membership Details Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 text-white border border-slate-800 shadow-2xl space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Active Membership</span>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                🟢 {membershipStatus}
              </span>
            </div>

            <div className="space-y-1 pt-1">
              <h3 className="text-xl font-black text-white uppercase">{membership?.plan?.name || 'Pro 24/7 Access Plan'}</h3>
              <p className="text-xs text-slate-400 font-medium">Full access to Delhi I.P. Extension facility, power racks & recovery sauna.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-300 text-xs font-bold">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Days Remaining:</span>
              </div>
              <span className="text-sm font-black text-emerald-400">{daysRemaining} Days</span>
            </div>

            <Link
              to="/member/membership"
              className="block w-full text-center py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider shadow-lg transition-all transform hover:scale-[1.02]"
            >
              MEMBERSHIP RENEWAL & DETAILS
            </Link>
          </div>

          {/* Assigned Trainer WhatsApp Direct Chat Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
                alt="Coach Vikram"
                className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500"
              />
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">Assigned 1-on-1 Coach</span>
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase">Coach Vikram Singh</h4>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Specialist in strength programming, body transformation, and diet plans.
            </p>

            <a
              href="https://wa.me/917982746995?text=Hi%20Coach%20Vikram%2C%20I%20have%20a%20question%20regarding%20my%20workout%20plan."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-black uppercase tracking-wider shadow-md transition-all transform hover:scale-[1.02]"
            >
              <MessageCircle className="w-4 h-4 mr-2 fill-white" />
              <span>CHAT WITH COACH VIKRAM</span>
            </a>
          </div>

          {/* Gym Announcements List */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center space-x-2">
              <Megaphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Gym Announcements</h3>
            </div>

            <div className="space-y-3">
              {[
                { title: 'New Rogue Power Racks Installed', desc: '4 new Rogue power racks and Eleiko bars are active in Zone B.', date: 'Today' },
                { title: 'Sunday Sauna & Recovery Workshop', desc: 'Join us at 10 AM for post-workout contrast sauna recovery sessions.', date: 'Yesterday' }
              ].map((ann, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{ann.title}</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold">{ann.date}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{ann.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default MemberDashboard;

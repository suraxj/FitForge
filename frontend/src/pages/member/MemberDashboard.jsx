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
  LogOut,
  Flame,
  Zap,
  Target,
  ChevronRight,
  Check
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
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [completedExercises, setCompletedExercises] = useState({});

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

  const toggleExercise = (exKey) => {
    setCompletedExercises(prev => ({
      ...prev,
      [exKey]: !prev[exKey]
    }));
  };

  if (loading) {
    return <Loader message="Initializing your FitForge member console..." />;
  }

  // Days remaining calculation
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

  // Fallback demo progress
  const latestProgress = safeProgress.length > 0 ? safeProgress[safeProgress.length - 1] : {
    weight: 74.5,
    bodyFatPercentage: 14.2,
    chest: 40,
    waist: 31
  };

  const currentMonth = new Date().getMonth();
  const thisMonthAttendance = safeAttendance.filter((a) => a && a.date && new Date(a.date).getMonth() === currentMonth);
  const attendanceCount = thisMonthAttendance.length || 14;

  // Mock weekly exercise schedule by day
  const weeklySchedule = {
    Monday: [
      { name: 'Rogue Barbell Bench Press', sets: '4 Sets x 8-10 Reps', target: 'Chest & Triceps', key: 'm1' },
      { name: 'Incline Dumbbell Flyes', sets: '3 Sets x 12 Reps', target: 'Upper Chest', key: 'm2' },
      { name: 'Weighted Dips', sets: '3 Sets x 10 Reps', target: 'Lower Chest & Triceps', key: 'm3' },
      { name: 'Cable Rope Tricep Pushdown', sets: '4 Sets x 15 Reps', target: 'Triceps', key: 'm4' }
    ],
    Tuesday: [
      { name: 'Barbell Deadlifts (Eleiko Bar)', sets: '4 Sets x 6 Reps', target: 'Posterior Chain', key: 't1' },
      { name: 'Lat Pulldowns (Wide Grip)', sets: '4 Sets x 10 Reps', target: 'Lats & Back', key: 't2' },
      { name: 'Seated Cable Row', sets: '3 Sets x 12 Reps', target: 'Middle Back', key: 't3' },
      { name: 'Incline Dumbbell Bicep Curls', sets: '4 Sets x 12 Reps', target: 'Biceps', key: 't4' }
    ],
    Wednesday: [
      { name: 'Active Recovery & Sauna', sets: '30 Mins Infrared Sauna', target: 'Muscle Recovery', key: 'w1' },
      { name: 'Core Plank Hold', sets: '4 Sets x 60 Seconds', target: 'Core Abs', key: 'w2' }
    ],
    Thursday: [
      { name: 'Rogue Olympic Back Squats', sets: '5 Sets x 8 Reps', target: 'Quads & Glutes', key: 'th1' },
      { name: 'Romanian Deadlifts', sets: '4 Sets x 10 Reps', target: 'Hamstrings', key: 'th2' },
      { name: 'Leg Press Machines', sets: '4 Sets x 12 Reps', target: 'Quads', key: 'th3' },
      { name: 'Seated Calf Raises', sets: '4 Sets x 15 Reps', target: 'Calves', key: 'th4' }
    ],
    Friday: [
      { name: 'Overhead Barbell Military Press', sets: '4 Sets x 8 Reps', target: 'Shoulders', key: 'f1' },
      { name: 'Dumbbell Lateral Raises', sets: '4 Sets x 15 Reps', target: 'Side Delts', key: 'f2' },
      { name: 'Face Pulls', sets: '3 Sets x 15 Reps', target: 'Rear Delts', key: 'f3' },
      { name: 'Assault Bike HIIT Circuit', sets: '15 Mins Intervals', target: 'Cardio Engine', key: 'f4' }
    ],
    Saturday: [
      { name: 'Functional Turf Sled Pushes', sets: '5 Laps x 30m', target: 'Full Body Power', key: 's1' },
      { name: 'Kettlebell Swings', sets: '4 Sets x 20 Reps', target: 'Explosive Power', key: 's2' }
    ],
    Sunday: [
      { name: 'Rest & Contrast Cold Plunge', sets: 'Full Rest Day', target: 'Recovery', key: 'su1' }
    ]
  };

  const activeDayExercises = weeklySchedule[selectedDay] || weeklySchedule.Monday;

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-['Outfit',sans-serif] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* ═══════════════════════════════════════════════════
          SECTION 1 — HERO WELCOME BANNER WITH ANIMATIONS
          ═══════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl animate__animated animate__backInDown">
        {/* Glow ambient circle background */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/15 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            {/* Header Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider animate__animated animate__bounceIn">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>FITFORGE MEMBER PORTAL</span>
              </div>
              <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>24/7 Gate Keypass Active</span>
              </div>
              <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold">
                <Flame className="w-3.5 h-3.5 text-amber-400 animate__animated animate__headShake animate__infinite" />
                <span>14-Day Workout Streak 🔥</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-white tracking-tight leading-tight">
              WELCOME BACK, <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-300 bg-clip-text text-transparent">{user?.name || 'Rohan Sharma'}</span>! 🏋️
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl font-medium leading-relaxed">
              Delhi I.P. Extension Club • Your customized workout schedule, body metric logs, and 24/7 keycard access are active.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/member/workout"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-all transform hover:scale-105 group"
            >
              <Dumbbell className="w-4 h-4" />
              <span>START WORKOUT</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/member/progress"
              className="px-5 py-3 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-black text-xs uppercase tracking-wider border border-slate-700 transition-all flex items-center space-x-2 transform hover:scale-105"
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>LOG METRICS</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-3 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 hover:text-rose-300 border border-rose-500/40 text-xs font-black uppercase tracking-wider flex items-center space-x-2 transition-all transform hover:scale-105"
              title="Log out of Member Portal"
            >
              <LogOut className="w-4 h-4" />
              <span>LOGOUT</span>
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          SECTION 2 — 4 STAT METRIC CARDS WITH ANIMATIONS
          ═══════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 — Membership */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3 hover:border-emerald-500/40 transition-all hover:-translate-y-1 animate__animated animate__backInLeft group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Membership</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 dark:text-white uppercase">{membershipStatus}</div>
            <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {daysRemaining} Days Remaining
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${(daysRemaining / 30) * 100}%` }} />
          </div>
        </div>

        {/* Metric 2 — Routine */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3 hover:border-emerald-500/40 transition-all hover:-translate-y-1 animate__animated animate__backInDown group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Current Routine</span>
            <div className="w-9 h-9 rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Dumbbell className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 dark:text-white truncate">
              {workoutPlan ? workoutPlan.title : 'Hypertrophy Pro'}
            </div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">
              Coach: Vikram Singh
            </div>
          </div>
          <div className="text-[10px] font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full w-fit">
            5-Day Split
          </div>
        </div>

        {/* Metric 3 — Check-ins */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3 hover:border-emerald-500/40 transition-all hover:-translate-y-1 animate__animated animate__backInDown group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Monthly Check-Ins</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 dark:text-white">{attendanceCount} Days</div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">
              Total check-ins: {safeAttendance.length || 24}
            </div>
          </div>
          <div className="flex items-center space-x-1 pt-0.5">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <span key={i} className={`w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center ${i < 5 ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* Metric 4 — Transformation Log */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3 hover:border-emerald-500/40 transition-all hover:-translate-y-1 animate__animated animate__backInRight group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Body Weight</span>
            <div className="w-9 h-9 rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {latestProgress.weight} <span className="text-xs font-semibold text-slate-400">kg</span>
            </div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              Body Fat: {latestProgress.bodyFatPercentage}%
            </div>
          </div>
          <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
            <span>📉 -2.1 kg this month</span>
          </div>
        </div>

      </div>

      {/* ═══════════════════════════════════════════════════
          SECTION 3 — INTERACTIVE WORKOUT ROUTINE VIEW
          ═══════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Interactive Exercise Routine Card */}
        <div className="lg:col-span-7 space-y-6 animate__animated animate__backInLeft">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            
            {/* Title & Link */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase text-slate-900 dark:text-white">Interactive Routine Planner</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Click a day to view target exercises & mark completions</p>
                </div>
              </div>
              <Link
                to="/member/workout"
                className="text-xs font-black text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1 uppercase tracking-wider"
              >
                <span>Full View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Interactive Day Selector Tabs */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-none">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                const isSelected = selectedDay === day;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-3.5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 flex-shrink-0 ${
                      isSelected
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md scale-105'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-500 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {day.substring(0, 3)}
                  </button>
                );
              })}
            </div>

            {/* Exercise List for Selected Day */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                <span>{selectedDay}'s Target Exercises</span>
                <span>{activeDayExercises.length} Exercises</span>
              </div>

              <div className="space-y-2.5">
                {activeDayExercises.map((ex) => {
                  const isDone = !!completedExercises[ex.key];
                  return (
                    <div
                      key={ex.key}
                      onClick={() => toggleExercise(ex.key)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isDone
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-400 line-through'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-emerald-500/40'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                          isDone ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                        }`}>
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className={`text-xs font-extrabold ${isDone ? 'text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                            {ex.name}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{ex.sets} • {ex.target}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                        isDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}>
                        {isDone ? 'Done ✓' : 'Pending'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Body Composition Metric Summary */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold border border-teal-500/30">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black uppercase text-slate-900 dark:text-white">Body Metrics Analytics</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Weight, Body Fat %, Chest, Waist logs</p>
                </div>
              </div>
              <Link
                to="/member/progress"
                className="text-xs font-black text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1 uppercase"
              >
                <span>Analytics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">Weight</p>
                <p className="text-lg font-black text-slate-900 dark:text-white">{latestProgress.weight} <span className="text-[10px] text-slate-400 font-normal">kg</span></p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">Body Fat</p>
                <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{latestProgress.bodyFatPercentage}%</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">Chest</p>
                <p className="text-lg font-black text-slate-900 dark:text-white">{latestProgress.chest} <span className="text-[10px] text-slate-400 font-normal">in</span></p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">Waist</p>
                <p className="text-lg font-black text-slate-900 dark:text-white">{latestProgress.waist} <span className="text-[10px] text-slate-400 font-normal">in</span></p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Active Membership, Coach Card & Gym Floor */}
        <div className="lg:col-span-5 space-y-6 animate__animated animate__backInRight">
          
          {/* Active Membership Details Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 text-white border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Active Membership</span>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                🟢 {membershipStatus}
              </span>
            </div>

            <div>
              <h3 className="text-xl font-black text-white uppercase">{membership?.plan?.name || 'Pro 24/7 Access Plan'}</h3>
              <p className="text-xs text-slate-400 font-medium">Delhi I.P. Extension facility, Rogue power cages & sauna suite.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-300 text-xs font-bold">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Days Remaining:</span>
              </div>
              <span className="text-xs font-black text-emerald-400">{daysRemaining} Days</span>
            </div>

            <Link
              to="/member/membership"
              className="block w-full text-center py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all transform hover:scale-[1.02]"
            >
              MEMBERSHIP RENEWAL & DETAILS
            </Link>
          </div>

          {/* Assigned 1-on-1 Coach Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
                alt="Coach Vikram"
                className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
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
              className="inline-flex items-center justify-center w-full py-3 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-black uppercase tracking-wider shadow-md transition-all transform hover:scale-[1.02]"
            >
              <MessageCircle className="w-4 h-4 mr-2 fill-white" />
              <span>CHAT WITH COACH VIKRAM</span>
            </a>
          </div>

          {/* Gym Floor Occupancy & Announcements */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Megaphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Gym Announcements</h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Live
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                { title: 'New Rogue Power Racks Installed', desc: '4 new Rogue power racks and Eleiko bars in Zone B.', date: 'Today' },
                { title: 'Sunday Sauna Recovery Workshop', desc: 'Post-workout contrast sauna sessions at 10 AM.', date: 'Yesterday' }
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

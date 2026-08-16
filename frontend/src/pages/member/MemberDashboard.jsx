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

  // Fallback demo metrics
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
    <div className="max-w-5xl mx-auto space-y-6 font-['Outfit',sans-serif] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Sleek Compact Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-500/30 p-5 sm:p-6 shadow-xl animate__animated animate__backInDown">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-black uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>MEMBER CONSOLE</span>
              </div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] font-bold border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>24/7 Gate Active</span>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black uppercase text-white tracking-tight">
              WELCOME BACK, <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">{user?.name || 'Rohan Sharma'}</span>! 🏋️
            </h1>
            <p className="text-slate-300 text-xs font-medium max-w-lg">
              Delhi I.P. Extension • Track routines, log body metrics, and check gym updates.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/member/workout"
              className="px-4 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider shadow-md flex items-center space-x-1.5 transition-all transform hover:scale-105"
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span>ROUTINE</span>
            </Link>
            <Link
              to="/member/progress"
              className="px-4 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-xs uppercase tracking-wider border border-slate-700 transition-all flex items-center space-x-1.5 transform hover:scale-105"
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>LOG METRICS</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 hover:text-rose-300 border border-rose-500/40 text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 transition-all transform hover:scale-105"
              title="Log out of Member Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>LOGOUT</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Compact Stat Pills */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Metric 1 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-1.5 hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Membership</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <div className="text-lg font-black text-slate-900 dark:text-white uppercase">{membershipStatus}</div>
            <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              {daysRemaining} Days Left
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-1.5 hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Routine</span>
            <Dumbbell className="w-4 h-4 text-teal-500" />
          </div>
          <div>
            <div className="text-lg font-black text-slate-900 dark:text-white truncate">
              {workoutPlan ? workoutPlan.title : 'Hypertrophy Pro'}
            </div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Coach: Vikram
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-1.5 hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Check-Ins</span>
            <CalendarCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <div className="text-lg font-black text-slate-900 dark:text-white">{attendanceCount} Days</div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Total: {safeAttendance.length || 24}
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-1.5 hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Weight</span>
            <TrendingUp className="w-4 h-4 text-teal-500" />
          </div>
          <div>
            <div className="text-lg font-black text-slate-900 dark:text-white">
              {latestProgress.weight} <span className="text-xs font-normal text-slate-400">kg</span>
            </div>
            <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              Fat: {latestProgress.bodyFatPercentage}%
            </div>
          </div>
        </div>

      </div>

      {/* Main Balanced Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Assigned Workout & Metrics */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Active Workout Schedule Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-black uppercase text-slate-900 dark:text-white">Assigned Workout Schedule</h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Head Coach Vikram's Program</p>
                </div>
              </div>
              <Link
                to="/member/workout"
                className="text-xs font-black text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1 uppercase"
              >
                <span>Program</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white uppercase">{workoutPlan?.title || '5-Day Hypertrophy & Strength Split'}</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Rogue power cages & HIIT finisher circuits.</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 uppercase">
                  {workoutPlan?.level || 'Pro'}
                </span>
              </div>

              {/* Day Schedule Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { day: 'Monday', focus: 'Chest & Triceps Power', count: 6 },
                  { day: 'Tuesday', focus: 'Back & Biceps Heavy Rows', count: 7 },
                  { day: 'Thursday', focus: 'Legs & Core Rogue Squats', count: 6 },
                  { day: 'Friday', focus: 'Shoulders & HIIT', count: 5 }
                ].map((sched, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-black uppercase text-emerald-600 dark:text-emerald-400">{sched.day}</span>
                      <span className="text-[9px] text-slate-400 font-bold">{sched.count} Ex.</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {sched.focus}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Body Metrics Summary Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-black uppercase text-slate-900 dark:text-white">Body Metrics Log</h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Weight & body fat circumference logs</p>
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
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">Weight</p>
                <p className="text-lg font-black text-slate-900 dark:text-white">{latestProgress.weight} <span className="text-[10px] text-slate-400 font-normal">kg</span></p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">Body Fat</p>
                <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{latestProgress.bodyFatPercentage}%</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">Chest</p>
                <p className="text-lg font-black text-slate-900 dark:text-white">{latestProgress.chest} <span className="text-[10px] text-slate-400 font-normal">in</span></p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">Waist</p>
                <p className="text-lg font-black text-slate-900 dark:text-white">{latestProgress.waist} <span className="text-[10px] text-slate-400 font-normal">in</span></p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Membership Card & Coach Card */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Membership Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 text-white border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">Active Membership</span>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                🟢 {membershipStatus}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-black text-white uppercase">{membership?.plan?.name || 'Pro 24/7 Access Plan'}</h3>
              <p className="text-xs text-slate-400 font-medium">Delhi I.P. Extension facility, power racks & recovery sauna.</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-300 text-xs font-bold">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Days Remaining:</span>
              </div>
              <span className="text-xs font-black text-emerald-400">{daysRemaining} Days</span>
            </div>

            <Link
              to="/member/membership"
              className="block w-full text-center py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all"
            >
              RENEWAL & DETAILS
            </Link>
          </div>

          {/* Assigned Coach WhatsApp Direct Chat */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
            <div className="flex items-center space-x-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
                alt="Coach Vikram"
                className="w-10 h-10 rounded-xl object-cover border-2 border-emerald-500"
              />
              <div>
                <span className="text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">1-on-1 Coach</span>
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase">Coach Vikram Singh</h4>
              </div>
            </div>

            <a
              href="https://wa.me/917982746995?text=Hi%20Coach%20Vikram%2C%20I%20have%20a%20question%20regarding%20my%20workout%20plan."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-black uppercase tracking-wider shadow-md transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 mr-1.5 fill-white" />
              <span>CHAT WITH COACH</span>
            </a>
          </div>

          {/* Announcements */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
            <div className="flex items-center space-x-2">
              <Megaphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Announcements</h3>
            </div>

            <div className="space-y-2">
              {[
                { title: 'New Rogue Power Racks Installed', desc: '4 new Rogue power racks and Eleiko bars in Zone B.', date: 'Today' },
                { title: 'Sunday Sauna Recovery', desc: 'Post-workout contrast sauna sessions at 10 AM.', date: 'Yesterday' }
              ].map((ann, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{ann.title}</span>
                    <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-extrabold">{ann.date}</span>
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

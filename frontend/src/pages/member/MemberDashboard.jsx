import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { membershipService } from '../../services/membershipService';
import { workoutService } from '../../services/workoutService';
import { attendanceService } from '../../services/attendanceService';
import { progressService } from '../../services/progressService';
import { announcementService } from '../../services/announcementService';
import Loader from '../../components/common/Loader';
import StatCard from '../../components/common/StatCard';
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
  AlertCircle
} from 'lucide-react';

const MemberDashboard = () => {
  const { user } = useAuth();
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

        if (memRes.status === 'fulfilled' && memRes.value.success) {
          setMembership(memRes.value.data);
        }
        if (workRes.status === 'fulfilled' && workRes.value.success) {
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

  if (loading) {
    return <Loader message="Loading your fitness dashboard..." />;
  }

  // Calculate days remaining in membership
  let daysRemaining = 0;
  let membershipStatus = 'No Active Plan';
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

  // Latest progress
  const latestProgress = safeProgress.length > 0 ? safeProgress[safeProgress.length - 1] : null;

  // Monthly attendance count
  const currentMonth = new Date().getMonth();
  const thisMonthAttendance = safeAttendance.filter((a) => a && a.date && new Date(a.date).getMonth() === currentMonth);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-slate-900 border border-amber-500/30 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold mb-3 border border-amber-500/30">
              <Award className="w-3.5 h-3.5" />
              <span>FitForge Member Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, <span className="text-amber-400">{user?.name}</span>! 💪
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Track your fitness journey, view personalized workout routines, log body progress, and stay updated with gym announcements.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/member/workout"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-sm hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/20 flex items-center space-x-2"
            >
              <Dumbbell className="w-4 h-4" />
              <span>Today's Routine</span>
            </Link>
            <Link
              to="/member/progress"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-all flex items-center space-x-2"
            >
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Log Progress</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Membership Status"
          value={membershipStatus.toUpperCase()}
          icon={Award}
          subtext={membership ? `${daysRemaining} days remaining` : 'Subscribe to a plan'}
          trend={membershipStatus === 'Active' ? 'up' : 'down'}
          color="amber"
        />

        <StatCard
          title="Workout Routine"
          value={workoutPlan ? workoutPlan.title : 'Not Assigned'}
          icon={Dumbbell}
          subtext={workoutPlan?.trainer ? `Trainer: ${workoutPlan.trainer.user?.name || 'Assigned'}` : 'Custom fitness plan'}
          color="orange"
        />

        <StatCard
          title="Monthly Attendance"
          value={`${thisMonthAttendance.length} Days`}
          icon={CalendarCheck}
          subtext={`Total check-ins: ${safeAttendance.length}`}
          color="emerald"
        />

        <StatCard
          title="Latest Weight"
          value={latestProgress ? `${latestProgress.weight} kg` : 'No logs yet'}
          icon={TrendingUp}
          subtext={latestProgress ? `Body fat: ${latestProgress.bodyFatPercentage || '--'}%` : 'Record initial metrics'}
          color="cyan"
        />
      </div>

      {/* Main Grid: Workout & Membership Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Workout Routine */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Assigned Workout Plan</h2>
                  <p className="text-xs text-slate-400">Curated plan by your personal trainer</p>
                </div>
              </div>
              <Link
                to="/member/workout"
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1"
              >
                <span>View Full Schedule</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {workoutPlan ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-white text-base">{workoutPlan.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{workoutPlan.description || 'Targeted strength & conditioning program'}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 capitalize">
                    {workoutPlan.level || 'Intermediate'}
                  </span>
                </div>

                {/* Day Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(workoutPlan.schedule || []).slice(0, 4).map((day, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-850 border border-slate-800/80 hover:border-amber-500/30 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase text-amber-400">{day.day}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{day.exercises?.length || 0} Exercises</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-200 line-clamp-1">
                        {day.focusArea || 'Full Body Workout'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 px-4 rounded-xl bg-slate-850 border border-slate-800/60 border-dashed">
                <Dumbbell className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-300 font-bold text-sm">No Workout Plan Assigned Yet</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Your trainer or gym administrator will assign your tailored workout routine shortly.
                </p>
              </div>
            )}
          </div>

          {/* Body Metrics Summary */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Body Metric Log</h2>
                  <p className="text-xs text-slate-400">Track weight & body fat progress</p>
                </div>
              </div>
              <Link
                to="/member/progress"
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
              >
                <span>Progress Analytics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {latestProgress ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 text-center">
                  <p className="text-xs text-slate-400 font-semibold mb-1">Weight</p>
                  <p className="text-xl font-extrabold text-white">{latestProgress.weight} <span className="text-xs text-slate-400">kg</span></p>
                </div>
                <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 text-center">
                  <p className="text-xs text-slate-400 font-semibold mb-1">Body Fat</p>
                  <p className="text-xl font-extrabold text-amber-400">{latestProgress.bodyFatPercentage || '--'} <span className="text-xs text-slate-400">%</span></p>
                </div>
                <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 text-center">
                  <p className="text-xs text-slate-400 font-semibold mb-1">Chest</p>
                  <p className="text-xl font-extrabold text-white">{latestProgress.chest || '--'} <span className="text-xs text-slate-400">in</span></p>
                </div>
                <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 text-center">
                  <p className="text-xs text-slate-400 font-semibold mb-1">Waist</p>
                  <p className="text-xl font-extrabold text-white">{latestProgress.waist || '--'} <span className="text-xs text-slate-400">in</span></p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 px-4 rounded-xl bg-slate-850 border border-slate-800/60 border-dashed">
                <p className="text-slate-400 text-sm">No body measurements recorded yet.</p>
                <Link
                  to="/member/progress"
                  className="inline-block mt-3 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-bold border border-emerald-500/30 transition-all"
                >
                  Record Initial Measurements
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Announcements & Membership */}
        <div className="space-y-6">
          {/* Membership Card */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">Active Membership</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                membershipStatus === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                {membershipStatus}
              </span>
            </div>

            {membership ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-extrabold text-white">{membership.plan?.name || 'Standard Gym Plan'}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Valid from {new Date(membership.startDate).toLocaleDateString()} to {new Date(membership.endDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-300 text-xs">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Days Left:</span>
                  </div>
                  <span className="text-sm font-extrabold text-amber-400">{daysRemaining} Days</span>
                </div>

                <Link
                  to="/member/membership"
                  className="block w-full text-center py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-all"
                >
                  Membership Details & Renewal
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <p className="text-slate-300 font-bold text-sm">No Active Membership</p>
                <p className="text-xs text-slate-500 mt-1 mb-4">Subscribe to a gym plan to access facility & trainer services.</p>
                <Link
                  to="/member/membership"
                  className="inline-block px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs"
                >
                  Choose a Plan
                </Link>
              </div>
            )}
          </div>

          {/* Announcements */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 border border-orange-500/20">
                <Megaphone className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-white">Gym Announcements</h2>
            </div>

            {safeAnnouncements.length > 0 ? (
              <div className="space-y-3">
                {safeAnnouncements.slice(0, 3).map((item) => (
                  <div key={item._id} className="p-3.5 rounded-xl bg-slate-850 border border-slate-800/80">
                    <h4 className="text-xs font-bold text-amber-400">{item.title}</h4>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2">{item.message}</p>
                    <span className="text-[10px] text-slate-500 mt-2 block">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">No recent announcements.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;

import React, { useState, useEffect } from 'react';
import { trainerService } from '../../services/trainerService';
import { announcementService } from '../../services/announcementService';
import StatCard from '../../components/common/StatCard';
import Loader from '../../components/common/Loader';
import { Users, Dumbbell, CalendarCheck, Megaphone, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TrainerDashboard = () => {
  const [assignedMembers, setAssignedMembers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mRes, aRes] = await Promise.all([
        trainerService.getMyAssignedMembers(),
        announcementService.getAnnouncements()
      ]);
      if (mRes.success) setAssignedMembers(mRes.data);
      if (aRes.success) setAnnouncements(aRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Opening Trainer Workspace..." />;
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl glass-panel border border-emerald-500/20 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Trainer Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Personal Coaching Hub</h1>
          <p className="text-xs text-slate-400 mt-1">Build splits, track body composition progress, and mark daily athlete attendance.</p>
        </div>

        <button
          onClick={() => navigate('/trainer/workouts')}
          className="px-5 py-3 rounded-2xl text-xs font-extrabold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg flex items-center space-x-2 transition-all"
        >
          <span>Workout Planner</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Assigned Clients"
          value={assignedMembers.length}
          subtext="Active training roster"
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Workout Builder"
          value="Active"
          subtext="Ready to assign splits"
          icon={Dumbbell}
          color="amber"
        />
        <StatCard
          title="Attendance Status"
          value="Check-in Ready"
          subtext="Mark today's attendance"
          icon={CalendarCheck}
          color="purple"
        />
      </div>

      {/* Roster & Announcements Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Assigned Clients */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">Assigned Athletes ({assignedMembers.length})</h3>
            <button onClick={() => navigate('/trainer/members')} className="text-xs text-amber-400 hover:underline">
              View Roster
            </button>
          </div>
          <div className="divide-y divide-slate-800/80">
            {assignedMembers.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No athletes assigned yet.</p>
            ) : (
              assignedMembers.map((m) => (
                <div key={m._id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={m.user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'}
                      alt={m.user?.name}
                      className="w-9 h-9 rounded-full object-cover border border-amber-500/30"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-100">{m.user?.name}</p>
                      <p className="text-xs text-slate-400">{m.user?.phone}</p>
                    </div>
                  </div>
                  <span className="text-xs text-amber-400 font-semibold">{m.membership?.plan?.name || 'Active Member'}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Announcements */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 text-amber-400 font-bold text-base">
            <Megaphone className="w-5 h-5" />
            <span>Facility Notices</span>
          </div>
          <div className="space-y-3">
            {announcements.slice(0, 3).map((item) => (
              <div key={item._id} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-xs text-white">{item.title}</p>
                  <span className="text-[10px] text-amber-400 uppercase font-bold">{item.priority}</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">{item.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;

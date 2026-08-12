import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import StatCard from '../../components/common/StatCard';
import Loader from '../../components/common/Loader';
import {
  Users,
  UserCheck,
  Award,
  DollarSign,
  AlertCircle,
  CalendarCheck,
  TrendingUp,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#f59e0b', '#10b981', '#6366f1', '#ec4899', '#8b5cf6'];

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await dashboardService.getAdminStats();
      if (res.success) {
        setData(res.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Compiling real-time dashboard analytics..." />;
  }

  const { summary, charts, recentActivity } = data || {};

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-amber-500/20 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Executive SaaS Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">System Analytics & Operations</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time breakdown of members, financial revenue, and gym attendance.</p>
        </div>

        <button
          onClick={() => navigate('/admin/members')}
          className="px-5 py-3 rounded-2xl text-xs font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all flex items-center space-x-2"
        >
          <span>Manage Members</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Members"
          value={summary?.totalMembers || 0}
          subtext={`${summary?.activeMembers || 0} active, ${summary?.expiredMembers || 0} expired`}
          icon={Users}
          color="amber"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${summary?.monthlyRevenue?.toLocaleString() || 0}`}
          subtext={`Total All-time: $${summary?.totalRevenue?.toLocaleString() || 0}`}
          icon={DollarSign}
          color="emerald"
        />
        <StatCard
          title="Active Memberships"
          value={summary?.activeMemberships || 0}
          subtext={`${summary?.totalTrainers || 0} Active Trainers`}
          icon={Award}
          color="blue"
        />
        <StatCard
          title="Today's Attendance"
          value={summary?.todayAttendanceCount || 0}
          subtext={`Pending Payments: ${summary?.pendingPaymentsCount || 0}`}
          icon={CalendarCheck}
          color="purple"
        />
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue & Member Growth Chart */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-bold text-white">Monthly Revenue Trend ($)</h3>
              <p className="text-xs text-slate-400">Financial performance over the last 6 months</p>
            </div>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts?.monthlyRevenueAndGrowth || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Membership Distribution Donut */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-bold text-white">Plan Distribution</h3>
              <p className="text-xs text-slate-400">Active subscriptions by tier</p>
            </div>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts?.planDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(charts?.planDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Registrations */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">Recent Member Registrations</h3>
            <button onClick={() => navigate('/admin/members')} className="text-xs text-amber-400 hover:underline">
              View All
            </button>
          </div>
          <div className="divide-y divide-slate-800/80">
            {recentActivity?.registrations?.map((m) => (
              <div key={m._id} className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={m.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={m.user?.name}
                    className="w-9 h-9 rounded-full object-cover border border-amber-500/30"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-100">{m.user?.name}</p>
                    <p className="text-xs text-slate-400">{m.user?.email}</p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold uppercase">
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Expiring Memberships Warning */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2 text-rose-400">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Expiring Memberships</h3>
            </div>
            <button onClick={() => navigate('/admin/memberships')} className="text-xs text-amber-400 hover:underline">
              Manage
            </button>
          </div>
          <div className="divide-y divide-slate-800/80">
            {recentActivity?.expiringMemberships?.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No memberships expiring within the next 7 days.</p>
            ) : (
              recentActivity?.expiringMemberships?.map((item) => (
                <div key={item._id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-100">{item.member?.user?.name}</p>
                    <p className="text-xs text-slate-400">Plan: {item.plan?.name}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">
                      Expires {new Date(item.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { memberService } from '../../services/memberService';
import Loader from '../../components/common/Loader';
import ReceiptModal from '../../components/modals/ReceiptModal';
import {
  User,
  ArrowLeft,
  Calendar,
  Award,
  CreditCard,
  CalendarCheck,
  Dumbbell,
  TrendingUp,
  FileText,
  Phone,
  Mail,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import toast from 'react-hot-toast';

const MemberDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    fetchMemberDetail();
  }, [id]);

  const fetchMemberDetail = async () => {
    setLoading(true);
    try {
      const res = await memberService.getMemberById(id);
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      toast.error('Failed to load member profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Fetching member profile and health metrics..." />;
  }

  if (!data || !data.member) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Member profile not found.</p>
        <button onClick={() => navigate('/admin/members')} className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold">
          Back to Member List
        </button>
      </div>
    );
  }

  const { member, payments, attendanceLogs, workoutPlan, progressHistory } = data;

  const chartData = (progressHistory || []).map((p) => ({
    date: new Date(p.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    weight: p.weight,
    bmi: p.bmi
  }));

  return (
    <div className="space-y-8">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <div className="text-right">
          <span
            className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${
              member.status === 'active'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}
          >
            {member.status} Member
          </span>
        </div>
      </div>

      {/* Member Profile Overview Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        <div className="flex items-center space-x-5 lg:col-span-2">
          <img
            src={member.user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
            alt={member.user?.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-amber-500/40 shadow-xl"
          />
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{member.user?.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center space-x-1"><Mail className="w-3.5 h-3.5 text-amber-400" /> <span>{member.user?.email}</span></span>
              <span className="flex items-center space-x-1"><Phone className="w-3.5 h-3.5 text-amber-400" /> <span>{member.user?.phone}</span></span>
              <span className="flex items-center space-x-1"><User className="w-3.5 h-3.5 text-amber-400" /> <span>{member.gender}</span></span>
            </div>
            {member.address && (
              <p className="text-xs text-slate-400 flex items-center space-x-1 pt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" /> <span>{member.address}</span>
              </p>
            )}
          </div>
        </div>

        {/* Emergency Contact Box */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-xs space-y-1">
          <p className="text-[10px] uppercase font-bold text-amber-400">Emergency Contact</p>
          <p className="font-bold text-white text-sm">{member.emergencyContact?.name || 'Not Provided'}</p>
          <p className="text-slate-400">{member.emergencyContact?.phone} ({member.emergencyContact?.relation})</p>
        </div>
      </div>

      {/* Membership & Trainer Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Membership Plan */}
        <div className="glass-card p-6 rounded-3xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <Award className="w-5 h-5" />
              <span>Current Membership</span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">
              {member.membership?.status || 'No Plan'}
            </span>
          </div>

          {member.membership ? (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Plan Name</span>
                <span className="font-bold text-white text-sm">{member.membership.plan?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Price / Duration</span>
                <span className="font-bold text-amber-400">${member.membership.plan?.price} / {member.membership.plan?.durationMonths} mo</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Expiry Date</span>
                <span className="font-bold text-slate-200">{new Date(member.membership.expiryDate).toLocaleDateString()}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-2">No active membership assigned yet.</p>
          )}
        </div>

        {/* Assigned Personal Trainer */}
        <div className="glass-card p-6 rounded-3xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
              <User className="w-5 h-5" />
              <span>Assigned Personal Trainer</span>
            </div>
          </div>

          {member.assignedTrainer ? (
            <div className="flex items-center space-x-4 pt-1">
              <img
                src={member.assignedTrainer.user?.avatar || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=100&auto=format&fit=crop&q=80'}
                alt={member.assignedTrainer.user?.name}
                className="w-12 h-12 rounded-full object-cover border border-emerald-500/30"
              />
              <div className="text-xs">
                <p className="font-bold text-white text-sm">{member.assignedTrainer.user?.name}</p>
                <p className="text-slate-400">{member.assignedTrainer.specializations?.join(', ')}</p>
                <p className="text-slate-500 text-[10px] mt-0.5">Contact: {member.assignedTrainer.user?.phone}</p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-2">No personal trainer assigned.</p>
          )}
        </div>
      </div>

      {/* Workout Plan & Body Progress Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Workout Routine */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <Dumbbell className="w-5 h-5" />
              <span>Assigned Workout Routine</span>
            </div>
            <span className="text-xs text-slate-400">{workoutPlan?.planName || 'General'}</span>
          </div>

          {workoutPlan && workoutPlan.exercises?.length > 0 ? (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <p className="font-bold text-white">{workoutPlan.planName}</p>
                <p className="text-slate-400 text-[11px]">Goal: {workoutPlan.goal}</p>
              </div>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {workoutPlan.exercises.map((ex, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-200">{ex.name}</p>
                      <p className="text-[10px] text-slate-400">Rest: {ex.restTime || '60s'}</p>
                    </div>
                    <span className="font-extrabold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                      {ex.sets} sets × {ex.reps}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">No workout plan assigned yet.</p>
          )}
        </div>

        {/* Weight & BMI Progress Chart */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2 text-purple-400 font-bold text-sm">
              <TrendingUp className="w-5 h-5" />
              <span>Body Measurement Tracking</span>
            </div>
          </div>

          {chartData.length > 0 ? (
            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                  <Line type="monotone" dataKey="weight" stroke="#f59e0b" strokeWidth={3} name="Weight (kg)" />
                  <Line type="monotone" dataKey="bmi" stroke="#a855f7" strokeWidth={2} name="BMI" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">No body measurement logs recorded yet.</p>
          )}
        </div>
      </div>

      {/* Payment History */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>Payment History</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 uppercase text-[10px] text-slate-400 font-bold">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Transaction ID</th>
                <th className="p-3">Method</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {payments?.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-4 text-slate-500">No payment records found.</td></tr>
              ) : (
                payments?.map((p) => (
                  <tr key={p._id}>
                    <td className="p-3">{new Date(p.paymentDate).toLocaleDateString()}</td>
                    <td className="p-3 font-mono text-amber-400">{p.transactionId}</td>
                    <td className="p-3">{p.paymentMethod}</td>
                    <td className="p-3 font-bold text-white">${p.amount?.toFixed(2)}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedPayment(p)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold"
                      >
                        View Receipt
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={Boolean(selectedPayment)}
        onClose={() => setSelectedPayment(null)}
        payment={selectedPayment}
      />
    </div>
  );
};

export default MemberDetail;

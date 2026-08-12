import React, { useState, useEffect } from 'react';
import { trainerService } from '../../services/trainerService';
import { progressService } from '../../services/progressService';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';
import {
  TrendingUp,
  Plus,
  Users,
  User,
  Scale,
  Percent,
  Calendar
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const TrainerProgress = () => {
  const [loading, setLoading] = useState(true);
  const [assignedMembers, setAssignedMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [progressList, setProgressList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    weight: '',
    height: '175',
    bodyFatPercentage: '',
    chest: '',
    waist: '',
    arms: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const res = await trainerService.getMyAssignedMembers();
        if (res.success && res.data) {
          setAssignedMembers(res.data);
          if (res.data.length > 0) {
            setSelectedMember(res.data[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching assigned members:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    if (!selectedMember) return;

    const fetchMemberProgress = async () => {
      try {
        const res = await progressService.getProgressByMember(selectedMember._id);
        if (res.success) {
          setProgressList(res.data || []);
        }
      } catch (err) {
        console.error('Error fetching progress for member:', err);
      }
    };

    fetchMemberProgress();
  }, [selectedMember]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMember) {
      toast.error('Select a member first!');
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...formData, memberId: selectedMember._id };
      const res = await progressService.addProgress(payload);
      if (res.success) {
        toast.success(`Progress logged for ${selectedMember.user?.name || 'Member'}!`);
        setShowModal(false);
        setFormData({
          weight: '',
          height: '175',
          bodyFatPercentage: '',
          chest: '',
          waist: '',
          arms: '',
          date: new Date().toISOString().split('T')[0]
        });
        // Refresh progress
        const updated = await progressService.getProgressByMember(selectedMember._id);
        if (updated.success) setProgressList(updated.data || []);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record progress');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader message="Loading assigned member progress portal..." />;
  }

  // Format chart data
  const chartData = progressList.map((item) => ({
    date: new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    weight: item.weight,
    bodyFat: item.bodyFatPercentage || 0
  }));

  const latest = progressList.length > 0 ? progressList[progressList.length - 1] : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Member Progress Tracker</h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor and record body transformations for your assigned gym trainees.
          </p>
        </div>

        {selectedMember && (
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/20 flex items-center space-x-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Record Measurement</span>
          </button>
        )}
      </div>

      {/* Member Selector Strip */}
      {assignedMembers.length > 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Select Assigned Trainee</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {assignedMembers.map((m) => {
              const isSelected = selectedMember?._id === m._id;

              return (
                <div
                  key={m._id}
                  onClick={() => setSelectedMember(m)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center space-x-3 ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500'
                      : 'bg-slate-850 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <img
                    src={m.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={m.user?.name}
                    className="w-10 h-10 rounded-full object-cover border border-amber-500/40"
                  />
                  <div className="min-w-0">
                    <p className={`text-xs font-bold truncate ${isSelected ? 'text-amber-400' : 'text-white'}`}>
                      {m.user?.name || 'Gym Member'}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{m.user?.email}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
          <Users className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-300 font-bold text-sm">No Members Assigned to You</p>
          <p className="text-xs text-slate-500 mt-1">
            Admin will assign gym members to your personal training roster.
          </p>
        </div>
      )}

      {selectedMember && (
        <div className="space-y-6">
          {/* Member Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-semibold mb-1">Weight</p>
                <p className="text-2xl font-extrabold text-white">
                  {latest ? `${latest.weight} kg` : 'N/A'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
                <Scale className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-semibold mb-1">Body Fat %</p>
                <p className="text-2xl font-extrabold text-amber-400">
                  {latest ? `${latest.bodyFatPercentage || '--'}%` : 'N/A'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 border border-orange-500/20">
                <Percent className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-semibold mb-1">Logged Entries</p>
                <p className="text-2xl font-extrabold text-emerald-400">
                  {progressList.length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">
              Progress Curve: <span className="text-amber-400">{selectedMember.user?.name}</span>
            </h2>

            {chartData.length > 0 ? (
              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '0.75rem',
                        color: '#f8fafc'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      name="Weight (kg)"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      dot={{ fill: '#f59e0b', r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="bodyFat"
                      name="Body Fat (%)"
                      stroke="#10b981"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={{ fill: '#10b981', r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-10 rounded-xl bg-slate-850 border border-slate-800/60 border-dashed">
                <TrendingUp className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-300 font-bold text-sm">No Progress Logged For This Member</p>
                <p className="text-xs text-slate-500 mt-1">
                  Click 'Record Measurement' above to record initial body metrics.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && selectedMember && (
        <Modal title={`Record Measurement: ${selectedMember.user?.name}`} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Weight (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="e.g. 80.0"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Height (cm) *</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="175"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Body Fat %</label>
                <input
                  type="number"
                  step="0.1"
                  name="bodyFatPercentage"
                  value={formData.bodyFatPercentage}
                  onChange={handleChange}
                  placeholder="e.g. 14.5"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Chest (in)</label>
                <input
                  type="number"
                  step="0.5"
                  name="chest"
                  value={formData.chest}
                  onChange={handleChange}
                  placeholder="40"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Waist (in)</label>
                <input
                  type="number"
                  step="0.5"
                  name="waist"
                  value={formData.waist}
                  onChange={handleChange}
                  placeholder="32"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Arms (in)</label>
                <input
                  type="number"
                  step="0.5"
                  name="arms"
                  value={formData.arms}
                  onChange={handleChange}
                  placeholder="15"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end space-x-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20"
              >
                {submitting ? 'Saving...' : 'Save Measurement'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default TrainerProgress;

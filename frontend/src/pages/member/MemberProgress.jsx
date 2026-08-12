import React, { useState, useEffect } from 'react';
import { progressService } from '../../services/progressService';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';
import {
  TrendingUp,
  Plus,
  Trash2,
  Activity,
  Award,
  Calendar,
  Scale,
  Percent
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

const MemberProgress = () => {
  const [loading, setLoading] = useState(true);
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

  const fetchProgress = async () => {
    setLoading(true);
    try {
      const res = await progressService.getMyProgress();
      if (res.success) {
        setProgressList(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      console.error('Error fetching progress:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.weight || !formData.height) {
      toast.error('Weight and height are required!');
      return;
    }

    setSubmitting(true);
    try {
      const res = await progressService.addProgress(formData);
      if (res.success) {
        toast.success('Body progress logged successfully! 🎯');
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
        fetchProgress();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to log progress.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader message="Loading body progress history..." />;
  }

  // Format chart data
  const chartData = progressList.map((item) => ({
    date: new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    weight: item.weight,
    bodyFat: item.bodyFatPercentage || 0
  }));

  const latest = progressList.length > 0 ? progressList[progressList.length - 1] : null;
  const initial = progressList.length > 0 ? progressList[0] : null;
  const weightChange = latest && initial ? (latest.weight - initial.weight).toFixed(1) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Body Progress Tracker</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track weight loss, muscle gain, and body fat percentage trends over time.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/20 flex items-center space-x-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Measurements</span>
        </button>
      </div>

      {/* Summary Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold mb-1">Current Weight</p>
            <p className="text-2xl font-extrabold text-white">
              {latest ? `${latest.weight} kg` : 'N/A'}
            </p>
            <span className="text-[10px] text-slate-500 mt-1 block">Recorded {latest ? new Date(latest.date).toLocaleDateString() : 'Never'}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
            <Scale className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold mb-1">Body Fat %</p>
            <p className="text-2xl font-extrabold text-amber-400">
              {latest ? `${latest.bodyFatPercentage || '--'}%` : 'N/A'}
            </p>
            <span className="text-[10px] text-slate-500 mt-1 block">Target: 12-18%</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 border border-orange-500/20">
            <Percent className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold mb-1">Total Weight Difference</p>
            <p className={`text-2xl font-extrabold ${Number(weightChange) <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {weightChange > 0 ? `+${weightChange}` : weightChange} kg
            </p>
            <span className="text-[10px] text-slate-500 mt-1 block">Since first record</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white">Body Weight & Fat % History</h2>
          </div>
        </div>

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
          <div className="text-center py-12 rounded-xl bg-slate-850 border border-slate-800/60 border-dashed">
            <TrendingUp className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-300 font-bold text-sm">No Measurement Data Available</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Click 'Log New Measurements' to add your first weight and body metrics entry.
            </p>
          </div>
        )}
      </div>

      {/* Progress Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white">Logged History Table</h2>

        {progressList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-850 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Date</th>
                  <th className="px-4 py-3">Weight (kg)</th>
                  <th className="px-4 py-3">Height (cm)</th>
                  <th className="px-4 py-3">Body Fat %</th>
                  <th className="px-4 py-3">Chest (in)</th>
                  <th className="px-4 py-3">Waist (in)</th>
                  <th className="px-4 py-3 rounded-r-xl">Arms (in)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {progressList.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-white">
                      {new Date(log.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3.5 text-amber-400 font-extrabold">{log.weight}</td>
                    <td className="px-4 py-3.5 text-slate-300">{log.height}</td>
                    <td className="px-4 py-3.5 text-emerald-400 font-bold">{log.bodyFatPercentage || '--'}%</td>
                    <td className="px-4 py-3.5 text-slate-400">{log.chest || '--'}</td>
                    <td className="px-4 py-3.5 text-slate-400">{log.waist || '--'}</td>
                    <td className="px-4 py-3.5 text-slate-400">{log.arms || '--'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>

      {/* Log Modal */}
      {showModal && (
        <Modal title="Log Body Measurements" onClose={() => setShowModal(false)}>
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
                  placeholder="e.g. 75.5"
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
                  placeholder="e.g. 175"
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
                  placeholder="e.g. 15.0"
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
                {submitting ? 'Saving...' : 'Save Entry'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default MemberProgress;

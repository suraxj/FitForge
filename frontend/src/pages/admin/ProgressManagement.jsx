import React, { useState, useEffect } from 'react';
import { progressService } from '../../services/progressService';
import { memberService } from '../../services/memberService';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import { TrendingUp, Plus, User, Trash2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import toast from 'react-hot-toast';

const ProgressManagement = () => {
  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    memberId: '',
    weight: 75,
    height: 178,
    bodyFatPercentage: 18,
    chest: 100,
    waist: 82,
    arms: 36,
    date: new Date().toISOString().substring(0, 10)
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (selectedMemberId) {
      fetchProgressHistory(selectedMemberId);
    }
  }, [selectedMemberId]);

  const fetchMembers = async () => {
    try {
      const res = await memberService.getMembers({ limit: 100 });
      if (res.success && res.data.members?.length > 0) {
        setMembers(res.data.members);
        setSelectedMemberId(res.data.members[0]._id);
      }
    } catch (e) {
      toast.error('Failed to load member list');
    }
  };

  const fetchProgressHistory = async (memberId) => {
    setLoading(true);
    try {
      const res = await progressService.getProgressByMember(memberId);
      if (res.success) setHistory(res.data);
    } catch (err) {
      toast.error('Failed to load progress history');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProgress = async (e) => {
    e.preventDefault();
    if (!formData.memberId) {
      toast.error('Please select member');
      return;
    }

    try {
      const res = await progressService.addProgress(formData);
      if (res.success) {
        toast.success('Body progress logged successfully');
        setIsModalOpen(false);
        if (formData.memberId === selectedMemberId) {
          fetchProgressHistory(selectedMemberId);
        }
      }
    } catch (err) {
      toast.error('Error recording body progress');
    }
  };

  const handleDeleteEntry = async (id) => {
    try {
      const res = await progressService.deleteProgress(id);
      if (res.success) {
        toast.success('Entry deleted');
        fetchProgressHistory(selectedMemberId);
      }
    } catch (e) {
      toast.error('Failed to delete entry');
    }
  };

  const chartData = history.map((item) => ({
    date: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    weight: item.weight,
    bmi: item.bmi,
    bodyFat: item.bodyFatPercentage,
    chest: item.chest,
    waist: item.waist,
    arms: item.arms
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Progress Tracking Engine</h1>
          <p className="text-xs text-slate-400">Log body composition, weight changes, BMI, and circumferences over time.</p>
        </div>

        <button
          onClick={() => {
            setFormData((prev) => ({ ...prev, memberId: selectedMemberId || (members[0]?._id || '') }));
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg flex items-center space-x-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Log Measurements</span>
        </button>
      </div>

      {/* Select Member Bar */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between border border-slate-800">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <User className="w-4 h-4 text-amber-400" />
          <label className="text-xs font-bold text-slate-300">Select Member Profile:</label>
          <select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-100 text-xs rounded-xl px-3 py-2"
          >
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.user?.name} ({m.user?.email})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Charts Grid */}
      {loading ? (
        <Loader message="Compiling progress data..." />
      ) : chartData.length === 0 ? (
        <div className="glass-card p-8 rounded-2xl text-center text-slate-500">No progress entries logged for this member.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weight & BMI Line Chart */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Weight (kg) & BMI Progress</span>
            </h3>
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                  <Line type="monotone" dataKey="weight" stroke="#f59e0b" strokeWidth={3} name="Weight (kg)" />
                  <Line type="monotone" dataKey="bmi" stroke="#a855f7" strokeWidth={2} name="BMI" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Circumferences Chart */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Body Circumferences (cm)</span>
            </h3>
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                  <Line type="monotone" dataKey="chest" stroke="#10b981" strokeWidth={2} name="Chest (cm)" />
                  <Line type="monotone" dataKey="waist" stroke="#ef4444" strokeWidth={2} name="Waist (cm)" />
                  <Line type="monotone" dataKey="arms" stroke="#3b82f6" strokeWidth={2} name="Arms (cm)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* History Log Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 uppercase text-[10px] text-slate-400 font-bold">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Weight</th>
                <th className="p-3">Height</th>
                <th className="p-3">BMI</th>
                <th className="p-3">Body Fat %</th>
                <th className="p-3">Chest</th>
                <th className="p-3">Waist</th>
                <th className="p-3">Arms</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {history.map((entry) => (
                <tr key={entry._id}>
                  <td className="p-3">{new Date(entry.date).toLocaleDateString()}</td>
                  <td className="p-3 font-bold text-amber-400">{entry.weight} kg</td>
                  <td className="p-3">{entry.height} cm</td>
                  <td className="p-3 font-mono">{entry.bmi}</td>
                  <td className="p-3">{entry.bodyFatPercentage}%</td>
                  <td className="p-3">{entry.chest} cm</td>
                  <td className="p-3">{entry.waist} cm</td>
                  <td className="p-3">{entry.arms} cm</td>
                  <td className="p-3 text-right">
                    <button onClick={() => handleDeleteEntry(entry._id)} className="p-1 rounded bg-slate-800 text-rose-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Body Measurements">
        <form onSubmit={handleAddProgress} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-slate-300">Member *</label>
            <select
              required
              value={formData.memberId}
              onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
              className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="">-- Choose Member --</option>
              {members.map((m) => (
                <option key={m._id} value={m._id}>{m.user?.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-300">Weight (kg) *</label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-300">Height (cm) *</label>
              <input
                type="number"
                required
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-300">Body Fat %</label>
              <input
                type="number"
                step="0.1"
                value={formData.bodyFatPercentage}
                onChange={(e) => setFormData({ ...formData, bodyFatPercentage: e.target.value })}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-300">Chest (cm)</label>
              <input
                type="number"
                value={formData.chest}
                onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-300">Waist (cm)</label>
              <input
                type="number"
                value={formData.waist}
                onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-300">Arms (cm)</label>
              <input
                type="number"
                value={formData.arms}
                onChange={(e) => setFormData({ ...formData, arms: e.target.value })}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-xs bg-slate-800 text-slate-300">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-xl text-xs font-extrabold bg-amber-500 text-slate-950">Save Progress Log</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProgressManagement;

import React, { useState, useEffect } from 'react';
import { membershipService } from '../../services/membershipService';
import { memberService } from '../../services/memberService';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { Award, Plus, Filter, Trash2, Calendar, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const MembershipManagement = () => {
  const [memberships, setMemberships] = useState([]);
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    memberId: '',
    planId: '',
    startDate: new Date().toISOString().substring(0, 10),
    paymentMethod: 'UPI',
    isPaid: true
  });

  useEffect(() => {
    fetchMemberships();
    fetchDropdowns();
  }, [statusFilter]);

  const fetchMemberships = async () => {
    setLoading(true);
    try {
      const res = await membershipService.getMemberships({ status: statusFilter });
      if (res.success) setMemberships(res.data);
    } catch (err) {
      toast.error('Failed to load memberships');
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [mRes, pRes] = await Promise.all([
        memberService.getMembers({ limit: 100 }),
        membershipService.getPlans()
      ]);
      if (mRes.success) setMembers(mRes.data.members);
      if (pRes.success) setPlans(pRes.data);
    } catch (err) {
      // ignore
    }
  };

  const handleAssignMembership = async (e) => {
    e.preventDefault();
    if (!formData.memberId || !formData.planId) {
      toast.error('Please select both Member and Membership Plan');
      return;
    }

    try {
      const res = await membershipService.assignMembership(formData);
      if (res.success) {
        toast.success('Membership assigned and payment recorded!');
        setIsAssignModalOpen(false);
        fetchMemberships();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error assigning membership');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      const res = await membershipService.deleteMembership(deleteId);
      if (res.success) {
        toast.success('Membership cancelled');
        fetchMemberships();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting membership');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Active Memberships</h1>
          <p className="text-xs text-slate-400">Assign plans, monitor expiration windows, and manage active athlete subscriptions.</p>
        </div>

        <button
          onClick={() => {
            if (members.length > 0) setFormData((prev) => ({ ...prev, memberId: members[0]._id }));
            if (plans.length > 0) setFormData((prev) => ({ ...prev, planId: plans[0]._id }));
            setIsAssignModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg flex items-center space-x-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Assign Membership</span>
        </button>
      </div>

      {/* Filter */}
      <div className="glass-panel p-4 rounded-2xl flex justify-between items-center border border-slate-800">
        <span className="text-xs font-bold text-slate-300">Filter Membership Status:</span>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2"
          >
            <option value="all">All Memberships</option>
            <option value="active">Active</option>
            <option value="expiring_soon">Expiring Soon (⚡ &lt; 7 days)</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Memberships Table */}
      {loading ? (
        <Loader message="Loading membership contracts..." />
      ) : (
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 uppercase text-[10px] font-bold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">Member</th>
                  <th className="p-4">Plan Name</th>
                  <th className="p-4">Start Date</th>
                  <th className="p-4">Expiry Date</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {memberships.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-8 text-slate-500">No memberships found.</td></tr>
                ) : (
                  memberships.map((m) => (
                    <tr key={m._id} className="hover:bg-slate-800/40">
                      <td className="p-4 font-bold text-white">{m.member?.user?.name || 'N/A'}</td>
                      <td className="p-4 text-amber-400 font-semibold">{m.plan?.name}</td>
                      <td className="p-4">{new Date(m.startDate).toLocaleDateString()}</td>
                      <td className="p-4 font-mono">{new Date(m.expiryDate).toLocaleDateString()}</td>
                      <td className="p-4 font-extrabold text-white">${m.amount?.toFixed(2)}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                            m.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : m.status === 'expiring_soon'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}
                        >
                          {m.status === 'expiring_soon' ? '⚠️ Expiring Soon' : m.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setDeleteId(m._id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Membership Plan to Athlete"
      >
        <form onSubmit={handleAssignMembership} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-slate-300">Select Member *</label>
            <select
              required
              value={formData.memberId}
              onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
              className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="">-- Choose Member --</option>
              {members.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.user?.name} ({m.user?.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-300">Select Membership Plan *</label>
            <select
              required
              value={formData.planId}
              onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
              className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="">-- Choose Plan --</option>
              {plans.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} - ${p.price} ({p.durationMonths} Month{p.durationMonths > 1 ? 's' : ''})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-300">Start Date</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-300">Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Online">Online</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="isPaid"
              checked={formData.isPaid}
              onChange={(e) => setFormData({ ...formData, isPaid: e.target.checked })}
              className="w-4 h-4 accent-amber-500 rounded"
            />
            <label htmlFor="isPaid" className="text-xs text-slate-300 font-semibold cursor-pointer">
              Mark Initial Payment as Received (Paid)
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAssignModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs bg-slate-800 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-extrabold bg-amber-500 text-slate-950"
            >
              Assign & Create Receipt
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Cancel Membership"
        message="Are you sure you want to cancel this member's subscription?"
      />
    </div>
  );
};

export default MembershipManagement;

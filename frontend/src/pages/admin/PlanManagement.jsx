import React, { useState, useEffect } from 'react';
import { membershipService } from '../../services/membershipService';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { Layers, Plus, Edit2, Trash2, CheckCircle2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const PlanManagement = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    durationMonths: 1,
    price: 49,
    description: '',
    features: 'Full Gym Access, Locker Room',
    status: 'active'
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await membershipService.getPlans();
      if (res.success) setPlans(res.data);
    } catch (err) {
      toast.error('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      durationMonths: 1,
      price: 49,
      description: '',
      features: 'Full Gym Access, Locker Room, Free Assessment',
      status: 'active'
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (plan) => {
    setSelectedPlan(plan);
    setFormData({
      name: plan.name,
      durationMonths: plan.durationMonths,
      price: plan.price,
      description: plan.description || '',
      features: plan.features?.join(', ') || '',
      status: plan.status || 'active'
    });
    setIsEditModalOpen(true);
  };

  const handleSavePlan = async (e) => {
    e.preventDefault();
    try {
      if (isAddModalOpen) {
        const res = await membershipService.createPlan(formData);
        if (res.success) toast.success('Membership plan created');
      } else {
        const res = await membershipService.updatePlan(selectedPlan._id, formData);
        if (res.success) toast.success('Membership plan updated');
      }
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      fetchPlans();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving plan');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      const res = await membershipService.deletePlan(deleteId);
      if (res.success) {
        toast.success('Plan deleted');
        fetchPlans();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting plan');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Membership Plans</h1>
          <p className="text-xs text-slate-400">Manage pricing tiers, subscription features, and duration terms.</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg flex items-center space-x-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Plan</span>
        </button>
      </div>

      {loading ? (
        <Loader message="Loading membership tiers..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div key={p._id} className="glass-card p-6 rounded-3xl space-y-5 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-xl font-extrabold text-white">{p.name}</h3>
                    <p className="text-xs text-amber-400 font-semibold flex items-center space-x-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{p.durationMonths} Month{p.durationMonths > 1 ? 's' : ''} Duration</span>
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${p.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-400'}`}>
                    {p.status}
                  </span>
                </div>

                <div className="my-4">
                  <span className="text-4xl font-black text-white">${p.price}</span>
                  <span className="text-xs text-slate-400"> / term</span>
                </div>

                {p.description && <p className="text-xs text-slate-400 leading-relaxed">{p.description}</p>}

                <div className="mt-4 space-y-2 text-xs text-slate-300">
                  {p.features?.map((feat, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  onClick={() => handleOpenEditModal(p)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteId(p._id)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Plan Form Modal */}
      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
        }}
        title={isAddModalOpen ? 'Create Membership Plan' : 'Edit Membership Plan'}
      >
        <form onSubmit={handleSavePlan} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-300">Plan Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-300">Duration (Months) *</label>
              <input
                type="number"
                min={1}
                required
                value={formData.durationMonths}
                onChange={(e) => setFormData({ ...formData, durationMonths: e.target.value })}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-300">Price ($) *</label>
              <input
                type="number"
                min={0}
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-300">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-300">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-300">Features List (Comma Separated)</label>
            <textarea
              rows={3}
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
              }}
              className="px-4 py-2 rounded-xl text-xs bg-slate-800 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-extrabold bg-amber-500 text-slate-950"
            >
              Save Plan
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Membership Plan"
        message="Are you sure you want to delete this membership plan?"
      />
    </div>
  );
};

export default PlanManagement;

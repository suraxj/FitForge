import React, { useState, useEffect } from 'react';
import { trainerService } from '../../services/trainerService';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { Search, UserPlus, Edit2, Trash2, Users, Award, DollarSign, Filter, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const TrainerManagement = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specFilter, setSpecFilter] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [assignedMembersModalTrainer, setAssignedMembersModalTrainer] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    specializations: 'Strength Training, Bodybuilding',
    experience: 3,
    bio: '',
    salary: 4000,
    status: 'active'
  });

  useEffect(() => {
    fetchTrainers();
  }, [specFilter]);

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const res = await trainerService.getTrainers({
        search,
        specialization: specFilter
      });
      if (res.success) {
        setTrainers(res.data);
      }
    } catch (err) {
      toast.error('Failed to load trainers');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTrainers();
  };

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      specializations: 'Strength Training, CrossFit',
      experience: 3,
      bio: '',
      salary: 4500,
      status: 'active'
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (trainer) => {
    setSelectedTrainer(trainer);
    setFormData({
      name: trainer.user?.name || '',
      email: trainer.user?.email || '',
      phone: trainer.user?.phone || '',
      password: '',
      specializations: trainer.specializations?.join(', ') || '',
      experience: trainer.experience || 0,
      bio: trainer.bio || '',
      salary: trainer.salary || 0,
      status: trainer.status || 'active'
    });
    setIsEditModalOpen(true);
  };

  const handleCreateTrainer = async (e) => {
    e.preventDefault();
    try {
      const res = await trainerService.createTrainer(formData);
      if (res.success) {
        toast.success('Trainer created successfully');
        setIsAddModalOpen(false);
        fetchTrainers();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating trainer');
    }
  };

  const handleUpdateTrainer = async (e) => {
    e.preventDefault();
    if (!selectedTrainer) return;
    try {
      const res = await trainerService.updateTrainer(selectedTrainer._id, formData);
      if (res.success) {
        toast.success('Trainer updated successfully');
        setIsEditModalOpen(false);
        fetchTrainers();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating trainer');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      const res = await trainerService.deleteTrainer(deleteId);
      if (res.success) {
        toast.success('Trainer account removed');
        fetchTrainers();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting trainer');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Trainer Management</h1>
          <p className="text-xs text-slate-400">Manage gym personal trainers, specializations, salary & assigned client rosters.</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 flex items-center space-x-2 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Trainer</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-800">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search trainer name..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </form>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={specFilter}
            onChange={(e) => setSpecFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
          >
            <option value="">All Specializations</option>
            <option value="Strength Training">Strength Training</option>
            <option value="Cardio">Cardio</option>
            <option value="CrossFit">CrossFit</option>
            <option value="Yoga">Yoga</option>
            <option value="Personal Training">Personal Training</option>
          </select>
        </div>
      </div>

      {/* Trainer Cards Grid */}
      {loading ? (
        <Loader message="Fetching fitness trainers..." />
      ) : trainers.length === 0 ? (
        <div className="glass-card p-8 rounded-2xl text-center text-slate-500">No trainers found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainers.map((t) => (
            <div key={t._id} className="glass-card p-6 rounded-3xl space-y-4 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div>
                {/* Header Profile */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={t.user?.avatar || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=100&auto=format&fit=crop&q=80'}
                      alt={t.user?.name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500/40"
                    />
                    <div>
                      <h3 className="text-base font-bold text-white leading-tight">{t.user?.name}</h3>
                      <p className="text-xs text-slate-400">{t.user?.email}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${t.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-400'}`}>
                    {t.status}
                  </span>
                </div>

                {/* Specializations Badges */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {t.specializations?.map((spec, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20">
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Meta stats */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold">Experience</span>
                    <p className="font-bold text-slate-200">{t.experience} Years</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold">Monthly Salary</span>
                    <p className="font-bold text-emerald-400">${t.salary}</p>
                  </div>
                </div>

                {t.bio && <p className="text-xs text-slate-400 mt-3 line-clamp-2 italic">"{t.bio}"</p>}
              </div>

              {/* Card Footer Actions */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setAssignedMembersModalTrainer(t)}
                  className="flex items-center space-x-1.5 text-xs font-bold text-amber-400 hover:underline"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{t.assignedMembers?.length || 0} Clients Assigned</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenEditModal(t)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(t._id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Trainer Modal */}
      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
        }}
        title={isAddModalOpen ? 'Create Personal Trainer' : 'Edit Trainer Details'}
      >
        <form onSubmit={isAddModalOpen ? handleCreateTrainer : handleUpdateTrainer} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-300">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-300">Email *</label>
              <input
                type="email"
                required
                disabled={isEditModalOpen}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white disabled:opacity-60"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-300">Phone *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            {isAddModalOpen && (
              <div>
                <label className="text-xs font-bold uppercase text-slate-300">Password *</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-300">Specializations (Comma Separated)</label>
            <input
              type="text"
              value={formData.specializations}
              onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
              placeholder="Strength Training, Bodybuilding, CrossFit..."
              className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-300">Experience (Years)</label>
              <input
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-300">Monthly Salary ($)</label>
              <input
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
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
            <label className="text-xs font-bold uppercase text-slate-300">Bio & Experience Highlights</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
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
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-extrabold bg-amber-500 hover:bg-amber-400 text-slate-950"
            >
              Save Trainer
            </button>
          </div>
        </form>
      </Modal>

      {/* Assigned Members Modal */}
      <Modal
        isOpen={Boolean(assignedMembersModalTrainer)}
        onClose={() => setAssignedMembersModalTrainer(null)}
        title={`Assigned Members - ${assignedMembersModalTrainer?.user?.name}`}
      >
        <div className="space-y-3">
          {assignedMembersModalTrainer?.assignedMembers?.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No members currently assigned to this trainer.</p>
          ) : (
            assignedMembersModalTrainer?.assignedMembers?.map((m) => (
              <div key={m._id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">{m.user?.name}</p>
                  <p className="text-slate-400">{m.user?.email}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Client
                </span>
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Trainer Profile"
        message="Are you sure you want to remove this trainer? Assigned members will be unassigned."
      />
    </div>
  );
};

export default TrainerManagement;

import React, { useState, useEffect } from 'react';
import { workoutService } from '../../services/workoutService';
import { memberService } from '../../services/memberService';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { Dumbbell, Plus, Trash2, Edit2, User, Clock, Target, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const WorkoutManagement = () => {
  const [workouts, setWorkouts] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    memberId: '',
    planName: 'Hypertrophy & Strength Split',
    goal: 'Muscle Growth & Conditioning',
    durationWeeks: 4,
    notes: 'Warm up properly before heavy compound lifts.',
    exercises: [
      { name: 'Barbell Bench Press', sets: 4, reps: '8-10', restTime: '90s', notes: '' },
      { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', restTime: '60s', notes: '' }
    ]
  });

  useEffect(() => {
    fetchWorkouts();
    fetchMembersDropdown();
  }, []);

  const fetchWorkouts = async () => {
    setLoading(true);
    try {
      const res = await workoutService.getWorkoutPlans();
      if (res.success) setWorkouts(res.data);
    } catch (err) {
      toast.error('Failed to load workout plans');
    } finally {
      setLoading(false);
    }
  };

  const fetchMembersDropdown = async () => {
    try {
      const res = await memberService.getMembers({ limit: 100 });
      if (res.success) setMembers(res.data.members);
    } catch (e) {
      // ignore
    }
  };

  const handleAddExerciseRow = () => {
    setFormData((prev) => ({
      ...prev,
      exercises: [...prev.exercises, { name: '', sets: 3, reps: '12', restTime: '60s', notes: '' }]
    }));
  };

  const handleRemoveExerciseRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, idx) => idx !== index)
    }));
  };

  const handleExerciseChange = (index, field, value) => {
    const updated = [...formData.exercises];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, exercises: updated }));
  };

  const handleSaveWorkout = async (e) => {
    e.preventDefault();
    if (!formData.memberId) {
      toast.error('Please select a member');
      return;
    }
    if (formData.exercises.length === 0) {
      toast.error('Please add at least one exercise to the routine');
      return;
    }

    try {
      const res = await workoutService.saveWorkoutPlan(formData);
      if (res.success) {
        toast.success('Workout plan created/updated successfully!');
        setIsModalOpen(false);
        fetchWorkouts();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving workout plan');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      const res = await workoutService.deleteWorkoutPlan(deleteId);
      if (res.success) {
        toast.success('Workout routine removed');
        fetchWorkouts();
      }
    } catch (err) {
      toast.error('Error deleting workout');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Workout Plan Builder</h1>
          <p className="text-xs text-slate-400">Design custom exercise splits, sets, reps, and rest periods for gym athletes.</p>
        </div>

        <button
          onClick={() => {
            if (members.length > 0) setFormData((prev) => ({ ...prev, memberId: members[0]._id }));
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg flex items-center space-x-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Workout Plan</span>
        </button>
      </div>

      {loading ? (
        <Loader message="Loading assigned routines..." />
      ) : workouts.length === 0 ? (
        <div className="glass-card p-8 rounded-2xl text-center text-slate-500">No workout routines created yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workouts.map((plan) => (
            <div key={plan._id} className="glass-card p-6 rounded-3xl space-y-4 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white">{plan.planName}</h3>
                    <p className="text-xs text-amber-400 font-semibold flex items-center space-x-1 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                      <span>Member: {plan.member?.user?.name}</span>
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase">
                    {plan.durationWeeks} Weeks
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-2 flex items-center space-x-1">
                  <Target className="w-3.5 h-3.5 text-amber-400" />
                  <span>Goal: {plan.goal}</span>
                </p>

                {/* Exercises list */}
                <div className="mt-4 space-y-2">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Exercise Routine ({plan.exercises?.length || 0})</p>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {plan.exercises?.map((ex, idx) => (
                      <div key={idx} className="p-2 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-200">{ex.name}</span>
                        <span className="text-amber-400 font-mono font-bold text-[11px]">{ex.sets} sets × {ex.reps}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  onClick={() => setDeleteId(plan._id)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Builder Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Workout Plan Builder" maxWidth="max-w-3xl">
        <form onSubmit={handleSaveWorkout} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <option key={m._id} value={m._id}>{m.user?.name} ({m.user?.email})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-300">Routine Title *</label>
              <input
                type="text"
                required
                value={formData.planName}
                onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-300">Fitness Goal</label>
              <input
                type="text"
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-300">Duration (Weeks)</label>
              <input
                type="number"
                min={1}
                value={formData.durationWeeks}
                onChange={(e) => setFormData({ ...formData, durationWeeks: e.target.value })}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          {/* Dynamic Exercise List Editor */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase text-amber-400">Exercise Checklist</label>
              <button
                type="button"
                onClick={handleAddExerciseRow}
                className="text-xs font-bold text-amber-400 hover:underline flex items-center space-x-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Exercise</span>
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {formData.exercises.map((ex, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center text-xs">
                  <div className="sm:col-span-5">
                    <input
                      type="text"
                      placeholder="Exercise Name (e.g. Bench Press)"
                      required
                      value={ex.name}
                      onChange={(e) => handleExerciseChange(idx, 'name', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="number"
                      placeholder="Sets"
                      required
                      value={ex.sets}
                      onChange={(e) => handleExerciseChange(idx, 'sets', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Reps (10-12)"
                      required
                      value={ex.reps}
                      onChange={(e) => handleExerciseChange(idx, 'reps', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Rest (60s)"
                      value={ex.restTime}
                      onChange={(e) => handleExerciseChange(idx, 'restTime', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div className="sm:col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveExerciseRow(idx)}
                      className="p-1 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-xs bg-slate-800 text-slate-300">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-xl text-xs font-extrabold bg-amber-500 text-slate-950">Save Workout Plan</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Workout Plan"
        message="Are you sure you want to delete this workout routine?"
      />
    </div>
  );
};

export default WorkoutManagement;

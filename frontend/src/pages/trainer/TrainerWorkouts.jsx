import React, { useState, useEffect } from 'react';
import { workoutService } from '../../services/workoutService';
import { trainerService } from '../../services/trainerService';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import { Dumbbell, Plus, Trash2, PlusCircle, Target, User } from 'lucide-react';
import toast from 'react-hot-toast';

const TrainerWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [assignedMembers, setAssignedMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    memberId: '',
    planName: 'Hypertrophy & Power Split',
    goal: 'Muscle Gain & Strength',
    durationWeeks: 4,
    notes: 'Maintain strict form.',
    exercises: [
      { name: 'Barbell Bench Press', sets: 4, reps: '8-10', restTime: '90s', notes: '' }
    ]
  });

  useEffect(() => {
    fetchWorkouts();
    fetchMembers();
  }, []);

  const fetchWorkouts = async () => {
    setLoading(true);
    try {
      const res = await workoutService.getWorkoutPlans();
      if (res.success) setWorkouts(res.data);
    } catch (e) {
      toast.error('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await trainerService.getMyAssignedMembers();
      if (res.success) setAssignedMembers(res.data);
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
      toast.error('Please select an assigned client');
      return;
    }

    try {
      const res = await workoutService.saveWorkoutPlan(formData);
      if (res.success) {
        toast.success('Workout assigned!');
        setIsModalOpen(false);
        fetchWorkouts();
      }
    } catch (err) {
      toast.error('Error saving workout plan');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Athlete Workout Routines</h1>
          <p className="text-xs text-slate-400">Design and assign split routines for your assigned clients.</p>
        </div>

        <button
          onClick={() => {
            if (assignedMembers.length > 0) setFormData((prev) => ({ ...prev, memberId: assignedMembers[0]._id }));
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg flex items-center space-x-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Assign New Workout</span>
        </button>
      </div>

      {loading ? (
        <Loader message="Fetching workout routines..." />
      ) : workouts.length === 0 ? (
        <div className="glass-card p-8 rounded-2xl text-center text-slate-500">No workout routines created yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workouts.map((plan) => (
            <div key={plan._id} className="glass-card p-6 rounded-3xl space-y-4 border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{plan.planName}</h3>
                  <p className="text-xs text-amber-400 font-semibold flex items-center space-x-1 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                    <span>Client: {plan.member?.user?.name}</span>
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase">
                  {plan.durationWeeks} Weeks
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold text-slate-400">Exercises ({plan.exercises?.length || 0})</p>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {plan.exercises?.map((ex, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200">{ex.name}</span>
                      <span className="text-amber-400 font-bold text-[11px]">{ex.sets} × {ex.reps}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Assign Workout Routine" maxWidth="max-w-2xl">
        <form onSubmit={handleSaveWorkout} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-slate-300">Client *</label>
            <select
              required
              value={formData.memberId}
              onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
              className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="">-- Select Client --</option>
              {assignedMembers.map((m) => (
                <option key={m._id} value={m._id}>{m.user?.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div>
              <label className="text-xs font-bold uppercase text-slate-300">Goal</label>
              <input
                type="text"
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          {/* Exercise Rows */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase text-amber-400">Exercise List</label>
              <button type="button" onClick={handleAddExerciseRow} className="text-xs text-amber-400 flex items-center space-x-1">
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Row</span>
              </button>
            </div>

            {formData.exercises.map((ex, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-12 gap-2 items-center text-xs">
                <input
                  type="text"
                  placeholder="Exercise"
                  required
                  value={ex.name}
                  onChange={(e) => handleExerciseChange(idx, 'name', e.target.value)}
                  className="col-span-5 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                />
                <input
                  type="number"
                  placeholder="Sets"
                  required
                  value={ex.sets}
                  onChange={(e) => handleExerciseChange(idx, 'sets', e.target.value)}
                  className="col-span-3 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Reps"
                  required
                  value={ex.reps}
                  onChange={(e) => handleExerciseChange(idx, 'reps', e.target.value)}
                  className="col-span-3 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                />
                <button type="button" onClick={() => handleRemoveExerciseRow(idx)} className="col-span-1 text-rose-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-xs bg-slate-800 text-slate-300">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-xl text-xs font-extrabold bg-amber-500 text-slate-950">Save Workout</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TrainerWorkouts;

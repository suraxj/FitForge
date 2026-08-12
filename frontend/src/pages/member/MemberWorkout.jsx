import React, { useState, useEffect } from 'react';
import { workoutService } from '../../services/workoutService';
import Loader from '../../components/common/Loader';
import {
  Dumbbell,
  Calendar,
  CheckCircle2,
  Circle,
  Flame,
  Info,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const MemberWorkout = () => {
  const [loading, setLoading] = useState(true);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [activeDay, setActiveDay] = useState('Monday');
  const [completedExercises, setCompletedExercises] = useState({});

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      setLoading(true);
      try {
        const res = await workoutService.getMyWorkoutPlan();
        if (res.success && res.data) {
          setWorkoutPlan(res.data);
          // Set initial day if schedule exists
          if (res.data.schedule && res.data.schedule.length > 0) {
            setActiveDay(res.data.schedule[0].day || 'Monday');
          }
        }
      } catch (err) {
        console.error('Error fetching member workout plan:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutPlan();
  }, []);

  const toggleExercise = (exerciseId) => {
    setCompletedExercises((prev) => {
      const nextState = { ...prev, [exerciseId]: !prev[exerciseId] };
      if (nextState[exerciseId]) {
        toast.success('Exercise completed! Keep grinding 🔥');
      }
      return nextState;
    });
  };

  if (loading) {
    return <Loader message="Loading your workout routine..." />;
  }

  // Find schedule for active day
  const currentSchedule = workoutPlan?.schedule?.find(
    (s) => s.day?.toLowerCase() === activeDay.toLowerCase()
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">My Workout Routine</h1>
          <p className="text-xs text-slate-400 mt-1">
            Follow your trainer-assigned workout schedule and track completed sets.
          </p>
        </div>

        {workoutPlan?.trainer && (
          <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <UserCheck className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400">Assigned Trainer:</span>
            <span className="font-bold text-white">{workoutPlan.trainer.user?.name || 'Personal Trainer'}</span>
          </div>
        )}
      </div>

      {workoutPlan ? (
        <div className="space-y-6">
          {/* Plan Header Card */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 capitalize inline-block mb-2">
                  {workoutPlan.level || 'Custom Program'}
                </span>
                <h2 className="text-2xl font-extrabold text-white">{workoutPlan.title}</h2>
                <p className="text-xs text-slate-400 mt-1">{workoutPlan.description || 'Custom tailored fitness & conditioning routine'}</p>
              </div>

              <div className="flex items-center space-x-3 text-xs text-slate-400 bg-slate-850 px-4 py-3 rounded-xl border border-slate-800">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>Intensity: <strong className="text-white">High</strong></span>
              </div>
            </div>
          </div>

          {/* Days Navigation Tabs */}
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {daysOfWeek.map((day) => {
              const hasSchedule = workoutPlan.schedule?.some((s) => s.day?.toLowerCase() === day.toLowerCase());
              const isActive = activeDay.toLowerCase() === day.toLowerCase();

              return (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 flex-shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : hasSchedule
                      ? 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      : 'bg-slate-950 text-slate-600 border border-slate-900'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{day}</span>
                  {hasSchedule && (
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-slate-950' : 'bg-amber-400'}`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Current Day Exercise List */}
          {currentSchedule && currentSchedule.exercises?.length > 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white">{activeDay}'s Focus</h3>
                  <p className="text-xs text-amber-400 font-semibold mt-0.5">{currentSchedule.focusArea || 'General Workout'}</p>
                </div>
                <span className="text-xs text-slate-400 bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-800 font-semibold">
                  {currentSchedule.exercises.length} Exercises Scheduled
                </span>
              </div>

              {/* Exercise Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentSchedule.exercises.map((ex, idx) => {
                  const exKey = `${activeDay}-${idx}`;
                  const isDone = !!completedExercises[exKey];

                  return (
                    <div
                      key={idx}
                      onClick={() => toggleExercise(exKey)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isDone
                          ? 'bg-slate-950/60 border-emerald-500/40 opacity-75'
                          : 'bg-slate-850 border-slate-800 hover:border-amber-500/40'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-xl mt-0.5 ${isDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                            <Dumbbell className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className={`font-bold text-sm ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                              {ex.name}
                            </h4>
                            <p className="text-xs text-slate-400 mt-0.5">Target: <span className="text-slate-300 font-semibold">{ex.targetMuscle || 'Full Body'}</span></p>
                          </div>
                        </div>

                        <button className="text-slate-400 hover:text-emerald-400">
                          {isDone ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-500/20" />
                          ) : (
                            <Circle className="w-6 h-6 text-slate-600" />
                          )}
                        </button>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-4">
                          <span className="bg-slate-800 px-2.5 py-1 rounded-lg font-bold text-amber-400">
                            {ex.sets || 3} Sets
                          </span>
                          <span className="bg-slate-800 px-2.5 py-1 rounded-lg font-bold text-slate-200">
                            {ex.reps || 12} Reps
                          </span>
                        </div>

                        {ex.restTime && (
                          <span className="text-slate-500 font-medium">{ex.restTime} s rest</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
              <Info className="w-10 h-10 text-amber-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">Rest Day Scheduled</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No exercises planned for {activeDay}. Take time to recover, stay hydrated, and stretch!
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
          <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white">No Workout Plan Assigned</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Your personal trainer will configure a customized exercise routine for you soon. Check back shortly!
          </p>
        </div>
      )}
    </div>
  );
};

export default MemberWorkout;

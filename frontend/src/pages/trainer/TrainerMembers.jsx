import React, { useState, useEffect } from 'react';
import { trainerService } from '../../services/trainerService';
import Loader from '../../components/common/Loader';
import { Users, Phone, Mail, Dumbbell, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const TrainerMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssigned();
  }, []);

  const fetchAssigned = async () => {
    setLoading(true);
    try {
      const res = await trainerService.getMyAssignedMembers();
      if (res.success) setMembers(res.data);
    } catch (err) {
      toast.error('Failed to load assigned client list');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Assigned Roster</h1>
        <p className="text-xs text-slate-400">View and manage clients assigned to your personal training track.</p>
      </div>

      {loading ? (
        <Loader message="Loading assigned roster..." />
      ) : members.length === 0 ? (
        <div className="glass-card p-8 rounded-2xl text-center text-slate-500">No athletes assigned to your track yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((m) => (
            <div key={m._id} className="glass-card p-6 rounded-3xl space-y-4 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-3">
                  <img
                    src={m.user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'}
                    alt={m.user?.name}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500/40"
                  />
                  <div>
                    <h3 className="text-base font-bold text-white leading-tight">{m.user?.name}</h3>
                    <p className="text-xs text-slate-400">{m.gender} • {m.status}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                  <p className="flex items-center space-x-2"><Mail className="w-3.5 h-3.5 text-emerald-400" /> <span>{m.user?.email}</span></p>
                  <p className="flex items-center space-x-2"><Phone className="w-3.5 h-3.5 text-emerald-400" /> <span>{m.user?.phone}</span></p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => navigate('/trainer/workouts')}
                  className="flex items-center space-x-1 text-xs font-bold text-amber-400 hover:underline"
                >
                  <Dumbbell className="w-3.5 h-3.5" />
                  <span>Build Routine</span>
                </button>
                <button
                  onClick={() => navigate('/trainer/progress')}
                  className="flex items-center space-x-1 text-xs font-bold text-emerald-400 hover:underline"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Log Measurements</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainerMembers;

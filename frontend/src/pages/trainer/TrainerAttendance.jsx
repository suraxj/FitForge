import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../services/attendanceService';
import { trainerService } from '../../services/trainerService';
import Loader from '../../components/common/Loader';
import { CalendarCheck, Save, CheckCircle2, Clock, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const TrainerAttendance = () => {
  const [assignedMembers, setAssignedMembers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substring(0, 10));
  const [attendanceState, setAttendanceState] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoster();
  }, [selectedDate]);

  const fetchRoster = async () => {
    setLoading(true);
    try {
      const [mRes, aRes] = await Promise.all([
        trainerService.getMyAssignedMembers(),
        attendanceService.getAttendance({ date: selectedDate })
      ]);
      if (mRes.success) setAssignedMembers(mRes.data);

      const stateMap = {};
      if (aRes.success && aRes.data) {
        aRes.data.forEach((rec) => {
          const mId = typeof rec.member === 'object' ? rec.member?._id : rec.member;
          if (mId) stateMap[mId] = rec.status;
        });
      }
      setAttendanceState(stateMap);
    } catch (e) {
      toast.error('Failed to load client roster');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = (mId, newStatus) => {
    setAttendanceState((prev) => ({ ...prev, [mId]: newStatus }));
  };

  const handleSaveRoster = async () => {
    const bulkPayload = Object.keys(attendanceState).map((mId) => ({
      memberId: mId,
      status: attendanceState[mId]
    }));

    try {
      const res = await attendanceService.markAttendance({
        date: selectedDate,
        bulk: bulkPayload
      });
      if (res.success) {
        toast.success(`Client attendance saved for ${selectedDate}`);
      }
    } catch (e) {
      toast.error('Failed to save attendance');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Mark Client Attendance</h1>
          <p className="text-xs text-slate-400">Track check-ins for your personal training roster.</p>
        </div>

        <button
          onClick={handleSaveRoster}
          className="px-5 py-2.5 rounded-xl font-extrabold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg flex items-center space-x-2 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Roster</span>
        </button>
      </div>

      <div className="glass-panel p-4 rounded-2xl flex items-center space-x-3 border border-slate-800">
        <label className="text-xs font-bold text-slate-300">Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-slate-900 border border-slate-800 text-slate-100 text-xs rounded-xl px-3 py-2"
        />
      </div>

      {loading ? (
        <Loader message="Loading assigned client roster..." />
      ) : (
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800">
          {assignedMembers.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center">No assigned clients to mark.</p>
          ) : (
            assignedMembers.map((m) => {
              const currentStatus = attendanceState[m._id] || 'present';
              return (
                <div key={m._id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white text-sm">{m.user?.name}</p>
                    <p className="text-xs text-slate-400">{m.user?.phone}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleStatusToggle(m._id, 'present')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                        currentStatus === 'present' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => handleStatusToggle(m._id, 'late')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                        currentStatus === 'late' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      Late
                    </button>
                    <button
                      onClick={() => handleStatusToggle(m._id, 'absent')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                        currentStatus === 'absent' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      Absent
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default TrainerAttendance;

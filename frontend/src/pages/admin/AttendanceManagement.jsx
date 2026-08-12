import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../services/attendanceService';
import { memberService } from '../../services/memberService';
import Loader from '../../components/common/Loader';
import { CalendarCheck, Filter, Calendar as CalendarIcon, CheckCircle2, XCircle, Clock, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const AttendanceManagement = () => {
  const [members, setMembers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substring(0, 10));
  const [attendanceState, setAttendanceState] = useState({});
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRosterAndAttendance();
  }, [selectedDate]);

  const fetchRosterAndAttendance = async () => {
    setLoading(true);
    try {
      const [mRes, aRes] = await Promise.all([
        memberService.getMembers({ limit: 100 }),
        attendanceService.getAttendance({ date: selectedDate })
      ]);

      if (mRes.success) setMembers(mRes.data.members);

      // Build status map
      const stateMap = {};
      if (aRes.success && aRes.data) {
        aRes.data.forEach((rec) => {
          const mId = typeof rec.member === 'object' ? rec.member?._id : rec.member;
          if (mId) {
            stateMap[mId] = rec.status;
          }
        });
      }
      setAttendanceState(stateMap);
    } catch (err) {
      toast.error('Failed to load attendance roster');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = (memberId, newStatus) => {
    setAttendanceState((prev) => ({
      ...prev,
      [memberId]: newStatus
    }));
  };

  const handleSaveRoster = async () => {
    const bulkPayload = Object.keys(attendanceState).map((mId) => ({
      memberId: mId,
      status: attendanceState[mId]
    }));

    if (bulkPayload.length === 0) {
      toast.error('No member status changes marked');
      return;
    }

    try {
      const res = await attendanceService.markAttendance({
        date: selectedDate,
        bulk: bulkPayload
      });
      if (res.success) {
        toast.success(`Attendance roster saved for ${selectedDate}`);
        fetchRosterAndAttendance();
      }
    } catch (err) {
      toast.error('Failed to save attendance');
    }
  };

  const filteredMembers = members.filter((m) => {
    if (statusFilter === 'all') return true;
    const currentStatus = attendanceState[m._id] || 'unmarked';
    return currentStatus === statusFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Attendance Roster</h1>
          <p className="text-xs text-slate-400">Mark daily member attendance, filter by status, and track monthly check-in rates.</p>
        </div>

        <button
          onClick={handleSaveRoster}
          className="px-5 py-2.5 rounded-xl font-extrabold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 flex items-center space-x-2 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Today's Roster</span>
        </button>
      </div>

      {/* Date & Filter Controls */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <CalendarIcon className="w-4 h-4 text-amber-400" />
          <label className="text-xs font-bold text-slate-300">Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-100 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2"
          >
            <option value="all">All Members</option>
            <option value="present">Present Only</option>
            <option value="late">Late Only</option>
            <option value="absent">Absent Only</option>
          </select>
        </div>
      </div>

      {/* Member Roster List */}
      {loading ? (
        <Loader message="Loading attendance entries..." />
      ) : (
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
          <div className="divide-y divide-slate-800/80">
            {filteredMembers.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">No member records found for this date.</p>
            ) : (
              filteredMembers.map((m) => {
                const currentStatus = attendanceState[m._id] || 'present';
                return (
                  <div key={m._id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center space-x-3">
                      <img
                        src={m.user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'}
                        alt={m.user?.name}
                        className="w-10 h-10 rounded-full object-cover border border-amber-500/30"
                      />
                      <div>
                        <p className="font-bold text-white text-sm">{m.user?.name}</p>
                        <p className="text-xs text-slate-400">Plan: {m.membership?.plan?.name || 'Standard'}</p>
                      </div>
                    </div>

                    {/* Toggle Buttons */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleStatusToggle(m._id, 'present')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-1 transition-all ${
                          currentStatus === 'present'
                            ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Present</span>
                      </button>

                      <button
                        onClick={() => handleStatusToggle(m._id, 'late')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-1 transition-all ${
                          currentStatus === 'late'
                            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Late</span>
                      </button>

                      <button
                        onClick={() => handleStatusToggle(m._id, 'absent')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-1 transition-all ${
                          currentStatus === 'absent'
                            ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Absent</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;

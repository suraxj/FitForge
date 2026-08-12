import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../services/attendanceService';
import Loader from '../../components/common/Loader';
import StatCard from '../../components/common/StatCard';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Award,
  TrendingUp,
  XCircle
} from 'lucide-react';

const MemberAttendance = () => {
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const res = await attendanceService.getMyAttendance();
        if (res.success) {
          const rawData = res.data?.records || res.data;
          setAttendance(Array.isArray(rawData) ? rawData : []);
        }
      } catch (err) {
        console.error('Error fetching member attendance:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  if (loading) {
    return <Loader message="Loading attendance records..." />;
  }

  // Calculate attendance statistics
  const safeAttendance = Array.isArray(attendance) ? attendance : [];
  const totalDays = safeAttendance.length;
  const presentDays = safeAttendance.filter((a) => a && a.status === 'present').length;
  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  // Recent attendance list
  const sortedAttendance = [...safeAttendance].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white">My Attendance History</h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor your gym check-ins, consistency rate, and attendance history.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Total Check-ins"
          value={`${totalDays} Sessions`}
          icon={CalendarCheck}
          subtext="Recorded gym visits"
          color="amber"
        />

        <StatCard
          title="Attendance Rate"
          value={`${attendancePercentage}%`}
          icon={TrendingUp}
          subtext="Overall gym consistency"
          color="emerald"
        />

        <StatCard
          title="Present Visits"
          value={`${presentDays} Days`}
          icon={CheckCircle2}
          subtext="Verified check-ins"
          color="cyan"
        />
      </div>

      {/* Attendance History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white">Recent Check-ins</h2>
          </div>
          <span className="text-xs text-slate-400 font-semibold">{totalDays} Total Records</span>
        </div>

        {sortedAttendance.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-850 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Date</th>
                  <th className="px-4 py-3">Check-in Time</th>
                  <th className="px-4 py-3">Recorded By</th>
                  <th className="px-4 py-3 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sortedAttendance.map((record) => (
                  <tr key={record._id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-white">
                      {new Date(record.date).toLocaleDateString(undefined, {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-4 py-3.5 text-slate-400">
                      {new Date(record.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3.5 text-slate-300">
                      {record.recordedBy?.name || 'Reception Check-in'}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                        record.status === 'present'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {record.status === 'present' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        <span>{record.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 rounded-xl bg-slate-850 border border-slate-800/60 border-dashed">
            <CalendarCheck className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-300 font-bold text-sm">No Attendance Recorded</p>
            <p className="text-xs text-slate-500 mt-1">
              Your check-ins will automatically appear here when scanned at gym entry.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberAttendance;

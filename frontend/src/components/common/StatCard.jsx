import React from 'react';

const StatCard = ({ title, value, subtext, icon: Icon, color = 'amber', trend }) => {
  const colorMap = {
    amber: 'from-amber-500/10 to-orange-500/5 text-amber-400 border-amber-500/20',
    emerald: 'from-emerald-500/10 to-teal-500/5 text-emerald-400 border-emerald-500/20',
    blue: 'from-blue-500/10 to-cyan-500/5 text-blue-400 border-blue-500/20',
    purple: 'from-purple-500/10 to-indigo-500/5 text-purple-400 border-purple-500/20',
    rose: 'from-rose-500/10 to-red-500/5 text-rose-400 border-rose-500/20'
  };

  const iconBgMap = {
    amber: 'bg-amber-500/10 text-amber-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    blue: 'bg-blue-500/10 text-blue-400',
    purple: 'bg-purple-500/10 text-purple-400',
    rose: 'bg-rose-500/10 text-rose-400'
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl border p-5 bg-gradient-to-br glass-card hover:border-slate-700 transition-all duration-300 ${colorMap[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="mt-2 text-2xl font-extrabold text-white tracking-tight">{value}</h3>
          {subtext && <p className="mt-1 text-xs text-slate-400">{subtext}</p>}
          {trend && (
            <span className={`inline-block mt-2 text-xs font-semibold ${trend.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend.positive ? '↑' : '↓'} {trend.text}
            </span>
          )}
        </div>
        {Icon && (
          <div className={`p-3.5 rounded-2xl ${iconBgMap[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;

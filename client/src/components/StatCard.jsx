import React from 'react';

export const StatCard = ({ title, value, unit = '', change = '', isPositive = true, icon: Icon }) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-3 hover:border-black transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-zinc-500 tracking-tight uppercase">{title}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-black">
            <Icon className="w-4 h-4 text-black" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-extrabold text-zinc-900 tracking-tight">{value}</span>
        {unit && <span className="text-xs font-semibold text-zinc-500">{unit}</span>}
      </div>

      {change && (
        <div className="text-xs font-bold text-zinc-800 flex items-center gap-1">
          <span className="text-emerald-600">{isPositive ? '↑' : '↓'} {change}</span>
          <span className="text-zinc-400 font-medium text-[11px]">vs last week</span>
        </div>
      )}
    </div>
  );
};

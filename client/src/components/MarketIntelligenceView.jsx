import { TrendingUp, BarChart, Activity, Sparkles } from 'lucide-react';
import { StatCard } from './StatCard';

export const MarketIntelligenceView = () => {
  const trends = [
    { day: 'Mon', avgPrice: 18200, loads: 12 },
    { day: 'Tue', avgPrice: 19400, loads: 15 },
    { day: 'Wed', avgPrice: 21700, loads: 18 },
    { day: 'Thu', avgPrice: 20500, loads: 14 },
    { day: 'Fri', avgPrice: 22800, loads: 21 },
    { day: 'Sat', avgPrice: 24100, loads: 25 },
    { day: 'Sun', avgPrice: 21900, loads: 19 }
  ];

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-purple">MARKET INTELLIGENCE</span>
            <span className="text-xs font-semibold text-slate-500 font-sans">Delhi → Jaipur Corridor</span>
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 font-outfit tracking-tight mt-1">
            Corridor Supply & Demand Metrics
          </h3>
        </div>
        <span className="badge-emerald font-semibold">HIGH DEMAND CORRIDOR</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="SUPPLY / DEMAND INDEX"
          value="1.42"
          subtext="High Demand Sector"
          icon={<TrendingUp size={20} className="text-emerald-600" />}
          trend="+12.4%"
        />
        <StatCard
          title="AVG RATE / KM"
          value="₹42.50 / km"
          subtext="Spot rate average"
          icon={<BarChart size={20} className="text-blue-600" />}
          trend="+8.1%"
        />
        <StatCard
          title="CORRIDOR VOLUME"
          value="42.5 Tons"
          subtext="Daily active payload"
          icon={<Activity size={20} className="text-purple-600" />}
          trend="+15.0%"
        />
        <StatCard
          title="AVG DETOUR"
          value="18.4 km"
          subtext="Optimal pick deviation"
          icon={<Sparkles size={20} className="text-cyan-600" />}
          trend="-4.2%"
        />
      </div>

      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 font-outfit">
            7-DAY AVERAGE BACKHAUL RATE TREND (INR)
          </div>
          <span className="badge-cyan text-xs">Delhi-Jaipur Express</span>
        </div>

        <div className="w-full h-44 flex items-end gap-3 border-b border-slate-200/80 pb-3 pt-6">
          {trends.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
              <div
                className="w-full bg-gradient-to-t from-blue-600 to-indigo-600 rounded-t-lg transition-all duration-300 shadow-md group-hover:brightness-110"
                style={{ height: `${(item.avgPrice / 25000) * 100}%` }}
              />
              <span className="text-xs font-semibold text-slate-600 mt-3 font-outfit">{item.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


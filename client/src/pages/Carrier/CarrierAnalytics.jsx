import { CarrierNavbar } from '../../components/Navbar';
import { StatCard } from '../../components/StatCard';
import { DollarSign, TrendingUp, Zap, ShieldCheck, BarChart3, Sparkles } from 'lucide-react';

export const CarrierAnalytics = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      <CarrierNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Header Glass Panel */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="badge-purple">
              <BarChart3 size={12} />
              FLEET ANALYTICS & IMPACT
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit tracking-tight">
              Utilisation & Revenue Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-normal max-w-2xl">
              Financial performance, empty KM reduction, and environmental CO2 impact metrics.
            </p>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="MONTHLY REVENUE"
            value="₹1,28,450"
            subtext="From backhaul dispatch"
            icon={<DollarSign size={20} className="text-blue-600" />}
            trend="+18.4%"
          />
          <StatCard
            title="NET CONTRIBUTION"
            value="+₹1,09,550"
            subtext="Net fuel & driver profit"
            icon={<TrendingUp size={20} className="text-emerald-600" />}
            trend="+22.1%"
          />
          <StatCard
            title="EMPTY KM AVOIDED"
            value="3,420 km"
            subtext="Deadhead distance saved"
            icon={<Zap size={20} className="text-purple-600" />}
            trend="+14.8%"
          />
          <StatCard
            title="CO2 OFFSET"
            value="2,907 kg"
            subtext="Carbon emissions saved"
            icon={<ShieldCheck size={20} className="text-cyan-600" />}
            trend="+29.0%"
          />
        </div>

        {/* Chart Panel */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 font-outfit">
              FLEET UTILISATION VS CO2 SAVINGS HISTORY
            </h2>
            <span className="badge-cyan text-xs">Past 30 Days</span>
          </div>

          <div className="w-full h-56 flex items-end gap-6 border-b border-slate-200/80 pb-3 pt-6">
            {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((w, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div
                  className="w-full max-w-[64px] bg-gradient-to-t from-blue-600 via-indigo-600 to-purple-500 rounded-t-xl transition-all duration-300 shadow-md group-hover:brightness-110"
                  style={{ height: `${65 + idx * 8}%` }}
                />
                <span className="text-xs font-semibold text-slate-600 mt-3 font-outfit">{w}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};


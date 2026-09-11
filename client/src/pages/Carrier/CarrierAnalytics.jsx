import { useEffect, useState } from 'react';
import { CarrierNavbar } from '../../components/Navbar';
import { StatCard } from '../../components/StatCard';
import { DollarSign, TrendingUp, Zap, ShieldCheck, BarChart3, Loader2 } from 'lucide-react';
import { analyticsApi } from '../../services/analytics.api';

export const CarrierAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const res = await analyticsApi.getCarrierStats();
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to load carrier analytics:', err);
        setError('Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

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
              Financial performance, empty KM reduction, and environmental CO2 impact metrics calculated from your real trips.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex items-center justify-center text-slate-500 gap-2">
            <Loader2 className="animate-spin" size={24} />
            <span>Loading real analytics data...</span>
          </div>
        ) : error ? (
          <div className="p-6 text-red-600 bg-red-50 rounded-xl border border-red-200">
            {error}
          </div>
        ) : (
          <>
            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard
                title="TOTAL REVENUE"
                value={`₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`}
                subtext="From backhaul dispatch"
                icon={<DollarSign size={20} className="text-blue-600" />}
                trend={`${stats?.loadsCompleted || 0} Loads`}
              />
              <StatCard
                title="NET CONTRIBUTION"
                value={`₹${(stats?.totalNetProfit || 0).toLocaleString('en-IN')}`}
                subtext="Net fuel & driver profit"
                icon={<TrendingUp size={20} className="text-emerald-600" />}
                trend={`${stats?.fleetUtilisation || 0}% Utilisation`}
              />
              <StatCard
                title="EMPTY KM AVOIDED"
                value={`${(stats?.emptyKmAvoided || 0).toLocaleString('en-IN')} km`}
                subtext="Deadhead distance saved"
                icon={<Zap size={20} className="text-purple-600" />}
                trend="Real Distance"
              />
              <StatCard
                title="CO2 OFFSET"
                value={`${(stats?.co2SavedKg || 0).toLocaleString('en-IN')} kg`}
                subtext="Carbon emissions saved"
                icon={<ShieldCheck size={20} className="text-cyan-600" />}
                trend="0.85 kg/km"
              />
            </div>

            {/* Chart Panel / Analytics Summary */}
            <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 font-outfit">
                  FLEET UTILISATION VS CO2 SAVINGS SUMMARY
                </h2>
                <span className="badge-cyan text-xs">Real Data</span>
              </div>

              {stats?.totalRevenue === 0 && stats?.loadsCompleted === 0 ? (
                <div className="p-10 text-center text-slate-500 space-y-2">
                  <div className="font-semibold text-base text-slate-700">Not enough analytics data yet</div>
                  <div className="text-xs">Publish capacity and complete backhaul trips to generate real revenue and carbon offset metrics.</div>
                </div>
              ) : (
                <div className="w-full h-44 flex items-end gap-6 border-b border-slate-200/80 pb-3 pt-6">
                  {['Active Trips', 'Completed Loads', 'Fleet Utilisation', 'CO2 Saved (x10kg)'].map((label, idx) => {
                    const vals = [
                      stats?.activeTrips || 0,
                      stats?.loadsCompleted || 0,
                      stats?.fleetUtilisation || 0,
                      Math.round((stats?.co2SavedKg || 0) / 10)
                    ];
                    const heightPercent = Math.min(100, Math.max(15, vals[idx] * 5));
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                        <div
                          className="w-full max-w-[64px] bg-gradient-to-t from-blue-600 via-indigo-600 to-purple-500 rounded-t-xl transition-all duration-300 shadow-md group-hover:brightness-110"
                          style={{ height: `${heightPercent}%` }}
                        />
                        <span className="text-xs font-semibold text-slate-600 mt-3 font-outfit text-center">{label} ({vals[idx]})</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};



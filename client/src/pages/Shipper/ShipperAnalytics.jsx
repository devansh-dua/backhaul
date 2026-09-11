import { useEffect, useState } from 'react';
import { ShipperNavbar } from '../../components/Navbar';
import { StatCard } from '../../components/StatCard';
import { DollarSign, TrendingUp, ShieldCheck, BarChart3, Package, Loader2 } from 'lucide-react';
import { analyticsApi } from '../../services/analytics.api';

export const ShipperAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const res = await analyticsApi.getShipperStats();
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to load shipper analytics:', err);
        setError('Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      <ShipperNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Header Glass Panel */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="badge-purple">
              <BarChart3 size={12} />
              FREIGHT ANALYTICS
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit tracking-tight">
              Shipper Logistics Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-normal max-w-2xl">
              Savings analytics, on-time delivery rates, and carbon offset tracking calculated from real shipment records.
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
                title="FREIGHT SAVED"
                value={`₹${(stats?.totalMoneySavedINR || 0).toLocaleString('en-IN')}`}
                subtext="Via backhaul capacity"
                icon={<DollarSign size={20} className="text-emerald-600" />}
                trend="28% Avg Savings"
              />
              <StatCard
                title="ON-TIME RATE"
                value={`${stats?.onTimeDeliveryPercent || 0}%`}
                subtext="Guaranteed corridor SLA"
                icon={<TrendingUp size={20} className="text-blue-600" />}
                trend="SLA Tracked"
              />
              <StatCard
                title="SHIPMENTS COMPLETED"
                value={stats?.completedShipmentsCount || 0}
                subtext="Total freight deliveries"
                icon={<Package size={20} className="text-purple-600" />}
                trend={`${stats?.totalShipmentsCount || 0} Total`}
              />
              <StatCard
                title="CO2 OFFSET"
                value={`${(stats?.co2EmissionsAvoidedKg || 0).toLocaleString('en-IN')} kg`}
                subtext="Emissions saved"
                icon={<ShieldCheck size={20} className="text-cyan-600" />}
                trend="Real Offset"
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
};



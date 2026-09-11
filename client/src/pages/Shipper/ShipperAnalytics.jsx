import { ShipperNavbar } from '../../components/Navbar';
import { StatCard } from '../../components/StatCard';
import { DollarSign, TrendingUp, ShieldCheck, BarChart3, Package, Zap } from 'lucide-react';

export const ShipperAnalytics = () => {
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
              Savings analytics, on-time delivery rates, and carbon offset tracking.
            </p>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="FREIGHT SAVED"
            value="₹32,450"
            subtext="Via backhaul capacity"
            icon={<DollarSign size={20} className="text-emerald-600" />}
            trend="+24.5%"
          />
          <StatCard
            title="ON-TIME RATE"
            value="99.2%"
            subtext="Guaranteed corridor SLA"
            icon={<TrendingUp size={20} className="text-blue-600" />}
            trend="+2.1%"
          />
          <StatCard
            title="SHIPMENTS COMPLETED"
            value="48"
            subtext="Total freight deliveries"
            icon={<Package size={20} className="text-purple-600" />}
            trend="+18.0%"
          />
          <StatCard
            title="CO2 OFFSET"
            value="1,840 kg"
            subtext="Emissions saved"
            icon={<ShieldCheck size={20} className="text-cyan-600" />}
            trend="+31.2%"
          />
        </div>
      </main>
    </div>
  );
};


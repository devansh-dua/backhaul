import { CarrierNavbar } from '../../components/Navbar';
import { RadarView } from '../../components/RadarView';
import { Cpu } from 'lucide-react';

export const RadarPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 font-sans">
      <CarrierNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Header Glass Panel */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="badge-purple">
              <Cpu size={12} />
              BACKHAUL RADAR
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit tracking-tight">
              Corridor Demand & Heatmap Radar
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-normal max-w-2xl">
              Surface real-time shipment demand clusters along your active route vector in real-time.
            </p>
          </div>
        </div>

        <RadarView />
      </main>
    </div>
  );
};


import { CarrierNavbar } from '../../components/Navbar';
import { WhatIfSimulatorCard } from '../../components/WhatIfSimulatorCard';
import { BarChart3 } from 'lucide-react';

export const WhatIfPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 font-sans">
      <CarrierNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Header Glass Panel */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="badge-purple">
              <BarChart3 size={12} />
              WHAT-IF ENGINE
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit tracking-tight">
              Scenario & Economics Simulator
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-normal max-w-2xl">
              Simulate real-time financial impact of route detours, fuel cost, payload weight & freight rate variations.
            </p>
          </div>
        </div>

        <WhatIfSimulatorCard />
      </main>
    </div>
  );
};


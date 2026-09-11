import { CarrierNavbar } from '../../components/Navbar';
import { MarketIntelligenceView } from '../../components/MarketIntelligenceView';
import { TrendingUp } from 'lucide-react';

export const MarketIntelligencePage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 font-sans">
      <CarrierNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Header Glass Panel */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="badge-purple">
              <TrendingUp size={12} />
              MARKET INTELLIGENCE
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit tracking-tight">
              Corridor Market Intelligence & Pricing
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-normal max-w-2xl">
              Real-time supply and demand metrics, average spot rates, and volume density.
            </p>
          </div>
        </div>

        <MarketIntelligenceView />
      </main>
    </div>
  );
};


import { Cpu, MapPin, CheckCircle2, Radio } from 'lucide-react';

export const RadarView = () => {
  const corridorDemands = [
    { city: 'Gurgaon (NH 48)', activeLoads: 3, weightTons: 6.8, avgRate: '₹4.5 / ton-km', matchScore: '94%' },
    { city: 'Neemrana Industrial Zone', activeLoads: 2, weightTons: 4.2, avgRate: '₹4.2 / ton-km', matchScore: '91%' },
    { city: 'Kotputli Checkpost Corridor', activeLoads: 4, weightTons: 9.5, avgRate: '₹4.8 / ton-km', matchScore: '89%' },
    { city: 'Shahpura Logistics Hub', activeLoads: 2, weightTons: 5.1, avgRate: '₹4.1 / ton-km', matchScore: '95%' }
  ];

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/20">
            <Radio size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-purple">BACKHAUL RADAR</span>
              <span className="text-xs font-semibold text-slate-500 font-sans">Live Demand Density</span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 font-outfit tracking-tight mt-0.5">
              Corridor Freight Demand Heatmap
            </h3>
          </div>
        </div>
        <span className="badge-emerald font-semibold">4 ACTIVE CORRIDOR HUBS</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {corridorDemands.map((hub, idx) => (
          <div key={idx} className="glass-card p-5 space-y-3 border-t-4 border-t-indigo-600">
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 font-outfit">
                <MapPin size={15} className="text-indigo-600" />
                <span>{hub.city}</span>
              </div>
              <span className="badge-emerald text-[11px] px-2 py-0.5">{hub.matchScore}</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-normal">Active Demand:</span>
                <span className="font-bold text-slate-900">{hub.activeLoads} Loads</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-normal">Total Volume:</span>
                <span className="font-bold text-slate-900">{hub.weightTons} Tons</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2">
                <span className="text-slate-500 font-normal">Avg Rate:</span>
                <span className="font-extrabold text-emerald-600 font-outfit">{hub.avgRate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


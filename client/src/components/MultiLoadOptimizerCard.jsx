import { useState } from 'react';
import { Sliders, Package, CheckCircle2, ShieldCheck, Layers } from 'lucide-react';

export const MultiLoadOptimizerCard = () => {
  const [vehicleCapacity] = useState(12.0);
  const [usedCapacity] = useState(4.2);
  const availableCapacity = vehicleCapacity - usedCapacity; // 7.8T

  const candidateLoads = [
    { id: 'A', name: 'Load A: Auto Parts (Gurgaon → Neemrana)', weight: 2.5, price: 7200, detour: 12, selected: true },
    { id: 'B', name: 'Load B: Electrical Kits (Manesar → Kotputli)', weight: 1.8, price: 5400, detour: 15, selected: true },
    { id: 'C', name: 'Load C: Machinery Hardware (Delhi → Jaipur)', weight: 3.2, price: 9100, detour: 8, selected: true },
    { id: 'D', name: 'Load D: FMCG Goods (Shahpura → Jaipur)', weight: 2.7, price: 6800, detour: 22, selected: false }
  ];

  const selectedLoads = candidateLoads.filter(l => l.selected);
  const totalWeight = selectedLoads.reduce((sum, l) => sum + l.weight, 0); // 7.5T
  const grossRevenue = selectedLoads.reduce((sum, l) => sum + l.price, 0); // 21,700
  const estCost = 2800;
  const netContribution = grossRevenue - estCost;

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/20">
            <Layers size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-purple">MULTI-LOAD OPTIMIZER</span>
              <span className="text-xs font-semibold text-slate-500 font-sans">Knapsack Algorithm</span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 font-outfit tracking-tight mt-0.5">
              Corridor Knapsack Load Combinator
            </h3>
          </div>
        </div>

        <span className="badge-emerald font-semibold">
          <ShieldCheck size={14} />
          OPTIMAL COMBINATION FOUND
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Candidate Loads List */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 font-outfit">
            CANDIDATE LOADS ALONG CORRIDOR
          </div>
          <div className="space-y-2.5">
            {candidateLoads.map((load) => (
              <div
                key={load.id}
                className={`glass-card p-4 flex items-center justify-between transition-all ${
                  load.selected ? 'border-purple-300 bg-purple-50/20 shadow-md' : 'opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={load.selected}
                    readOnly
                    className="accent-indigo-600 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 font-outfit">{load.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Weight: {load.weight}T · Detour: +{load.detour}km
                    </div>
                  </div>
                </div>
                <span className="font-extrabold text-xs text-slate-900 font-outfit">
                  ₹{load.price.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Multi-Load Economics Summary */}
        <div className="glass-card p-6 space-y-5 bg-gradient-to-br from-white/90 to-purple-50/30">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 font-outfit">
            COMBINED OPTIMIZATION METRICS
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700 font-outfit">
              <span>Capacity Utilisation ({totalWeight.toFixed(1)}T / {availableCapacity}T)</span>
              <span className="font-extrabold text-slate-900">96.1%</span>
            </div>
            <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden border border-slate-300/60">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full" style={{ width: '96.1%' }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="glass-panel p-4 bg-white/90">
              <div className="text-[10px] font-bold text-slate-500 uppercase font-outfit">Gross Revenue</div>
              <div className="text-lg font-extrabold text-slate-900 font-outfit mt-0.5">
                ₹{grossRevenue.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="glass-panel p-4 bg-white/90">
              <div className="text-[10px] font-bold text-slate-500 uppercase font-outfit">Net Contribution</div>
              <div className="text-lg font-extrabold text-emerald-600 font-outfit mt-0.5">
                +₹{netContribution.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


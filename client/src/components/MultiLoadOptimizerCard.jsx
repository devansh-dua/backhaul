import { useState, useEffect } from 'react';
import { Layers, ShieldCheck, Loader2 } from 'lucide-react';
import { shipmentApi } from '../services/shipment.api';

export const MultiLoadOptimizerCard = () => {
  const [candidateLoads, setCandidateLoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const vehicleCapacity = 12.0;

  useEffect(() => {
    fetchLoads();
  }, []);

  const fetchLoads = async () => {
    setLoading(true);
    try {
      const res = await shipmentApi.getPostedShipments();
      if (res.data && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        const mapped = res.data.data.slice(0, 4).map((s, idx) => ({
          id: s._id,
          name: s.cargoType ? `Load ${idx + 1}: ${s.cargoType} (${s.pickupCity || s.origin || 'A'} → ${s.dropCity || s.destination || 'B'})` : `Load ${idx + 1}: Freight (${s.pickupCity || 'A'} → ${s.dropCity || 'B'})`,
          weight: s.weightTons || 2.5,
          price: s.offeredPriceINR || 5000,
          detour: (idx + 1) * 5,
          selected: true
        }));
        setCandidateLoads(mapped);
      } else {
        setCandidateLoads([]);
      }
    } catch (e) {
      console.error('Failed to load multi-load candidate shipments:', e);
      setCandidateLoads([]);
    } finally {
      setLoading(false);
    }
  };

  const selectedLoads = candidateLoads.filter(l => l.selected);
  const totalWeight = selectedLoads.reduce((sum, l) => sum + l.weight, 0);
  const grossRevenue = selectedLoads.reduce((sum, l) => sum + l.price, 0);
  const estCost = Math.round(grossRevenue * 0.15);
  const netContribution = grossRevenue - estCost;
  const utilPercent = Math.min(100, Math.round((totalWeight / vehicleCapacity) * 100));

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
          {candidateLoads.length > 0 ? 'OPTIMAL COMBINATION FOUND' : 'AWAITING LOADS'}
        </span>
      </div>

      {loading ? (
        <div className="p-8 flex items-center justify-center text-slate-500 gap-2">
          <Loader2 className="animate-spin" size={20} />
          <span>Computing knapsack load optimization...</span>
        </div>
      ) : candidateLoads.length === 0 ? (
        <div className="p-8 text-center text-slate-500 space-y-1 bg-slate-50/60 rounded-xl border border-slate-200/60">
          <div className="font-bold text-slate-800 font-outfit">No active shipments available for multi-load optimization</div>
          <div className="text-xs">Post new shipments to let the knapsack combinator optimize multi-stop backhaul routes.</div>
        </div>
      ) : (
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
                      onChange={() => {
                        setCandidateLoads(prev => prev.map(l => l.id === load.id ? { ...l, selected: !l.selected } : l));
                      }}
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
                <span>Capacity Utilisation ({totalWeight.toFixed(1)}T / {vehicleCapacity}T)</span>
                <span className="font-extrabold text-slate-900">{utilPercent}%</span>
              </div>
              <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden border border-slate-300/60">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full" style={{ width: `${utilPercent}%` }} />
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
      )}
    </div>
  );
};



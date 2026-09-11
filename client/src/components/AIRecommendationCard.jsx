import { useState } from 'react';
import { Cpu, CheckCircle2, XCircle, ShieldCheck, Sparkles } from 'lucide-react';

export const AIRecommendationCard = ({ recommendationData, onAccept, onReject }) => {
  const [loading, setLoading] = useState(false);

  if (!recommendationData) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 text-center py-8">
        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
          <Sparkles size={20} />
        </div>
        <h3 className="text-base font-extrabold text-slate-900 font-outfit">
          AI Autopilot Plan Status
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          No active backhaul plan selected yet. Publish fleet capacity or post a shipment to run Gemini AI corridor optimization.
        </p>
      </div>
    );
  }

  const data = recommendationData;

  const handleAcceptClick = async () => {
    setLoading(true);
    if (onAccept) await onAccept(data);
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 sm:p-7 rounded-2xl border-2 border-blue-600 shadow-sm space-y-5 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="badge-purple">
              <Cpu size={14} /> AI AUTOPILOT RECOMMENDATION
            </span>
            <span className="badge-emerald font-semibold">
              <ShieldCheck size={14} /> {data.confidenceScore || 94}% CONFIDENCE
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-outfit tracking-tight">
            Accept {data.shipmentCount || 1} Compatible Corridor Shipment
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Truck: <strong className="text-slate-900 font-bold">{data.truck || data.vehicle?.registrationNumber || 'Fleet Vehicle'}</strong> | Route: <strong className="text-slate-900 font-bold">{data.route || 'Corridor Route'}</strong> | Capacity: <strong className="text-emerald-700 font-bold">{data.remainingCapacityTons || data.vehicle?.availableCapacityTons || 0}T Available</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onReject && (
            <button
              onClick={onReject}
              className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-200 transition-all cursor-pointer font-outfit flex items-center gap-1"
            >
              <XCircle size={15} className="text-slate-400" /> REJECT
            </button>
          )}
          
          <button
            onClick={handleAcceptClick}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer font-outfit flex items-center gap-1.5"
          >
            <CheckCircle2 size={16} /> {loading ? 'ACCEPTING PLAN...' : 'ACCEPT PLAN'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-center font-outfit">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase">Gross Revenue</div>
          <div className="text-base font-black text-slate-900 mt-0.5">₹{(data.grossRevenueINR || 0).toLocaleString('en-IN')}</div>
        </div>
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase">Est. Detour Cost</div>
          <div className="text-base font-black text-red-600 mt-0.5">-₹{(data.estimatedCostINR || 0).toLocaleString('en-IN')}</div>
        </div>
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase">Net Contribution</div>
          <div className="text-base font-black text-emerald-600 mt-0.5">+₹{(data.netContributionINR || 0).toLocaleString('en-IN')}</div>
        </div>
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase">Total Detour</div>
          <div className="text-base font-black text-blue-600 mt-0.5">{data.detourKm || 0} km</div>
        </div>
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase">Driver Hours</div>
          <div className="text-base font-black text-slate-900 mt-0.5">{data.driverHoursAvailable || 'Safe'}</div>
        </div>
      </div>

      {data.reasons && data.reasons.length > 0 && (
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2 font-outfit">
            WHY BACKHAULX RECOMMENDS THIS
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
            {data.reasons.map((r, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

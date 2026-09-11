import { useState, useEffect } from 'react';
import { MapPin, Radio, Loader2 } from 'lucide-react';
import { shipmentApi } from '../services/shipment.api';

export const RadarView = () => {
  const [hubs, setHubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRadarData();
  }, []);

  const fetchRadarData = async () => {
    setLoading(true);
    try {
      const res = await shipmentApi.getPostedShipments();
      if (res.data && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        // Group shipments by pickup city
        const cityMap = {};
        res.data.data.forEach((s) => {
          const city = s.pickupCity || s.origin || 'Corridor Hub';
          if (!cityMap[city]) {
            cityMap[city] = { city, activeLoads: 0, weightTons: 0, totalRate: 0, count: 0 };
          }
          cityMap[city].activeLoads += 1;
          cityMap[city].weightTons += s.weightTons || 0;
          cityMap[city].totalRate += s.offeredPriceINR || 0;
          cityMap[city].count += 1;
        });

        const aggregated = Object.values(cityMap).map((h) => ({
          city: h.city,
          activeLoads: h.activeLoads,
          weightTons: Number(h.weightTons.toFixed(1)),
          avgRate: `₹${Math.round(h.totalRate / (h.count || 1)).toLocaleString('en-IN')}`,
          matchScore: `${Math.min(98, 85 + h.activeLoads * 3)}%`
        }));
        setHubs(aggregated);
      } else {
        setHubs([]);
      }
    } catch (e) {
      console.error('Failed to load radar data:', e);
      setHubs([]);
    } finally {
      setLoading(false);
    }
  };

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
        <span className="badge-emerald font-semibold">{hubs.length} ACTIVE CORRIDOR HUBS</span>
      </div>

      {loading ? (
        <div className="p-8 flex items-center justify-center text-slate-500 gap-2">
          <Loader2 className="animate-spin" size={20} />
          <span>Scanning corridor demand radar...</span>
        </div>
      ) : hubs.length === 0 ? (
        <div className="p-8 text-center text-slate-500 space-y-1 bg-slate-50/60 rounded-xl border border-slate-200/60">
          <div className="font-bold text-slate-800 font-outfit">No active corridor freight demand detected on radar</div>
          <div className="text-xs">Post new shipments or publish capacity to populate real-time corridor heatmaps.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {hubs.map((hub, idx) => (
            <div key={idx} className="glass-card p-5 space-y-3 border-t-4 border-t-indigo-600">
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 font-outfit truncate">
                  <MapPin size={15} className="text-indigo-600 shrink-0" />
                  <span className="truncate">{hub.city}</span>
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
                  <span className="text-slate-500 font-normal">Avg Price:</span>
                  <span className="font-extrabold text-emerald-600 font-outfit">{hub.avgRate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};



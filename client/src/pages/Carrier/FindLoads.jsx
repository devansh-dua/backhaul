import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CarrierNavbar } from '../../components/Navbar';
import { Package, MapPin, DollarSign, Filter, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export const FindLoads = () => {
  const navigate = useNavigate();
  const [shipments] = useState([
    { id: '1', title: 'Auto Parts & Industrial Bearings', pickup: 'Gurgaon', drop: 'Neemrana', weight: 2.5, price: 7200, detour: 12, matchScore: '94%' },
    { id: '2', title: 'Precision Electrical Wiring Harness', pickup: 'Manesar', drop: 'Kotputli', weight: 1.8, price: 5400, detour: 15, matchScore: '91%' },
    { id: '3', title: 'Textile Machinery Spare Hardware', pickup: 'Delhi', drop: 'Jaipur', weight: 3.2, price: 9100, detour: 8, matchScore: '96%' },
    { id: '4', title: 'Consumer FMCG Cartons & Packaging', pickup: 'Shahpura', drop: 'Jaipur', weight: 2.7, price: 6800, detour: 22, matchScore: '88%' }
  ]);

  const handleSelectLoad = (shipment) => {
    navigate(`/tracking/demo_trip_${Date.now()}`);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 pb-16">
      <CarrierNavbar />

      <main className="max-w-6xl mx-auto px-6 pt-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
          <div className="space-y-1">
            <span className="text-xs font-mono tracking-widest uppercase text-zinc-400 font-semibold">
              Carrier Dispatch Marketplace
            </span>
            <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
              Available Return Trip Shipments
            </h1>
            <p className="text-xs text-zinc-500 max-w-xl">
              Compatible shipper orders along your active truck corridor rank-sorted by AI net profit margin.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-black text-white text-xs font-bold rounded-full">
              4 MATCHED FREIGHT ORDERS
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shipments.map((s) => (
            <div key={s.id} className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 hover:border-black transition-all shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-lg text-zinc-900">{s.title}</h3>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full">
                    {s.matchScore} MATCH
                  </span>
                </div>

                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 font-medium">Pickup → Drop City</span>
                    <strong className="text-zinc-900 font-semibold">{s.pickup} → {s.drop}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 font-medium">Freight Weight</span>
                    <strong className="text-zinc-900">{s.weight} Tons</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 font-medium">Corridor Detour</span>
                    <strong className="text-zinc-900">+{s.detour} km</strong>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-zinc-200">
                    <span className="text-zinc-500 font-medium">Offered Payout</span>
                    <strong className="text-base font-extrabold text-zinc-900">₹{s.price.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleSelectLoad(s)}
                className="w-full py-3 bg-black text-white font-bold text-sm rounded-xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Accept Freight Load & Launch Ride
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

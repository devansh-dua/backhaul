import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CarrierNavbar } from '../../components/Navbar';
import { Package, ChevronRight, CheckCircle2, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      <CarrierNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Header Glass Panel */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="badge-purple">
              <Sparkles size={12} />
              CARRIER DISPATCH MARKETPLACE
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit tracking-tight">
              Available Return Trip Shipments
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-normal max-w-2xl">
              Compatible shipper orders along your active corridor, rank-sorted by AI net contribution margin.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="badge-emerald">
              4 MATCHED FREIGHT ORDERS AVAILABLE
            </span>
          </div>
        </div>

        {/* Tech Table Glass Container */}
        <div className="glass-panel p-6 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="tech-table w-full">
              <thead>
                <tr>
                  <th>Freight Title</th>
                  <th>Corridor Route</th>
                  <th>Weight</th>
                  <th>Detour Distance</th>
                  <th>Offered Payout</th>
                  <th>AI Match</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((s) => (
                  <tr key={s.id} className="hover:bg-purple-50/40 transition-colors">
                    <td className="font-semibold text-slate-900 font-outfit">{s.title}</td>
                    <td className="font-medium text-slate-700">{s.pickup} → {s.drop}</td>
                    <td className="font-semibold text-slate-600">{s.weight} Tons</td>
                    <td className="font-semibold text-amber-600">+{s.detour} km</td>
                    <td className="font-extrabold text-slate-900 font-outfit text-base">₹{s.price.toLocaleString('en-IN')}</td>
                    <td>
                      <span className="badge-emerald font-semibold">{s.matchScore} Match</span>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => handleSelectLoad(s)}
                        className="btn-primary text-xs px-4 py-2 flex items-center justify-center gap-1.5 ml-auto"
                      >
                        Accept Load <ArrowRight size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};


import React, { useState } from 'react';
import { ShipperNavbar } from '../../components/Navbar';
import { Package, Truck, Compass, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyShipments = () => {
  const [shipments] = useState([
    { id: 's1', title: 'Auto Parts & Industrial Bearings', pickup: 'Gurgaon', drop: 'Neemrana', weight: 2.5, price: 7200, status: 'IN_TRANSIT', vehicle: 'RJ-104-5891' },
    { id: 's2', title: 'Precision Electrical Wiring Harness', pickup: 'Manesar', drop: 'Kotputli', weight: 1.8, price: 5400, status: 'MATCHED', vehicle: 'RJ-104-5891' },
    { id: 's3', title: 'Textile Machinery Spare Hardware', pickup: 'Delhi', drop: 'Jaipur', weight: 3.2, price: 9100, status: 'DELIVERED', vehicle: 'RJ-104-5891' }
  ]);

  return (
    <div className="min-h-screen bg-white text-zinc-900 pb-16">
      <ShipperNavbar />

      <main className="max-w-6xl mx-auto px-6 pt-8 space-y-8">
        <div className="pb-6 border-b border-zinc-200 space-y-1">
          <span className="text-xs font-mono tracking-widest uppercase text-zinc-400 font-semibold">
            Shipment Management
          </span>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
            My Active & Historical Shipments
          </h1>
          <p className="text-xs text-zinc-500 max-w-xl">
            Track shipment lifecycle statuses from initial posting to live transport and POD confirmation.
          </p>
        </div>

        <div className="space-y-4">
          {shipments.map((s) => (
            <div key={s.id} className="bg-white border border-zinc-200 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-black transition-all shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-black" />
                  <h3 className="font-extrabold text-base text-zinc-900">{s.title}</h3>
                  <span className={`px-2.5 py-0.5 text-xs font-extrabold rounded-full border ${
                    s.status === 'IN_TRANSIT' ? 'bg-zinc-900 text-white border-black' :
                    s.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    'bg-zinc-100 text-zinc-800 border-zinc-200'
                  }`}>
                    {s.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-500">
                  Corridor: <strong className="text-zinc-800">{s.pickup} → {s.drop}</strong> · Weight: <strong className="text-zinc-800">{s.weight} Tons</strong> · Assigned Vehicle: <strong className="text-zinc-900 font-mono">{s.vehicle}</strong>
                </p>
              </div>

              <div className="flex items-center gap-4 text-right">
                <div>
                  <div className="text-xs text-zinc-400 uppercase font-semibold">Offered Freight</div>
                  <div className="text-lg font-extrabold text-zinc-900">₹{s.price.toLocaleString('en-IN')}</div>
                </div>
                <Link
                  to={`/tracking/demo_trip_s1`}
                  className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:bg-zinc-800 flex items-center gap-1"
                >
                  Track Live GPS <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

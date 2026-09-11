import React, { useState } from 'react';
import { ShipperNavbar } from '../../components/Navbar';
import { Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyShipments = () => {
  const [shipments] = useState([
    { id: 's1', title: 'Auto Parts & Industrial Bearings', pickup: 'Gurgaon', drop: 'Neemrana', weight: 2.5, price: 7200, status: 'IN_TRANSIT', vehicle: 'RJ-104-5891' },
    { id: 's2', title: 'Precision Electrical Wiring Harness', pickup: 'Manesar', drop: 'Kotputli', weight: 1.8, price: 5400, status: 'MATCHED', vehicle: 'RJ-104-5891' },
    { id: 's3', title: 'Textile Machinery Spare Hardware', pickup: 'Delhi', drop: 'Jaipur', weight: 3.2, price: 9100, status: 'DELIVERED', vehicle: 'RJ-104-5891' }
  ]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 font-sans">
      <ShipperNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Header Glass Panel */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="badge-purple">
              <Package size={12} />
              SHIPMENT MANAGEMENT
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit tracking-tight">
              My Active & Historical Shipments
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-normal max-w-2xl">
              Track shipment lifecycle statuses from initial posting to live transport and POD confirmation.
            </p>
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
                  <th>Assigned Vehicle</th>
                  <th>Offered Rate</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((s) => (
                  <tr key={s.id} className="hover:bg-purple-50/40 transition-colors">
                    <td className="font-semibold text-slate-900 font-outfit">{s.title}</td>
                    <td className="font-medium text-slate-700">{s.pickup} → {s.drop}</td>
                    <td className="font-semibold text-slate-600">{s.weight} Tons</td>
                    <td className="font-semibold text-slate-900 font-outfit">{s.vehicle}</td>
                    <td className="font-extrabold text-slate-900 font-outfit text-base">₹{s.price.toLocaleString('en-IN')}</td>
                    <td>
                      <span className={
                        s.status === 'IN_TRANSIT' ? 'badge-purple' :
                        s.status === 'DELIVERED' ? 'badge-emerald' : 'badge-cyan'
                      }>
                        {s.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <Link
                        to={`/tracking/demo_trip_s1`}
                        className="btn-primary text-xs px-3.5 py-1.5 inline-flex items-center gap-1.5"
                      >
                        Track Live <ArrowRight size={13} />
                      </Link>
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


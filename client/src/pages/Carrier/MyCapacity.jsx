import React, { useState } from 'react';
import { CarrierNavbar } from '../../components/Navbar';
import { Truck, Plus, ShieldCheck } from 'lucide-react';

export const MyCapacity = () => {
  const [capacities] = useState([
    {
      id: 'cap1',
      registrationNumber: 'RJ-104-5891',
      origin: 'Delhi',
      destination: 'Jaipur',
      availableCapacityTons: 7.8,
      totalCapacityTons: 12.0,
      departureTime: '06:30 PM',
      driverHoursAvailable: '6h 20m',
      status: 'OPEN_BACKHAUL'
    },
    {
      id: 'cap2',
      registrationNumber: 'MH-12-9982',
      origin: 'Mumbai',
      destination: 'Satara',
      availableCapacityTons: 6.2,
      totalCapacityTons: 10.0,
      departureTime: '08:00 PM',
      driverHoursAvailable: '7h 15m',
      status: 'OPEN_BACKHAUL'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      <CarrierNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Header Glass Panel */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="badge-purple">
              <Truck size={14} /> FLEET CAPACITY MANAGEMENT
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit tracking-tight">
              Published Vehicle Capacity Slots
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-normal max-w-2xl">
              Publish unused return truck capacity to receive automated AI backhaul freight proposals.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary text-xs px-4 py-2.5 flex items-center gap-1.5"
          >
            <Plus size={16} /> Publish Capacity Slot
          </button>
        </div>

        {showAddForm && (
          <div className="glass-card p-6 sm:p-8 rounded-2xl space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 font-outfit">Publish Available Return Slot</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-outfit">Registration Number</label>
                <input type="text" defaultValue="KA-01-4410" className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-outfit">Corridor Route</label>
                <input type="text" defaultValue="Bangalore → Hyderabad" className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-outfit">Capacity (Tons)</label>
                <input type="number" defaultValue="9.5" className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors" />
              </div>
            </div>
            <button
              onClick={() => { setShowAddForm(false); }}
              className="btn-emerald text-xs px-5 py-2.5"
            >
              Confirm & Start AI Matching
            </button>
          </div>
        )}

        {/* Capacity Data Table */}
        <div className="glass-panel p-6 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="tech-table w-full">
              <thead>
                <tr>
                  <th>Registration</th>
                  <th>Corridor Route</th>
                  <th>Available Capacity</th>
                  <th>Departure Time</th>
                  <th>Driver Safe Hours</th>
                  <th className="text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {capacities.map((cap) => (
                  <tr key={cap.id} className="hover:bg-purple-50/40 transition-colors">
                    <td className="font-extrabold text-slate-900 font-outfit">{cap.registrationNumber}</td>
                    <td className="font-medium text-slate-700">{cap.origin} → {cap.destination}</td>
                    <td className="font-extrabold text-emerald-600 font-outfit">{cap.availableCapacityTons} / {cap.totalCapacityTons} Tons</td>
                    <td className="text-xs text-slate-500 font-normal">{cap.departureTime}</td>
                    <td className="font-bold text-slate-900 font-outfit text-xs">{cap.driverHoursAvailable}</td>
                    <td className="text-right">
                      <span className="badge-emerald font-semibold">{cap.status}</span>
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


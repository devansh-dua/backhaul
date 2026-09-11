import React, { useState } from 'react';
import { CarrierNavbar } from '../../components/Navbar';
import { Truck, Plus, Calendar, Clock, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';

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
    <div className="min-h-screen bg-white text-zinc-900 pb-16">
      <CarrierNavbar />

      <main className="max-w-6xl mx-auto px-6 pt-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
          <div className="space-y-1">
            <span className="text-xs font-mono tracking-widest uppercase text-zinc-400 font-semibold">
              Fleet Capacity Management
            </span>
            <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
              Published Vehicle Capacity Slots
            </h1>
            <p className="text-xs text-zinc-500 max-w-xl">
              Publish unused return truck capacity to receive automated AI backhaul freight proposals.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" />
            Publish New Capacity Slot
          </button>
        </div>

        {showAddForm && (
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 space-y-4 animate-in fade-in">
            <h3 className="text-base font-bold text-zinc-900">Publish Available Return Slot</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Truck Reg Number</label>
                <input type="text" defaultValue="KA-01-4410" className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-sm font-semibold" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Origin → Destination</label>
                <input type="text" defaultValue="Bangalore → Hyderabad" className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-sm font-semibold" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Available Capacity (Tons)</label>
                <input type="number" defaultValue="9.5" className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-sm font-semibold" />
              </div>
            </div>
            <button
              onClick={() => { alert('Capacity published successfully!'); setShowAddForm(false); }}
              className="px-5 py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-zinc-800"
            >
              Confirm & Start Matching
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {capacities.map((cap) => (
            <div key={cap.id} className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 hover:border-black transition-all shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-black" />
                  <span className="font-extrabold text-lg text-zinc-900 font-mono">{cap.registrationNumber}</span>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full">
                  {cap.status}
                </span>
              </div>

              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 font-medium">Corridor Route</span>
                  <strong className="text-zinc-900 font-bold">{cap.origin} → {cap.destination}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 font-medium">Available Freight Slot</span>
                  <strong className="text-emerald-600 font-bold">{cap.availableCapacityTons} / {cap.totalCapacityTons} Tons</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 font-medium">Driver Safe Hours</span>
                  <strong className="text-zinc-900">{cap.driverHoursAvailable}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

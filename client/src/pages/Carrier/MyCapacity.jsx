import React, { useState, useEffect } from 'react';
import { CarrierNavbar } from '../../components/Navbar';
import { capacityApi } from '../../services/capacity.api';
import { vehicleApi } from '../../services/vehicle.api';
import { Truck, Plus, ShieldCheck, Inbox, CheckCircle2 } from 'lucide-react';

export const MyCapacity = () => {
  const [capacities, setCapacities] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [form, setForm] = useState({
    vehicleId: '',
    registrationNumber: '',
    origin: '',
    destination: '',
    availableCapacityTons: '',
    departureTime: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const resCap = await capacityApi.getCarrierCapacities();
      if (resCap.data && resCap.data.success && Array.isArray(resCap.data.data)) {
        setCapacities(resCap.data.data);
      } else {
        setCapacities([]);
      }

      const resVeh = await vehicleApi.getCarrierVehicles();
      if (resVeh.data && resVeh.data.success && Array.isArray(resVeh.data.data)) {
        setVehicles(resVeh.data.data);
      }
    } catch (e) {
      setCapacities([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishSubmit = async (e) => {
    e.preventDefault();
    try {
      let selectedVeh = vehicles.find(v => v._id === form.vehicleId) || vehicles[0];
      if (!selectedVeh) {
        const createVehRes = await vehicleApi.createVehicle({
          registrationNumber: form.registrationNumber,
          totalCapacityTons: parseFloat(form.availableCapacityTons) + 2.5,
          usedCapacityTons: 0,
          currentCity: form.origin,
          destinationCity: form.destination
        });
        selectedVeh = createVehRes.data?.data;
      }

      await capacityApi.publishCapacity({
        vehicle: selectedVeh?._id,
        origin: form.origin,
        destination: form.destination,
        availableDate: new Date(),
        availableCapacityTons: parseFloat(form.availableCapacityTons),
        totalCapacityTons: parseFloat(form.availableCapacityTons) + 2.5,
        departureTime: form.departureTime
      });

      setShowAddForm(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      <CarrierNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Header Panel */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 font-outfit cursor-pointer self-start sm:self-auto"
          >
            <Plus size={16} /> Publish Capacity Slot
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 font-outfit">Publish Available Return Slot</h3>
            <form onSubmit={handlePublishSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-outfit">Vehicle Registration</label>
                  <input 
                    type="text" 
                    value={form.registrationNumber}
                    onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-outfit">Origin City</label>
                  <input 
                    type="text" 
                    value={form.origin}
                    onChange={(e) => setForm({ ...form, origin: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-outfit">Destination City</label>
                  <input 
                    type="text" 
                    value={form.destination}
                    onChange={(e) => setForm({ ...form, destination: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-outfit">Capacity (Tons)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={form.availableCapacityTons}
                    onChange={(e) => setForm({ ...form, availableCapacityTons: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500" 
                    required 
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs font-outfit cursor-pointer"
              >
                Confirm & Start AI Matching
              </button>
            </form>
          </div>
        )}

        {/* Capacity Data Table or Empty State */}
        {capacities.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Inbox size={24} />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 font-outfit">
              No active capacity slots published
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              Publish your first return trip capacity slot above to receive Gemini AI matched backhaul shipments.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="tech-table w-full">
                <thead>
                  <tr>
                    <th>Registration</th>
                    <th>Corridor Route</th>
                    <th>Available Capacity</th>
                    <th>Departure Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {capacities.map((cap) => (
                    <tr key={cap._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="font-extrabold text-slate-900 font-outfit">{cap.vehicle?.registrationNumber || 'REG-104'}</td>
                      <td className="font-medium text-slate-700">{cap.origin} → {cap.destination}</td>
                      <td className="font-extrabold text-emerald-600 font-outfit">{cap.availableCapacityTons} / {cap.totalCapacityTons || 10} Tons</td>
                      <td className="text-xs text-slate-500 font-normal">{cap.departureTime || '06:30 PM'}</td>
                      <td>
                        <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200 font-outfit">
                          {cap.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

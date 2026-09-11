import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShipperNavbar } from '../../components/Navbar';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { Truck, MapPin, Search, Loader2, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export const FindCapacity = () => {
  const { user } = useAuth();
  const { requestTruckBooking, bookingStatus, confirmedBooking, clearBookingState } = useSocket();
  const navigate = useNavigate();

  const [pickupCity, setPickupCity] = useState('Delhi');
  const [dropCity, setDropCity] = useState('Jaipur');
  const [weightTons, setWeightTons] = useState(3.5);

  const [availableTrucks] = useState([
    {
      id: 't1',
      reg: 'RJ-104-5891',
      carrier: 'Apex Express Logistics',
      mainRoute: 'Delhi → Jaipur Corridor',
      origin: 'Delhi',
      destination: 'Jaipur',
      availableCapacity: 7.8,
      totalCapacity: 12.0,
      matchScore: 96,
      detourKm: 8,
      offeredPrice: 14500,
      carrierId: 'carrier_demo_1'
    },
    {
      id: 't2',
      reg: 'MH-12-9982',
      carrier: 'Sahyadri Freight Carriers',
      mainRoute: 'Mumbai → Pune → Satara Corridor',
      origin: 'Mumbai',
      destination: 'Satara',
      availableCapacity: 6.2,
      totalCapacity: 10.0,
      matchScore: 94,
      detourKm: 14,
      offeredPrice: 18200,
      carrierId: 'carrier_demo_2'
    },
    {
      id: 't3',
      reg: 'KA-01-4410',
      carrier: 'Deccan Express Logistics',
      mainRoute: 'Bangalore → Hyderabad Corridor',
      origin: 'Bangalore',
      destination: 'Hyderabad',
      availableCapacity: 9.5,
      totalCapacity: 16.0,
      matchScore: 91,
      detourKm: 22,
      offeredPrice: 24000,
      carrierId: 'carrier_demo_3'
    }
  ]);

  useEffect(() => {
    if (confirmedBooking && confirmedBooking.tripId) {
      navigate(`/tracking/${confirmedBooking.tripId}`);
    }
  }, [confirmedBooking, navigate]);

  const handleBookTruck = (truck) => {
    requestTruckBooking({
      shipperId: user?._id || 'demo_shipper_1',
      shipperName: user?.name || 'Enterprise Shipper',
      carrierId: truck.carrierId,
      vehicleId: truck.id,
      vehicleRegistration: truck.reg,
      pickupCity: pickupCity || truck.origin,
      dropCity: dropCity || truck.destination,
      route: `${pickupCity || truck.origin} → ${dropCity || truck.destination}`,
      weightTons: Number(weightTons),
      offeredPriceINR: truck.offeredPrice,
      detourKm: truck.detourKm,
      matchScore: truck.matchScore
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      <ShipperNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Header Glass Panel */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="badge-purple">
              <Truck size={12} />
              REAL-TIME CAPACITY EXCHANGE
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit tracking-tight">
              Find Verified Return Trips & Empty Capacity
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-normal max-w-2xl">
              Search return-journey trucks moving along your destination corridor and book available payload in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="badge-emerald font-semibold">
              {availableTrucks.length} CORRIDOR TRUCKS AVAILABLE
            </span>
          </div>
        </div>

        {/* Filter Bar Glass Panel */}
        <div className="glass-panel p-5 rounded-2xl grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 font-outfit mb-1">Pickup City</label>
            <input
              type="text"
              value={pickupCity}
              onChange={(e) => setPickupCity(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 font-outfit mb-1">Destination City</label>
            <input
              type="text"
              value={dropCity}
              onChange={(e) => setDropCity(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 font-outfit mb-1">Weight (Tons)</label>
            <input
              type="number"
              step="0.5"
              value={weightTons}
              onChange={(e) => setWeightTons(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex items-end">
            <button className="btn-primary w-full py-2 text-xs flex items-center justify-center gap-1.5">
              <Search size={14} />
              Filter Trucks
            </button>
          </div>
        </div>

        {/* Real-time Status Overlay Modal */}
        {bookingStatus === 'WAITING' && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
            <div className="glass-panel p-8 max-w-sm w-full text-center space-y-4 shadow-2xl bg-white/95 rounded-2xl">
              <Loader2 size={32} className="text-indigo-600 animate-spin mx-auto" />
              <div className="space-y-1.5">
                <h3 className="text-lg font-extrabold text-slate-900 font-outfit">Requesting Carrier Handshake...</h3>
                <p className="text-xs text-slate-600 font-normal">
                  Dispatching real-time Socket.IO booking request for route <span className="font-bold text-slate-900">{pickupCity} → {dropCity}</span>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Capacity Data Table */}
        <div className="glass-panel p-6 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="tech-table w-full">
              <thead>
                <tr>
                  <th>Vehicle & Carrier</th>
                  <th>Active Route</th>
                  <th>Available Capacity</th>
                  <th>Detour Distance</th>
                  <th>Guaranteed Rate</th>
                  <th>Match %</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {availableTrucks.map((truck) => (
                  <tr key={truck.id} className="hover:bg-purple-50/40 transition-colors">
                    <td>
                      <div className="font-bold text-slate-900 font-outfit text-sm">{truck.reg}</div>
                      <div className="text-xs text-slate-500 font-normal">{truck.carrier}</div>
                    </td>
                    <td className="font-medium text-slate-700">{truck.mainRoute}</td>
                    <td className="font-semibold text-slate-900 font-outfit">{truck.availableCapacity} / {truck.totalCapacity} Tons</td>
                    <td className="font-semibold text-amber-600">+{truck.detourKm} km</td>
                    <td className="font-extrabold text-slate-900 font-outfit text-base">₹{truck.offeredPrice.toLocaleString('en-IN')}</td>
                    <td>
                      <span className="badge-emerald font-semibold">{truck.matchScore}% Match</span>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => handleBookTruck(truck)}
                        disabled={bookingStatus === 'WAITING'}
                        className="btn-primary text-xs px-4 py-2 flex items-center justify-center gap-1.5 ml-auto disabled:opacity-50"
                      >
                        Book Truck <ArrowRight size={13} />
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


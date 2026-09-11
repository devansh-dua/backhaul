import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShipperNavbar } from '../../components/Navbar';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { Truck, MapPin, ArrowRight, ShieldCheck, Search, Loader2, Sparkles, AlertCircle } from 'lucide-react';

export const FindCapacity = () => {
  const { user } = useAuth();
  const { requestTruckBooking, bookingStatus, confirmedBooking, clearBookingState } = useSocket();
  const navigate = useNavigate();

  const [pickupCity, setPickupCity] = useState('Gurgaon');
  const [dropCity, setDropCity] = useState('Jaipur');
  const [weightTons, setWeightTons] = useState(3.5);
  const [requestingTruckId, setRequestingTruckId] = useState(null);

  // Available sample trucks across different interstate corridors
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
      detourKm: 14,
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
      detourKm: 18,
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
    setRequestingTruckId(truck.id);
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
    <div className="min-h-screen bg-white text-zinc-900 pb-16">
      <ShipperNavbar />

      <main className="max-w-6xl mx-auto px-6 pt-8 space-y-8">
        {/* Page Title & Search Bar */}
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-mono tracking-widest uppercase text-zinc-500 font-semibold">
              Community Logistics Exchange · Real-time Booking
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
              Find Verified Return Trips & Empty Capacity
            </h1>
            <p className="text-sm text-zinc-500 max-w-2xl">
              Search return-journey trucks traveling along your corridor and book unused capacity like Uber in real-time.
            </p>
          </div>

          {/* Search Inputs */}
          <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-4 shadow-sm">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                Pickup City / Hub
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={pickupCity}
                  onChange={(e) => setPickupCity(e.target.value)}
                  placeholder="e.g. Gurgaon / Delhi / Pune"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-zinc-300 rounded-xl text-sm font-semibold focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                Drop Destination
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={dropCity}
                  onChange={(e) => setDropCity(e.target.value)}
                  placeholder="e.g. Jaipur / Satara / Chennai"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-zinc-300 rounded-xl text-sm font-semibold focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                Cargo Weight (Tons)
              </label>
              <input
                type="number"
                step="0.5"
                value={weightTons}
                onChange={(e) => setWeightTons(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-sm font-semibold focus:outline-none focus:border-black"
              />
            </div>

            <div className="flex items-end">
              <button className="w-full py-2.5 bg-black text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2">
                <Search className="w-4 h-4" />
                Filter Corridor Trucks
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Status Overlay Modal for Shipper */}
        {bookingStatus === 'WAITING' && (
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto">
                <Loader2 className="w-6 h-6 text-black animate-spin" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-zinc-900">Requesting Carrier Approval...</h3>
                <p className="text-xs text-zinc-500">
                  Sending booking proposal to carrier for route <strong className="text-zinc-800">{pickupCity} → {dropCity}</strong>.
                </p>
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-xs text-zinc-600">
                ⚡ Real-time Socket.IO handshake active. Waiting for carrier response...
              </div>
            </div>
          </div>
        )}

        {bookingStatus === 'REJECTED' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between text-red-700 text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>Carrier declined the request. You can try requesting another return truck below.</span>
            </div>
            <button onClick={clearBookingState} className="px-3 py-1 bg-red-100 rounded-lg text-xs font-bold hover:bg-red-200">
              Dismiss
            </button>
          </div>
        )}

        {/* Truck Listings */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-zinc-900">
            Matching Empty Return Trucks ({availableTrucks.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {availableTrucks.map((truck) => (
              <div key={truck.id} className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-4 hover:border-black transition-all shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-black" />
                      <span className="font-bold text-lg text-zinc-900">{truck.reg}</span>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full">
                      {truck.matchScore}% MATCH
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-zinc-600">
                    <p className="font-semibold text-zinc-900">{truck.carrier}</p>
                    <p className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                      Main Route: <strong className="text-zinc-800">{truck.mainRoute}</strong>
                    </p>
                  </div>

                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Connected Pickup:</span>
                      <strong className="text-zinc-900">{pickupCity}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Connected Drop:</span>
                      <strong className="text-zinc-900">{dropCity}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Available Capacity:</span>
                      <strong className="text-emerald-600">{truck.availableCapacity} / {truck.totalCapacity} Tons</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Corridor Detour:</span>
                      <strong className="text-zinc-900">+{truck.detourKm} km</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500 font-medium">Guaranteed Freight Price</span>
                    <span className="text-lg font-extrabold text-zinc-900">₹{truck.offeredPrice.toLocaleString('en-IN')}</span>
                  </div>

                  <button
                    onClick={() => handleBookTruck(truck)}
                    disabled={bookingStatus === 'WAITING'}
                    className="w-full py-3 bg-black text-white font-bold text-sm rounded-xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    Book Return Truck Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

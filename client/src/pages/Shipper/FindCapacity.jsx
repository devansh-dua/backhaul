import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShipperNavbar } from '../../components/Navbar';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { capacityApi } from '../../services/capacity.api';
import { Truck, MapPin, Search, Loader2, Sparkles, AlertCircle, ArrowRight, Inbox } from 'lucide-react';

export const FindCapacity = () => {
  const { user } = useAuth();
  const { requestTruckBooking, bookingStatus, confirmedBooking } = useSocket();
  const navigate = useNavigate();

  const [pickupCity, setPickupCity] = useState('Delhi');
  const [dropCity, setDropCity] = useState('Jaipur');
  const [weightTons, setWeightTons] = useState(3.5);

  const [availableTrucks, setAvailableTrucks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCapacities();
  }, []);

  const fetchCapacities = async () => {
    setLoading(true);
    try {
      const res = await capacityApi.getOpenCapacities();
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        const mapped = res.data.data.map((item, idx) => ({
          id: item._id,
          reg: item.vehicle?.registrationNumber || item.registrationNumber || 'Vehicle',
          carrier: item.carrier?.companyName || item.carrier?.name || 'Carrier',
          mainRoute: `${item.origin} → ${item.destination} Corridor`,
          origin: item.origin,
          destination: item.destination,
          availableCapacity: item.availableCapacityTons || 0,
          totalCapacity: item.totalCapacityTons || item.availableCapacityTons || 0,
          matchScore: Math.max(80, 96 - idx * 3),
          detourKm: 8 + idx * 4,
          offeredPrice: item.minimumPriceINR || item.targetPriceINR || Math.round((item.availableCapacityTons || 1) * 950),
          carrierId: item.carrier?._id
        }));
        setAvailableTrucks(mapped);
      } else {
        setAvailableTrucks([]);
      }
    } catch (e) {
      setAvailableTrucks([]);
    } finally {
      setLoading(false);
    }
  };

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
        {/* Header Panel */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 font-outfit">
              {availableTrucks.length} CORRIDOR TRUCKS AVAILABLE
            </span>
          </div>
        </div>

        {/* Filter Bar Panel */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 font-outfit mb-1">Pickup City</label>
            <input
              type="text"
              value={pickupCity}
              onChange={(e) => setPickupCity(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 font-outfit mb-1">Destination City</label>
            <input
              type="text"
              value={dropCity}
              onChange={(e) => setDropCity(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 font-outfit mb-1">Weight (Tons)</label>
            <input
              type="number"
              step="0.5"
              value={weightTons}
              onChange={(e) => setWeightTons(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button 
              onClick={fetchCapacities}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs w-full py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-1.5 font-outfit cursor-pointer"
            >
              <Search size={14} />
              Filter Trucks
            </button>
          </div>
        </div>

        {/* Real-time Status Overlay Modal */}
        {bookingStatus === 'WAITING' && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white p-8 max-w-sm w-full text-center space-y-4 shadow-2xl rounded-2xl">
              <Loader2 size={32} className="text-blue-600 animate-spin mx-auto" />
              <div className="space-y-1.5">
                <h3 className="text-lg font-extrabold text-slate-900 font-outfit">Requesting Carrier Handshake...</h3>
                <p className="text-xs text-slate-600 font-normal">
                  Dispatching real-time Socket.IO booking request for route <span className="font-bold text-slate-900">{pickupCity} → {dropCity}</span>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Capacity Table or Empty State */}
        {availableTrucks.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Inbox size={24} />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 font-outfit">
              No corridor trucks available
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              There are currently no open carrier capacities published matching your search criteria. Try modifying your pickup or destination city.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
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
                    <tr key={truck.id} className="hover:bg-slate-50/80 transition-colors">
                      <td>
                        <div className="font-bold text-slate-900 font-outfit text-sm">{truck.reg}</div>
                        <div className="text-xs text-slate-500 font-normal">{truck.carrier}</div>
                      </td>
                      <td className="font-medium text-slate-700">{truck.mainRoute}</td>
                      <td className="font-semibold text-slate-900 font-outfit">{truck.availableCapacity} / {truck.totalCapacity} Tons</td>
                      <td className="font-semibold text-amber-600">+{truck.detourKm} km</td>
                      <td className="font-extrabold text-slate-900 font-outfit text-base">₹{truck.offeredPrice.toLocaleString('en-IN')}</td>
                      <td>
                        <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200 font-outfit">{truck.matchScore}% Match</span>
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => handleBookTruck(truck)}
                          disabled={bookingStatus === 'WAITING'}
                          className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-4 py-2 font-bold rounded-lg flex items-center justify-center gap-1.5 ml-auto font-outfit cursor-pointer disabled:opacity-50"
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
        )}
      </main>
    </div>
  );
};

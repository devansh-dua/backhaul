import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShipperNavbar } from '../../components/Navbar';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { capacityApi } from '../../services/capacity.api';
import { Truck, MapPin, Search, Loader2, Sparkles, AlertCircle, ArrowRight, Inbox, CheckCircle2 } from 'lucide-react';

export const FindCapacity = () => {
  const { user } = useAuth();
  const { requestTruckBooking, bookingStatus, confirmedBooking } = useSocket();
  const navigate = useNavigate();

  const [pickupCity, setPickupCity] = useState('Delhi');
  const [dropCity, setDropCity] = useState('Jaipur');
  const [weightTons, setWeightTons] = useState(2.5);

  const [availableTrucks, setAvailableTrucks] = useState([]);
  const [diagnostics, setDiagnostics] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('bestMatch');

  useEffect(() => {
    fetchCapacities();
  }, []);

  const fetchCapacities = async () => {
    setLoading(true);
    setStatusMessage('Searching compatible capacity...');
    try {
      const res = await capacityApi.searchCapacities({
        pickupLocation: pickupCity,
        dropLocation: dropCity,
        weightTons: Number(weightTons) || 2.5,
        shipmentType: 'General Cargo',
        pickupDate: 'Today'
      });

      if (res.data && res.data.success && Array.isArray(res.data.candidates)) {
        setDiagnostics(res.data.diagnostics || null);
        const mapped = res.data.candidates.map((item) => ({
          id: item.capacityId || item._id,
          reg: item.vehicleNumber || 'Vehicle',
          carrier: item.carrierName || 'Verified Carrier',
          mainRoute: item.plannedRoute || `${item.pickupLocation} → ${item.dropLocation}`,
          origin: item.pickupLocation,
          destination: item.dropLocation,
          availableCapacity: item.availableCapacity || 0,
          totalCapacity: item.vehicleCapacity || item.availableCapacity || 10,
          matchScore: item.matchScore || 85,
          detourKm: item.totalDetourKm || 0,
          offeredPrice: item.estimatedPrice || 7800,
          carrierId: item.carrierId,
          matchReasons: item.matchReasons || []
        }));
        setAvailableTrucks(mapped);
        const totalChecked = res.data.diagnostics?.totalChecked || mapped.length;
        setStatusMessage(`${totalChecked} capacity slots checked • ${mapped.length} compatible candidates found`);
      } else {
        setAvailableTrucks([]);
        setDiagnostics(res.data?.diagnostics || null);
        setStatusMessage('No compatible capacity options found');
      }
    } catch (e) {
      setAvailableTrucks([]);
      setStatusMessage('');
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

  const sortedTrucks = [...availableTrucks].sort((a, b) => {
    if (sortBy === 'bestMatch') return b.matchScore - a.matchScore;
    if (sortBy === 'lowestPrice') return a.offeredPrice - b.offeredPrice;
    if (sortBy === 'lowestDetour') return a.detourKm - b.detourKm;
    if (sortBy === 'highestCapacity') return b.availableCapacity - a.availableCapacity;
    return 0;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      <ShipperNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Header Panel */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="badge-purple flex items-center gap-1 w-fit">
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
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
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

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 font-outfit mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
            >
              <option value="bestMatch">Best Match</option>
              <option value="lowestPrice">Lowest Price</option>
              <option value="lowestDetour">Lowest Detour</option>
              <option value="highestCapacity">Highest Capacity</option>
            </select>
          </div>

          <div>
            <button 
              onClick={fetchCapacities}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs w-full py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-1.5 font-outfit cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
              Filter Capacity
            </button>
          </div>
        </div>

        {statusMessage && (
          <div className="bg-slate-100 border border-slate-200 p-3 rounded-xl text-xs font-semibold text-slate-700 text-center font-outfit">
            ⚡ {statusMessage}
          </div>
        )}

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

        {/* Capacity Table or Diagnostic Empty State */}
        {sortedTrucks.length === 0 ? (
          <div className="bg-white p-10 sm:p-12 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-4 max-w-2xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <Inbox size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-slate-900 font-outfit">
                No compatible vehicle capacity found
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                No published capacity currently meets all criteria for <span className="font-bold text-slate-800">{pickupCity} → {dropCity} ({weightTons}T)</span>.
              </p>
            </div>

            {diagnostics && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-2 text-xs">
                <div className="font-bold text-slate-800 uppercase text-[10px] tracking-wider font-outfit">
                  Matching Diagnostics (Checked {diagnostics.totalChecked || 0} Capacity Slots):
                </div>
                <ul className="space-y-1 text-slate-600 font-medium list-disc list-inside">
                  {diagnostics.failedRouteCount > 0 && (
                    <li><span className="font-bold text-slate-800">{diagnostics.failedRouteCount}</span> failed route compatibility / detour threshold</li>
                  )}
                  {diagnostics.failedCapacityCount > 0 && (
                    <li><span className="font-bold text-slate-800">{diagnostics.failedCapacityCount}</span> failed capacity requirement (&lt; {weightTons}T)</li>
                  )}
                  {diagnostics.failedTimeCount > 0 && (
                    <li><span className="font-bold text-slate-800">{diagnostics.failedTimeCount}</span> failed pickup window</li>
                  )}
                  {diagnostics.failedDriverCount > 0 && (
                    <li><span className="font-bold text-slate-800">{diagnostics.failedDriverCount}</span> failed driver availability or rest status</li>
                  )}
                </ul>
              </div>
            )}

            <button
              onClick={() => navigate('/shipper/post-shipment')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-xs inline-flex items-center gap-1.5 font-outfit cursor-pointer"
            >
              Post Shipment & Get Notified <ArrowRight size={14} />
            </button>
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
                    <th>Estimated Price</th>
                    <th>Match Score</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTrucks.map((truck) => (
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

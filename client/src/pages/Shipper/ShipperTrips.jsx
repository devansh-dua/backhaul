import { useState, useEffect } from 'react';
import { ShipperNavbar } from '../../components/Navbar';
import { LiveTrackingMap } from '../../components/LiveTrackingMap';
import { tripApi } from '../../services/trip.api';
import { Compass, Inbox, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ShipperTrips = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await tripApi.getMyTrips();
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        setTrips(res.data.data);
        if (res.data.data.length > 0) {
          setActiveTrip(res.data.data[0]);
        }
      } else {
        setTrips([]);
      }
    } catch (e) {
      console.error('Failed to load shipper trips:', e);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      <ShipperNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Header Glass Panel */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="badge-purple">
              <Compass size={12} />
              LIVE SHIPMENT TELEMETRY
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit tracking-tight">
              Active Freight Tracking & Dispatch
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-normal max-w-2xl">
              Real-time GPS Socket.IO telemetry for active carrier transport along your corridor.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex items-center justify-center text-slate-500 gap-2 bg-white rounded-2xl border border-slate-200">
            <Loader2 className="animate-spin" size={24} />
            <span>Loading active shipments telemetry...</span>
          </div>
        ) : trips.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Inbox size={24} />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 font-outfit">
              No active or historical trips found
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              Post a shipment to get started with live corridor matching and GPS telemetry.
            </p>
            <button
              onClick={() => navigate('/shipper/post')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs inline-flex items-center gap-1 font-outfit cursor-pointer mt-2"
            >
              Post New Shipment <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {activeTrip && <LiveTrackingMap tripId={activeTrip._id} />}

            {/* List of Shipper Active Trips */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 font-outfit">
                Your Dispatched Freight ({trips.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="tech-table w-full">
                  <thead>
                    <tr>
                      <th>Trip Route</th>
                      <th>Carrier</th>
                      <th>Freight Fee</th>
                      <th>Status</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trips.map((t) => (
                      <tr key={t._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="font-extrabold text-slate-900 font-outfit">{t.origin} → {t.destination}</td>
                        <td className="font-semibold text-slate-700">{t.carrier?.companyName || t.carrier?.name || 'Carrier'}</td>
                        <td className="font-extrabold text-slate-900 font-outfit">₹{(t.grossRevenueINR || 0).toLocaleString('en-IN')}</td>
                        <td>
                          <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200 font-outfit">
                            {t.status}
                          </span>
                        </td>
                        <td className="text-right">
                          <button
                            onClick={() => setActiveTrip(t)}
                            className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-3.5 py-1.5 rounded-lg font-outfit cursor-pointer"
                          >
                            Track Live
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};



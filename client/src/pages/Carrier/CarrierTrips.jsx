import { useState, useEffect } from 'react';
import { CarrierNavbar } from '../../components/Navbar';
import { LiveTrackingMap } from '../../components/LiveTrackingMap';
import { ProofOfDeliveryModal } from '../../components/ProofOfDeliveryModal';
import { tripApi } from '../../services/trip.api';
import { Compass, CheckCircle2, Inbox, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CarrierTrips = () => {
  const navigate = useNavigate();
  const [showPodModal, setShowPodModal] = useState(false);
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
      setTrips([]);
    } finally {
      setLoading(false);
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
              <Compass size={12} />
              ACTIVE CORRIDOR FLEET DISPATCH
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit tracking-tight">
              Active Trips & Telemetry
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-normal max-w-2xl">
              Real-time Socket.IO vehicle telemetry, live route tracking, and digital Proof of Delivery.
            </p>
          </div>

          {activeTrip && (
            <button
              onClick={() => setShowPodModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs font-outfit self-start sm:self-auto"
            >
              <CheckCircle2 size={15} /> File Proof of Delivery (POD)
            </button>
          )}
        </div>

        {trips.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Inbox size={24} />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 font-outfit">
              No active or historical trips found
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              Accept a backhaul shipment opportunity to launch your first tracked return trip.
            </p>
            <button
              onClick={() => navigate('/carrier/loads')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs inline-flex items-center gap-1 font-outfit cursor-pointer mt-2"
            >
              Browse Shipment Opportunities <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <LiveTrackingMap tripId={activeTrip?._id || 'demo_trip_101'} />

            {/* List of Carrier Trips */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 font-outfit">
                All Fleet Dispatched Trips ({trips.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="tech-table w-full">
                  <thead>
                    <tr>
                      <th>Trip Route</th>
                      <th>Vehicle</th>
                      <th>Gross Revenue</th>
                      <th>Status</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trips.map((t) => (
                      <tr key={t._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="font-extrabold text-slate-900 font-outfit">{t.origin} → {t.destination}</td>
                        <td className="font-semibold text-slate-700">{t.vehicle?.registrationNumber || 'Vehicle'}</td>
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
                            View Telemetry
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

        <ProofOfDeliveryModal
          isOpen={showPodModal}
          onClose={() => setShowPodModal(false)}
          onConfirmed={() => {
            fetchTrips();
            setShowPodModal(false);
          }}
        />
      </main>
    </div>
  );
};

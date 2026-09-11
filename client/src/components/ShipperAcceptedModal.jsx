import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { CheckCircle2, ArrowRight, X, Truck, Navigation } from 'lucide-react';

export const ShipperAcceptedModal = () => {
  const { shipperAccepted, dismissShipperAccepted } = useSocket();
  const navigate = useNavigate();

  if (!shipperAccepted) return null;

  const pickupCity = shipperAccepted.pickupCity || shipperAccepted.origin || 'Delhi';
  const dropCity = shipperAccepted.dropCity || shipperAccepted.destination || 'Jaipur';
  const carrierName = shipperAccepted.carrier?.name || shipperAccepted.carrierName || 'Verified Carrier';
  const vehicleReg = shipperAccepted.vehicle?.registrationNumber || shipperAccepted.vehicleReg || 'RJ-104';
  const tripId = shipperAccepted.tripId;

  const handleViewTrip = () => {
    dismissShipperAccepted();
    if (tripId) {
      navigate(`/tracking/${tripId}`);
    } else {
      navigate('/shipper/shipments');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in slide-in-from-bottom-5 duration-300 font-sans">
      <div className="glass-panel p-6 shadow-2xl bg-white/95 rounded-2xl border-2 border-emerald-500/40 backdrop-blur-xl relative space-y-4">
        {/* Close Button */}
        <button
          onClick={dismissShipperAccepted}
          className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
          title="Close notification"
        >
          <X size={16} />
        </button>

        {/* Top Header Badge */}
        <div className="flex items-center gap-2 pr-6">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <span className="text-[11px] font-extrabold font-outfit text-emerald-700 uppercase tracking-wider">
              ✓ SHIPMENT ACCEPTED
            </span>
            <p className="text-xs text-slate-500 font-normal">Your shipment is now booked and confirmed</p>
          </div>
        </div>

        {/* Route Card */}
        <div className="glass-card p-4 bg-emerald-50/40 border border-emerald-100 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-base font-black text-slate-900 font-outfit">
            <span>{pickupCity}</span>
            <ArrowRight size={16} className="text-emerald-600 shrink-0" />
            <span>{dropCity}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-emerald-100">
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider font-outfit">CARRIER</span>
              <p className="font-extrabold text-slate-900 font-outfit truncate">{carrierName}</p>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider font-outfit">VEHICLE REG</span>
              <p className="font-extrabold text-slate-900 font-outfit">{vehicleReg}</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleViewTrip}
          className="btn-emerald w-full py-2.5 text-xs flex items-center justify-center gap-2 shadow-lg rounded-xl"
        >
          <Navigation size={15} />
          VIEW TRIP & TRACK LIVE
        </button>
      </div>
    </div>
  );
};

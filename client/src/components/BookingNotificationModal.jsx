import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { CheckCircle2, ArrowRight, X, Truck, AlertCircle, Eye, Sparkles } from 'lucide-react';

export const BookingNotificationModal = () => {
  const {
    incomingShipment,
    dismissIncomingShipment,
    acceptShipment,
    acceptingLoad,
    acceptError
  } = useSocket();

  const navigate = useNavigate();

  if (!incomingShipment) return null;

  const pickupCity = incomingShipment.pickupCity || incomingShipment.origin || incomingShipment.pickupLocation?.city || 'Delhi';
  const dropCity = incomingShipment.dropCity || incomingShipment.destination || incomingShipment.dropLocation?.city || 'Jaipur';
  const weight = incomingShipment.weightTons || incomingShipment.weight || 2.5;
  const cargoType = incomingShipment.cargoType || 'General Freight';
  const price = incomingShipment.offeredPriceINR || incomingShipment.price || incomingShipment.estimatedRevenue || 7200;
  const matchScore = incomingShipment.matchScore || 94;
  const shipmentId = incomingShipment.shipmentId || incomingShipment._id;

  const handleAccept = async () => {
    if (!shipmentId) return;
    const res = await acceptShipment(shipmentId);
    if (res.success && res.trip) {
      dismissIncomingShipment();
      navigate(`/tracking/${res.trip._id}`);
    }
  };

  const handleViewLoad = () => {
    dismissIncomingShipment();
    navigate('/carrier/loads');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in slide-in-from-bottom-5 duration-300 font-sans">
      <div className="glass-panel p-6 shadow-2xl bg-white/95 rounded-2xl border-2 border-indigo-500/30 backdrop-blur-xl relative space-y-4">
        {/* Close Button */}
        <button
          onClick={dismissIncomingShipment}
          className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
          title="Close notification"
        >
          <X size={16} />
        </button>

        {/* Top Header Badge */}
        <div className="flex items-center gap-2 pr-6">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center shadow-md">
            <Truck size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[11px] font-extrabold font-outfit text-indigo-700 uppercase tracking-wider">
                NEW BACKHAUL OPPORTUNITY
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal">Matching load posted on your corridor</p>
          </div>
        </div>

        {/* Error Notice (if race condition occurs) */}
        {acceptError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs font-semibold font-outfit">
            <AlertCircle size={16} className="shrink-0 text-red-500" />
            <span>{acceptError}</span>
          </div>
        )}

        {/* Route & Price Card */}
        <div className="glass-card p-4 bg-gradient-to-r from-slate-50 to-indigo-50/30 border border-indigo-100/80 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-base font-black text-slate-900 font-outfit tracking-tight">
              <span>{pickupCity}</span>
              <ArrowRight size={16} className="text-indigo-600 shrink-0" />
              <span>{dropCity}</span>
            </div>
            <div className="text-right">
              <span className="badge-emerald text-[10px] px-2 py-0.5">
                {matchScore}% Match
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
            <span className="text-slate-600 font-bold font-outfit">{weight}T · {cargoType}</span>
            <span className="text-base font-extrabold text-emerald-600 font-outfit">
              ₹{Number(price).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Metadata Details */}
        <div className="grid grid-cols-2 gap-2 text-[11px] font-outfit">
          <div className="glass-card p-2.5 bg-slate-50/80 rounded-lg">
            <span className="text-slate-400 font-normal">Pickup Window</span>
            <p className="font-extrabold text-slate-800 mt-0.5">Today, Immediate</p>
          </div>
          <div className="glass-card p-2.5 bg-slate-50/80 rounded-lg">
            <span className="text-slate-400 font-normal">Est. Margin</span>
            <p className="font-extrabold text-indigo-600 mt-0.5">High Efficiency</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={handleViewLoad}
            className="btn-secondary text-xs py-2.5 flex items-center justify-center gap-1.5 rounded-xl"
          >
            <Eye size={15} />
            VIEW LOAD
          </button>
          <button
            onClick={handleAccept}
            disabled={acceptingLoad}
            className="btn-emerald text-xs py-2.5 flex items-center justify-center gap-1.5 shadow-lg rounded-xl disabled:opacity-50"
          >
            {acceptingLoad ? (
              <span className="animate-spin">⌛</span>
            ) : (
              <>
                <CheckCircle2 size={15} />
                ACCEPT
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

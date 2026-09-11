import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { CheckCircle2, XCircle, Truck, MapPin, ArrowRight, ShieldCheck, DollarSign } from 'lucide-react';

export const BookingNotificationModal = () => {
  const { incomingRequest, respondBookingRequest, confirmedBooking, clearBookingState } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (confirmedBooking && confirmedBooking.tripId) {
      navigate(`/tracking/${confirmedBooking.tripId}`);
    }
  }, [confirmedBooking, navigate]);

  if (!incomingRequest) return null;

  const handleAccept = () => {
    respondBookingRequest(incomingRequest.requestId, 'ACCEPTED');
  };

  const handleReject = () => {
    respondBookingRequest(incomingRequest.requestId, 'REJECTED');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-black/10 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-6 relative overflow-hidden">
        {/* Top Header Badge */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
              Uber-Style Real-time Return Load Booking
            </span>
          </div>
          <span className="text-xs font-mono bg-zinc-100 text-zinc-800 px-2.5 py-1 rounded-full font-medium">
            Match Score {incomingRequest.matchScore || 94}%
          </span>
        </div>

        {/* Route Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-medium uppercase tracking-wider">
            <span>Pickup & Drop Corridor</span>
            <span>Est. Revenue</span>
          </div>

          <div className="flex items-center justify-between bg-zinc-50 p-4 rounded-xl border border-zinc-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-lg font-bold text-zinc-900">
                <span>{incomingRequest.pickupCity || 'Delhi'}</span>
                <ArrowRight className="w-4 h-4 text-zinc-400" />
                <span>{incomingRequest.dropCity || 'Jaipur'}</span>
              </div>
              <p className="text-xs text-zinc-500 font-sans">
                Main Truck Route: {incomingRequest.route || 'Interstate Highway Corridor'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-zinc-900">
                ₹{(incomingRequest.offeredPriceINR || incomingRequest.price || 14500).toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] uppercase font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Guaranteed Payout
              </span>
            </div>
          </div>
        </div>

        {/* Cargo & Detour Specs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 space-y-1">
            <span className="text-xs text-zinc-400 font-medium">Cargo Weight</span>
            <p className="text-sm font-semibold text-zinc-900">
              {incomingRequest.weightTons || 3.5} Tons Capacity
            </p>
          </div>
          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 space-y-1">
            <span className="text-xs text-zinc-400 font-medium">Corridor Detour</span>
            <p className="text-sm font-semibold text-zinc-900">
              {incomingRequest.detourKm || 18} km (Minimal)
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleReject}
            className="w-full py-3 px-4 rounded-xl border border-zinc-300 text-zinc-700 font-medium hover:bg-zinc-100 transition-all text-sm flex items-center justify-center gap-2"
          >
            <XCircle className="w-4 h-4 text-zinc-500" />
            Decline Load
          </button>
          <button
            onClick={handleAccept}
            className="w-full py-3 px-4 rounded-xl bg-black text-white font-medium hover:bg-zinc-800 transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-black/10"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Accept & Start Ride
          </button>
        </div>
      </div>
    </div>
  );
};

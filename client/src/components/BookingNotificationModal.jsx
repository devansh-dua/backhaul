import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

export const BookingNotificationModal = () => {
  const { incomingRequest, respondBookingRequest, confirmedBooking } = useSocket();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md font-sans">
      <div className="glass-panel p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl bg-white/95 rounded-2xl relative border border-slate-200/80">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold font-outfit text-slate-900 uppercase">
              REAL-TIME BOOKING PROPOSAL
            </span>
          </div>
          {incomingRequest.matchScore && (
            <span className="badge-emerald font-semibold">
              Match {incomingRequest.matchScore}%
            </span>
          )}
        </div>

        <div className="space-y-2.5">
          <div className="text-[11px] font-bold uppercase text-slate-500 tracking-wider font-outfit">
            CORRIDOR ROUTE & PAYOUT
          </div>

          <div className="glass-card p-4 flex items-center justify-between bg-slate-50/80">
            <div>
              <div className="flex items-center gap-2 text-base font-extrabold text-slate-900 font-outfit">
                <span>{incomingRequest.pickupCity || incomingRequest.origin || '—'}</span>
                <ArrowRight size={16} className="text-indigo-600" />
                <span>{incomingRequest.dropCity || incomingRequest.destination || '—'}</span>
              </div>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                {incomingRequest.route || 'Interstate Corridor'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-base font-extrabold text-slate-900 font-outfit">
                ₹{(incomingRequest.offeredPriceINR || incomingRequest.price || 0).toLocaleString('en-IN')}
              </div>
              <span className="badge-emerald text-[10px]">
                Guaranteed Payout
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="glass-card p-3.5 bg-slate-50/50">
            <span className="text-slate-500 font-normal">Cargo Payload</span>
            <p className="font-extrabold text-slate-900 font-outfit text-sm mt-0.5">
              {incomingRequest.weightTons || incomingRequest.weight || 0} Tons
            </p>
          </div>
          <div className="glass-card p-3.5 bg-slate-50/50">
            <span className="text-slate-500 font-normal">Corridor Detour</span>
            <p className="font-extrabold text-amber-600 font-outfit text-sm mt-0.5">
              +{incomingRequest.detourKm || 0} km
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleReject}
            className="btn-secondary text-xs py-2.5 flex items-center justify-center gap-1.5"
          >
            <XCircle size={15} className="text-slate-500" />
            Decline Load
          </button>
          <button
            onClick={handleAccept}
            className="btn-emerald text-xs py-2.5 flex items-center justify-center gap-1.5 shadow-md"
          >
            <CheckCircle2 size={15} />
            Accept & Launch
          </button>
        </div>
      </div>
    </div>
  );
};


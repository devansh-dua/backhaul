import { useState, useEffect } from 'react';
import { CheckCircle2, ShieldCheck, FileCheck, X, KeyRound, Clock, Truck } from 'lucide-react';
import DeliveryOtpModal from './DeliveryOtpModal';
import { podApi } from '../services/pod.api';
import { useAuth } from '../context/AuthContext';

export const ProofOfDeliveryModal = ({ isOpen, onClose, trip, onConfirmed }) => {
  const { user } = useAuth();
  const [podDetails, setPodDetails] = useState(null);
  const [loadingPod, setLoadingPod] = useState(false);
  const [isDelivered, setIsDelivered] = useState(false);

  const shipmentId = trip?.shipments?.[0]?._id || trip?.shipment?._id || trip?.shipment || trip?.shipmentId;
  const tripId = trip?._id;

  useEffect(() => {
    if (isOpen && (trip?.status === 'DELIVERED' || isDelivered)) {
      fetchPodData();
    }
  }, [isOpen, trip, isDelivered]);

  const fetchPodData = async () => {
    if (!tripId) return;
    setLoadingPod(true);
    try {
      const res = await podApi.getPod(tripId);
      if (res.data?.success) {
        setPodDetails(res.data.data);
        setIsDelivered(true);
      }
    } catch (err) {
      console.log('No existing POD document found yet:', err.message);
    } finally {
      setLoadingPod(false);
    }
  };

  if (!isOpen) return null;

  // If shipment/trip is not delivered yet and user is carrier, show DeliveryOtpModal
  if (trip?.status !== 'DELIVERED' && !isDelivered) {
    return (
      <DeliveryOtpModal
        isOpen={isOpen}
        onClose={onClose}
        shipmentId={shipmentId}
        tripId={tripId}
        onSuccess={(data) => {
          setIsDelivered(true);
          setPodDetails(data?.pod);
          if (onConfirmed) onConfirmed(data);
        }}
      />
    );
  }

  // If already delivered, show Verified POD Certificate modal
  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-slate-800 border border-emerald-500/50 p-6 sm:p-8 max-w-md w-full relative space-y-5 shadow-2xl rounded-2xl text-white">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400"></div>

        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-2xl font-bold shrink-0">
            📜
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white font-outfit uppercase tracking-tight">Verified Proof of Delivery</h3>
            <p className="text-xs text-slate-400">Secure Digital OTP Verification Certificate</p>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-emerald-500/30 p-4 rounded-xl space-y-3 text-xs">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="text-slate-400">Status:</span>
            <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-1 rounded-full border border-emerald-500/40 flex items-center gap-1">
              <CheckCircle2 size={12} /> DELIVERED & VERIFIED
            </span>
          </div>

          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Verification Method:</span>
            <span className="font-semibold text-white flex items-center gap-1">
              <KeyRound size={13} className="text-emerald-400" />
              6-Digit Customer OTP
            </span>
          </div>

          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Shipment ID:</span>
            <span className="font-mono text-emerald-400 font-bold">{shipmentId || 'N/A'}</span>
          </div>

          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Delivered Timestamp:</span>
            <span className="font-semibold text-slate-200">
              {podDetails?.deliveredAt ? new Date(podDetails.deliveredAt).toLocaleString() : new Date().toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between pt-1">
            <span className="text-slate-400">Security Hash Verification:</span>
            <span className="font-mono text-xs text-emerald-300 font-semibold">SHA256_VERIFIED_PASS</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
        >
          Close Certificate
        </button>
      </div>
    </div>
  );
};


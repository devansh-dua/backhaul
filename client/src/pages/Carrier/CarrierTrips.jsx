import { useState } from 'react';
import { CarrierNavbar } from '../../components/Navbar';
import { LiveTrackingMap } from '../../components/LiveTrackingMap';
import { ProofOfDeliveryModal } from '../../components/ProofOfDeliveryModal';
import { Compass, CheckCircle2, Sparkles } from 'lucide-react';

export const CarrierTrips = () => {
  const [showPodModal, setShowPodModal] = useState(false);
  const [tripStatus, setTripStatus] = useState('IN_TRANSIT');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      <CarrierNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Header Glass Panel */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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

          <button
            onClick={() => setShowPodModal(true)}
            className="btn-emerald text-xs px-4 py-2.5 flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <CheckCircle2 size={15} /> File Proof of Delivery (POD)
          </button>
        </div>

        <LiveTrackingMap tripId="demo_trip_101" />

        <ProofOfDeliveryModal
          isOpen={showPodModal}
          onClose={() => setShowPodModal(false)}
          onConfirmed={() => setTripStatus('DELIVERED')}
        />
      </main>
    </div>
  );
};


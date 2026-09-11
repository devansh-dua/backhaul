import { useState } from 'react';
import { CarrierNavbar } from '../../components/Navbar';
import { LiveTrackingMap } from '../../components/LiveTrackingMap';
import { ProofOfDeliveryModal } from '../../components/ProofOfDeliveryModal';
import { Compass, CheckCircle2, Truck, ShieldCheck, MapPin } from 'lucide-react';

export const CarrierTrips = () => {
  const [showPodModal, setShowPodModal] = useState(false);
  const [tripStatus, setTripStatus] = useState('IN_TRANSIT');

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '3rem', color: '#0f172a' }}>
      <CarrierNavbar />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>Active Trips & Deliveries</h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Real-time Socket.IO vehicle tracking and digital Proof of Delivery filing</p>
          </div>

          <button
            onClick={() => setShowPodModal(true)}
            style={{ background: 'linear-gradient(135deg, #059669, #047857)', border: 'none', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <CheckCircle2 size={18} /> Confirm Delivery & File POD
          </button>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <LiveTrackingMap />
        </div>

        <ProofOfDeliveryModal
          isOpen={showPodModal}
          onClose={() => setShowPodModal(false)}
          onConfirmed={() => setTripStatus('DELIVERED')}
        />
      </div>
    </div>
  );
};

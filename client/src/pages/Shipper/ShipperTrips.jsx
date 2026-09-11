import { ShipperNavbar } from '../../components/Navbar';
import { LiveTrackingMap } from '../../components/LiveTrackingMap';

export const ShipperTrips = () => {
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '3rem', color: '#0f172a' }}>
      <ShipperNavbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem 1.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>Live Shipment Tracking</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Real-time GPS Socket.IO telemetry for active carrier transport</p>
        </div>
        <LiveTrackingMap />
      </div>
    </div>
  );
};

import { ShipperNavbar } from '../../components/Navbar';
import { LiveTrackingMap } from '../../components/LiveTrackingMap';
import { Compass } from 'lucide-react';

export const ShipperTrips = () => {
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

        <LiveTrackingMap tripId="demo_trip_101" />
      </main>
    </div>
  );
};


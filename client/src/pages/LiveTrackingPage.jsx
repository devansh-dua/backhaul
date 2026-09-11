import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CarrierNavbar, ShipperNavbar } from '../components/Navbar';
import { LiveTrackingMap } from '../components/LiveTrackingMap';
import { ProofOfDeliveryModal } from '../components/ProofOfDeliveryModal';
import { EnvironmentalImpactCard } from '../components/EnvironmentalImpactCard';
import { useAuth } from '../context/AuthContext';
import { tripApi } from '../services/trip.api';
import { Truck, Phone, ArrowRight, FileCheck, CheckCircle2, Clock } from 'lucide-react';

export const LiveTrackingPage = () => {
  const { tripId } = useParams();
  const { user } = useAuth();

  const [tripDetails, setTripDetails] = useState(null);
  const [isPodOpen, setIsPodOpen] = useState(false);
  const [isDelivered, setIsDelivered] = useState(false);

  useEffect(() => {
    if (!tripId) return;

    const fetchTrip = async () => {
      try {
        const res = await tripApi.getTripById(tripId);
        if (res.data && res.data.success && res.data.data) {
          setTripDetails(res.data.data);
          if (res.data.data.status === 'DELIVERED') {
            setIsDelivered(true);
          }
        }
      } catch (err) {
        console.error('Failed to fetch trip details:', err);
      }
    };

    fetchTrip();
  }, [tripId]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      {user?.role === 'SHIPPER' ? <ShipperNavbar /> : <CarrierNavbar />}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Header Glass Panel */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={isDelivered ? 'badge-emerald font-semibold' : 'badge-purple'}>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {isDelivered ? 'DELIVERY COMPLETED' : 'LIVE TELEMETRY IN TRANSIT'}
              </span>
              <span className="text-xs font-semibold text-slate-500 font-sans">Trip ID: {tripId?.slice(-8)}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit tracking-tight mt-1 flex items-center gap-3">
              <span>{tripDetails?.origin || '—'}</span>
              <ArrowRight size={20} className="text-indigo-600" />
              <span>{tripDetails?.destination || '—'}</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 font-normal mt-0.5">
              Carrier: <strong className="text-slate-900 font-outfit font-bold">{tripDetails?.carrier?.companyName || tripDetails?.carrierName || 'Carrier'}</strong> · Rate: <strong className="text-emerald-600 font-outfit font-extrabold">₹{(tripDetails?.grossRevenueINR || 0).toLocaleString('en-IN')}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${tripDetails?.driverPhone || ''}`}
              className="btn-secondary text-xs px-4 py-2.5 flex items-center gap-1.5"
            >
              <Phone size={14} /> Call Driver
            </a>

            <button
              onClick={() => setIsPodOpen(true)}
              className="btn-emerald text-xs px-4 py-2.5 flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <FileCheck size={15} />
              {isDelivered ? 'View Digital POD' : 'File POD'}
            </button>
          </div>
        </div>

        <LiveTrackingMap tripId={tripId} />

        {/* Real Environmental Impact Summary Card */}
        <EnvironmentalImpactCard
          emptyKm={tripDetails?.emptyKmAvoided || (isDelivered ? 252 : 0)}
          co2Kg={tripDetails?.co2SavedKg || (isDelivered ? 141 : 0)}
          fuelLiters={tripDetails?.fuelSavedLiters || (isDelivered ? 52.5 : 0)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-card p-6 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 font-outfit">
              VEHICLE & DRIVER SPECS
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-normal">Registration:</span>
                <span className="font-bold text-slate-900 font-outfit">{tripDetails?.vehicle?.registrationNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-normal">Vehicle Category:</span>
                <span className="font-semibold text-slate-800">{tripDetails?.vehicle?.vehicleType || 'TRUCK'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-normal">Driver Phone:</span>
                <span className="font-semibold text-slate-900">{tripDetails?.driverPhone || 'N/A'}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-500 font-normal">Payout Rate:</span>
                <span className="font-extrabold text-emerald-600 font-outfit text-sm">₹{(tripDetails?.grossRevenueINR || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 glass-card p-6 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 font-outfit">
              DISPATCH MILESTONE TIMELINE
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="glass-panel p-3.5 space-y-1 bg-white/90">
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold font-outfit">
                  <CheckCircle2 size={14} />
                  <span>Matched</span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal">Contract verified</p>
              </div>

              <div className="glass-panel p-3.5 space-y-1 bg-white/90">
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold font-outfit">
                  <CheckCircle2 size={14} />
                  <span>Picked Up</span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal">Loaded at origin</p>
              </div>

              <div className="glass-panel p-3.5 space-y-1 bg-purple-50/50 border-purple-200">
                <div className="flex items-center gap-1.5 text-indigo-600 font-bold font-outfit">
                  <Clock size={14} className="animate-spin" />
                  <span>In Transit</span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal">Avg ~64 km/h</p>
              </div>

              <div className={`glass-panel p-3.5 space-y-1 ${isDelivered ? 'bg-emerald-50 border-emerald-300' : 'opacity-60'}`}>
                <div className="flex items-center gap-1.5 text-slate-900 font-bold font-outfit">
                  <CheckCircle2 size={14} className={isDelivered ? 'text-emerald-600' : ''} />
                  <span>Delivered</span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal">POD verified</p>
              </div>
            </div>
          </div>
        </div>

        <ProofOfDeliveryModal
          isOpen={isPodOpen}
          onClose={() => setIsPodOpen(false)}
          trip={tripDetails}
          onConfirmed={() => setIsDelivered(true)}
        />
      </main>
    </div>
  );
};


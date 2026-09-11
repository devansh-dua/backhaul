import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CarrierNavbar, ShipperNavbar } from '../components/Navbar';
import { LiveTrackingMap } from '../components/LiveTrackingMap';
import { ProofOfDeliveryModal } from '../components/ProofOfDeliveryModal';
import { useAuth } from '../context/AuthContext';
import { tripApi } from '../services/trip.api';
import { Truck, MapPin, Phone, ShieldCheck, ArrowRight, FileCheck, Share2, DollarSign, CheckCircle2, Clock } from 'lucide-react';

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
        }
      } catch (err) {
        // Fallback default trip object if requested tripId is a dynamic socket demo ID
        setTripDetails({
          _id: tripId,
          origin: 'Gurgaon',
          destination: 'Jaipur',
          vehicle: { registrationNumber: 'RJ-104-5891', vehicleType: 'HEAVY_TRUCK' },
          grossRevenueINR: 14500,
          driverPhone: '+91 98290 12345',
          carrierName: 'Apex Express Logistics',
          shipperName: 'Enterprise Freight Corp',
          status: 'IN_TRANSIT'
        });
      }
    };

    fetchTrip();
  }, [tripId]);

  return (
    <div className="min-h-screen bg-white text-zinc-900 pb-16">
      {user?.role === 'SHIPPER' ? <ShipperNavbar /> : <CarrierNavbar />}

      <main className="max-w-6xl mx-auto px-6 pt-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {isDelivered ? 'DELIVERY COMPLETED' : 'RIDE CONFIRMED & IN TRANSIT'}
              </span>
              <span className="text-xs font-mono text-zinc-400">Trip #{tripId?.slice(-8)}</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-3">
              <span>{tripDetails?.origin || 'Gurgaon'}</span>
              <ArrowRight className="w-5 h-5 text-zinc-400" />
              <span>{tripDetails?.destination || 'Jaipur'}</span>
            </h1>
            <p className="text-xs text-zinc-500">
              Carrier: <strong className="text-zinc-800">{tripDetails?.carrierName || 'Apex Express Logistics'}</strong> · Freight Payout: <strong className="text-zinc-900">₹{(tripDetails?.grossRevenueINR || 14500).toLocaleString('en-IN')}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <a
              href={`tel:${tripDetails?.driverPhone || '+919829012345'}`}
              className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-xl border border-zinc-200 flex items-center gap-2 transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-zinc-600" />
              Call Driver ({tripDetails?.driverPhone || '+91 98290 12345'})
            </a>

            <button
              onClick={() => setIsPodOpen(true)}
              className="px-4 py-2.5 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
              {isDelivered ? 'View Digital POD' : 'Confirm Delivery & POD'}
            </button>
          </div>
        </div>

        {/* Live GPS Telemetry Component */}
        <LiveTrackingMap tripId={tripId} />

        {/* Shipment Details & Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Key Specs Card */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
              Vehicle & Freight Info
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
                <span className="text-zinc-500 font-medium">Vehicle Reg Number</span>
                <span className="font-bold text-zinc-900 font-mono text-sm">{tripDetails?.vehicle?.registrationNumber || 'RJ-104-5891'}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
                <span className="text-zinc-500 font-medium">Vehicle Category</span>
                <span className="font-semibold text-zinc-800">{tripDetails?.vehicle?.vehicleType || 'HEAVY_TRUCK'}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
                <span className="text-zinc-500 font-medium">Driver Phone</span>
                <span className="font-semibold text-zinc-900">{tripDetails?.driverPhone || '+91 98290 12345'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-medium">Guaranteed Revenue</span>
                <span className="font-bold text-emerald-600 text-sm">₹{(tripDetails?.grossRevenueINR || 14500).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Delivery Timeline Progress */}
          <div className="md:col-span-2 bg-zinc-50 border border-zinc-200 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
              Live Milestone Milestone Tracking
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3 rounded-xl border border-zinc-200 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirmed</span>
                </div>
                <p className="text-[11px] text-zinc-500">Shipper & Carrier matched</p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-zinc-200 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Cargo Picked</span>
                </div>
                <p className="text-[11px] text-zinc-500">Loaded at {tripDetails?.origin || 'Gurgaon'}</p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-black space-y-1 shadow-sm">
                <div className="flex items-center gap-1.5 text-black text-xs font-extrabold">
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span>In Transit</span>
                </div>
                <p className="text-[11px] text-zinc-500">Highway speed ~62 km/h</p>
              </div>

              <div className={`p-3 rounded-xl border space-y-1 ${isDelivered ? 'bg-white border-emerald-500' : 'bg-zinc-100 border-zinc-200 text-zinc-400'}`}>
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Delivered</span>
                </div>
                <p className="text-[11px] text-zinc-500">POD verified</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Proof of Delivery Modal */}
      <ProofOfDeliveryModal
        isOpen={isPodOpen}
        onClose={() => setIsPodOpen(false)}
        trip={tripDetails}
        onConfirmed={() => setIsDelivered(true)}
      />
    </div>
  );
};

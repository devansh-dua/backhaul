import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Plus, Package, ArrowUpRight, CheckCircle2, ChevronLeft, ChevronRight, Truck, Sparkles } from 'lucide-react';
import { shipmentApi } from '../services/shipment.api';

// High resolution logistics & highway truck photos for background cross-fade slider
const HERO_BACKGROUNDS = [
  'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?auto=format&fit=crop&w=2000&q=80'
];

export const Hero = ({ onScrollToOpportunities }) => {
  const navigate = useNavigate();
  
  // Background image index for auto-sliding background photos
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Active highlighted ride index for Previous Rides carousel
  const [activeRideIndex, setActiveRideIndex] = useState(0);

  // Previous Rides Data from real backend
  const [previousRides, setPreviousRides] = useState([]);

  // Auto slide background photos every 4.5 seconds
  useEffect(() => {
    const bgTimer = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % HERO_BACKGROUNDS.length);
    }, 4500);
    return () => clearInterval(bgTimer);
  }, []);

  // Auto rotate highlighted previous ride every 3.5 seconds
  useEffect(() => {
    if (previousRides.length === 0) return;
    const rideTimer = setInterval(() => {
      setActiveRideIndex((prev) => (prev + 1) % previousRides.length);
    }, 3500);
    return () => clearInterval(rideTimer);
  }, [previousRides.length]);

  useEffect(() => {
    fetchRecentShipments();
  }, []);

  const fetchRecentShipments = async () => {
    try {
      const res = await shipmentApi.getPostedShipments();
      if (res.data && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        const fetched = res.data.data.slice(0, 4).map((item, idx) => ({
          id: item._id,
          route: `${item.pickupCity || item.origin || 'Origin'} → ${item.deliveryCity || item.dropCity || item.destination || 'Destination'}`,
          truck: item.vehicle?.registrationNumber || `Truck ${idx + 1}`,
          date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent',
          cargo: item.cargoType || 'General Freight',
          status: item.status || 'Posted',
          revenue: item.offeredPriceINR || item.payoutINR || 0,
          emptyKmSaved: Math.round((item.weightTons || 2) * 50)
        }));
        setPreviousRides(fetched);
      } else {
        setPreviousRides([]);
      }
    } catch (e) {
      console.error('Failed to fetch recent shipments for hero:', e);
      setPreviousRides([]);
    }
  };

  const currentRide = previousRides[activeRideIndex] || previousRides[0];

  return (
    <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 shadow-lg bg-slate-950 transition-all">
      
      {/* Background Image Carousel with Smooth Cross-Fade */}
      {HERO_BACKGROUNDS.map((bgUrl, index) => (
        <div 
          key={bgUrl}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            index === currentBgIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
          style={{ backgroundImage: `url('${bgUrl}')` }}
        />
      ))}

      {/* Dark Blur Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-900/40 backdrop-blur-[2px]" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 py-12 sm:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LEFT COLUMN: Eyebrow, Headline, Description, CTAs */}
        <div className="lg:col-span-7 space-y-6 text-white">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-extrabold tracking-wider text-slate-200 uppercase font-outfit shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            KEEP MOVING. KEEP EARNING.
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-outfit tracking-tight leading-[1.1]">
            Every Mile Has<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-blue-300">
              Another Opportunity.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-200 font-normal max-w-xl leading-relaxed">
            BackhaulX finds the most profitable loads for your existing route.<br />
            Turn empty space into real revenue — with AI on your side.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={onScrollToOpportunities}
              className="bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-outfit group cursor-pointer"
            >
              View Today's Opportunities 
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-slate-950" />
            </button>

            <button
              onClick={() => navigate('/carrier/capacity')}
              className="bg-slate-900/80 hover:bg-slate-900 text-white font-semibold text-sm px-5 py-3.5 rounded-xl border border-white/25 backdrop-blur-md transition-all flex items-center gap-1.5 font-outfit cursor-pointer"
            >
              Add Capacity <Plus size={16} />
            </button>
          </div>

          {/* Background Photo Indicators */}
          <div className="flex items-center gap-2 pt-4">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-outfit mr-1">
              Live Highway Views
            </span>
            {HERO_BACKGROUNDS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBgIndex(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === currentBgIndex ? 'w-6 bg-blue-500' : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
                title={`View photo ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Floating Glass "Previous Rides" Panel with Carousel */}
        <div className="lg:col-span-5">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-white/40 shadow-2xl space-y-4 max-w-md ml-auto relative overflow-hidden">
            
            {/* Header with Navigation Controls */}
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <Truck size={16} />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 font-outfit">
                  Previous Rides
                </h3>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveRideIndex((prev) => (prev - 1 + previousRides.length) % previousRides.length)}
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                  title="Previous Ride"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => setActiveRideIndex((prev) => (prev + 1) % previousRides.length)}
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                  title="Next Ride"
                >
                  <ChevronRight size={14} />
                </button>
                <button
                  onClick={() => navigate('/carrier/trips')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors ml-1 flex items-center gap-0.5 font-outfit"
                >
                  All <ArrowUpRight size={13} />
                </button>
              </div>
            </div>

            {previousRides.length === 0 ? (
              <div className="p-6 text-center text-slate-500 space-y-2 bg-slate-50/80 rounded-xl border border-slate-200/60">
                <div className="text-sm font-bold text-slate-800 font-outfit">No recent completed trips</div>
                <div className="text-xs">Publish capacity or browse shipment opportunities to start logging trips in your corridor history.</div>
              </div>
            ) : (
              <>
                {/* Featured Active Previous Ride Showcase Card */}
                {currentRide && (
                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50/90 to-indigo-50/70 border border-blue-200/80 shadow-xs space-y-3 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md font-outfit uppercase">
                          {currentRide.truck}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">
                          {currentRide.date}
                        </span>
                      </div>

                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 font-outfit">
                        <CheckCircle2 size={11} className="text-emerald-600" />
                        {currentRide.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base sm:text-lg font-black text-slate-900 font-outfit tracking-tight">
                        {currentRide.route}
                      </h4>
                      <div className="text-xs text-slate-600 font-medium mt-0.5">
                        Cargo: <strong className="text-slate-900">{currentRide.cargo}</strong> · Saved <strong className="text-emerald-700">{currentRide.emptyKmSaved} km empty</strong>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase font-outfit">Payout Earned</span>
                        <div className="text-base sm:text-lg font-black text-slate-900 font-outfit">
                          ₹{currentRide.revenue.toLocaleString('en-IN')}
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/carrier/trips`)}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg transition-all shadow-xs cursor-pointer font-outfit"
                      >
                        View Trip Details
                      </button>
                    </div>
                  </div>
                )}

                {/* Compact List of Other Recent Rides */}
                <div className="space-y-2 pt-1">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-outfit">
                    Recent Completed Trips
                  </div>
                  {previousRides.map((ride, idx) => (
                    <div 
                      key={ride.id}
                      onClick={() => setActiveRideIndex(idx)}
                      className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        idx === activeRideIndex 
                          ? 'bg-white border-blue-400 shadow-xs ring-2 ring-blue-100' 
                          : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-2 h-2 rounded-full ${idx === activeRideIndex ? 'bg-blue-600' : 'bg-slate-300'}`} />
                        <div className="truncate">
                          <div className="text-xs font-bold text-slate-900 font-outfit truncate">
                            {ride.route}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {ride.date}
                          </div>
                        </div>
                      </div>

                      <div className="text-xs font-black text-slate-900 font-outfit flex-shrink-0">
                        ₹{ride.revenue.toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

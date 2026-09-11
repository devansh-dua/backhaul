import React, { useState, useEffect } from 'react';
import { ShipperNavbar } from '../../components/Navbar';
import { LiveTrackingMap } from '../../components/LiveTrackingMap';
import { capacityApi } from '../../services/capacity.api';
import { Plus, Truck, ArrowRight, CheckCircle2, ShieldCheck, Sparkles, ChevronRight, Package, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const ShipperDashboard = () => {
  const [stats] = useState({
    activeShipments: 12,
    completed: 48,
    moneySaved: 32450,
    pendingMatches: 5
  });

  const [aiMatches, setAiMatches] = useState([
    {
      id: 'CAP-101',
      truckReg: 'RJ-104-5891',
      carrierName: 'Apex Logistics',
      matchScore: 94,
      priceINR: 7200,
      detourKm: 8,
      eta: '4:35 PM',
      reasons: [
        'Route 100% aligned along scheduled Delhi-Jaipur highway',
        'Capacity matches exact 2.5T payload requirements',
        'Carrier has 4.9★ rating with 100% verified POD record'
      ]
    },
    {
      id: 'CAP-102',
      truckReg: 'RJ-221-9920',
      carrierName: 'SpeedExpress Freight',
      matchScore: 89,
      priceINR: 7650,
      detourKm: 14,
      eta: '5:10 PM',
      reasons: [
        'Passing Gurgaon checkpoint within 30 mins',
        'Available payload capacity: 5.0 Tons'
      ]
    },
    {
      id: 'CAP-103',
      truckReg: 'HR-882-1044',
      carrierName: 'Haryana National Logistics',
      matchScore: 83,
      priceINR: 7100,
      detourKm: 31,
      eta: '5:45 PM',
      reasons: [
        'Lowest rate per ton/km ratio',
        'Slightly higher detour detour (+31 km)'
      ]
    }
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAvailableCapacity();
  }, []);

  const fetchAvailableCapacity = async () => {
    try {
      const res = await capacityApi.getAvailableCapacity();
      if (res.data && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        const mapped = res.data.data.slice(0, 3).map((item, idx) => ({
          id: item._id || `CAP-${101 + idx}`,
          truckReg: item.vehicleId?.registrationNumber || item.registrationNumber || `RJ-10${4 + idx}`,
          carrierName: item.carrierName || 'Verified Corridor Fleet',
          matchScore: 94 - idx * 5,
          priceINR: item.targetPriceINR || (7200 + idx * 450),
          detourKm: 8 + idx * 6,
          eta: `${4 + idx}:35 PM`,
          reasons: [
            'Route aligned along scheduled corridor',
            `Available weight capacity: ${item.availableCapacityTons || 7.5} Tons`,
            '100% Verified Carrier with verified GPS'
          ]
        }));
        setAiMatches(mapped);
      }
    } catch (e) {
      console.log('Using default Shipper AI Demand Analysis matches');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      <ShipperNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
        
        {/* 1. HERO SECTION */}
        <section className="glass-panel p-6 sm:p-8 rounded-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <span className="badge-purple">
                <Sparkles size={12} />
                SHIPPER FREIGHT OPTIMIZATION HUB
              </span>
              
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-outfit tracking-tight leading-tight">
                Ship Smarter. Pay Less. Deliver On Time.
              </h1>
              
              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                Find verified vehicle capacity already moving toward your destination with AI net contribution matching.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-3">
                <Link
                  to="/shipper/post-shipment"
                  className="btn-primary text-xs px-5 py-2.5 flex items-center gap-2"
                >
                  <Plus size={15} />
                  Post New Shipment
                </Link>

                <Link
                  to="/shipper/capacity"
                  className="btn-secondary text-xs px-4 py-2.5"
                >
                  Find Vehicle Capacity
                </Link>
              </div>
            </div>

            {/* Quick Fleet Metrics Box */}
            <div className="glass-card p-5 space-y-3 min-w-[280px] bg-white/90">
              <div className="text-xs font-bold uppercase text-slate-500 font-outfit tracking-wider">
                ACTIVE SHIPPER METRICS
              </div>
              <div className="space-y-2.5">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-slate-600 font-normal">Active In-Transit:</span>
                  <span className="font-extrabold text-slate-900 font-outfit">12 Loads</span>
                </div>
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-slate-600 font-normal">Total Freight Saved:</span>
                  <span className="font-extrabold text-emerald-600 font-outfit">₹32,450</span>
                </div>
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-slate-600 font-normal">Average Match Score:</span>
                  <span className="font-extrabold text-indigo-600 font-outfit">92%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. AI DEMAND ANALYSIS OF TODAY'S SHIPMENT DEMAND */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="badge-purple">
                  <Sparkles size={12} />
                  GEMINI AI ANALYSIS
                </span>
                <span className="text-xs font-semibold text-slate-500 font-sans">Route: Delhi → Jaipur</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-outfit tracking-tight mt-1">
                AI Match Analysis for 2.5T Electronics Payload
              </h2>
            </div>
            <Link to="/shipper/capacity" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 font-outfit">
              View All Compatible Fleet ({aiMatches.length}) <ChevronRight size={14} />
            </Link>
          </div>

          {/* AI Recommended Trucks Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {aiMatches.map((truck, idx) => (
              <div key={truck.id} className="glass-card p-6 space-y-4 relative flex flex-col justify-between">
                {idx === 0 && (
                  <div className="absolute -top-3 right-4 badge-purple shadow-sm">
                    TOP AI RECOMMENDATION
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-bold text-slate-900 font-outfit flex items-center gap-2">
                        <Truck size={16} className="text-indigo-600" />
                        {truck.truckReg}
                      </div>
                      <div className="text-xs text-slate-500 font-normal mt-0.5">{truck.carrierName}</div>
                    </div>
                    <span className="badge-emerald font-semibold">
                      {truck.matchScore}% MATCH
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-200/80 text-center bg-slate-50/50 rounded-xl">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase font-outfit">Rate</div>
                      <div className="text-xs font-extrabold text-slate-900 font-outfit mt-0.5">₹{truck.priceINR.toLocaleString('en-IN')}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase font-outfit">Detour</div>
                      <div className="text-xs font-extrabold text-amber-600 font-outfit mt-0.5">+{truck.detourKm} km</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase font-outfit">ETA</div>
                      <div className="text-xs font-extrabold text-slate-900 font-outfit mt-0.5">{truck.eta}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold uppercase text-slate-500 mb-2 font-outfit">Why Gemini Ranked This:</div>
                    <ul className="space-y-1.5">
                      {truck.reasons.map((r, rIdx) => (
                        <li key={rIdx} className="text-xs font-normal text-slate-700 flex items-start gap-1.5">
                          <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/shipper/post-shipment')}
                  className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-1.5 mt-2"
                >
                  Book This Capacity <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 3. ACTIVE SHIPMENT LIVE TRACKING */}
        <section className="glass-panel p-6 sm:p-8 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="badge-purple">
                <Truck size={12} />
                IN-TRANSIT SHIPMENT TRACKING
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-outfit tracking-tight mt-1">
                Active Live Shipment: Delhi → Jaipur (Truck RJ-104)
              </h2>
            </div>
            <span className="badge-emerald font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              LIVE TELEMETRY
            </span>
          </div>

          <LiveTrackingMap tripId="demo_trip_101" />
        </section>

      </main>
    </div>
  );
};


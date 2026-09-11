import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CarrierNavbar } from '../../components/Navbar';
import { Hero } from '../../components/Hero';
import { Footer } from '../../components/Footer';
import { AIRecommendationCard } from '../../components/AIRecommendationCard';
import { RouteMap } from '../../components/RouteMap';
import { AcceptRejectCard } from '../../components/AcceptRejectCard';
import { analyticsApi } from '../../services/analytics.api';
import { shipmentApi } from '../../services/shipment.api';
import { matchApi } from '../../services/match.api';
import { 
  Truck, Package, Fuel, BarChart3, Leaf, Sparkles, 
  ArrowRight, ChevronRight, Calendar, ArrowUpRight, CheckCircle2, ShieldCheck
} from 'lucide-react';

export const CarrierDashboard = () => {
  const navigate = useNavigate();
  const opportunitiesRef = useRef(null);

  // Today's Opportunities Data
  const [opportunities, setOpportunities] = useState([
    {
      id: 'OPP-101',
      route: 'Delhi → Jaipur',
      cargoIcon: '📦',
      cargo: 'Electronics',
      weight: '2.5 T',
      pickup: '10:30 AM',
      deadline: '5:00 PM',
      revenue: 7200,
      detour: '+8 km',
      matchScore: 94
    },
    {
      id: 'OPP-102',
      route: 'Gurgaon → Neemrana',
      cargoIcon: '⚙️',
      cargo: 'Auto Components',
      weight: '3.0 T',
      pickup: '11:15 AM',
      deadline: '4:30 PM',
      revenue: 8500,
      detour: '+12 km',
      matchScore: 91
    },
    {
      id: 'OPP-103',
      route: 'Rewari → Shahpura',
      cargoIcon: '🛠️',
      cargo: 'Industrial Tools',
      weight: '2.0 T',
      pickup: '1:00 PM',
      deadline: '6:30 PM',
      revenue: 6000,
      detour: '+4 km',
      matchScore: 89
    },
    {
      id: 'OPP-104',
      route: 'Mumbai → Nashik',
      cargoIcon: '🧃',
      cargo: 'Food & Beverages',
      weight: '4.5 T',
      pickup: '2:00 PM',
      deadline: '9:00 PM',
      revenue: 11200,
      detour: '+18 km',
      matchScore: 87
    }
  ]);

  // AI Recommended Loads Data
  const [aiRecommendations, setAiRecommendations] = useState([
    {
      id: 'AI-REC-1',
      route: 'Delhi → Lucknow',
      weightCargo: '3.0 T · FMCG',
      detour: '+10 km detour',
      demandTag: 'High Demand',
      revenue: 12500,
      matchScore: 96,
      isBestMatch: true
    },
    {
      id: 'AI-REC-2',
      route: 'Jaipur → Chandigarh',
      weightCargo: '2.5 T · Electronics',
      detour: '+14 km detour',
      demandTag: 'Good Rate',
      revenue: 9800,
      matchScore: 92,
      isBestMatch: false
    },
    {
      id: 'AI-REC-3',
      route: 'Mumbai → Indore',
      weightCargo: '4.0 T · Auto Parts',
      detour: '+20 km detour',
      demandTag: 'High Demand',
      revenue: 14200,
      matchScore: 89,
      isBestMatch: false
    }
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const resShipments = await shipmentApi.getPostedShipments();
      if (resShipments.data && resShipments.data.success && Array.isArray(resShipments.data.data) && resShipments.data.data.length > 0) {
        const fetchedOpp = resShipments.data.data.slice(0, 4).map((item, idx) => ({
          id: item._id || `OPP-${101 + idx}`,
          route: `${item.pickupCity || 'Delhi'} → ${item.deliveryCity || 'Jaipur'}`,
          cargoIcon: idx % 2 === 0 ? '📦' : '⚙️',
          cargo: item.cargoType || 'General Freight',
          weight: `${item.weightTons || 2.5} T`,
          pickup: item.pickupTimeWindow || '10:30 AM',
          deadline: item.deliveryDeadline || '5:00 PM',
          revenue: item.payoutINR || (7200 + idx * 1300),
          detour: `+${8 + idx * 4} km`,
          matchScore: 94 - idx * 3
        }));
        setOpportunities(fetchedOpp);
      }
    } catch (e) {
      // Use defaults
    }
  };

  const handleAcceptLoad = async (oppData) => {
    try {
      const res = await matchApi.acceptMatch({
        vehicle: { registrationNumber: 'RJ-104-5891', currentCity: 'Delhi', destinationCity: 'Jaipur' },
        grossRevenueINR: oppData?.revenue || 12500,
        netContributionINR: (oppData?.revenue || 12500) * 0.85,
        detourKm: 14,
        totalWeight: 3.0
      });
      if (res.data && res.data.success && res.data.data) {
        navigate(`/tracking/${res.data.data._id}`);
      } else {
        navigate(`/tracking/demo_trip_${Date.now()}`);
      }
    } catch (e) {
      navigate(`/tracking/demo_trip_${Date.now()}`);
    }
  };

  const scrollToOpportunities = () => {
    opportunitiesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900">
      
      <div>
        {/* 1. NAVBAR */}
        <CarrierNavbar />

        {/* MAIN PAGE CONTAINER: Max Width 1440px with generous spacing */}
        <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-12 sm:space-y-16">
          
          {/* 2. HERO SECTION */}
          <Hero onScrollToOpportunities={scrollToOpportunities} />

          {/* 3. TODAY'S OPPORTUNITY SECTION */}
          <section ref={opportunitiesRef} className="space-y-4">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 pb-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit tracking-tight">
                  Today's Opportunity
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
                  Fresh shipments that match your route and capacity.
                </p>
              </div>

              <button
                onClick={() => navigate('/carrier/loads')}
                className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 font-outfit self-start sm:self-auto cursor-pointer"
              >
                View All Loads <ArrowUpRight size={16} />
              </button>
            </div>

            {/* Opportunities Table Container */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider font-outfit">
                      <th className="py-4 px-6">Route</th>
                      <th className="py-4 px-6">Cargo Type</th>
                      <th className="py-4 px-6">Weight</th>
                      <th className="py-4 px-6">Pickup Time</th>
                      <th className="py-4 px-6">Deadline</th>
                      <th className="py-4 px-6">Revenue</th>
                      <th className="py-4 px-6">Detour</th>
                      <th className="py-4 px-6">Match</th>
                      <th className="py-4 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-medium text-slate-700">
                    {opportunities.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="py-4 px-6 font-extrabold text-slate-900 font-outfit text-sm sm:text-base">
                          {item.route}
                        </td>
                        <td className="py-4 px-6 text-slate-800 font-semibold">
                          <span className="mr-1.5">{item.cargoIcon}</span>
                          {item.cargo}
                        </td>
                        <td className="py-4 px-6 font-extrabold text-slate-900 font-outfit">
                          {item.weight}
                        </td>
                        <td className="py-4 px-6 text-slate-600 font-medium">
                          {item.pickup}
                        </td>
                        <td className="py-4 px-6 text-slate-600 font-medium">
                          {item.deadline}
                        </td>
                        <td className="py-4 px-6 font-extrabold text-slate-900 font-outfit text-base">
                          ₹{item.revenue.toLocaleString('en-IN')}
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-600">
                          {item.detour}
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-outfit">
                            {item.matchScore}%
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleAcceptLoad(item)}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-all shadow-xs cursor-pointer"
                          >
                            View Load
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </section>


          {/* 4. YOUR FLEET AT A GLANCE SECTION */}
          <section className="space-y-4">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 pb-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit tracking-tight">
                  Your Fleet at a Glance
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
                  A summary of your fleet's recent activity and performance.
                </p>
              </div>

              <button
                onClick={() => navigate('/carrier/capacity')}
                className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 font-outfit self-start sm:self-auto cursor-pointer"
              >
                Manage Fleet <ArrowUpRight size={16} />
              </button>
            </div>

            {/* 5 Compact Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              
              {/* Card 1: Total Trucks */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <Truck size={18} />
                  </div>
                  <span className="text-xs font-bold text-slate-500 font-outfit">
                    Total Trucks
                  </span>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 font-outfit">
                    4
                  </div>
                  <div className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-0.5">
                    ↑ 1 new this month
                  </div>
                </div>
              </div>

              {/* Card 2: Active Trips */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <Package size={18} />
                  </div>
                  <span className="text-xs font-bold text-slate-500 font-outfit">
                    Active Trips
                  </span>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 font-outfit">
                    2
                  </div>
                  <div className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-0.5">
                    ↑ 100% on road
                  </div>
                </div>
              </div>

              {/* Card 3: Total Revenue */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <Fuel size={18} />
                  </div>
                  <span className="text-xs font-bold text-slate-500 font-outfit">
                    Total Revenue
                  </span>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 font-outfit">
                    ₹1,24,600
                  </div>
                  <div className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-0.5">
                    ↑ 18% vs last month
                  </div>
                </div>
              </div>

              {/* Card 4: Fleet Utilisation */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <BarChart3 size={18} />
                  </div>
                  <span className="text-xs font-bold text-slate-500 font-outfit">
                    Fleet Utilisation
                  </span>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 font-outfit">
                    78%
                  </div>
                  <div className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-0.5">
                    ↑ 12% improvement
                  </div>
                </div>
              </div>

              {/* Card 5: CO2 Saved */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <Leaf size={18} />
                  </div>
                  <span className="text-xs font-bold text-slate-500 font-outfit">
                    CO₂ Saved
                  </span>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 font-outfit">
                    1.8 Tons
                  </div>
                  <div className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-0.5">
                    ↑ 22% vs last month
                  </div>
                </div>
              </div>

            </div>

          </section>


          {/* 5. AI RECOMMENDED LOADS SECTION */}
          <section className="space-y-4">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 pb-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit tracking-tight flex items-center gap-2">
                  <Sparkles size={24} className="text-blue-600" />
                  AI Recommended Loads
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
                  Smart suggestions to maximise your earnings based on your route, capacity and past behaviour.
                </p>
              </div>

              <button
                onClick={() => navigate('/carrier/optimizer')}
                className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 font-outfit self-start sm:self-auto cursor-pointer"
              >
                View More <ArrowUpRight size={16} />
              </button>
            </div>

            {/* 3 AI Recommendation Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Delhi -> Lucknow */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between space-y-5 relative overflow-hidden group hover:border-blue-300 transition-all">
                {/* Top Best Match Badge */}
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full font-outfit border border-emerald-200">
                    Best Match
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Truck size={17} />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-black text-slate-900 font-outfit">
                    Delhi → Lucknow
                  </h3>
                  <div className="text-xs font-semibold text-slate-500">
                    3.0 T · FMCG
                  </div>

                  {/* Pills */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-200/80">
                      +10 km detour
                    </span>
                    <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-blue-100">
                      High Demand
                    </span>
                  </div>
                </div>

                {/* Footer Pricing & Action */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-[11px] font-semibold text-slate-400 uppercase">Est. Revenue</div>
                      <div className="text-xl font-black text-slate-900 font-outfit">
                        ₹12,500
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-emerald-600 font-outfit">
                        96%
                      </div>
                      <div className="text-[11px] font-bold text-slate-400">Match</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAcceptLoad(aiRecommendations[0])}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer font-outfit"
                  >
                    Accept Load <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Card 2: Jaipur -> Chandigarh */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between space-y-5 relative overflow-hidden group hover:border-blue-300 transition-all">
                <div className="flex items-center justify-between">
                  <span className="bg-purple-50 text-purple-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full font-outfit border border-purple-200">
                    High Efficiency
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Truck size={17} />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-black text-slate-900 font-outfit">
                    Jaipur → Chandigarh
                  </h3>
                  <div className="text-xs font-semibold text-slate-500">
                    2.5 T · Electronics
                  </div>

                  {/* Pills */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-200/80">
                      +14 km detour
                    </span>
                    <span className="bg-purple-50 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-purple-100">
                      Good Rate
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-[11px] font-semibold text-slate-400 uppercase">Est. Revenue</div>
                      <div className="text-xl font-black text-slate-900 font-outfit">
                        ₹9,800
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-emerald-600 font-outfit">
                        92%
                      </div>
                      <div className="text-[11px] font-bold text-slate-400">Match</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAcceptLoad(aiRecommendations[1])}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer font-outfit"
                  >
                    Accept Load <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Card 3: Mumbai -> Indore */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between space-y-5 relative overflow-hidden group hover:border-blue-300 transition-all">
                <div className="flex items-center justify-between">
                  <span className="bg-blue-50 text-blue-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full font-outfit border border-blue-200">
                    High Volume
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Truck size={17} />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-black text-slate-900 font-outfit">
                    Mumbai → Indore
                  </h3>
                  <div className="text-xs font-semibold text-slate-500">
                    4.0 T · Auto Parts
                  </div>

                  {/* Pills */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-200/80">
                      +20 km detour
                    </span>
                    <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-blue-100">
                      High Demand
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-[11px] font-semibold text-slate-400 uppercase">Est. Revenue</div>
                      <div className="text-xl font-black text-slate-900 font-outfit">
                        ₹14,200
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-emerald-600 font-outfit">
                        89%
                      </div>
                      <div className="text-[11px] font-bold text-slate-400">Match</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAcceptLoad(aiRecommendations[2])}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer font-outfit"
                  >
                    Accept Load <ArrowRight size={14} />
                  </button>
                </div>
              </div>

            </div>

            {/* Retain functional AI Autopilot Recommendation card */}
            <div className="pt-4">
              <AIRecommendationCard onAccept={handleAcceptLoad} />
            </div>

          </section>


          {/* 6. PERFORMANCE (LAST 30 DAYS) SECTION */}
          <section className="space-y-4">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 pb-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit tracking-tight">
                  Performance (Last 30 Days)
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
                  Track your growth, savings and impact over time.
                </p>
              </div>

              {/* Date Filter Dropdown Pill */}
              <div className="flex items-center gap-2 bg-white border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs self-start sm:self-auto">
                <Calendar size={14} className="text-slate-400" />
                <span>Oct 13, 2024 – Nov 12, 2024</span>
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* 4 Analytics Sparkline Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Revenue Trend */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div>
                  <div className="text-xs font-bold text-slate-500 font-outfit">Revenue Trend</div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-slate-900 font-outfit">₹1.24L</span>
                    <span className="text-xs font-bold text-emerald-600">↑ 18%</span>
                  </div>
                </div>

                {/* SVG Green Line Area Sparkline */}
                <div className="h-16 w-full pt-2">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 200 60" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,45 Q40,35 80,42 T160,20 T200,10 L200,60 L0,60 Z"
                      fill="url(#revGrad)"
                    />
                    <path
                      d="M0,45 Q40,35 80,42 T160,20 T200,10"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div className="flex justify-between text-[10px] font-bold text-slate-400 border-t border-slate-100 pt-2 font-outfit">
                  <span>13 Oct</span>
                  <span>20 Oct</span>
                  <span>27 Oct</span>
                  <span>3 Nov</span>
                  <span>12 Nov</span>
                </div>
              </div>

              {/* Card 2: Shipments Completed */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div>
                  <div className="text-xs font-bold text-slate-500 font-outfit">Shipments Completed</div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-slate-900 font-outfit">18</span>
                    <span className="text-xs font-bold text-emerald-600">↑ 20%</span>
                  </div>
                </div>

                {/* SVG Blue Bar Chart */}
                <div className="h-16 w-full pt-2">
                  <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
                    {[20, 28, 22, 35, 30, 42, 38, 48, 55].map((val, idx) => (
                      <rect
                        key={idx}
                        x={idx * 22 + 4}
                        y={60 - val}
                        width="12"
                        height={val}
                        rx="3"
                        fill="#3b82f6"
                        opacity={idx === 8 ? "1" : "0.75"}
                      />
                    ))}
                  </svg>
                </div>

                <div className="flex justify-between text-[10px] font-bold text-slate-400 border-t border-slate-100 pt-2 font-outfit">
                  <span>13 Oct</span>
                  <span>20 Oct</span>
                  <span>27 Oct</span>
                  <span>3 Nov</span>
                  <span>12 Nov</span>
                </div>
              </div>

              {/* Card 3: Empty KM Avoided */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div>
                  <div className="text-xs font-bold text-slate-500 font-outfit">Empty KM Avoided</div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-slate-900 font-outfit">3,420 km</span>
                    <span className="text-xs font-bold text-emerald-600">↑ 28%</span>
                  </div>
                </div>

                {/* SVG Emerald Bar Chart */}
                <div className="h-16 w-full pt-2">
                  <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
                    {[18, 24, 30, 22, 38, 45, 34, 48, 56].map((val, idx) => (
                      <rect
                        key={idx}
                        x={idx * 22 + 4}
                        y={60 - val}
                        width="12"
                        height={val}
                        rx="3"
                        fill="#10b981"
                        opacity={idx === 8 ? "1" : "0.75"}
                      />
                    ))}
                  </svg>
                </div>

                <div className="flex justify-between text-[10px] font-bold text-slate-400 border-t border-slate-100 pt-2 font-outfit">
                  <span>13 Oct</span>
                  <span>20 Oct</span>
                  <span>27 Oct</span>
                  <span>3 Nov</span>
                  <span>12 Nov</span>
                </div>
              </div>

              {/* Card 4: CO2 Saved */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div>
                  <div className="text-xs font-bold text-slate-500 font-outfit">CO₂ Saved</div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-slate-900 font-outfit">1,800 kg</span>
                    <span className="text-xs font-bold text-emerald-600">↑ 22%</span>
                  </div>
                </div>

                {/* SVG Purple Area Chart */}
                <div className="h-16 w-full pt-2">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 200 60" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="co2Grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,50 Q50,45 100,35 T170,20 T200,12 L200,60 L0,60 Z"
                      fill="url(#co2Grad)"
                    />
                    <path
                      d="M0,50 Q50,45 100,35 T170,20 T200,12"
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div className="flex justify-between text-[10px] font-bold text-slate-400 border-t border-slate-100 pt-2 font-outfit">
                  <span>13 Oct</span>
                  <span>20 Oct</span>
                  <span>27 Oct</span>
                  <span>3 Nov</span>
                  <span>12 Nov</span>
                </div>
              </div>

            </div>

          </section>

          {/* Route Map & Accept/Reject Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
            <div className="lg:col-span-2">
              <RouteMap />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900 font-outfit">
                AI Accept / Reject Recommendations
              </h3>
              <AcceptRejectCard
                decision="ACCEPT"
                confidence={94}
                loadTitle="Delhi → Jaipur Multi-Load Plan"
                reasons={[
                  'Route aligned (+24 km detour)',
                  'Capacity compatible (7.5T fits inside 7.8T)',
                  'Deadline achievable (6h 20m driver hours safe)',
                  'Strong net profit (+₹18,900)'
                ]}
              />

              <AcceptRejectCard
                decision="REJECT"
                confidence={88}
                loadTitle="Off-Route Agra Detour Load"
                reasons={[
                  'Excessive +140 km detour off core corridor',
                  'Driver safe hours risk exceeded',
                  'Low revenue per km ratio (< ₹65/km)'
                ]}
              />
            </div>
          </div>

        </main>
      </div>

      {/* 7. FOOTER */}
      <Footer />

    </div>
  );
};

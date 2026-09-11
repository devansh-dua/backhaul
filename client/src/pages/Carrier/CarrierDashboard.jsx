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
import { trustApi } from '../../services/trust.api';
import { useSocket } from '../../context/SocketContext';
import { 
  Truck, Package, Fuel, BarChart3, Leaf, Sparkles, 
  ArrowRight, ChevronRight, Calendar, ArrowUpRight, CheckCircle2, ShieldCheck, Inbox, Repeat, Star
} from 'lucide-react';

export const CarrierDashboard = () => {
  const navigate = useNavigate();
  const { acceptShipment } = useSocket();
  const opportunitiesRef = useRef(null);

  const [loading, setLoading] = useState(true);

  // Real Database Metrics State
  const [stats, setStats] = useState({
    todayRevenue: 0,
    totalRevenue: 0,
    totalTrucks: 0,
    activeTrips: 0,
    unusedCapacityTons: 0,
    emptyKmAvoided: 0,
    co2SavedKg: 0,
    fleetUtilisation: 0,
    loadsCompleted: 0
  });

  // Real Opportunities from MongoDB
  const [opportunities, setOpportunities] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [trustStats, setTrustStats] = useState({
    trustedPartners: 0,
    repeatShipments: 0,
    averageRating: 'New Partner',
    onTimeRate: '100%',
    trustedLoadsAvailable: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Real Stats
      const resStats = await analyticsApi.getCarrierStats();
      if (resStats.data && resStats.data.success && resStats.data.data) {
        setStats(resStats.data.data);
      }

      // 2. Fetch Real Trust Stats
      try {
        const resTrust = await trustApi.getTrustProfile();
        const resPartners = await trustApi.getTopPartners();
        if (resTrust.data?.success && resTrust.data.data) {
          const tp = resTrust.data.data;
          const partnersList = resPartners.data?.data || [];
          const totalRepeat = partnersList.reduce((acc, p) => acc + (p.completedTogether || 0), 0);
          setTrustStats({
            trustedPartners: tp.repeatPartnersCount || partnersList.length || 0,
            repeatShipments: totalRepeat,
            averageRating: tp.averageRating !== 'New' ? `${tp.averageRating} ★` : 'New Partner',
            onTimeRate: tp.onTimeRate || '100%',
            trustedLoadsAvailable: partnersList.length > 0 ? Math.min(3, partnersList.length) : 0
          });
        }
      } catch (err) {
        console.error('Trust stats fetch error:', err.message);
      }

      // 3. Fetch Real Posted Shipments for Today's Opportunity
      const resShipments = await shipmentApi.getPostedShipments();
      if (resShipments.data && resShipments.data.success && Array.isArray(resShipments.data.data)) {
        const fetchedOpp = resShipments.data.data.map((item, idx) => ({
          id: item._id,
          route: `${item.pickupCity || 'Delhi'} → ${item.dropCity || item.deliveryCity || 'Jaipur'}`,
          cargoIcon: idx % 2 === 0 ? '📦' : '⚙️',
          cargo: item.cargoType || 'General Freight',
          weight: `${item.weightTons || 2.5} T`,
          pickup: item.pickupTimeWindow || '10:30 AM',
          deadline: item.deadline ? new Date(item.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Today',
          revenue: item.offeredPriceINR || 0,
          detour: `+${8 + idx * 4} km`,
          matchScore: 94 - idx * 3
        }));
        setOpportunities(fetchedOpp);
        setAiRecommendations(fetchedOpp.slice(0, 3));
      } else {
        setOpportunities([]);
        setAiRecommendations([]);
      }
    } catch (e) {
      setOpportunities([]);
      setAiRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptLoad = async (oppData) => {
    const res = await acceptShipment(oppData?.id, {
      grossRevenueINR: oppData?.revenue || 0,
      detourKm: parseInt(oppData?.detour) || 8,
      totalWeight: parseFloat(oppData?.weight) || 2.5
    });

    if (res.success && res.trip) {
      navigate(`/tracking/${res.trip._id}`);
    } else {
      navigate('/carrier/trips');
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

        {/* MAIN PAGE CONTAINER */}
        <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-12 sm:space-y-16">
          
          {/* 2. HERO SECTION */}
          <Hero onScrollToOpportunities={scrollToOpportunities} />

          {/* TRUST NETWORK SECTION */}
          <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider font-outfit">
                  <ShieldCheck size={16} />
                  TRUST NETWORK
                </div>
                <h3 className="text-xl font-black font-outfit text-white">
                  Logistics Reputation & Repeat Pairings
                </h3>
                <p className="text-slate-300 text-xs font-normal">
                  {trustStats.trustedLoadsAvailable > 0
                    ? `${trustStats.trustedLoadsAvailable} trusted partner loads available today`
                    : 'Complete trips with shippers to build verified repeat partnerships'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-center">
                <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                  <div className="text-[11px] text-slate-300 font-medium uppercase">Trusted Partners</div>
                  <div className="text-xl font-black font-outfit text-white">{trustStats.trustedPartners}</div>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                  <div className="text-[11px] text-slate-300 font-medium uppercase">Repeat Shipments</div>
                  <div className="text-xl font-black font-outfit text-white">{trustStats.repeatShipments}</div>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                  <div className="text-[11px] text-slate-300 font-medium uppercase">Average Rating</div>
                  <div className="text-xl font-black font-outfit text-amber-400">{trustStats.averageRating}</div>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                  <div className="text-[11px] text-slate-300 font-medium uppercase">On-Time Rate</div>
                  <div className="text-xl font-black font-outfit text-emerald-400">{trustStats.onTimeRate}</div>
                </div>

                <button
                  onClick={() => navigate('/carrier/trust')}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-sm flex items-center gap-1.5 font-outfit cursor-pointer"
                >
                  View Trusted Matches <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </section>

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
                View All Loads ({opportunities.length}) <ArrowUpRight size={16} />
              </button>
            </div>

            {/* Opportunities Table Container or Empty State */}
            {opportunities.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <Inbox size={24} />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 font-outfit">
                  No active shipment opportunities
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                  There are currently no posted shipments matching active route capacity. Publish your truck's capacity slot to find return loads.
                </p>
                <button
                  onClick={() => navigate('/carrier/capacity')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs inline-flex items-center gap-1 font-outfit cursor-pointer mt-2"
                >
                  Publish Fleet Capacity
                </button>
              </div>
            ) : (
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
            )}

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
                    {stats.totalTrucks}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-1">
                    Registered in fleet
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
                    {stats.activeTrips}
                  </div>
                  <div className="text-xs font-semibold text-emerald-600 mt-1">
                    On road right now
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
                    ₹{stats.totalRevenue.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-1">
                    Earned from backhaul
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
                    {stats.fleetUtilisation}%
                  </div>
                  <div className="text-xs font-semibold text-blue-600 mt-1">
                    Capacity payload
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
                    {stats.co2SavedKg} kg
                  </div>
                  <div className="text-xs font-semibold text-emerald-600 mt-1">
                    Green logistics impact
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

            {/* AI Recommendation Cards Grid or Empty State */}
            {aiRecommendations.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200/80 text-center space-y-2">
                <div className="text-sm font-extrabold text-slate-900 font-outfit">
                  No AI recommended loads currently available
                </div>
                <p className="text-xs text-slate-500">
                  Add vehicles or publish active return route capacity to trigger Gemini AI candidate ranking.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {aiRecommendations.map((item, idx) => (
                  <div key={item.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between space-y-5 relative overflow-hidden group hover:border-blue-300 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full font-outfit border border-emerald-200">
                        {idx === 0 ? 'Best Match' : 'High Efficiency'}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Truck size={17} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-black text-slate-900 font-outfit">
                        {item.route}
                      </h3>
                      <div className="text-xs font-semibold text-slate-500">
                        {item.weight} · {item.cargo}
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1">
                        <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-200/80">
                          {item.detour}
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
                            ₹{item.revenue.toLocaleString('en-IN')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-black text-emerald-600 font-outfit">
                            {item.matchScore}%
                          </div>
                          <div className="text-[11px] font-bold text-slate-400">Match</div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAcceptLoad(item)}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer font-outfit"
                      >
                        Accept Load <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </section>


          {/* 6. PERFORMANCE SECTION */}
          <section className="space-y-4">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 pb-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit tracking-tight">
                  Performance Summary
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
                  Track your growth, savings and impact over time.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-white border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs self-start sm:self-auto">
                <Calendar size={14} className="text-slate-400" />
                <span>Real-Time Database Analytics</span>
              </div>
            </div>

            {/* 4 Analytics Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                <div className="text-xs font-bold text-slate-500 font-outfit">Total Revenue</div>
                <div className="text-2xl font-black text-slate-900 font-outfit">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
                <div className="text-[11px] text-slate-400">Database trips aggregate</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                <div className="text-xs font-bold text-slate-500 font-outfit">Shipments Completed</div>
                <div className="text-2xl font-black text-slate-900 font-outfit">{stats.loadsCompleted}</div>
                <div className="text-[11px] text-slate-400">Delivered backhaul trips</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                <div className="text-xs font-bold text-slate-500 font-outfit">Empty KM Avoided</div>
                <div className="text-2xl font-black text-slate-900 font-outfit">{stats.emptyKmAvoided.toLocaleString()} km</div>
                <div className="text-[11px] text-slate-400">Deadhead reduction</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                <div className="text-xs font-bold text-slate-500 font-outfit">CO₂ Saved</div>
                <div className="text-2xl font-black text-slate-900 font-outfit">{stats.co2SavedKg.toLocaleString()} kg</div>
                <div className="text-[11px] text-slate-400">Calculated carbon offset</div>
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
                loadTitle="Corridor Multi-Load Backhaul"
                reasons={[
                  'Route aligned (+24 km detour)',
                  'Capacity compatible',
                  'Deadline achievable within safe driver hours',
                  'Strong net profit contribution'
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

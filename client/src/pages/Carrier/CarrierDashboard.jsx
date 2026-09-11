import React, { useState, useEffect, useRef } from 'react';
import { CarrierNavbar } from '../../components/Navbar';
import { StatCard } from '../../components/StatCard';
import { AIRecommendationCard } from '../../components/AIRecommendationCard';
import { RouteMap } from '../../components/RouteMap';
import { AcceptRejectCard } from '../../components/AcceptRejectCard';
import { analyticsApi } from '../../services/analytics.api';
import { shipmentApi } from '../../services/shipment.api';
import { matchApi } from '../../services/match.api';
import { DollarSign, Truck, ShieldCheck, TrendingUp, Zap, ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CarrierDashboard = () => {
  const [stats, setStats] = useState({
    todayRevenue: 21700,
    unusedCapacityTons: 7.8,
    emptyKmAvoided: 3420,
    fleetUtilisation: 88,
    co2SavedKg: 2907
  });

  const [opportunities, setOpportunities] = useState([
    {
      id: 'OPP-101',
      route: 'Delhi → Jaipur',
      cargo: 'Electronics Hardware',
      weight: '2.5T',
      pickup: '10:30 AM',
      deadline: '5:00 PM',
      revenue: 7200,
      detour: '+8 km',
      matchScore: 94,
      status: 'AVAILABLE'
    },
    {
      id: 'OPP-102',
      route: 'Gurgaon → Neemrana',
      cargo: 'Auto Components',
      weight: '3.0T',
      pickup: '11:15 AM',
      deadline: '4:30 PM',
      revenue: 8500,
      detour: '+12 km',
      matchScore: 91,
      status: 'AVAILABLE'
    },
    {
      id: 'OPP-103',
      route: 'Rewari → Shahpura',
      cargo: 'Industrial Tools',
      weight: '2.0T',
      pickup: '01:00 PM',
      deadline: '6:30 PM',
      revenue: 6000,
      detour: '+4 km',
      matchScore: 89,
      status: 'AVAILABLE'
    }
  ]);

  const [acceptedTrip, setAcceptedTrip] = useState(null);
  const opportunitiesRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const resStats = await analyticsApi.getCarrierStats();
      if (resStats.data && resStats.data.success && resStats.data.data) {
        setStats(resStats.data.data);
      }
      const resShipments = await shipmentApi.getPostedShipments();
      if (resShipments.data && resShipments.data.success && Array.isArray(resShipments.data.data) && resShipments.data.data.length > 0) {
        const backendOpp = resShipments.data.data.map((item, index) => ({
          id: item._id || `OPP-${104 + index}`,
          route: `${item.pickupCity || 'Delhi'} → ${item.deliveryCity || 'Jaipur'}`,
          cargo: `${item.cargoType || 'General Freight'}`,
          weight: `${item.weightTons || 2.5}T`,
          pickup: item.pickupTimeWindow || '10:30 AM',
          deadline: item.deliveryDeadline || '5:00 PM',
          revenue: item.payoutINR || (7000 + index * 1200),
          detour: `+${8 + index * 4} km`,
          matchScore: 94 - index * 3,
          status: 'AVAILABLE'
        }));
        setOpportunities(backendOpp);
      }
    } catch (e) {
      console.log('Using default carrier opportunities');
    }
  };

  const handleAcceptPlan = async (recData) => {
    try {
      const res = await matchApi.acceptMatch({
        vehicle: { registrationNumber: 'RJ-104-5891', currentCity: 'Delhi', destinationCity: 'Jaipur' },
        grossRevenueINR: recData?.grossRevenueINR || 21700,
        netContributionINR: recData?.netContributionINR || 18900,
        detourKm: recData?.detourKm || 24,
        totalWeight: 7.5
      });
      if (res.data && res.data.success && res.data.data) {
        setAcceptedTrip(res.data.data);
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
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      <CarrierNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
        {/* Header Glass Panel */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <span className="badge-purple">
              <Zap size={14} /> CARRIER OPTIMIZATION ENGINE
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-outfit tracking-tight leading-tight">
              Turn Empty Miles Into Guaranteed Profit
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
              BackhaulX surfaces compatible freight for your truck's scheduled return route — eliminating empty deadhead runs.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button onClick={scrollToOpportunities} className="btn-primary text-xs px-5 py-2.5">
                View Today's Opportunities <ArrowRight size={15} />
              </button>
              <button onClick={() => navigate('/carrier/capacity')} className="btn-secondary text-xs px-4 py-2.5">
                Manage Fleet Capacity
              </button>
            </div>
          </div>
        </div>

        {/* 5-Column Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard title="Today's Revenue" value={`₹${(stats.todayRevenue || 21700).toLocaleString('en-IN')}`} change="18.4%" isPositive={true} icon={DollarSign} />
          <StatCard title="Unused Capacity" value={`${stats.unusedCapacityTons || 7.8} Tons`} change="RJ-104 Available" isPositive={true} icon={Truck} />
          <StatCard title="Empty KM Avoided" value={`${(stats.emptyKmAvoided || 3420).toLocaleString()} km`} change="260 km today" isPositive={true} icon={TrendingUp} />
          <StatCard title="Fleet Utilisation" value={`${stats.fleetUtilisation || 88}%`} change="Optimal Knapsack" isPositive={true} icon={Zap} />
          <StatCard title="CO2 Saved" value={`${(stats.co2SavedKg || 2907).toLocaleString()} kg`} change="Green Logistics" isPositive={true} icon={ShieldCheck} />
        </div>

        {/* AI Autopilot Recommendation Card */}
        <div>
          <AIRecommendationCard onAccept={handleAcceptPlan} />
        </div>

        {/* Opportunities Table Glass Panel */}
        <div ref={opportunitiesRef} className="glass-panel p-6 sm:p-8 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
            <div>
              <span className="badge-cyan">AVAILABLE CAPACITY MATCHES</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-outfit tracking-tight mt-1">
                Today's Backhaul Opportunities
              </h2>
            </div>
            <button
              onClick={() => navigate('/carrier/loads')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 font-outfit"
            >
              View All Loads ({opportunities.length}) <ChevronRight size={16} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="tech-table w-full">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Cargo Type</th>
                  <th>Weight</th>
                  <th>Pickup / Deadline</th>
                  <th>Revenue</th>
                  <th>Detour</th>
                  <th>Match Score</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {opportunities.map((opp) => (
                  <tr key={opp.id} className="hover:bg-purple-50/40 transition-colors">
                    <td className="font-extrabold text-slate-900 font-outfit">{opp.route}</td>
                    <td className="font-medium text-slate-700">{opp.cargo}</td>
                    <td className="font-semibold text-slate-900 font-outfit">{opp.weight}</td>
                    <td className="text-xs text-slate-500 font-normal">
                      <div>Pickup: {opp.pickup}</div>
                      <div>Deadline: {opp.deadline}</div>
                    </td>
                    <td className="font-extrabold text-slate-900 font-outfit text-base">
                      ₹{opp.revenue.toLocaleString('en-IN')}
                    </td>
                    <td className="font-semibold text-amber-600">
                      {opp.detour}
                    </td>
                    <td>
                      <span className="badge-emerald font-semibold">{opp.matchScore}% Match</span>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => handleAcceptPlan({ grossRevenueINR: opp.revenue, detourKm: parseInt(opp.detour) || 12 })}
                        className="btn-primary text-xs px-3.5 py-1.5 inline-flex items-center gap-1"
                      >
                        View Load <ArrowRight size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Route Corridor Map & AI Accept/Reject Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RouteMap />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900 font-outfit">AI Accept / Reject Recommendations</h3>
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
  );
};


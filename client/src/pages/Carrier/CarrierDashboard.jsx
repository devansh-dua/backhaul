import React, { useState, useEffect } from 'react';
import { CarrierNavbar } from '../../components/Navbar';
import { StatCard } from '../../components/StatCard';
import { AIRecommendationCard } from '../../components/AIRecommendationCard';
import { RouteMap } from '../../components/RouteMap';
import { AcceptRejectCard } from '../../components/AcceptRejectCard';
import { analyticsApi } from '../../services/analytics.api';
import { matchApi } from '../../services/match.api';
import { DollarSign, Truck, ShieldCheck, TrendingUp, Zap, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CarrierDashboard = () => {
  const [stats, setStats] = useState({
    todayRevenue: 21700,
    totalRevenue: 128450,
    unusedCapacityTons: 7.8,
    emptyKmAvoided: 3420,
    co2SavedKg: 2907,
    fleetUtilisation: 88
  });
  const [acceptedTrip, setAcceptedTrip] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await analyticsApi.getCarrierStats();
      if (res.data && res.data.success && res.data.data) {
        setStats(res.data.data);
      }
    } catch (e) {
      console.log('Using default carrier metrics');
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

  return (
    <div className="min-h-screen bg-white text-zinc-900 pb-16">
      <CarrierNavbar />

      <main className="max-w-6xl mx-auto px-6 pt-8 space-y-8">
        {/* Header Title Banner */}
        <div className="space-y-1 pb-4 border-b border-zinc-200">
          <span className="text-xs font-mono tracking-widest uppercase text-zinc-400 font-semibold">
            Carrier Optimization Engine
          </span>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
            Turn Empty Miles Into Guaranteed Profit
          </h1>
        </div>

        {/* 5-Column Stat Card Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard title="Today's Revenue" value="₹21,700" change="18.4%" isPositive={true} icon={DollarSign} />
          <StatCard title="Unused Capacity" value={`${stats.unusedCapacityTons} Tons`} change="RJ-104 Available" isPositive={true} icon={Truck} />
          <StatCard title="Empty KM Avoided" value={`${stats.emptyKmAvoided.toLocaleString()} km`} change="260 km today" isPositive={true} icon={TrendingUp} />
          <StatCard title="Fleet Utilisation" value={`${stats.fleetUtilisation}%`} change="Optimal Knapsack" isPositive={true} icon={Zap} />
          <StatCard title="CO2 Saved" value={`${stats.co2SavedKg.toLocaleString()} kg`} change="Green Logistics" isPositive={true} icon={ShieldCheck} />
        </div>

        {/* AI Autopilot Executive Recommendation Banner */}
        <div>
          <AIRecommendationCard onAccept={handleAcceptPlan} />
        </div>

        {/* Route Corridor Map & Accept/Reject Intelligence Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RouteMap />
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-zinc-900">
              AI Accept / Reject Recommendation
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
  );
};

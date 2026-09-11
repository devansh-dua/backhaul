import React, { useState, useEffect, useRef } from 'react';
import { CarrierNavbar } from '../../components/Navbar';
import { StatCard } from '../../components/StatCard';
import { AIRecommendationCard } from '../../components/AIRecommendationCard';
import { RouteMap } from '../../components/RouteMap';
import { AcceptRejectCard } from '../../components/AcceptRejectCard';
import { analyticsApi } from '../../services/analytics.api';
import { shipmentApi } from '../../services/shipment.api';
import { matchApi } from '../../services/match.api';
import { DollarSign, Truck, ShieldCheck, TrendingUp, Zap, ArrowRight, ChevronRight } from 'lucide-react';
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
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '3rem', color: '#0f172a' }}>
      <CarrierNavbar />

      <main className="app-container" style={{ pt: '2rem', spaceY: '2rem' }}>
        {/* Header Title Banner */}
        <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', marginTop: '1rem' }}>
          <span className="badge badge-purple" style={{ marginBottom: '0.75rem' }}>
            <Zap size={14} /> CARRIER OPTIMIZATION ENGINE
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.03em' }}>
            Turn Empty Miles Into Guaranteed Profit
          </h1>
          <p style={{ color: '#475569', fontSize: '1rem', marginTop: '4px', fontWeight: '500' }}>
            BackhaulX finds the most profitable way to use the capacity your truck already has — without creating another trip.
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
            <button onClick={scrollToOpportunities} className="btn-primary">
              VIEW TODAY'S OPPORTUNITIES <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate('/carrier/capacity')} className="btn-secondary">
              VIEW FLEET
            </button>
          </div>
        </div>

        {/* 5-Column Stat Cards matching Landing Page */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', margin: '2rem 0' }}>
          <StatCard title="Today's Revenue" value={`₹${(stats.todayRevenue || 21700).toLocaleString('en-IN')}`} change="18.4%" isPositive={true} icon={DollarSign} />
          <StatCard title="Unused Capacity" value={`${stats.unusedCapacityTons || 7.8} Tons`} change="RJ-104 Available" isPositive={true} icon={Truck} />
          <StatCard title="Empty KM Avoided" value={`${(stats.emptyKmAvoided || 3420).toLocaleString()} km`} change="260 km today" isPositive={true} icon={TrendingUp} />
          <StatCard title="Fleet Utilisation" value={`${stats.fleetUtilisation || 88}%`} change="Optimal Knapsack" isPositive={true} icon={Zap} />
          <StatCard title="CO2 Saved" value={`${(stats.co2SavedKg || 2907).toLocaleString()} kg`} change="Green Logistics" isPositive={true} icon={ShieldCheck} />
        </div>

        {/* AI Autopilot Executive Recommendation Banner */}
        <div style={{ marginBottom: '2rem' }}>
          <AIRecommendationCard onAccept={handleAcceptPlan} />
        </div>

        {/* Today's Opportunities Data Table */}
        <div ref={opportunitiesRef} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>AVAILABLE CAPACITY MATCHES</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>Today's Backhaul Opportunities</h2>
            </div>
            <button onClick={() => navigate('/carrier/loads')} style={{ background: 'transparent', border: 'none', color: '#2563eb', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
              View All Loads ({opportunities.length}) <ChevronRight size={16} />
            </button>
          </div>

          <div className="table-container">
            <table className="tech-table">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Cargo Type</th>
                  <th>Weight</th>
                  <th>Pickup / Deadline</th>
                  <th>Revenue</th>
                  <th>Detour</th>
                  <th>Match Score</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {opportunities.map((opp) => (
                  <tr key={opp.id}>
                    <td style={{ fontWeight: '800', color: '#0f172a' }}>{opp.route}</td>
                    <td style={{ fontWeight: '600', color: '#334155' }}>{opp.cargo}</td>
                    <td className="font-mono-num" style={{ fontWeight: '700' }}>{opp.weight}</td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      <div>Pickup: {opp.pickup}</div>
                      <div>Deadline: {opp.deadline}</div>
                    </td>
                    <td className="font-mono-num" style={{ fontWeight: '800', color: '#0f172a' }}>
                      ₹{opp.revenue.toLocaleString('en-IN')}
                    </td>
                    <td className="font-mono-num" style={{ fontWeight: '700', color: '#0284c7' }}>
                      {opp.detour}
                    </td>
                    <td>
                      <span className="badge badge-emerald">{opp.matchScore}% MATCH</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleAcceptPlan({ grossRevenueINR: opp.revenue, detourKm: parseInt(opp.detour) || 12 })}
                        className="btn-primary"
                        style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                      >
                        VIEW LOAD
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Route Corridor Map & Accept/Reject Intelligence Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <RouteMap />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>AI Accept / Reject Recommendation</h3>
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

import { ShipperNavbar } from '../../components/Navbar';
import { StatCard } from '../../components/StatCard';
import { DollarSign, Package, TrendingUp, ShieldCheck } from 'lucide-react';

export const ShipperAnalytics = () => {
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '3rem', color: '#0f172a' }}>
      <ShipperNavbar />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem 1.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>Shipper Logistics Analytics</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Savings analytics, on-time delivery rates, and carbon offset tracking</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <StatCard title="Total Freight Cost Saved" value="₹32,450" change="32% below spot" isPositive={true} icon={DollarSign} color="#059669" />
          <StatCard title="On-Time Delivery Rate" value="99.2%" change="+1.4%" isPositive={true} icon={ShieldCheck} color="#2563eb" />
          <StatCard title="Shipments Completed" value="48" change="Zero damages" isPositive={true} icon={Package} color="#0284c7" />
          <StatCard title="CO2 Offset" value="1,840 kg" change="Green Freight" isPositive={true} icon={TrendingUp} color="#7c3aed" />
        </div>
      </div>
    </div>
  );
};

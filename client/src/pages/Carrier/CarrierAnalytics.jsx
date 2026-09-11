import { CarrierNavbar } from '../../components/Navbar';
import { StatCard } from '../../components/StatCard';
import { DollarSign, TrendingUp, Zap, ShieldCheck, BarChart3 } from 'lucide-react';

export const CarrierAnalytics = () => {
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '3rem', color: '#0f172a' }}>
      <CarrierNavbar />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem 1.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>Utilisation & Revenue Analytics</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Financial performance, empty KM reduction, and environmental CO2 impact</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <StatCard title="Monthly Revenue" value="₹1,28,450" change="22.4%" isPositive={true} icon={DollarSign} color="#059669" />
          <StatCard title="Net Profit Margin" value="87.2%" change="Low Detours" isPositive={true} icon={TrendingUp} color="#2563eb" />
          <StatCard title="Empty KM Avoided" value="3,420 km" change="Corridor Matching" isPositive={true} icon={Zap} color="#0284c7" />
          <StatCard title="CO2 Emissions Saved" value="2,907 kg" change="0.85kg / km" isPositive={true} icon={ShieldCheck} color="#059669" />
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: '800', marginBottom: '1rem' }}>FLEET UTILISATION VS CO2 SAVINGS HISTORY</h3>
          <div style={{ width: '100%', height: '220px', display: 'flex', alignItems: 'flex-end', gap: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
            {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((w, idx) => (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ width: '60%', height: `${65 + idx * 8}%`, background: 'linear-gradient(180deg, #059669, #e2e8f0)', borderRadius: '6px 6px 0 0' }} />
                <span style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '8px', fontWeight: '600' }}>{w}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

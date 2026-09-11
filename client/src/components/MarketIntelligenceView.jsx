import { TrendingUp, BarChart, DollarSign, Activity } from 'lucide-react';

export const MarketIntelligenceView = () => {
  const trends = [
    { day: 'Mon', avgPrice: 18200, loads: 12 },
    { day: 'Tue', avgPrice: 19400, loads: 15 },
    { day: 'Wed', avgPrice: 21700, loads: 18 },
    { day: 'Thu', avgPrice: 20500, loads: 14 },
    { day: 'Fri', avgPrice: 22800, loads: 21 },
    { day: 'Sat', avgPrice: 24100, loads: 25 },
    { day: 'Sun', avgPrice: 21900, loads: 19 }
  ];

  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: '800' }}>MARKET INTELLIGENCE & CORRIDOR RATES</h3>
          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Delhi → Jaipur Corridor (NH 48) Real-Time Supply/Demand Metrics</p>
        </div>
        <span className="badge badge-emerald">HIGH DEMAND CORRIDOR</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Supply / Demand Index</div>
          <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#059669', marginTop: '4px' }}>1.42 (High Demand)</div>
        </div>

        <div className="glass-card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Avg Backhaul Rate</div>
          <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0284c7', marginTop: '4px' }}>₹42.50 / km</div>
        </div>

        <div className="glass-card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Available Corridor Capacity</div>
          <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#7c3aed', marginTop: '4px' }}>42.5 Tons</div>
        </div>

        <div className="glass-card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Average Detour</div>
          <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#d97706', marginTop: '4px' }}>18.4 km</div>
        </div>
      </div>

      {/* Bar Chart Representation of Corridor Rate Trend */}
      <div>
        <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b', marginBottom: '0.75rem' }}>7-DAY AVERAGE BACKHAUL RATE TREND (INR)</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '140px', padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
          {trends.map((item, idx) => (
            <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
              <div
                style={{
                  width: '100%',
                  height: `${(item.avgPrice / 25000) * 100}%`,
                  background: 'linear-gradient(180deg, #2563eb 0%, #cbd5e1 100%)',
                  borderRadius: '6px 6px 0 0',
                  position: 'relative'
                }}
              >
                <span style={{ position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.65rem', color: '#2563eb', fontWeight: '800' }}>
                  ₹{(item.avgPrice / 1000).toFixed(1)}k
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px', fontWeight: '600' }}>{item.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

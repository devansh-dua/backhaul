import { useState } from 'react';
import { Cpu, MapPin, TrendingUp, Navigation, Package } from 'lucide-react';

export const RadarView = () => {
  const corridorDemands = [
    { city: 'Gurgaon (NH 48)', activeLoads: 3, weightTons: 6.8, avgRate: '₹4.5 / ton-km', matchScore: '94%' },
    { city: 'Neemrana Industrial Zone', activeLoads: 2, weightTons: 4.2, avgRate: '₹4.2 / ton-km', matchScore: '91%' },
    { city: 'Kotputli Checkpost Corridor', activeLoads: 4, weightTons: 9.5, avgRate: '₹4.8 / ton-km', matchScore: '89%' },
    { city: 'Shahpura Logistics Hub', activeLoads: 2, weightTons: 5.1, avgRate: '₹4.1 / ton-km', matchScore: '95%' }
  ];

  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Cpu size={20} color="#0284c7" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: '800' }}>BACKHAUL RADAR DEMAND HEATMAP</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Surfaces real-time shipment demand clusters along active route vector</p>
          </div>
        </div>
        <span className="badge badge-cyan">4 ACTIVE CORRIDOR HUBS</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {corridorDemands.map((hub, idx) => (
          <div key={idx} className="glass-card" style={{ padding: '1.25rem', borderTop: '4px solid #0284c7' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} color="#0284c7" />
                <span style={{ fontWeight: '800', fontSize: '0.95rem', color: '#0f172a' }}>{hub.city}</span>
              </div>
              <span className="badge badge-emerald">{hub.matchScore}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: '#334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Active Demand:</span>
                <span style={{ fontWeight: '800', color: '#0f172a' }}>{hub.activeLoads} Loads</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Volume:</span>
                <span style={{ fontWeight: '800', color: '#0284c7' }}>{hub.weightTons} Tons</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Avg Rate:</span>
                <span style={{ fontWeight: '800', color: '#059669' }}>{hub.avgRate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import { useState } from 'react';
import { Sliders, Package, Layers, TrendingUp, ShieldCheck } from 'lucide-react';

export const MultiLoadOptimizerCard = () => {
  const [vehicleCapacity] = useState(12.0);
  const [usedCapacity] = useState(4.2);
  const availableCapacity = vehicleCapacity - usedCapacity; // 7.8T

  const candidateLoads = [
    { id: 'A', name: 'Load A: Auto Parts (Gurgaon → Neemrana)', weight: 2.5, price: 7200, detour: 12, selected: true },
    { id: 'B', name: 'Load B: Electrical Kits (Manesar → Kotputli)', weight: 1.8, price: 5400, detour: 15, selected: true },
    { id: 'C', name: 'Load C: Machinery Hardware (Delhi → Jaipur)', weight: 3.2, price: 9100, detour: 8, selected: true },
    { id: 'D', name: 'Load D: FMCG Goods (Shahpura → Jaipur)', weight: 2.7, price: 6800, detour: 22, selected: false }
  ];

  const selectedLoads = candidateLoads.filter(l => l.selected);
  const totalWeight = selectedLoads.reduce((sum, l) => sum + l.weight, 0); // 7.5T
  const grossRevenue = selectedLoads.reduce((sum, l) => sum + l.price, 0); // 21,700
  const maxDetour = Math.max(...selectedLoads.map(l => l.detour)); // 15km
  const estCost = 2800;
  const netContribution = grossRevenue - estCost;

  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sliders size={20} color="#7c3aed" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: '800' }}>MULTI-LOAD KNAPSACK OPTIMIZER</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Combines multiple compatible shipments into available 7.8T truck capacity</p>
          </div>
        </div>
        <span className="badge badge-purple">OPTIMAL COMBINATION FOUND</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Load Selection List */}
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b', marginBottom: '0.75rem' }}>AVAILABLE CANDIDATE LOADS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {candidateLoads.map((load) => (
              <div key={load.id} className="glass-card" style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderColor: load.selected ? '#7c3aed' : '#e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="checkbox" checked={load.selected} readOnly style={{ accentColor: '#7c3aed' }} />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>{load.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Weight: {load.weight}T | Detour: +{load.detour}km</div>
                  </div>
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#059669' }}>₹{load.price.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Calculated Metrics Summary */}
        <div className="glass-card" style={{ padding: '1.25rem', background: '#f8fafc' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b', marginBottom: '0.75rem' }}>COMBINED OPTIMIZATION RESULTS</div>
          
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#334155', marginBottom: '4px', fontWeight: '600' }}>
              <span>Capacity Utilisation ({totalWeight}T / {availableCapacity}T)</span>
              <span style={{ color: '#0284c7', fontWeight: '700' }}>96.1%</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${(totalWeight / availableCapacity) * 100}%`, height: '100%', background: 'linear-gradient(to right, #2563eb, #059669)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
            <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Gross Revenue</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>₹{grossRevenue.toLocaleString('en-IN')}</div>
            </div>
            <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Net Contribution</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#059669' }}>+₹{netContribution.toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

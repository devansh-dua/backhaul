import { useState } from 'react';
import { BarChart3, RotateCcw, TrendingUp, DollarSign, Fuel, ShieldCheck } from 'lucide-react';

export const WhatIfSimulatorCard = () => {
  const [priceAdj, setPriceAdj] = useState(0);
  const [fuelAdj, setFuelAdj] = useState(0);
  const [detourAdj, setDetourAdj] = useState(0);
  const [addedWeight, setAddedWeight] = useState(0);

  const baseGross = 21700;
  const baseCost = 2800;
  const baseNet = 18900;
  const baseUtil = 88;
  const baseEmptyKm = 260;
  const baseCo2 = 220;

  // Recalculated AFTER values
  const simulatedGross = Math.round((baseGross + (addedWeight * 3200)) * (1 + priceAdj / 100));
  const simulatedCost = Math.round((baseCost + (detourAdj * 26)) * (1 + fuelAdj / 100));
  const simulatedNet = Math.max(0, simulatedGross - simulatedCost);
  const simulatedUtil = Math.min(100, baseUtil + Math.round((addedWeight / 12) * 100));
  const simulatedEmptyKm = baseEmptyKm + Math.round(addedWeight * 15);
  const simulatedCo2 = Math.round(simulatedEmptyKm * 0.85);

  const deltaNet = simulatedNet - baseNet;

  return (
    <div className="glass-panel" style={{ padding: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart3 size={22} color="#0284c7" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: '800' }}>WHAT-IF SCENARIO SIMULATOR</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Simulate real-time financial impact of route, fuel, load & price variations</p>
          </div>
        </div>

        <button
          onClick={() => { setPriceAdj(0); setFuelAdj(0); setDetourAdj(0); setAddedWeight(0); }}
          style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#475569', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: '600' }}
        >
          <RotateCcw size={14} /> Reset Scenario
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Controls Section */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h4 style={{ color: '#0f172a', fontSize: '0.95rem', marginBottom: '1rem', fontWeight: '800' }}>SIMULATION CONTROLS</h4>

          <div style={{ marginBottom: '1.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#334155', marginBottom: '6px', fontWeight: '600' }}>
              <span>Price Adjustment Rate</span>
              <span style={{ color: '#0284c7', fontWeight: '700' }}>{priceAdj > 0 ? `+${priceAdj}%` : `${priceAdj}%`}</span>
            </div>
            <input type="range" min="-20" max="30" value={priceAdj} onChange={(e) => setPriceAdj(Number(e.target.value))} style={{ width: '100%', accentColor: '#2563eb' }} />
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#334155', marginBottom: '6px', fontWeight: '600' }}>
              <span>Fuel Cost Variance</span>
              <span style={{ color: '#dc2626', fontWeight: '700' }}>{fuelAdj > 0 ? `+${fuelAdj}%` : `${fuelAdj}%`}</span>
            </div>
            <input type="range" min="0" max="50" value={fuelAdj} onChange={(e) => setFuelAdj(Number(e.target.value))} style={{ width: '100%', accentColor: '#dc2626' }} />
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#334155', marginBottom: '6px', fontWeight: '600' }}>
              <span>Detour Distance Adjustment</span>
              <span style={{ color: '#7c3aed', fontWeight: '700' }}>+{detourAdj} km</span>
            </div>
            <input type="range" min="0" max="60" value={detourAdj} onChange={(e) => setDetourAdj(Number(e.target.value))} style={{ width: '100%', accentColor: '#7c3aed' }} />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#334155', marginBottom: '6px', fontWeight: '600' }}>
              <span>Add Additional Load Weight</span>
              <span style={{ color: '#059669', fontWeight: '700' }}>+{addedWeight} Tons</span>
            </div>
            <input type="range" min="0" max="4" step="0.5" value={addedWeight} onChange={(e) => setAddedWeight(Number(e.target.value))} style={{ width: '100%', accentColor: '#059669' }} />
          </div>
        </div>

        {/* Before vs After Comparison Table */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h4 style={{ color: '#0f172a', fontSize: '0.95rem', marginBottom: '1rem', fontWeight: '800' }}>BEFORE vs AFTER SIMULATION</h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', textAlign: 'center', fontSize: '0.8rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e2e8f0', fontWeight: '700', color: '#64748b' }}>
            <div>METRIC</div>
            <div>BEFORE</div>
            <div>AFTER</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '0.8rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center', color: '#334155' }}>
              <div style={{ textAlign: 'left', fontWeight: '600' }}>Gross Revenue</div>
              <div>₹{baseGross.toLocaleString('en-IN')}</div>
              <div style={{ fontWeight: '800', color: '#0f172a' }}>₹{simulatedGross.toLocaleString('en-IN')}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center', color: '#334155' }}>
              <div style={{ textAlign: 'left', fontWeight: '600' }}>Est. Cost</div>
              <div>₹{baseCost.toLocaleString('en-IN')}</div>
              <div style={{ fontWeight: '800', color: '#dc2626' }}>₹{simulatedCost.toLocaleString('en-IN')}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center', color: '#334155', padding: '6px 0', background: '#d1fae5', borderRadius: '6px' }}>
              <div style={{ textAlign: 'left', fontWeight: '800', color: '#059669', paddingLeft: '6px' }}>Net Profit</div>
              <div style={{ fontWeight: '700' }}>₹{baseNet.toLocaleString('en-IN')}</div>
              <div style={{ fontWeight: '800', color: '#059669' }}>₹{simulatedNet.toLocaleString('en-IN')}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center', color: '#334155' }}>
              <div style={{ textAlign: 'left', fontWeight: '600' }}>Utilisation %</div>
              <div>{baseUtil}%</div>
              <div style={{ fontWeight: '800', color: '#0284c7' }}>{simulatedUtil}%</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center', color: '#334155' }}>
              <div style={{ textAlign: 'left', fontWeight: '600' }}>CO2 Saved</div>
              <div>{baseCo2} kg</div>
              <div style={{ fontWeight: '800', color: '#7c3aed' }}>{simulatedCo2} kg</div>
            </div>
          </div>

          <div style={{ marginTop: '1.2rem', padding: '0.75rem', borderRadius: '8px', background: deltaNet >= 0 ? '#d1fae5' : '#fef2f2', border: `1px solid ${deltaNet >= 0 ? '#a7f3d0' : '#fecaca'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: '600' }}>Impact on Net Contribution:</span>
            <span style={{ fontSize: '1.05rem', fontWeight: '800', color: deltaNet >= 0 ? '#059669' : '#dc2626' }}>
              {deltaNet >= 0 ? `+₹${deltaNet.toLocaleString('en-IN')}` : `-₹${Math.abs(deltaNet).toLocaleString('en-IN')}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

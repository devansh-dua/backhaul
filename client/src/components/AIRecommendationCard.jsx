import { useState } from 'react';
import { Cpu, CheckCircle2, XCircle, ArrowRight, ShieldCheck, Zap, AlertTriangle } from 'lucide-react';

export const AIRecommendationCard = ({ recommendationData, onAccept, onReject }) => {
  const [loading, setLoading] = useState(false);

  const data = recommendationData || {
    truck: 'RJ-104',
    route: 'Delhi → Jaipur',
    remainingCapacityTons: 7.8,
    driverHoursAvailable: '6h 20m',
    grossRevenueINR: 21700,
    estimatedCostINR: 2800,
    netContributionINR: 18900,
    detourKm: 24,
    confidenceScore: 94,
    shipmentCount: 3,
    reasons: [
      'Route aligned along core Delhi-Jaipur corridor',
      'Capacity compatible (fits inside remaining 7.8T)',
      'Deadline achievable within scheduled transport window',
      'Driver hours available (6h 20m safe margin)',
      'Low detour (+24 km total)',
      'Strong revenue density (₹72.6 / km)'
    ]
  };

  const handleAcceptClick = async () => {
    setLoading(true);
    if (onAccept) await onAccept(data);
    setLoading(false);
  };

  return (
    <div className="glass-panel" style={{ padding: '1.75rem', border: '2px solid #000000', background: '#ffffff', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <span className="badge badge-black" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Cpu size={14} /> AI AUTOPILOT RECOMMENDATION
            </span>
            <span className="badge badge-black">{data.confidenceScore}% CONFIDENCE</span>
          </div>

          <h2 style={{ fontSize: '1.4rem', color: '#000000', fontWeight: '800' }}>
            Accept {data.shipmentCount} Compatible Corridor Shipments
          </h2>
          <p style={{ color: '#52525b', fontSize: '0.9rem', marginTop: '4px', fontWeight: '600' }}>
            Truck <strong style={{ color: '#000000' }}>{data.truck}</strong> | Route: <strong style={{ color: '#000000' }}>{data.route}</strong> | Available Capacity: <strong style={{ color: '#000000' }}>{data.remainingCapacityTons}T</strong>
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={onReject}
            style={{ background: '#ffffff', border: '1px solid #000000', color: '#000000', padding: '0.65rem 1.25rem', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <XCircle size={16} /> REJECT
          </button>
          
          <button
            onClick={handleAcceptClick}
            disabled={loading}
            style={{ background: '#000000', border: 'none', color: '#ffffff', padding: '0.65rem 1.75rem', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <CheckCircle2 size={18} /> {loading ? 'ACCEPTING PLAN...' : 'ACCEPT PLAN'}
          </button>
        </div>
      </div>

      {/* Metrics Banner Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', margin: '1.5rem 0', padding: '1rem', background: '#fafafa', borderRadius: '10px', border: '1px solid #e4e4e7' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#52525b', fontWeight: '700' }}>Gross Revenue</div>
          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#000000' }}>₹{data.grossRevenueINR.toLocaleString('en-IN')}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#52525b', fontWeight: '700' }}>Est. Detour Cost</div>
          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#000000' }}>-₹{data.estimatedCostINR.toLocaleString('en-IN')}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#52525b', fontWeight: '700' }}>Net Contribution</div>
          <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#000000' }}>+₹{data.netContributionINR.toLocaleString('en-IN')}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#52525b', fontWeight: '700' }}>Total Detour</div>
          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#000000' }}>{data.detourKm} km</div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#52525b', fontWeight: '700' }}>Driver Hours</div>
          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#000000' }}>{data.driverHoursAvailable}</div>
        </div>
      </div>

      {/* Key Reasons List */}
      <div>
        <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#000000', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          AI REASONING & HARD CONSTRAINT VALIDATION
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.5rem' }}>
          {data.reasons.map((r, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#09090b', fontWeight: '600' }}>
              <CheckCircle2 size={15} color="#000000" style={{ flexShrink: 0 }} />
              <span>{r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

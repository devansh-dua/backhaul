import { useState } from 'react';
import { Cpu, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

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
      'Route aligned along core Delhi-Jaipur corridor (NH 48)',
      'Capacity compatible (fits inside remaining 7.8T)',
      'Deadline achievable within scheduled transport window',
      'Driver hours available (6h 20m safe margin)',
      'Low detour (+24 km total detour distance)',
      'Strong revenue density (₹72.6 / km net payout)'
    ]
  };

  const handleAcceptClick = async () => {
    setLoading(true);
    if (onAccept) await onAccept(data);
    setLoading(false);
  };

  return (
    <div className="glass-panel" style={{ padding: '1.75rem', border: '2px solid #2563eb', background: '#ffffff', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <span className="badge badge-purple">
              <Cpu size={14} /> AI AUTOPILOT RECOMMENDATION
            </span>
            <span className="badge badge-emerald">
              <ShieldCheck size={14} /> {data.confidenceScore}% CONFIDENCE
            </span>
          </div>

          <h2 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: '800' }}>
            Accept {data.shipmentCount} Compatible Corridor Shipments
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px', fontWeight: '600' }}>
            Truck <strong style={{ color: '#0f172a' }}>{data.truck}</strong> | Route: <strong style={{ color: '#0f172a' }}>{data.route}</strong> | Available Capacity: <strong style={{ color: '#059669' }}>{data.remainingCapacityTons}T</strong>
          </p>
        </div>

        {/* Action Buttons matching Landing style */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={onReject}
            className="btn-secondary"
            style={{ padding: '0.65rem 1.25rem' }}
          >
            <XCircle size={16} color="#64748b" /> REJECT
          </button>
          
          <button
            onClick={handleAcceptClick}
            disabled={loading}
            className="btn-emerald"
            style={{ padding: '0.65rem 1.75rem' }}
          >
            <CheckCircle2 size={18} /> {loading ? 'ACCEPTING PLAN...' : 'ACCEPT PLAN'}
          </button>
        </div>
      </div>

      {/* Metrics Banner Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', margin: '1.25rem 0', padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700' }}>Gross Revenue</div>
          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>₹{data.grossRevenueINR.toLocaleString('en-IN')}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700' }}>Est. Detour Cost</div>
          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#dc2626' }}>-₹{data.estimatedCostINR.toLocaleString('en-IN')}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700' }}>Net Contribution</div>
          <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#059669' }}>+₹{data.netContributionINR.toLocaleString('en-IN')}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700' }}>Total Detour</div>
          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0284c7' }}>{data.detourKm} km</div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700' }}>Driver Hours</div>
          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>{data.driverHoursAvailable}</div>
        </div>
      </div>

      {/* Key Reasons List */}
      <div>
        <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          WHY BACKHAULX RECOMMENDS THIS
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.5rem' }}>
          {data.reasons.map((r, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#334155', fontWeight: '600' }}>
              <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0 }} />
              <span>{r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

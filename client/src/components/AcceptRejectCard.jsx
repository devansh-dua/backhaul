import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export const AcceptRejectCard = ({ decision = 'ACCEPT', confidence = 94, reasons = [], loadTitle = 'Corridor Load Match' }) => {
  const isAccept = decision === 'ACCEPT';

  return (
    <div className="glass-card" style={{ padding: '1.25rem', borderLeft: `4px solid #000000`, border: '1px solid #e4e4e7' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h4 style={{ color: '#000000', fontSize: '1.05rem', fontWeight: '800' }}>{loadTitle}</h4>
        <span className="badge badge-black">
          {isAccept ? <CheckCircle size={14} /> : <XCircle size={14} />} {decision} ({confidence}% CONFIDENCE)
        </span>
      </div>

      <div style={{ fontSize: '0.85rem', color: '#09090b' }}>
        <div style={{ fontWeight: '800', color: '#52525b', marginBottom: '4px' }}>Key AI Evaluation Factors:</div>
        <ul style={{ paddingLeft: '1.2rem' }}>
          {reasons.map((r, idx) => (
            <li key={idx} style={{ marginBottom: '4px', color: '#000000', fontWeight: '600' }}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

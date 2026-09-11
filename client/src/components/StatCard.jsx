import React from 'react';

export const StatCard = ({ title, value, unit = '', change = '', isPositive = true, icon: Icon }) => {
  return (
    <div className="glass-card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{title}</span>
        {Icon && (
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
            <Icon size={16} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>{value}</span>
        {unit && <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748b' }}>{unit}</span>}
      </div>

      {change && (
        <div style={{ marginTop: '0.35rem', fontSize: '0.75rem', fontWeight: '700', color: isPositive ? '#059669' : '#dc2626', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>{isPositive ? '↑' : '↓'} {change}</span>
        </div>
      )}
    </div>
  );
};

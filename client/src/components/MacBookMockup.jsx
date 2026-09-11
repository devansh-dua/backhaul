import { TrendingUp, CheckCircle, Zap, ShieldCheck } from 'lucide-react';

export const MacBookMockup = ({ children }) => {
  return (
    <div className="macbook-container">
      {/* Floating Mini UI Cards */}
      <div className="floating-pill pill-top-left">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={14} color="#059669" />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Gross Contribution</div>
            <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#059669' }}>+₹18,900 earned</div>
          </div>
        </div>
      </div>

      <div className="floating-pill pill-top-right">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={16} color="#0284c7" />
          <span style={{ color: '#0284c7', fontWeight: '700' }}>94% Route Compatibility</span>
        </div>
      </div>

      <div className="floating-pill pill-bottom-right">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} color="#7c3aed" />
          <span style={{ color: '#7c3aed', fontWeight: '700' }}>260 Empty KM Avoided</span>
        </div>
      </div>

      {/* MacBook Perspective Display Frame */}
      <div className="macbook-frame">
        <div className="macbook-notch"></div>
        <div className="macbook-screen">
          {children}
        </div>
      </div>
      <div className="macbook-base"></div>
    </div>
  );
};

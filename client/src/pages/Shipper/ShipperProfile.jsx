import { ShipperNavbar } from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Star } from 'lucide-react';

export const ShipperProfile = () => {
  const { user } = useAuth();

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '3rem', color: '#0f172a' }}>
      <ShipperNavbar />

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem 1.5rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'linear-gradient(135deg, #059669, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: '800', color: '#fff' }}>
              {user?.name ? user.name[0] : 'V'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>{user?.name || 'Vikram Mehta'}</h2>
                <span className="badge badge-emerald"><ShieldCheck size={14} /> VERIFIED SHIPPER</span>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '2px', fontWeight: '500' }}>{user?.company || 'Jaipur Auto Components Ltd'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

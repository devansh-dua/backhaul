import { CarrierNavbar } from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { User, ShieldCheck, Star, Award, Truck, CheckCircle2 } from 'lucide-react';

export const CarrierProfile = () => {
  const { user } = useAuth();

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '3rem', color: '#0f172a' }}>
      <CarrierNavbar />

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem 1.5rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: '800', color: '#fff' }}>
              {user?.name ? user.name[0] : 'R'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>{user?.name || 'Rajesh Sharma'}</h2>
                <span className="badge badge-emerald"><ShieldCheck size={14} /> VERIFIED CARRIER</span>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '2px', fontWeight: '500' }}>{user?.company || 'Apex Express Logistics Pvt Ltd'}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', margin: '1.5rem 0', background: '#f1f5f9', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Carrier Rating</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#d97706', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={16} fill="#d97706" color="#d97706" /> 4.9 / 5.0
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Completed Trips</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>34 Deliveries</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>On-Time Score</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#059669' }}>98.5%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

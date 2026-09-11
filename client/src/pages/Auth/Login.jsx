import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Truck, Package, Lock, Mail, ArrowRight } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('carrier@backhaulx.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'CARRIER') {
        navigate('/carrier');
      } else {
        navigate('/shipper');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', position: 'relative' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem', position: 'relative', background: '#ffffff' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #2563eb, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', color: '#fff' }}>
            <Truck size={26} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a' }}>Welcome Back</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>Sign in to access BACKHAULX AI Engine</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'center', fontWeight: '600' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#475569', marginBottom: '6px', fontWeight: '600' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', color: '#0f172a', fontSize: '0.95rem', fontWeight: '500' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#475569', marginBottom: '6px', fontWeight: '600' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', color: '#0f172a', fontSize: '0.95rem', fontWeight: '500' }}
              />
            </div>
          </div>

          {/* Quick Demo Login Credentials Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', margin: '0.25rem 0' }}>
            <button
              type="button"
              onClick={() => { setEmail('carrier@backhaulx.com'); setPassword('password123'); }}
              style={{ flex: 1, padding: '0.4rem', background: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '6px', color: '#0284c7', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
            >
              Demo Carrier
            </button>
            <button
              type="button"
              onClick={() => { setEmail('shipper@backhaulx.com'); setPassword('password123'); }}
              style={{ flex: 1, padding: '0.4rem', background: '#d1fae5', border: '1px solid #a7f3d0', borderRadius: '6px', color: '#059669', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
            >
              Demo Shipper
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', border: 'none', color: '#fff', padding: '0.85rem', borderRadius: '10px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#64748b' }}>
          Don't have an account? <Link to="/register" style={{ color: '#2563eb', fontWeight: '700' }}>Register here</Link>
        </div>
      </div>
    </div>
  );
};

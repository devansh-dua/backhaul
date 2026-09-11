import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Truck, Package, Activity, Compass, Cpu, Sliders, BarChart3, LogOut, ArrowRightLeft, ShieldCheck } from 'lucide-react';

export const LandingNavbar = () => {
  return (
    <nav className="glass-panel" style={{ margin: '1rem 2rem', padding: '0.85rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: '1rem', zIndex: 100 }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #2563eb, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <Truck size={20} />
        </div>
        <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.03em' }}>
          BACKHAUL<span style={{ color: '#2563eb' }}>X</span>
        </span>
      </Link>

      <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '700', color: '#475569' }} className="hidden md:flex">
        <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
        <a href="#radar" className="hover:text-blue-600 transition-colors">Backhaul Radar</a>
        <a href="#optimizer" className="hover:text-blue-600 transition-colors">Optimizer</a>
        <a href="#impact" className="hover:text-blue-600 transition-colors">Impact</a>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to="/login" style={{ padding: '0.5rem 1.25rem', color: '#0f172a', fontWeight: '700', fontSize: '0.9rem' }}>
          Log In
        </Link>
        <Link to="/register" className="btn-primary" style={{ padding: '0.55rem 1.35rem', fontSize: '0.9rem' }}>
          Get Started
        </Link>
      </div>
    </nav>
  );
};

export const CarrierNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: 'Dashboard', path: '/carrier', icon: Activity },
    { label: 'Find Loads', path: '/carrier/loads', icon: Package },
    { label: 'My Capacity', path: '/carrier/capacity', icon: Truck },
    { label: 'Trips', path: '/carrier/trips', icon: Compass },
    { label: 'Radar', path: '/carrier/radar', icon: Cpu },
    { label: 'Multi-Load', path: '/carrier/optimizer', icon: Sliders },
    { label: 'What-If', path: '/carrier/what-if', icon: BarChart3 },
  ];

  return (
    <nav className="glass-panel" style={{ margin: '1rem 1.5rem', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link to="/carrier" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #2563eb, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Truck size={18} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>BACKHAUL<span style={{ color: '#2563eb' }}>X</span></span>
          <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>CARRIER</span>
        </Link>

        <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.9rem', color: '#475569', fontWeight: '700' }} className="hidden lg:flex">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: active ? '#2563eb' : '#475569',
                  fontWeight: active ? '800' : '700',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '8px',
                  background: active ? '#eff6ff' : 'transparent'
                }}
              >
                <Icon size={16} color={active ? '#2563eb' : '#64748b'} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={() => navigate('/shipper')}
          style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#0f172a', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '700' }}
        >
          <ArrowRightLeft size={14} color="#2563eb" />
          Switch to Shipper
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#0f172a', fontWeight: '700' }}>
          <ShieldCheck size={16} color="#059669" />
          <span>{user?.name || 'Carrier Ops'}</span>
        </div>

        <button
          onClick={() => { logout(); navigate('/login'); }}
          style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#64748b', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: '700' }}
        >
          <LogOut size={14} /> Exit
        </button>
      </div>
    </nav>
  );
};

export const ShipperNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: 'Dashboard', path: '/shipper', icon: Activity },
    { label: 'Post Shipment', path: '/shipper/post-shipment', icon: Package },
    { label: 'My Shipments', path: '/shipper/shipments', icon: Package },
    { label: 'Available Trucks', path: '/shipper/capacity', icon: Truck },
    { label: 'Live Trips', path: '/shipper/trips', icon: Compass },
  ];

  return (
    <nav className="glass-panel" style={{ margin: '1rem 1.5rem', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link to="/shipper" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #059669, #047857)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Package size={18} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>BACKHAUL<span style={{ color: '#059669' }}>X</span></span>
          <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>SHIPPER</span>
        </Link>

        <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.9rem', color: '#475569', fontWeight: '700' }} className="hidden lg:flex">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: active ? '#059669' : '#475569',
                  fontWeight: active ? '800' : '700',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '8px',
                  background: active ? '#ecfdf5' : 'transparent'
                }}
              >
                <Icon size={16} color={active ? '#059669' : '#64748b'} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={() => navigate('/carrier')}
          style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#0f172a', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '700' }}
        >
          <ArrowRightLeft size={14} color="#059669" />
          Switch to Carrier
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#0f172a', fontWeight: '700' }}>
          <ShieldCheck size={16} color="#059669" />
          <span>{user?.name || 'Shipper Ops'}</span>
        </div>

        <button
          onClick={() => { logout(); navigate('/login'); }}
          style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#64748b', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: '700' }}
        >
          <LogOut size={14} /> Exit
        </button>
      </div>
    </nav>
  );
};

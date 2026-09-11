import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Truck, Package, Activity, Compass, Cpu, Sliders, BarChart3, User, LogOut, ShieldCheck } from 'lucide-react';

export const LandingNavbar = () => {
  return (
    <nav className="glass-panel" style={{ margin: '1rem 2rem', padding: '0.85rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: '1rem', zIndex: 100, border: '1px solid #000000' }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <Truck size={22} />
        </div>
        <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#000000', letterSpacing: '-0.03em' }}>
          BACKHAUL<span style={{ color: '#000000' }}>X</span>
        </span>
      </Link>

      <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '700', color: '#000000' }}>
        <a href="#how-it-works">How It Works</a>
        <a href="#radar">Backhaul Radar</a>
        <a href="#optimizer">Optimizer</a>
        <a href="#impact">Impact</a>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to="/login" style={{ padding: '0.5rem 1.25rem', color: '#000000', fontWeight: '700', fontSize: '0.9rem' }}>
          Log In
        </Link>
        <Link to="/register" style={{ padding: '0.55rem 1.35rem', background: '#000000', color: '#ffffff', borderRadius: '8px', fontWeight: '700', fontSize: '0.9rem' }}>
          Get Started
        </Link>
      </div>
    </nav>
  );
};

export const CarrierNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="glass-panel" style={{ margin: '1rem 1.5rem', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 100, border: '1px solid #e4e4e7' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link to="/carrier" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Truck size={18} />
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#000000' }}>BACKHAUL<span style={{ color: '#000000' }}>X</span></span>
          <span className="badge badge-black" style={{ fontSize: '0.65rem' }}>CARRIER</span>
        </Link>

        <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.9rem', color: '#000000', fontWeight: '700' }}>
          <Link to="/carrier" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#000000' }}><Activity size={16} /> Dashboard</Link>
          <Link to="/carrier/loads" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Package size={16} /> Find Loads</Link>
          <Link to="/carrier/capacity" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Truck size={16} /> My Capacity</Link>
          <Link to="/carrier/trips" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Compass size={16} /> Trips</Link>
          <Link to="/carrier/radar" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Cpu size={16} /> Radar</Link>
          <Link to="/carrier/optimizer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Sliders size={16} /> Multi-Load</Link>
          <Link to="/carrier/what-if" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><BarChart3 size={16} /> What-If</Link>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#000000', fontWeight: '700' }}>
          <ShieldCheck size={16} color="#000000" />
          <span>{user?.name || 'Carrier'}</span>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }} style={{ background: '#ffffff', border: '1px solid #000000', color: '#000000', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: '700' }}>
          <LogOut size={14} /> Exit
        </button>
      </div>
    </nav>
  );
};

export const ShipperNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="glass-panel" style={{ margin: '1rem 1.5rem', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 100, border: '1px solid #e4e4e7' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link to="/shipper" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Package size={18} />
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#000000' }}>BACKHAUL<span style={{ color: '#000000' }}>X</span></span>
          <span className="badge badge-black" style={{ fontSize: '0.65rem' }}>SHIPPER</span>
        </Link>

        <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.9rem', color: '#000000', fontWeight: '700' }}>
          <Link to="/shipper" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#000000' }}><Activity size={16} /> Dashboard</Link>
          <Link to="/shipper/post-shipment" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#000000' }}><Package size={16} /> Post Shipment</Link>
          <Link to="/shipper/shipments" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>My Shipments</Link>
          <Link to="/shipper/capacity" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Truck size={16} /> Available Trucks</Link>
          <Link to="/shipper/trips" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Compass size={16} /> Live Trips</Link>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#000000', fontWeight: '700' }}>
          <ShieldCheck size={16} color="#000000" />
          <span>{user?.name || 'Shipper'}</span>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }} style={{ background: '#ffffff', border: '1px solid #000000', color: '#000000', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: '700' }}>
          <LogOut size={14} /> Exit
        </button>
      </div>
    </nav>
  );
};

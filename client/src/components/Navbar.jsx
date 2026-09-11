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

  const isActive = (path) => {
    if (path === '/carrier') {
      return location.pathname === '/carrier' || location.pathname === '/carrier/';
    }
    return location.pathname.startsWith(path);
  };

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
    <nav className="bg-white border-b border-slate-200/80 sticky top-0 z-50 shadow-xs">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Left Brand + Navigation */}
        <div className="flex items-center gap-6 xl:gap-8">
          <Link to="/carrier" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
              <Truck size={18} />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-slate-900 font-outfit tracking-tight">
                BACKHAUL<span className="text-blue-600">X</span>
              </span>
              <span className="bg-slate-100 text-slate-500 font-bold text-[10px] tracking-wider px-2 py-0.5 rounded-full uppercase font-outfit border border-slate-200/80">
                CARRIER
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-outfit transition-all ${
                    active
                      ? 'bg-blue-50 text-blue-600 border border-blue-100/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={15} className={active ? 'text-blue-600' : 'text-slate-400'} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Tools: Notification Bell & Profile Avatar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/shipper')}
            className="hidden md:flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold font-outfit transition-colors border border-slate-200/60"
            title="Switch View"
          >
            <ArrowRightLeft size={13} className="text-blue-600" />
            <span>Switch to Shipper</span>
          </button>

          {/* Notification Bell */}
          <button
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-600 flex items-center justify-center relative transition-colors"
            title="Notifications"
          >
            <div className="w-2 h-2 rounded-full bg-red-500 absolute top-1.5 right-1.5 ring-2 ring-white"></div>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          {/* Profile User Dropdown Pill */}
          <div className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-full pl-1 pr-2.5 py-1 transition-all">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center font-outfit">
              {user?.name ? user.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'DD'}
            </div>
            <span className="text-xs font-bold text-slate-800 font-outfit hidden sm:inline">
              {user?.name || 'Devansh Dua'}
            </span>
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
            title="Log Out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export const ShipperNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/shipper') {
      return location.pathname === '/shipper' || location.pathname === '/shipper/';
    }
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { label: 'Dashboard', path: '/shipper', icon: Activity },
    { label: 'Post Shipment', path: '/shipper/post-shipment', icon: Package },
    { label: 'My Shipments', path: '/shipper/shipments', icon: Package },
    { label: 'Find Capacity', path: '/shipper/capacity', icon: Truck },
    { label: 'Analytics', path: '/shipper/analytics', icon: BarChart3 },
  ];

  return (
    <nav className="bg-white border-b border-slate-200/80 sticky top-0 z-50 shadow-xs">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Left Brand + Navigation */}
        <div className="flex items-center gap-6 xl:gap-8">
          <Link to="/shipper" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-700 transition-colors">
              <Package size={18} />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-slate-900 font-outfit tracking-tight">
                BACKHAUL<span className="text-emerald-600">X</span>
              </span>
              <span className="bg-emerald-50 text-emerald-700 font-bold text-[10px] tracking-wider px-2 py-0.5 rounded-full uppercase font-outfit border border-emerald-200/80">
                SHIPPER
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-outfit transition-all ${
                    active
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={15} className={active ? 'text-emerald-600' : 'text-slate-400'} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Tools: Notification Bell & Profile Avatar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/carrier')}
            className="hidden md:flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold font-outfit transition-colors border border-slate-200/60"
            title="Switch View"
          >
            <ArrowRightLeft size={13} className="text-emerald-600" />
            <span>Switch to Carrier</span>
          </button>

          {/* Notification Bell */}
          <button
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-600 flex items-center justify-center relative transition-colors"
            title="Notifications"
          >
            <div className="w-2 h-2 rounded-full bg-red-500 absolute top-1.5 right-1.5 ring-2 ring-white"></div>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          {/* Profile User Dropdown Pill */}
          <div className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-full pl-1 pr-2.5 py-1 transition-all">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center font-outfit">
              {user?.name ? user.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'DD'}
            </div>
            <span className="text-xs font-bold text-slate-800 font-outfit hidden sm:inline">
              {user?.name || 'Devansh Dua'}
            </span>
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
            title="Log Out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </nav>
  );
};

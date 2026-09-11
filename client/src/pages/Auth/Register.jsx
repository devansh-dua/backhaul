import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Truck, Package, ArrowRight, AlertCircle } from 'lucide-react';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('CARRIER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register({ name, email, password, company, role });
      if (user.role === 'CARRIER') {
        navigate('/carrier');
      } else {
        navigate('/shipper');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md glass-card p-8 sm:p-10 space-y-6 shadow-xl relative z-10 border border-slate-200/80">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <Truck size={20} />
            </div>
            <span className="text-xl font-extrabold font-outfit tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              BACKTRACKING
            </span>
          </Link>

          <h2 className="text-2xl font-extrabold text-slate-900 font-outfit tracking-tight">Create Account</h2>
          <p className="text-xs sm:text-sm text-slate-600 font-normal">Select your role to start optimizing return trip economics</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/80 text-xs font-bold font-outfit">
          <button
            type="button"
            onClick={() => setRole('CARRIER')}
            className={`py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              role === 'CARRIER' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck size={15} /> Carrier / Fleet
          </button>

          <button
            type="button"
            onClick={() => setRole('SHIPPER')}
            className={`py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              role === 'SHIPPER' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package size={15} /> Shipper / Business
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-semibold flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <div className="flex-1">
              <span>{error}</span>
              {error.toLowerCase().includes('already exists') && (
                <div className="mt-1">
                  <Link to="/login" className="underline font-bold text-rose-800 font-outfit">Click here to Sign In instead →</Link>
                </div>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 font-outfit">Full Name</label>
            <input
              type="text"
              required
              placeholder="Devansh Dua"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 font-outfit">Email Address</label>
            <input
              type="email"
              required
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 font-outfit">Company Name</label>
            <input
              type="text"
              required
              placeholder="Apex Logistics Ltd"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 font-outfit">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-xs flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
            <ArrowRight size={15} />
          </button>
        </form>

        <div className="text-center text-xs text-slate-600 font-normal pt-2">
          Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline font-outfit">Sign In</Link>
        </div>
      </div>
    </div>
  );
};


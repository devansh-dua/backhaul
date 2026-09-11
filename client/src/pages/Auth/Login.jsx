import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Truck, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

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
              BACKHAULX
            </span>
          </Link>

          <h2 className="text-2xl font-extrabold text-slate-900 font-outfit tracking-tight">Welcome Back</h2>
          <p className="text-xs sm:text-sm text-slate-600 font-normal">Sign in to access BACKHAULX Intelligence Engine</p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-semibold flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 font-outfit">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 font-outfit">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Quick Demo Credentials */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => { setEmail('carrier@backhaulx.com'); setPassword('password123'); }}
              className="btn-secondary text-[11px] py-2 flex items-center justify-center font-outfit"
            >
              Demo Carrier
            </button>
            <button
              type="button"
              onClick={() => { setEmail('shipper@backhaulx.com'); setPassword('password123'); }}
              className="btn-secondary text-[11px] py-2 flex items-center justify-center font-outfit"
            >
              Demo Shipper
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-xs flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight size={15} />
          </button>
        </form>

        <div className="text-center text-xs text-slate-600 font-normal pt-2">
          Don't have an account? <Link to="/register" className="text-indigo-600 font-bold hover:underline font-outfit">Register here</Link>
        </div>
      </div>
    </div>
  );
};


import { ShipperNavbar } from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

export const ShipperProfile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 font-sans">
      <ShipperNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-2xl font-extrabold text-white font-outfit shadow-lg shadow-blue-500/20">
              {user?.name ? user.name[0] : 'S'}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-extrabold text-slate-900 font-outfit tracking-tight">{user?.name || 'Vikram Mehta'}</h2>
                <span className="badge-emerald font-semibold">
                  <ShieldCheck size={13} /> VERIFIED SHIPPER
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">{user?.company || 'Jaipur Auto Components Ltd'}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};


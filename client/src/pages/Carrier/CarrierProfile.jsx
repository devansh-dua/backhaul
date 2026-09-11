import { CarrierNavbar } from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Star } from 'lucide-react';

export const CarrierProfile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 font-sans">
      <CarrierNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-2xl font-extrabold text-white font-outfit shadow-lg shadow-blue-500/20">
              {user?.name ? user.name[0] : 'C'}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-extrabold text-slate-900 font-outfit tracking-tight">{user?.name || 'Rajesh Sharma'}</h2>
                <span className="badge-emerald font-semibold">
                  <ShieldCheck size={13} /> VERIFIED CARRIER
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">{user?.company || 'Apex Express Logistics Pvt Ltd'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-6 border-t border-slate-200/80">
            <div className="glass-card p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 font-outfit">Carrier Rating</div>
              <div className="text-xl font-extrabold text-slate-900 font-outfit flex items-center gap-1.5 mt-2">
                <Star size={18} className="text-amber-500 fill-amber-500" /> 4.9 / 5.0
              </div>
            </div>

            <div className="glass-card p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 font-outfit">Completed Trips</div>
              <div className="text-xl font-extrabold text-slate-900 font-outfit mt-2">34 Deliveries</div>
            </div>

            <div className="glass-card p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 font-outfit">On-Time Score</div>
              <div className="text-xl font-extrabold text-emerald-600 font-outfit mt-2">98.5%</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};


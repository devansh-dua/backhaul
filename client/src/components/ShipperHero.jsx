import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowRight, Package, ArrowUpRight, ShieldCheck, Sparkles, Leaf, CheckCircle2, Clock } from 'lucide-react';
import { shipmentApi } from '../services/shipment.api';

export const ShipperHero = () => {
  const navigate = useNavigate();
  const [recentOrders, setRecentOrders] = useState([
    { id: 'ORD-101', route: 'Delhi → Mumbai', specs: '2.5T · Electronics', status: 'In Transit', statusType: 'blue', date: 'Today, 10:30 AM' },
    { id: 'ORD-102', route: 'Bengaluru → Chennai', specs: '1.0T · Auto Parts', status: 'Delivered', statusType: 'green', date: 'Yesterday' },
    { id: 'ORD-103', route: 'Pune → Hyderabad', specs: '3.2T · FMCG', status: 'Delivered', statusType: 'green', date: '10 Nov 2024' },
    { id: 'ORD-104', route: 'Kolkata → Delhi', specs: '4.0T · Industrial Tools', status: 'Assigned', statusType: 'amber', date: '09 Nov 2024' },
  ]);

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const fetchRecentOrders = async () => {
    try {
      const res = await shipmentApi.getPostedShipments();
      if (res.data && res.data.success && Array.isArray(res.data.data) && res.data.data.length >= 3) {
        const fetched = res.data.data.slice(0, 4).map((item, idx) => ({
          id: item._id || `ORD-${101 + idx}`,
          route: `${item.pickupCity || 'Delhi'} → ${item.deliveryCity || 'Mumbai'}`,
          specs: `${item.weightTons || 2.5}T · ${item.cargoType || 'General Freight'}`,
          status: idx === 0 ? 'In Transit' : idx === 3 ? 'Assigned' : 'Delivered',
          statusType: idx === 0 ? 'blue' : idx === 3 ? 'amber' : 'green',
          date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Recent'
        }));
        setRecentOrders(fetched);
      }
    } catch (e) {
      // Use defaults
    }
  };

  return (
    <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 shadow-lg bg-slate-950">
      {/* Background Logistics Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=80')` 
        }}
      />

      {/* Dark Blur Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-900/40 backdrop-blur-[2px]" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 py-12 sm:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LEFT COLUMN: Eyebrow, Main Headline, Description, CTAs, 3 Trust Points */}
        <div className="lg:col-span-7 space-y-6 text-white">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-[11px] font-extrabold tracking-wider text-blue-300 uppercase font-outfit">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            SMARTER LOGISTICS. BIGGER POSSIBILITIES.
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-outfit tracking-tight leading-[1.1]">
            Ship Smarter.<br />
            <span className="text-blue-400 underline decoration-blue-500/40 underline-offset-4">
              Pay Less.
            </span><br />
            Deliver On Time.
          </h1>

          <p className="text-base sm:text-lg text-slate-200 font-normal max-w-xl leading-relaxed">
            Find verified vehicle capacity already moving toward your destination. BackhaulX AI matches your shipments with the best available trucks — faster, cheaper and greener.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={() => navigate('/shipper/post-shipment')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg hover:shadow-blue-600/30 transition-all flex items-center gap-2 font-outfit cursor-pointer"
            >
              <Plus size={18} />
              Post New Shipment
            </button>

            <button
              onClick={() => navigate('/shipper/capacity')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-5 py-3.5 rounded-xl border border-white/25 backdrop-blur-md transition-all flex items-center gap-1.5 font-outfit cursor-pointer"
            >
              Find Vehicle Capacity <ArrowRight size={16} />
            </button>
          </div>

          {/* 3 Small Trust / Value Points */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/15 text-slate-300 text-xs">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
                <ShieldCheck size={16} />
              </div>
              <div>
                <div className="font-extrabold text-white font-outfit">Verified Carriers</div>
                <div className="text-[11px] text-slate-400">Trusted & compliant</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
                <Sparkles size={16} />
              </div>
              <div>
                <div className="font-extrabold text-white font-outfit">AI-Powered Matching</div>
                <div className="text-[11px] text-slate-400">Best price, faster delivery</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Leaf size={16} />
              </div>
              <div>
                <div className="font-extrabold text-white font-outfit">Lower Emissions</div>
                <div className="text-[11px] text-slate-400">A cleaner tomorrow</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Floating "Recent Orders" Panel */}
        <div className="lg:col-span-5">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-white/40 shadow-2xl space-y-4 max-w-md ml-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 font-outfit flex items-center gap-2">
                <Package size={17} className="text-emerald-600" />
                Recent Orders
              </h3>
              <button
                onClick={() => navigate('/shipper/shipments')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-800 transition-colors flex items-center gap-0.5 font-outfit"
              >
                Track all shipments <ArrowUpRight size={14} />
              </button>
            </div>

            {/* List of Recent Orders */}
            <div className="space-y-2.5">
              {recentOrders.map((order) => (
                <div 
                  key={order.id}
                  onClick={() => navigate('/shipper/shipments')}
                  className="p-3.5 rounded-xl bg-slate-50/80 hover:bg-emerald-50/50 border border-slate-200/60 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-xs shrink-0 group-hover:border-emerald-300">
                      <Package size={17} className="text-slate-600 group-hover:text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-extrabold text-slate-900 font-outfit">
                        {order.route}
                      </div>
                      <div className="text-[11px] font-medium text-slate-500">
                        {order.specs}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex items-center gap-2">
                    <div>
                      {order.statusType === 'blue' && (
                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200 font-outfit">
                          <Clock size={10} className="text-blue-600 animate-spin" />
                          {order.status}
                        </span>
                      )}
                      {order.statusType === 'green' && (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 font-outfit">
                          <CheckCircle2 size={10} className="text-emerald-600" />
                          {order.status}
                        </span>
                      )}
                      {order.statusType === 'amber' && (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200 font-outfit">
                          {order.status}
                        </span>
                      )}
                      <div className="text-[10px] font-medium text-slate-400 mt-0.5">
                        {order.date}
                      </div>
                    </div>

                    <ArrowRight size={14} className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { ShipperNavbar } from '../../components/Navbar';
import { shipmentApi } from '../../services/shipment.api';
import { podApi } from '../../services/pod.api';
import { Package, ArrowRight, Plus, Inbox } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const MyShipments = () => {
  const navigate = useNavigate();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const res = await shipmentApi.getShipperShipments();
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        setShipments(res.data.data);
      } else {
        setShipments([]);
      }
    } catch (e) {
      setShipments([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 font-sans">
      <ShipperNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Header Panel */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="badge-purple">
              <Package size={12} />
              SHIPMENT MANAGEMENT
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit tracking-tight">
              My Active & Historical Shipments
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-normal max-w-2xl">
              Track shipment lifecycle statuses from initial posting to live transport and POD confirmation.
            </p>
          </div>

          <button
            onClick={() => navigate('/shipper/post-shipment')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 font-outfit cursor-pointer self-start sm:self-auto"
          >
            <Plus size={16} /> Post New Shipment
          </button>
        </div>

        {/* Data Table or Empty State */}
        {shipments.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Inbox size={24} />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 font-outfit">
              No shipments created yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              You haven't posted any shipments yet. Click Post New Shipment to find AI matched vehicle capacity.
            </p>
            <button
              onClick={() => navigate('/shipper/post-shipment')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs inline-flex items-center gap-1 font-outfit cursor-pointer mt-2"
            >
              Post New Shipment
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="tech-table w-full">
                <thead>
                  <tr>
                    <th>Freight Title</th>
                    <th>Corridor Route</th>
                    <th>Weight</th>
                    <th>Offered Rate</th>
                    <th>Date Posted</th>
                    <th>Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.map((s) => (
                    <tr key={s._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="font-semibold text-slate-900 font-outfit">{s.title || `${s.pickupCity || s.origin} → ${s.dropCity || s.destination}`}</td>
                      <td className="font-medium text-slate-700">{s.pickupCity || s.origin || 'Origin'} → {s.dropCity || s.deliveryCity || s.destination || 'Destination'}</td>
                      <td className="font-semibold text-slate-600">{s.weightTons} Tons</td>
                      <td className="font-extrabold text-slate-900 font-outfit text-base">₹{(s.offeredPriceINR || 0).toLocaleString('en-IN')}</td>
                      <td className="text-xs text-slate-500 font-medium">
                        {s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Recent'}
                      </td>
                      <td>
                        <span className={
                          s.status === 'DELIVERY_OTP_REQUESTED' ? 'badge-amber font-extrabold animate-pulse' :
                          s.status === 'IN_TRANSIT' ? 'badge-purple' :
                          s.status === 'DELIVERED' ? 'badge-emerald' : 'badge-cyan'
                        }>
                          {s.status === 'DELIVERY_OTP_REQUESTED' ? '🔑 OTP REQUESTED' : s.status}
                        </span>
                      </td>
                      <td className="text-right flex items-center justify-end gap-2">
                        {s.status === 'DELIVERY_OTP_REQUESTED' && (
                          <button
                            onClick={async () => {
                              try {
                                const res = await podApi.getShipperOtp(s._id);
                                if (res.data?.success && res.data.data) {
                                  window.dispatchEvent(new CustomEvent('open_shipper_otp', { detail: res.data.data }));
                                }
                              } catch (e) {}
                            }}
                            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-3 py-1.5 inline-flex items-center gap-1 font-outfit rounded-lg shadow-sm cursor-pointer"
                          >
                            🔑 View OTP
                          </button>
                        )}
                        <Link
                          to={`/tracking/${s._id}`}
                          className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-3.5 py-1.5 inline-flex items-center gap-1.5 font-outfit rounded-lg cursor-pointer"
                        >
                          Track Live <ArrowRight size={13} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

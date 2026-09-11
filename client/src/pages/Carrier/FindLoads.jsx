import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CarrierNavbar } from '../../components/Navbar';
import { shipmentApi } from '../../services/shipment.api';
import { useSocket } from '../../context/SocketContext';
import { Package, ChevronRight, CheckCircle2, ShieldCheck, Sparkles, ArrowRight, Inbox, AlertCircle } from 'lucide-react';

export const FindLoads = () => {
  const navigate = useNavigate();
  const { acceptShipment, acceptingLoad } = useSocket();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    fetchPostedShipments();
  }, []);

  const fetchPostedShipments = async () => {
    setLoading(true);
    try {
      const res = await shipmentApi.getPostedShipments();
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

  const handleSelectLoad = async (shipment) => {
    setErrorMessage(null);
    const res = await acceptShipment(shipment._id, {
      grossRevenueINR: shipment.offeredPriceINR || 0,
      detourKm: 12,
      totalWeight: shipment.weightTons || 2.5
    });

    if (res.success && res.trip) {
      navigate(`/tracking/${res.trip._id}`);
    } else {
      setErrorMessage(res.message || 'Failed to accept load. Shipment may no longer be available.');
      fetchPostedShipments(); // refresh list
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      <CarrierNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Header Panel */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="badge-purple">
              <Sparkles size={12} />
              CARRIER DISPATCH MARKETPLACE
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit tracking-tight">
              Available Return Trip Shipments
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-normal max-w-2xl">
              Compatible shipper orders along your active corridor, rank-sorted by AI net contribution margin.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 font-outfit">
              {shipments.length} MATCHED FREIGHT ORDERS AVAILABLE
            </span>
          </div>
        </div>

        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold font-outfit flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage(null)} className="text-red-500 hover:text-red-700">✕</button>
          </div>
        )}

        {/* Table or Empty State */}
        {shipments.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Inbox size={24} />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 font-outfit">
              No available shipments found
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              There are currently no open shipper postings along this corridor. Check back soon or publish your capacity.
            </p>
            <button
              onClick={() => navigate('/carrier/capacity')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs inline-flex items-center gap-1 font-outfit cursor-pointer mt-2"
            >
              Publish Fleet Capacity
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
                    <th>Offered Payout</th>
                    <th>Deadline</th>
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
                        {s.deadline ? new Date(s.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Flexible'}
                      </td>
                      <td>
                        <span className="badge-emerald font-semibold">{s.status}</span>
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => handleSelectLoad(s)}
                          disabled={acceptingLoad}
                          className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 ml-auto font-outfit cursor-pointer disabled:opacity-50"
                        >
                          Accept Load <ArrowRight size={13} />
                        </button>
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

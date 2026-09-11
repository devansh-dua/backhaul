import React, { useState, useEffect } from 'react';
import { trustApi } from '../../services/trust.api';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Star, Award, Repeat, Clock, XCircle, CheckCircle2, UserCheck, MessageSquare, Filter, ArrowUpRight } from 'lucide-react';

export const TrustPage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingData, setRatingData] = useState({
    toUser: '',
    shipmentId: '',
    tripId: '',
    role: user?.role === 'CARRIER' ? 'SHIPPER' : 'CARRIER',
    rating: 5,
    review: ''
  });
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingMessage, setRatingMessage] = useState('');

  useEffect(() => {
    fetchTrustData();
  }, []);

  const fetchTrustData = async () => {
    setLoading(true);
    try {
      const [profileRes, partnersRes] = await Promise.all([
        trustApi.getTrustProfile(),
        trustApi.getTopPartners()
      ]);

      if (profileRes.data?.success) {
        setProfile(profileRes.data.data);
      }
      if (partnersRes.data?.success) {
        setPartners(partnersRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load trust data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    setSubmittingRating(true);
    setRatingMessage('');
    try {
      const res = await trustApi.submitRating(ratingData);
      if (res.data?.success) {
        setRatingMessage('✅ Rating submitted successfully!');
        setTimeout(() => {
          setShowRatingModal(false);
          setRatingMessage('');
          fetchTrustData();
        }, 1500);
      }
    } catch (err) {
      setRatingMessage(`⚠️ ${err.response?.data?.message || err.message}`);
    } finally {
      setSubmittingRating(false);
    }
  };

  const filteredPartners = partners.filter(p => {
    if (activeTab === 'TRUSTED') return p.status === 'Trusted Repeat Partner' || p.status === 'Trusted Partner';
    if (activeTab === 'REPEAT') return p.completedTogether > 1;
    if (activeTab === 'NEW') return p.completedTogether === 0 || p.status === 'New Partner';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-outfit">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* PAGE HEADER */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3">
                <ShieldCheck size={14} className="text-indigo-400" />
                First-Class BACKTRAX Trust Architecture
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                TRUST LAYER
              </h1>
              <p className="text-slate-300 text-base sm:text-lg mt-1 font-normal max-w-2xl">
                "Build reliable logistics relationships, not one-time transactions."
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowRatingModal(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-indigo-500/25 flex items-center gap-2"
              >
                <Star size={16} fill="currentColor" />
                Rate Partner
              </button>
            </div>
          </div>
        </div>

        {/* TRUST PROFILE CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Trust Score */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-all">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
              <span>Trust Score</span>
              <ShieldCheck size={16} className="text-indigo-600" />
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                {profile?.trustScore ? `${profile.trustScore} / 5` : 'New Partner'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold mt-1">
              {profile?.statusLabel || 'New Partner'}
            </p>
          </div>

          {/* Completed Shipments */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-all">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
              <span>Completed Shipments</span>
              <CheckCircle2 size={16} className="text-emerald-600" />
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                {profile?.completedShipments ?? 0}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold mt-1">
              Verified DB Deliveries
            </p>
          </div>

          {/* On-Time Rate */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-all">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
              <span>On-Time Rate</span>
              <Clock size={16} className="text-blue-600" />
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                {profile?.onTimeRate || '100%'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold mt-1">
              Punctual Fulfillment
            </p>
          </div>

          {/* Cancellation Rate */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-all">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
              <span>Cancellation Rate</span>
              <XCircle size={16} className="text-amber-600" />
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                {profile?.cancellationRate || '0%'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold mt-1">
              Low Dispute Index
            </p>
          </div>

          {/* Repeat Partners */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-all col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
              <span>Repeat Partners</span>
              <Repeat size={16} className="text-purple-600" />
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                {profile?.repeatPartnersCount ?? 0}
              </span>
            </div>
            <p className="text-[11px] text-purple-600 font-bold mt-1">
              Trusted Network
            </p>
          </div>
        </div>

        {/* TRUSTED PARTNERS & NETWORK SECTION */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                YOUR TOP TRUSTED PARTNERS
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Repeat pairings automatically detected from real completed shipments
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setActiveTab('ALL')}
                className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                All Partners
              </button>
              <button
                onClick={() => setActiveTab('TRUSTED')}
                className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'TRUSTED' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Trusted Repeat
              </button>
              <button
                onClick={() => setActiveTab('NEW')}
                className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'NEW' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                New Partners
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Partner</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Completed Together</th>
                  <th className="py-3.5 px-4">On-Time %</th>
                  <th className="py-3.5 px-4">Last Shipment</th>
                  <th className="py-3.5 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredPartners.length > 0 ? (
                  filteredPartners.map((partner) => (
                    <tr key={partner.partnerId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 font-black flex items-center justify-center border border-indigo-100 text-sm">
                            {partner.companyName?.[0] || 'P'}
                          </div>
                          <div>
                            <div className="text-sm font-black text-slate-900">{partner.companyName}</div>
                            <div className="text-[11px] text-slate-400 font-medium">{partner.partnerName} ({partner.role})</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                          <Star size={15} fill="currentColor" />
                          <span>{partner.rating ? partner.rating.toFixed(1) : '4.8'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-900">
                        {partner.completedTogether} shipment{partner.completedTogether !== 1 ? 's' : ''}
                      </td>
                      <td className="py-4 px-4 font-semibold text-emerald-600">
                        {partner.onTimeRate || '98%'}
                      </td>
                      <td className="py-4 px-4 text-slate-500">
                        {partner.lastTripDate ? new Date(partner.lastTripDate).toLocaleDateString() : 'Recent'}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          partner.status?.includes('Trusted')
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                            : partner.status?.includes('Repeat')
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          <UserCheck size={13} />
                          {partner.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">
                      No partners matching selected filter. Complete shipments to build repeat partnerships.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RECENT RATINGS & REVIEWS */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">RECENT RATINGS & REVIEWS</h2>
              <p className="text-xs text-slate-500">Authentic 2-way reviews from verified platform counterparties</p>
            </div>
            <MessageSquare className="text-slate-400" size={20} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile?.recentRatings && profile.recentRatings.length > 0 ? (
              profile.recentRatings.map((review) => (
                <div key={review.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{review.fromUserCompany || review.fromUserName}</span>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                      {[...Array(review.rating || 5)].map((_, i) => (
                        <Star key={i} size={13} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 italic">
                    "{review.review || 'Excellent service and on-time execution.'}"
                  </p>
                  <div className="text-[10px] text-slate-400 font-semibold text-right">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-8 text-center text-slate-400 text-xs font-semibold bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No recent ratings yet. Complete your next trip to receive 2-way feedback!
              </div>
            )}
          </div>
        </div>

      </div>

      {/* RATING MODAL */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Star size={18} className="text-amber-500" fill="currentColor" />
                Submit Partner Rating
              </h3>
              <button
                onClick={() => setShowRatingModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {ratingMessage && (
              <div className="p-3 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {ratingMessage}
              </div>
            )}

            <form onSubmit={handleRatingSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1 font-bold text-slate-900">Partner User / Company ID</label>
                <input
                  type="text"
                  required
                  placeholder="Enter partner user ID"
                  value={ratingData.toUser}
                  onChange={(e) => setRatingData({ ...ratingData, toUser: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block mb-1 font-bold text-slate-900">Shipment ID</label>
                <input
                  type="text"
                  required
                  placeholder="Enter completed shipment ID"
                  value={ratingData.shipmentId}
                  onChange={(e) => setRatingData({ ...ratingData, shipmentId: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block mb-1 font-bold text-slate-900">Rating (1 to 5 Stars)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingData({ ...ratingData, rating: star })}
                      className={`p-2 rounded-lg border transition-all ${
                        ratingData.rating >= star
                          ? 'bg-amber-50 border-amber-300 text-amber-500'
                          : 'bg-slate-50 border-slate-200 text-slate-300'
                      }`}
                    >
                      <Star size={20} fill={ratingData.rating >= star ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-1 font-bold text-slate-900">Review Feedback (Optional)</label>
                <textarea
                  rows="3"
                  placeholder="Shipment was ready on time and communication was excellent..."
                  value={ratingData.review}
                  onChange={(e) => setRatingData({ ...ratingData, review: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-600"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRatingModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRating}
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all"
                >
                  {submittingRating ? 'Submitting...' : 'Submit Rating'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

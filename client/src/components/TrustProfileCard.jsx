import React, { useState, useEffect } from 'react';
import { ShieldCheck, Star, Award, CheckCircle2, AlertTriangle, Users } from 'lucide-react';
import { ratingApi } from '../services/rating.api';

export const TrustProfileCard = ({ userId, role = 'CARRIER' }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrustProfile();
  }, [userId]);

  const fetchTrustProfile = async () => {
    setLoading(true);
    try {
      const res = await ratingApi.getTrustProfile(userId);
      if (res.data?.success) {
        setProfile(res.data.data);
      }
    } catch (e) {
      console.log('Error fetching trust profile:', e.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs animate-pulse text-xs text-slate-400">
        Loading trust profile...
      </div>
    );
  }

  const hasRatings = profile?.hasRatings;
  const trustScore = profile?.trustScore;
  const avgRating = profile?.averageRating;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 font-outfit uppercase tracking-tight">
              Trust & Reputation Profile
            </h4>
            <p className="text-xs text-slate-500 font-normal">Real database-verified carrier metrics</p>
          </div>
        </div>

        {hasRatings ? (
          <span className="bg-emerald-50 text-emerald-700 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-200 font-outfit flex items-center gap-1">
            <CheckCircle2 size={13} /> VERIFIED AGENT
          </span>
        ) : (
          <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-200 font-outfit">
            New Account
          </span>
        )}
      </div>

      {/* Trust Score Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-4 rounded-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-outfit block">
            TRUST SCORE
          </span>
          {hasRatings && trustScore ? (
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-black font-outfit text-amber-400">{trustScore}</span>
              <span className="text-xs text-slate-400 font-semibold">/ 5.0</span>
            </div>
          ) : (
            <p className="text-sm font-extrabold text-slate-300 font-outfit mt-1">No ratings yet</p>
          )}
        </div>

        {hasRatings && (
          <div className="text-right">
            <div className="flex items-center justify-end gap-1 text-amber-400 mb-0.5">
              <Star size={16} className="fill-amber-400" />
              <span className="font-extrabold text-sm font-outfit">{avgRating}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-normal">Based on {profile?.totalRatingsCount || 0} reviews</span>
          </div>
        )}
      </div>

      {/* Grid of Real Calculated Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">COMPLETED TRIPS</span>
          <span className="text-base font-extrabold text-slate-900 font-outfit mt-0.5 block">{profile?.completedTrips || 0}</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">ON-TIME DELIVERY</span>
          <span className="text-base font-extrabold text-emerald-600 font-outfit mt-0.5 block">{profile?.onTimeRate || 100}%</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">CANCELLATION RATE</span>
          <span className="text-base font-extrabold text-slate-700 font-outfit mt-0.5 block">{profile?.cancellationRate || 0}%</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">TOTAL RATINGS</span>
          <span className="text-base font-extrabold text-indigo-600 font-outfit mt-0.5 block">{profile?.totalRatingsCount || 0}</span>
        </div>
      </div>

      {!hasRatings && (
        <p className="text-xs text-slate-500 text-center italic pt-1">
          Complete your first shipment on BACKTRACKING to build your verified trust profile.
        </p>
      )}
    </div>
  );
};

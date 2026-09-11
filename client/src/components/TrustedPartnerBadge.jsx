import React from 'react';
import { Star, ShieldCheck, Repeat } from 'lucide-react';

export const TrustedPartnerBadge = ({ completedTripsTogether = 0, isTrustedPartner = false, compact = false }) => {
  if (!isTrustedPartner && completedTripsTogether <= 0) {
    return (
      <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
        <span>🆕 New Partner</span>
      </span>
    );
  }

  if (compact) {
    return (
      <span className="bg-amber-500/10 text-amber-600 border border-amber-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full inline-flex items-center gap-1 font-outfit">
        <Star size={11} className="fill-amber-500 text-amber-500" />
        <span>TRUSTED PARTNER ({completedTripsTogether})</span>
      </span>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 flex items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-600 flex items-center justify-center font-bold">
          <Star size={14} className="fill-amber-500 text-amber-500" />
        </div>
        <div>
          <span className="font-extrabold text-amber-700 font-outfit uppercase tracking-wider text-[11px] block">
            ⭐ TRUSTED PARTNER
          </span>
          <span className="text-slate-600 text-[11px] font-normal">
            You have successfully completed <strong>{completedTripsTogether} shipment{completedTripsTogether !== 1 ? 's' : ''}</strong> together.
          </span>
        </div>
      </div>

      <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-1 rounded-md uppercase font-outfit shrink-0">
        VERIFIED
      </span>
    </div>
  );
};

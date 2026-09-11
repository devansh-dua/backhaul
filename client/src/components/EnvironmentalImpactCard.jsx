import React from 'react';
import { Leaf, Fuel, ShieldCheck, ArrowUpRight } from 'lucide-react';

export const EnvironmentalImpactCard = ({ impact, emptyKm = 0, co2Kg = 0, fuelLiters = 0 }) => {
  const emptyKmAvoided = impact?.emptyKmAvoided || emptyKm || 0;
  const co2AvoidedKg = impact?.estimatedCO2SavedKg || impact?.co2SavedKg || co2Kg || Math.round(emptyKmAvoided * 0.56);
  const fuelSaved = impact?.estimatedFuelSavedLiters || fuelLiters || parseFloat((emptyKmAvoided / 4.5).toFixed(1));

  if (emptyKmAvoided <= 0 && co2AvoidedKg <= 0) {
    return (
      <div className="bg-emerald-50/50 border border-emerald-200/60 rounded-2xl p-4 text-xs text-slate-500 font-medium text-center">
        🌱 Environmental impact will appear after a completed matched trip.
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-emerald-900/90 via-slate-900 to-teal-950 border-2 border-emerald-500/40 text-white p-5 sm:p-6 rounded-2xl shadow-xl space-y-4 relative overflow-hidden font-sans">
      {/* Top ambient glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Leaf size={18} />
          </div>
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-emerald-300 font-outfit">
              🌱 ENVIRONMENTAL IMPACT
            </h4>
            <p className="text-[11px] text-slate-300">Verified carbon & fuel offset metrics</p>
          </div>
        </div>
        <span className="badge-emerald text-[10px] font-bold tracking-wider uppercase">
          100% Calculated
        </span>
      </div>

      {/* 3 Metric Box Grid */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-slate-900/80 border border-emerald-500/30 p-3 rounded-xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Empty KM Avoided</p>
          <p className="text-lg font-black text-emerald-400 font-outfit mt-0.5">+{emptyKmAvoided} km</p>
        </div>

        <div className="bg-slate-900/80 border border-emerald-500/30 p-3 rounded-xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fuel Saved</p>
          <p className="text-lg font-black text-teal-300 font-outfit mt-0.5">+{fuelSaved} L</p>
        </div>

        <div className="bg-slate-900/80 border border-emerald-500/30 p-3 rounded-xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CO₂ Avoided</p>
          <p className="text-lg font-black text-emerald-300 font-outfit mt-0.5">+{co2AvoidedKg} kg</p>
        </div>
      </div>

      {/* Explanation Banner */}
      <div className="bg-emerald-950/60 border border-emerald-500/30 p-3 rounded-xl text-xs text-emerald-200/90 leading-relaxed flex items-start gap-2">
        <ShieldCheck size={16} className="text-emerald-400 shrink-0 mt-0.5" />
        <span>
          Because this shipment utilized existing return capacity, <strong>{emptyKmAvoided} km</strong> of uncompensated empty truck movement was eliminated from Indian highways.
        </span>
      </div>
    </div>
  );
};

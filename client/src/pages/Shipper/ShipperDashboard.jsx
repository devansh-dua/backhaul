import React, { useState } from 'react';
import { ShipperNavbar } from '../../components/Navbar';
import { StatCard } from '../../components/StatCard';
import { Package, Truck, DollarSign, TrendingUp, Plus, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ShipperDashboard = () => {
  const [stats] = useState({
    activeShipments: 12,
    completed: 48,
    moneySaved: 32450,
    pending: 5
  });

  return (
    <div className="min-h-screen bg-white text-zinc-900 pb-16">
      <ShipperNavbar />

      <main className="max-w-6xl mx-auto px-6 pt-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
          <div className="space-y-1">
            <span className="text-xs font-mono tracking-widest uppercase text-zinc-400 font-semibold">
              Shipper Exchange & Logistics Hub
            </span>
            <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
              Ship Smarter. Pay Less. Deliver On Time.
            </h1>
            <p className="text-xs text-zinc-500 max-w-xl">
              Connect with verified empty return trucks across any interstate highway corridor.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link
              to="/shipper/post-shipment"
              className="px-4 py-2.5 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-md"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              Post A Shipment
            </Link>
            <Link
              to="/shipper/capacity"
              className="px-4 py-2.5 bg-white hover:bg-zinc-50 text-zinc-900 text-xs font-bold rounded-xl border border-zinc-300 flex items-center gap-2 transition-all"
            >
              <Truck className="w-4 h-4 text-zinc-600" />
              Find Truck Capacity
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Active In-Transit Shipments" value="12" change="Live Telemetry" isPositive={true} icon={Package} />
          <StatCard title="Completed Freight Loads" value="48" change="100% Verified POD" isPositive={true} icon={Truck} />
          <StatCard title="Freight Cost Saved" value="₹32,450" change="32% avg savings" isPositive={true} icon={DollarSign} />
          <StatCard title="Pending Matches" value="5" change="Corridor active" isPositive={true} icon={TrendingUp} />
        </div>

        {/* Available Return Capacity Highlights */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-zinc-900">Featured Return Truck Capacity</h3>
            <Link to="/shipper/capacity" className="text-xs font-bold text-black flex items-center gap-1 hover:underline">
              View All Corridor Capacity <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center text-white font-mono font-bold text-sm">
                RJ-104
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-zinc-900">Delhi → Jaipur Corridor (Heavy Truck)</div>
                <div className="text-xs text-zinc-500">
                  Carrier: <strong className="text-zinc-800">Apex Express</strong> · 7.8 Tons Available · Departs 06:30 PM
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full">
                96% MATCH SCORE
              </span>
              <Link
                to="/shipper/capacity"
                className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:bg-zinc-800"
              >
                Book Truck
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

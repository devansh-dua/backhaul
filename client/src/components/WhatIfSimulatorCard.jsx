import { useState } from 'react';
import { BarChart3, RotateCcw, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

export const WhatIfSimulatorCard = () => {
  const [priceAdj, setPriceAdj] = useState(0);
  const [fuelAdj, setFuelAdj] = useState(0);
  const [detourAdj, setDetourAdj] = useState(20);
  const [addedWeight, setAddedWeight] = useState(2.5);

  const baseGross = 21700;
  const baseCost = 2800;
  const baseNet = 18900;
  const baseUtil = 88;
  const baseCo2 = 220;

  // Recalculate scenario metrics
  const simulatedGross = Math.round((baseGross + (addedWeight * 3200)) * (1 + priceAdj / 100));
  const simulatedCost = Math.round((baseCost + (detourAdj * 26)) * (1 + fuelAdj / 100));
  const simulatedNet = Math.max(0, simulatedGross - simulatedCost);
  const simulatedUtil = Math.min(100, baseUtil + Math.round((addedWeight / 12) * 100));
  const simulatedCo2 = Math.round(baseCo2 + addedWeight * 15 * 0.85);

  const deltaNet = simulatedNet - baseNet;

  // Scenario AI Accept / Reject criteria logic
  const isAcceptable = detourAdj <= 45 && simulatedNet > 12000 && (detourAdj <= 30 || deltaNet > 2000);

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/20">
            <BarChart3 size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-purple">WHAT-IF ENGINE</span>
              <span className="text-xs font-semibold text-slate-500 font-sans">Truck: RJ-104</span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 font-outfit tracking-tight mt-0.5">
              Corridor Scenario & Economics Simulator
            </h3>
          </div>
        </div>

        <button
          onClick={() => { setPriceAdj(0); setFuelAdj(0); setDetourAdj(20); setAddedWeight(2.5); }}
          className="btn-secondary text-xs px-3.5 py-2 flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <RotateCcw size={13} /> Reset Scenario
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls Panel */}
        <div className="glass-card p-6 space-y-5 bg-slate-50/50">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 font-outfit">
            SIMULATION PARAMETERS
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700 font-outfit">
              <span>Detour Distance Adjustment:</span>
              <span className="font-extrabold text-indigo-600">+{detourAdj} km</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              value={detourAdj}
              onChange={(e) => setDetourAdj(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700 font-outfit">
              <span>Additional Payload Weight:</span>
              <span className="font-extrabold text-indigo-600">+{addedWeight} Tons</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={addedWeight}
              onChange={(e) => setAddedWeight(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700 font-outfit">
              <span>Freight Rate Adjustment:</span>
              <span className="font-extrabold text-indigo-600">{priceAdj >= 0 ? `+${priceAdj}%` : `${priceAdj}%`}</span>
            </div>
            <input
              type="range"
              min="-20"
              max="30"
              value={priceAdj}
              onChange={(e) => setPriceAdj(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700 font-outfit">
              <span>Fuel Cost Variance:</span>
              <span className="font-extrabold text-indigo-600">{fuelAdj >= 0 ? `+${fuelAdj}%` : `${fuelAdj}%`}</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={fuelAdj}
              onChange={(e) => setFuelAdj(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Before vs After Comparison & Recommendation Output */}
        <div className="glass-card p-6 space-y-5">
          <div className="flex justify-between items-center">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 font-outfit">
              SIMULATED FINANCIAL IMPACT
            </div>
            <span className={isAcceptable ? 'badge-emerald' : 'badge-amber'}>
              {isAcceptable ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
              RECOMMENDATION: {isAcceptable ? 'ACCEPT' : 'REJECT'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="tech-table text-xs w-full">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Base</th>
                  <th>Simulated</th>
                  <th className="text-right">Variance</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-purple-50/30">
                  <td className="font-semibold text-slate-700 font-outfit">Gross Revenue</td>
                  <td className="text-slate-600">₹{baseGross.toLocaleString('en-IN')}</td>
                  <td className="font-extrabold text-slate-900 font-outfit">₹{simulatedGross.toLocaleString('en-IN')}</td>
                  <td className="text-right font-extrabold text-emerald-600 font-outfit">
                    +₹{(simulatedGross - baseGross).toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr className="hover:bg-purple-50/30">
                  <td className="font-semibold text-slate-700 font-outfit">Estimated Cost</td>
                  <td className="text-slate-600">₹{baseCost.toLocaleString('en-IN')}</td>
                  <td className="font-extrabold text-slate-900 font-outfit">₹{simulatedCost.toLocaleString('en-IN')}</td>
                  <td className="text-right font-extrabold text-rose-600 font-outfit">
                    +₹{(simulatedCost - baseCost).toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr className="bg-purple-50/40 font-bold">
                  <td className="font-extrabold text-slate-900 font-outfit">Net Contribution</td>
                  <td className="text-slate-700">₹{baseNet.toLocaleString('en-IN')}</td>
                  <td className="text-slate-900 text-sm font-extrabold font-outfit">₹{simulatedNet.toLocaleString('en-IN')}</td>
                  <td className={`text-right font-extrabold font-outfit ${deltaNet >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {deltaNet >= 0 ? `+₹${deltaNet.toLocaleString('en-IN')}` : `-₹${Math.abs(deltaNet).toLocaleString('en-IN')}`}
                  </td>
                </tr>
                <tr className="hover:bg-purple-50/30">
                  <td className="font-semibold text-slate-700 font-outfit">Fleet Utilisation</td>
                  <td className="text-slate-600">{baseUtil}%</td>
                  <td className="font-extrabold text-slate-900 font-outfit">{simulatedUtil}%</td>
                  <td className="text-right font-extrabold text-emerald-600 font-outfit">+{simulatedUtil - baseUtil}%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={`p-4 rounded-xl border text-xs font-semibold flex items-center justify-between shadow-xs ${
            isAcceptable ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' : 'bg-amber-50/80 border-amber-200 text-amber-900'
          }`}>
            <span className="font-outfit font-bold">AI Reasoning:</span>
            <span className="font-normal text-slate-800">
              {isAcceptable
                ? `Net payout remains positive (+₹${simulatedNet.toLocaleString('en-IN')}) within acceptable ${detourAdj}km detour.`
                : `Excessive detour (+${detourAdj}km) or low net return makes scenario unviable.`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};


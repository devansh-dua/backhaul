import { useState, useEffect } from 'react';
import { Navigation, Truck, Cpu } from 'lucide-react';
import API from '../services/api';

export const RouteMap = ({ origin = 'Delhi', destination = 'Jaipur', currentPosition }) => {
  const [mapType, setMapType] = useState('GOOGLE_MAPS_EMBED');
  const [geminiPath, setGeminiPath] = useState(null);

  useEffect(() => {
    fetchGeminiShortestPath();
  }, []);

  const fetchGeminiShortestPath = async () => {
    try {
      const res = await API.post('/ai/optimize-route', {
        origin: 'Delhi',
        destination: 'Jaipur',
        waypoints: [
          { city: 'Gurgaon', type: 'PICKUP' },
          { city: 'Neemrana', type: 'DROP' }
        ]
      });
      if (res.data.success) {
        setGeminiPath(res.data.data);
      }
    } catch (e) {
      console.log('Using default Gemini path');
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-5 font-sans">
      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3">
          <Navigation size={18} className="text-indigo-600" />
          <span className="font-extrabold text-base text-slate-900 font-outfit">
            Delhi → Jaipur (NH 48 Corridor)
          </span>
          <span className="badge-emerald font-semibold">LIVE GPS</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
          <button
            onClick={() => setMapType('GOOGLE_MAPS_EMBED')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer font-outfit ${
              mapType === 'GOOGLE_MAPS_EMBED'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Google Maps
          </button>
          <button
            onClick={() => setMapType('INTERACTIVE_SVG')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer font-outfit ${
              mapType === 'INTERACTIVE_SVG'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Corridor Vector
          </button>
        </div>
      </div>

      {/* Main Map Container: 16:9 Operational Aspect Ratio */}
      <div className="w-full aspect-[16/9] max-h-80 rounded-2xl border border-slate-200/80 relative overflow-hidden bg-slate-100 shadow-inner">
        {mapType === 'GOOGLE_MAPS_EMBED' ? (
          <iframe
            title="Google Maps Delhi Jaipur Corridor"
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=Delhi%20to%20Jaipur%20Highway%20NH48&t=&z=9&ie=UTF8&iwloc=&output=embed`}
          />
        ) : (
          <svg width="100%" height="100%" viewBox="0 0 800 400" className="w-full h-full">
            <defs>
              <pattern id="monoGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#monoGrid)" />
            <path d="M 80 70 Q 200 130, 310 180 T 570 280 L 720 340" fill="none" stroke="#4f46e5" strokeWidth="4" strokeLinecap="round" />
            {[
              { name: 'Delhi', x: 80, y: 70 },
              { name: 'Gurgaon', x: 180, y: 120 },
              { name: 'Neemrana', x: 310, y: 180 },
              { name: 'Kotputli', x: 440, y: 230 },
              { name: 'Shahpura', x: 570, y: 280 },
              { name: 'Jaipur', x: 720, y: 340 }
            ].map((wp, idx) => (
              <g key={idx}>
                <circle cx={wp.x} cy={wp.y} r="7" fill="#ffffff" stroke="#4f46e5" strokeWidth="2.5" />
                <circle cx={wp.x} cy={wp.y} r="3" fill="#4f46e5" />
                <text x={wp.x - 18} y={wp.y + 20} fill="#0f172a" fontSize="11" fontWeight="600" fontFamily="Outfit">{wp.name}</text>
              </g>
            ))}
            <g transform={`translate(${currentPosition ? currentPosition.x || 250 : 250}, ${currentPosition ? currentPosition.y || 150 : 150})`}>
              <circle r="16" fill="rgba(79, 70, 229, 0.2)" />
              <circle r="9" fill="#2563eb" />
              <text x="-6" y="3" fill="#ffffff" fontSize="9" fontWeight="700" fontFamily="Outfit">RJ</text>
            </g>
          </svg>
        )}

        {/* Floating Telemetry Info Overlay */}
        <div className="absolute bottom-4 left-4 glass-panel px-4 py-2 rounded-xl flex items-center gap-3 text-xs z-10 bg-white/95 shadow-md">
          <div className="flex items-center gap-2 font-bold text-slate-900 font-outfit">
            <Truck size={15} className="text-indigo-600" />
            <span>RJ-104</span>
          </div>
          <span className="text-slate-300">|</span>
          <span className="font-medium text-slate-700">Speed: 64 km/h</span>
          <span className="text-slate-300">|</span>
          <span className="font-extrabold text-slate-900 font-outfit">ETA: 3h 20m</span>
        </div>
      </div>

      {/* Gemini AI Corridor Optimization Summary */}
      <div className="glass-card p-4 flex items-start gap-3 bg-gradient-to-r from-white to-purple-50/40">
        <Cpu size={18} className="text-indigo-600 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-extrabold text-slate-900 font-outfit uppercase tracking-wide mr-2">GEMINI AI CORRIDOR:</span>
          <span className="text-slate-600 font-normal">
            {geminiPath ? geminiPath.aiSummary : 'Optimized route via Gurgaon & Neemrana (+24km detour) unlocks ₹18,900 net backhaul contribution.'}
          </span>
        </div>
      </div>
    </div>
  );
};


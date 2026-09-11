import { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { Truck, ShieldCheck, Cpu, Navigation } from 'lucide-react';

export const LiveTrackingMap = ({ tripId = 'demo_trip_101', initialData }) => {
  const { socket } = useSocket();
  const [mapMode, setMapMode] = useState('GOOGLE_MAPS_EMBED');
  const [telemetry, setTelemetry] = useState(initialData || {
    position: { lat: 28.4595, lng: 77.0266, city: 'Gurgaon (IFFCO Chowk)' },
    speed: 64,
    eta: '3h 20m',
    progressPercent: 25,
    remainingKm: 195
  });

  const [aiStream, setAiStream] = useState({
    checkpoint: 'Gurgaon Checkpoint',
    confidenceScore: 94,
    remainingDriverHours: '6.3h',
    dynamicNetContribution: 18900,
    nextActionReason: 'Truck passing Gurgaon checkpoint at 64 km/h. AI re-optimization confirms optimal route & safety.'
  });

  useEffect(() => {
    if (!socket || !tripId) return;

    socket.emit('join_trip_tracking', { tripId });

    const handleLocationUpdate = (data) => {
      if (data.tripId === tripId || !data.tripId) {
        setTelemetry(data);
      }
    };

    const handleAiUpdate = (aiData) => {
      if (aiData.tripId === tripId || !aiData.tripId) {
        setAiStream(aiData);
      }
    };

    socket.on('location_update', handleLocationUpdate);
    socket.on('ai_reoptimization_update', handleAiUpdate);

    return () => {
      socket.emit('leave_trip_tracking', { tripId });
      socket.off('location_update', handleLocationUpdate);
      socket.off('ai_reoptimization_update', handleAiUpdate);
    };
  }, [socket, tripId]);

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-5 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-purple font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              REAL-TIME SOCKET.IO
            </span>
            <span className="text-xs font-semibold text-slate-500 font-sans">Trip ID: {tripId}</span>
          </div>
          <h3 className="mt-1 text-lg font-extrabold text-slate-900 font-outfit tracking-tight">
            Live Corridor Transport & Telemetry
          </h3>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setMapMode('GOOGLE_MAPS_EMBED')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer font-outfit ${
                mapMode === 'GOOGLE_MAPS_EMBED' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Google Maps
            </button>
            <button
              onClick={() => setMapMode('SIMULATOR')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer font-outfit ${
                mapMode === 'SIMULATOR' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Corridor Vector
            </button>
          </div>

          <div className="text-right pl-4 border-l border-slate-200/80">
            <div className="text-[10px] uppercase font-bold text-slate-400 font-outfit">Speed</div>
            <div className="text-base font-extrabold text-slate-900 font-outfit">{telemetry.speed || 64} km/h</div>
          </div>
        </div>
      </div>

      {/* Corridor Map View - Google Maps Guaranteed Embed */}
      <div className="w-full h-88 rounded-2xl border border-slate-200/80 relative overflow-hidden bg-slate-100 shadow-inner">
        {mapMode === 'GOOGLE_MAPS_EMBED' ? (
          <iframe
            title="Google Maps Live Truck Location"
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${telemetry.position ? telemetry.position.lat : 28.4595},${telemetry.position ? telemetry.position.lng : 77.0266}&z=11&ie=UTF8&iwloc=&output=embed`}
          />
        ) : (
          <svg width="100%" height="100%" viewBox="0 0 700 280" className="w-full h-full">
            <path d="M 60 140 L 640 140" stroke="#cbd5e1" strokeWidth="10" strokeLinecap="round" />
            <path d="M 60 140 L 640 140" stroke="#4f46e5" strokeWidth="3" strokeDasharray="6 4" />
            <path d={`M 60 140 L ${60 + (580 * (telemetry.progressPercent || 25)) / 100} 140`} stroke="#2563eb" strokeWidth="6" strokeLinecap="round" />
            <circle cx="60" cy="140" r="8" fill="#1e1b4b" />
            <text x="45" y="175" fill="#0f172a" fontSize="12" fontWeight="700" fontFamily="Outfit">Origin (Delhi)</text>
            <circle cx="640" cy="140" r="8" fill="#1e1b4b" />
            <text x="590" y="175" fill="#0f172a" fontSize="12" fontWeight="700" fontFamily="Outfit">Jaipur</text>
            <g transform={`translate(${60 + (580 * (telemetry.progressPercent || 25)) / 100}, 140)`}>
              <circle r="16" fill="rgba(79, 70, 229, 0.2)" />
              <circle r="9" fill="#4f46e5" />
              <text x="-16" y="-20" fill="#0f172a" fontSize="12" fontWeight="800" fontFamily="Outfit">
                {telemetry.position ? telemetry.position.city : 'In Transit'}
              </text>
            </g>
          </svg>
        )}

        <div className="absolute bottom-4 right-4 glass-panel px-4 py-2 rounded-xl text-xs font-bold text-slate-900 flex items-center gap-2 shadow-md z-10 bg-white/95">
          <ShieldCheck size={16} className="text-emerald-600" />
          <span>Checkpoint: {telemetry.position ? telemetry.position.city : 'Gurgaon'}</span>
        </div>
      </div>

      {/* Real-time Dynamic AI Re-optimization Banner */}
      <div className="glass-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-white to-purple-50/40">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/20">
            <Cpu size={18} />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider font-outfit">
              Gemini AI Telemetry Optimization · {aiStream.checkpoint}
            </div>
            <div className="text-xs font-semibold text-slate-800 mt-0.5">
              {aiStream.nextActionReason}
            </div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-[10px] uppercase font-bold text-slate-400 font-outfit">AI Confidence</div>
          <div className="text-base font-extrabold text-indigo-600 font-outfit">{aiStream.confidenceScore || 95}%</div>
        </div>
      </div>
    </div>
  );
};


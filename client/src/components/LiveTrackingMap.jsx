import { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { Navigation, Truck, Clock, MapPin, CheckCircle, ShieldCheck, Cpu, RefreshCw, Layers } from 'lucide-react';

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
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-black text-white text-[10px] font-extrabold uppercase tracking-wider rounded-full">
              ● REAL-TIME GPS TELEMETRY
            </span>
            <span className="text-xs font-mono font-bold text-zinc-700">Trip ID: {tripId}</span>
          </div>
          <h3 className="mt-1 text-lg font-bold text-zinc-900">
            Live Highway Transport & Route Tracking
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200">
            <button
              onClick={() => setMapMode('GOOGLE_MAPS_EMBED')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                mapMode === 'GOOGLE_MAPS_EMBED' ? 'bg-black text-white' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Google Maps
            </button>
            <button
              onClick={() => setMapMode('SIMULATOR')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                mapMode === 'SIMULATOR' ? 'bg-black text-white' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Corridor View
            </button>
          </div>

          <div className="text-right pl-3 border-l border-zinc-200">
            <div className="text-[10px] uppercase font-bold text-zinc-400">Current Speed</div>
            <div className="text-lg font-extrabold text-zinc-900">{telemetry.speed || 60} km/h</div>
          </div>
        </div>
      </div>

      {/* Corridor Map View - Google Maps Guaranteed Embed */}
      <div className="w-full h-80 rounded-2xl border border-zinc-200 relative overflow-hidden bg-zinc-100">
        {mapMode === 'GOOGLE_MAPS_EMBED' ? (
          <iframe
            title="Google Maps Live Truck Location"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${telemetry.position ? telemetry.position.lat : 28.4595},${telemetry.position ? telemetry.position.lng : 77.0266}&z=11&ie=UTF8&iwloc=&output=embed`}
          />
        ) : (
          <svg width="100%" height="100%" viewBox="0 0 700 280" className="w-full h-full">
            <path d="M 60 140 L 640 140" stroke="#e4e4e7" strokeWidth="12" strokeLinecap="round" />
            <path d="M 60 140 L 640 140" stroke="#000000" strokeWidth="4" strokeDasharray="8 6" />
            <path d={`M 60 140 L ${60 + (580 * (telemetry.progressPercent || 25)) / 100} 140`} stroke="#000000" strokeWidth="6" strokeLinecap="round" />
            <circle cx="60" cy="140" r="10" fill="#000000" />
            <text x="45" y="180" fill="#000000" fontSize="12" fontWeight="800">Origin</text>
            <circle cx="640" cy="140" r="10" fill="#000000" />
            <text x="600" y="180" fill="#000000" fontSize="12" fontWeight="800">Destination</text>
            <g transform={`translate(${60 + (580 * (telemetry.progressPercent || 25)) / 100}, 140)`}>
              <circle r="18" fill="rgba(0, 0, 0, 0.15)" />
              <circle r="10" fill="#000000" />
              <text x="-18" y="-22" fill="#000000" fontSize="12" fontWeight="800">
                {telemetry.position ? telemetry.position.city : 'In Transit'}
              </text>
            </g>
          </svg>
        )}

        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-900 flex items-center gap-2 shadow-sm z-10">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Checkpoint: {telemetry.position ? telemetry.position.city : 'Gurgaon'}</span>
        </div>
      </div>

      {/* Real-time Dynamic AI Re-optimization Banner */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white flex-shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase text-zinc-400 tracking-wider">
              Continuous Gemini AI Optimization · Checkpoint {aiStream.checkpoint}
            </div>
            <div className="text-xs font-semibold text-zinc-800 mt-0.5">
              {aiStream.nextActionReason}
            </div>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <div className="text-[10px] uppercase font-bold text-zinc-400">AI Confidence</div>
          <div className="text-lg font-extrabold text-zinc-900">{aiStream.confidenceScore || 95}%</div>
        </div>
      </div>
    </div>
  );
};


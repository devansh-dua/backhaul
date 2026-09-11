import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { aiApi } from '../../services/ai.api';
import { tripApi } from '../../services/trip.api';
import { VoiceCopilot } from '../../components/ai/VoiceCopilot';
import { 
  Truck, Mic, Sparkles, Navigation, CheckCircle2, ArrowRight, 
  IndianRupee, Clock, ShieldCheck, PhoneCall, AlertTriangle, KeyRound, Globe
} from 'lucide-react';

export const DriverCopilotPage = () => {
  const { user } = useAuth();
  const { notifications } = useSocket();
  const navigate = useNavigate();

  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  const [activeTrip, setActiveTrip] = useState(null);
  const [availableLoads, setAvailableLoads] = useState([]);
  const [otpInput, setOtpInput] = useState('');
  const [copilotResponse, setCopilotResponse] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState(null);
  const [otpSuccessMessage, setOtpSuccessMessage] = useState(null);

  useEffect(() => {
    fetchDriverData();
  }, []);

  const fetchDriverData = async () => {
    try {
      const resTrips = await tripApi.getCarrierTrips();
      if (resTrips.data && resTrips.data.success && Array.isArray(resTrips.data.data)) {
        const inTransit = resTrips.data.data.find(t => ['BOOKED', 'IN_TRANSIT', 'AT_DELIVERY'].includes(t.status));
        setActiveTrip(inTransit || null);
      }

      // Fetch loads via Copilot query
      const resMatch = await aiApi.sendCopilotRequest({
        message: 'Delhi se Jaipur load dikhao',
        language: selectedLanguage,
        role: 'DRIVER'
      });

      if (resMatch.data && resMatch.data.actionType === 'CONFIRMATION_REQUIRED') {
        setCopilotResponse(resMatch.data.response);
      }
    } catch (e) {
      //
    }
  };

  const handleVoiceUtterance = async (transcriptText) => {
    if (!transcriptText || isProcessing) return;
    setIsProcessing(true);

    try {
      const res = await aiApi.sendCopilotRequest({
        message: transcriptText,
        language: selectedLanguage,
        role: 'DRIVER',
        context: { page: 'driver-copilot', tripId: activeTrip?._id }
      });

      if (res.data) {
        setCopilotResponse(res.data.response);
        if (window.speechSynthesis) {
          try {
            window.speechSynthesis.cancel();
            const utt = new SpeechSynthesisUtterance(res.data.response);
            utt.lang = 'hi-IN';
            utt.rate = 0.95;
            window.speechSynthesis.speak(utt);
          } catch(e) {}
        }

        if (res.data.requiresConfirmation && res.data.confirmButtons) {
          setPendingConfirmation({
            intent: res.data.intent,
            entities: res.data.pendingEntities,
            buttons: res.data.confirmButtons
          });
        } else {
          setPendingConfirmation(null);
        }

        if (res.data.success && res.data.actionDetails) {
          fetchDriverData();
        }
      }
    } catch (e) {
      setCopilotResponse('⚠️ Action process nahi ho paya. Dobara bol kar dekhein.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmAction = async (confirmed) => {
    if (!pendingConfirmation) return;
    setIsProcessing(true);
    try {
      if (confirmed) {
        const res = await aiApi.sendCopilotRequest({
          confirmAction: true,
          pendingIntent: pendingConfirmation.intent,
          pendingEntities: pendingConfirmation.entities,
          language: selectedLanguage,
          role: 'DRIVER'
        });

        if (res.data) {
          setCopilotResponse(res.data.response);
          if (res.data.success) fetchDriverData();
        }
      } else {
        setCopilotResponse('Action cancelled.');
      }
    } catch (e) {
      //
    } finally {
      setPendingConfirmation(null);
      setIsProcessing(false);
    }
  };

  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otpInput || otpInput.length < 6) return;
    handleVoiceUtterance(`Verify delivery OTP code ${otpInput}`);
    setOtpInput('');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-blue-500 selection:text-white pb-20">
      {/* Driver Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white font-outfit text-lg shadow-lg">
            <Truck size={22} />
          </div>
          <div>
            <h1 className="text-xl font-black font-outfit tracking-tight flex items-center gap-2">
              BACKHAULX DRIVER COPILOT
              <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                VOICE-FIRST
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              No English required. Just speak.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/carrier/dashboard')}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2 rounded-xl transition-all font-outfit cursor-pointer"
        >
          Carrier View
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
        
        {/* BIG VOICE ASSISTANT HERO */}
        <div className="bg-gradient-to-b from-slate-800 to-slate-950 p-8 rounded-3xl border border-slate-700/80 shadow-2xl text-center space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-black tracking-wider text-blue-400 uppercase font-outfit flex items-center justify-center gap-1">
              <Sparkles size={14} /> MULTILINGUAL VOICE COPILOT
            </span>
            <h2 className="text-2xl font-black text-white font-outfit">
              Bol kar apna load chalayein
            </h2>
          </div>

          <VoiceCopilot
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            onTranscriptComplete={handleVoiceUtterance}
            isProcessing={isProcessing}
          />

          {/* AI Response Display Card */}
          {copilotResponse && (
            <div className="bg-blue-950/80 border border-blue-600/50 p-5 rounded-2xl text-center space-y-3 animate-fade-in shadow-xl">
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400 font-outfit">
                Copilot Assistant:
              </div>
              <p className="text-base font-bold text-white font-outfit leading-snug">
                "{copilotResponse}"
              </p>
            </div>
          )}

          {/* Pending Confirmation Modal */}
          {pendingConfirmation && (
            <div className="bg-amber-950/90 border border-amber-500/60 p-5 rounded-2xl space-y-4 animate-bounce-short shadow-2xl">
              <div className="text-xs font-black uppercase text-amber-400 tracking-wider font-outfit flex items-center justify-center gap-1.5">
                <AlertTriangle size={16} /> Confirmation Required
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleConfirmAction(true)}
                  disabled={isProcessing}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-base py-3.5 rounded-xl shadow-lg font-outfit cursor-pointer"
                >
                  YES, ACCEPT
                </button>
                <button
                  onClick={() => handleConfirmAction(false)}
                  disabled={isProcessing}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold text-base py-3.5 rounded-xl font-outfit cursor-pointer"
                >
                  NO, CANCEL
                </button>
              </div>
            </div>
          )}
        </div>

        {/* TODAY'S TRIP CARD */}
        {activeTrip ? (
          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider font-outfit flex items-center gap-1.5">
                <Navigation size={15} /> Active Trip
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/40">
                {activeTrip.status}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-white font-outfit">
                  {activeTrip.origin} → {activeTrip.destination}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Shipment: {activeTrip.shipment?.cargoType || 'General Cargo'} ({activeTrip.shipment?.weightTons || 2.5}T)
                </p>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold uppercase text-slate-400">Total Earning</div>
                <div className="text-2xl font-black text-emerald-400 font-outfit">
                  ₹{(activeTrip.grossRevenueINR || 7800).toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Delivery OTP Verification Box */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-700 space-y-3 pt-4">
              <div className="flex items-center justify-between text-xs font-bold font-outfit text-slate-300">
                <span className="flex items-center gap-1.5 text-blue-400">
                  <KeyRound size={16} /> Delivery OTP Verification
                </span>
                <span>Enter 6-Digit Code</span>
              </div>

              <form onSubmit={handleVerifyOtpSubmit} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="e.g. 482913"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-center text-lg font-black text-white tracking-widest focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={otpInput.length < 6 || isProcessing}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-5 py-3 rounded-xl shadow-lg font-outfit cursor-pointer shrink-0 disabled:opacity-50"
                >
                  Verify OTP
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl text-center space-y-3">
            <h3 className="text-lg font-black text-white font-outfit">No active trip in progress</h3>
            <p className="text-xs text-slate-400">
              Speak <span className="text-blue-400 font-bold font-outfit">"Delhi se Jaipur load dikhao"</span> to find return journey loads.
            </p>
          </div>
        )}

        {/* DRIVER QUICK VOICE ACTIONS */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleVoiceUtterance('Delhi se Jaipur load dikhao')}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 p-5 rounded-2xl text-left space-y-1 transition-all cursor-pointer shadow-lg"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2">
              <Truck size={18} />
            </div>
            <div className="text-sm font-black text-white font-outfit">Find Loads</div>
            <div className="text-[11px] text-slate-400">"Jaipur wala load dikhao"</div>
          </button>

          <button
            onClick={() => handleVoiceUtterance('Mere truck mein 3 ton jagah hai')}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 p-5 rounded-2xl text-left space-y-1 transition-all cursor-pointer shadow-lg"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
              <IndianRupee size={18} />
            </div>
            <div className="text-sm font-black text-white font-outfit">Update Space</div>
            <div className="text-[11px] text-slate-400">"3 ton jagah available hai"</div>
          </button>
        </div>

      </main>
    </div>
  );
};

import { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { ShieldCheck, Copy, Check, Clock, Truck, X } from 'lucide-react';

export default function ShipperOtpBanner() {
  const { shipperDeliveryOtp, dismissShipperDeliveryOtp } = useSocket();
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes default
  const [activeOtpData, setActiveOtpData] = useState(null);

  useEffect(() => {
    if (shipperDeliveryOtp) {
      setActiveOtpData(shipperDeliveryOtp);
      const expiresAt = new Date(shipperDeliveryOtp.expiresAt).getTime();
      const diff = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setTimeLeft(diff);
    }
  }, [shipperDeliveryOtp]);

  useEffect(() => {
    const handleCustomOpen = (e) => {
      if (e.detail) {
        setActiveOtpData(e.detail);
        const expiresAt = e.detail.expiresAt ? new Date(e.detail.expiresAt).getTime() : Date.now() + 600000;
        const diff = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
        setTimeLeft(diff);
      }
    };
    window.addEventListener('open_shipper_otp', handleCustomOpen);
    return () => window.removeEventListener('open_shipper_otp', handleCustomOpen);
  }, []);

  // Countdown timer effect
  useEffect(() => {
    let interval;
    if (activeOtpData && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeOtpData, timeLeft]);

  if (!activeOtpData || timeLeft <= 0) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopy = () => {
    if (activeOtpData?.otp) {
      navigator.clipboard.writeText(activeOtpData.otp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setActiveOtpData(null);
    dismissShipperDeliveryOtp();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-fade-in font-sans">
      <div className="bg-slate-800 border-2 border-emerald-500/60 rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden text-center text-white">
        {/* Glowing top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 animate-pulse"></div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-700/60 transition-colors"
          title="Close Popup"
        >
          <X size={20} />
        </button>

        {/* Header Icon */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-3xl mx-auto mb-3 shadow-lg shadow-emerald-500/10">
          🔑
        </div>

        {/* Header Title */}
        <div className="space-y-1 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold uppercase tracking-wider border border-emerald-500/40">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Delivery Arrival OTP
          </span>
          <h3 className="text-xl font-extrabold text-white font-outfit mt-1">Driver Has Arrived at Destination</h3>
          <p className="text-xs text-slate-300">Share this 6-digit PIN with the carrier to verify & complete delivery</p>
        </div>

        {/* OTP Code Display Box */}
        <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-5 my-4 shadow-inner">
          <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest mb-2 font-outfit">
            YOUR 6-DIGIT VERIFICATION CODE
          </p>

          <div className="flex justify-center items-center gap-2 text-3xl font-mono font-extrabold text-emerald-300 tracking-widest my-2">
            {activeOtpData.otp ? (
              activeOtpData.otp.split('').map((digit, idx) => (
                <span
                  key={idx}
                  className="w-11 h-13 bg-slate-800 border-2 border-emerald-500/40 rounded-xl flex items-center justify-center shadow-md text-white font-bold text-2xl"
                >
                  {digit}
                </span>
              ))
            ) : (
              <span>******</span>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-3">
            <Clock size={13} className="text-emerald-400" />
            <span>Valid for: <strong className="text-emerald-400 font-mono text-sm">{formatTime(timeLeft)}</strong></span>
          </div>
        </div>

        {/* Carrier Info Card */}
        {(activeOtpData.carrierName || activeOtpData.origin) && (
          <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-3 text-left space-y-1 text-xs text-slate-300 mb-5">
            {activeOtpData.carrierName && (
              <div className="flex justify-between">
                <span className="text-slate-400">Carrier:</span>
                <span className="font-bold text-white">{activeOtpData.carrierName}</span>
              </div>
            )}
            {activeOtpData.origin && activeOtpData.destination && (
              <div className="flex justify-between truncate">
                <span className="text-slate-400">Route:</span>
                <span className="font-medium text-slate-200">{activeOtpData.origin} → {activeOtpData.destination}</span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={handleCopy}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check size={16} />
                <span>COPIED TO CLIPBOARD</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>COPY OTP CODE</span>
              </>
            )}
          </button>

          <button
            onClick={handleClose}
            className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Dismiss Popup
          </button>
        </div>
      </div>
    </div>
  );
}

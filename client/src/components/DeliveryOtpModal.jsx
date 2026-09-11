import { useState, useEffect, useRef } from 'react';
import { podApi } from '../services/pod.api';

export default function DeliveryOtpModal({ isOpen, onClose, shipmentId, tripId, onSuccess }) {
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [requestingOtp, setRequestingOtp] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [error, setError] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  // Handle resend countdown timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Request OTP automatically on open if not already requested
  useEffect(() => {
    if (isOpen && shipmentId && !otpRequested) {
      handleRequestOtp();
    }
  }, [isOpen, shipmentId]);

  const handleRequestOtp = async () => {
    if (!shipmentId) return;
    setRequestingOtp(true);
    setError('');
    try {
      const res = await podApi.requestOtp(shipmentId, tripId);
      if (res.data?.success) {
        setOtpRequested(true);
        setAttemptsLeft(res.data.data?.maxAttempts - res.data.data?.attempts || 3);
        setResendCooldown(30);
        setTimeout(() => inputRefs[0].current?.focus(), 100);
      } else {
        setError(res.data?.message || 'Failed to request delivery OTP');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to request OTP from customer';
      // If OTP was already requested, mark as requested
      if (err.response?.status === 400 && msg.includes('OTP already requested')) {
        setOtpRequested(true);
        setResendCooldown(30);
      } else {
        setError(msg);
      }
    } finally {
      setRequestingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || !shipmentId) return;
    setRequestingOtp(true);
    setError('');
    setOtpDigits(['', '', '', '', '', '']);
    try {
      const res = await podApi.resendOtp(shipmentId, tripId);
      if (res.data?.success) {
        setOtpRequested(true);
        setAttemptsLeft(3);
        setResendCooldown(30);
        setSuccessMessage('A new 6-digit OTP has been sent to the customer.');
        setTimeout(() => setSuccessMessage(''), 4000);
        setTimeout(() => inputRefs[0].current?.focus(), 100);
      } else {
        setError(res.data?.message || 'Failed to resend OTP');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to resend OTP');
    } finally {
      setRequestingOtp(false);
    }
  };

  const handleDigitChange = (index, value) => {
    // Only keep numeric character
    const num = value.replace(/[^0-9]/g, '');
    if (!num && value !== '') return;

    const newDigits = [...otpDigits];
    newDigits[index] = num.slice(-1);
    setOtpDigits(newDigits);
    setError('');

    // Auto-advance focus to next input box
    if (num && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim().replace(/[^0-9]/g, '');
    if (pasted.length >= 6) {
      const digits = pasted.slice(0, 6).split('');
      setOtpDigits(digits);
      inputRefs[5].current?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otp = otpDigits.join('');
    if (otp.length !== 6) {
      setError('Please enter all 6 digits of the delivery OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await podApi.verifyOtp(shipmentId, otp, tripId);
      if (res.data?.success) {
        setSuccessMessage('Delivery verified successfully!');
        if (onSuccess) {
          onSuccess(res.data.data);
        }
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setError(res.data?.message || 'Verification failed');
      }
    } catch (err) {
      const data = err.response?.data;
      const msg = data?.message || err.message || 'Invalid delivery OTP';
      setError(msg);
      if (data?.attemptsLeft !== undefined) {
        setAttemptsLeft(data.attemptsLeft);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Glow accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700/50"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 text-2xl font-bold">
            🔒
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Proof of Delivery OTP</h3>
            <p className="text-xs text-slate-400">Ask customer for the 6-digit verification code</p>
          </div>
        </div>

        {/* Content Body */}
        {requestingOtp && !otpRequested ? (
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-3"></div>
            <p className="text-sm text-slate-300">Generating secure delivery OTP & notifying customer...</p>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
                <span>✅</span>
                <span>{successMessage}</span>
              </div>
            )}

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/60 text-center">
              <p className="text-xs text-slate-400 mb-4">
                Enter the 6-digit code received by the customer to confirm delivery.
              </p>

              {/* 6 Digit Input Boxes */}
              <div className="flex justify-center gap-2" onPaste={handlePaste}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={inputRefs[idx]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-11 h-13 text-center text-2xl font-mono font-bold bg-slate-800 border-2 border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 rounded-xl text-white outline-none transition-all"
                  />
                ))}
              </div>

              {attemptsLeft !== null && (
                <p className="text-xs text-amber-400/90 mt-3 font-medium">
                  {attemptsLeft > 0 ? `⚠️ ${attemptsLeft} attempt(s) remaining` : '❌ Attempts exhausted. Please resend a new OTP.'}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading || otpDigits.join('').length !== 6 || attemptsLeft === 0}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <span>Verify OTP & Complete Delivery</span>
                    <span>→</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || requestingOtp}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
                >
                  {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : '🔄 Resend OTP to Customer'}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

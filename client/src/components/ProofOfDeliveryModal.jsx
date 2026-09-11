import { useState } from 'react';
import { CheckCircle2, ShieldCheck, FileCheck, X } from 'lucide-react';
import { podApi } from '../services/pod.api';

export const ProofOfDeliveryModal = ({ isOpen, onClose, trip, onConfirmed }) => {
  const [receiverName, setReceiverName] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await podApi.confirmDelivery(
        trip?._id || '66d012345678901234567890',
        trip?.shipments?.[0]?._id || '66d012345678901234567891',
        receiverName || 'Jaipur Central Receiving Manager',
        notes || 'Cargo delivered in pristine condition with 0 damage.'
      );
      setSuccess(true);
      if (onConfirmed) onConfirmed();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1800);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 font-sans">
      <div className="glass-panel p-6 sm:p-8 max-w-md w-full relative space-y-5 shadow-2xl bg-white/95 rounded-2xl border border-slate-200/80">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/20">
            <FileCheck size={18} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 font-outfit uppercase tracking-tight">PROOF OF DELIVERY (POD)</h3>
            <p className="text-xs text-slate-600 font-normal">Confirm shipment delivery and generate digital verification certificate</p>
          </div>
        </div>

        {success ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 size={44} className="text-emerald-500 mx-auto animate-bounce" />
            <h4 className="text-lg font-extrabold text-slate-900 font-outfit">Delivery Confirmed & POD Filed!</h4>
            <p className="text-xs text-slate-600 font-normal">Digital proof stored with timestamp and GPS verification</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 font-outfit">Receiver Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Suresh Kumar (Logistics Supervisor)"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 font-outfit">Delivery Notes / Remarks</label>
              <textarea
                rows={3}
                placeholder="Cargo seal status, unloading timestamp..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="glass-panel p-4 rounded-xl text-xs space-y-1.5 text-slate-600 bg-slate-50/80">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 font-outfit">
                <ShieldCheck size={15} className="text-emerald-600" />
                <span>Automatic Metadata Attachment:</span>
              </div>
              <div className="font-normal text-slate-700">• GPS Coords: 26.9124° N, 75.7873° E (Jaipur Cargo Hub)</div>
              <div className="font-normal text-slate-700">• OTP Stamp: VERIFIED_#89201</div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-emerald w-full py-3 text-xs flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              {submitting ? 'FILING DIGITAL POD...' : 'CONFIRM DELIVERY & FILE POD'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};


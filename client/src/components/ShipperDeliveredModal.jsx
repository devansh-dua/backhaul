import { useSocket } from '../context/SocketContext';

export default function ShipperDeliveredModal() {
  const { deliveryCompleted, dismissDeliveryCompleted } = useSocket();

  if (!deliveryCompleted) return null;

  const handleClose = () => {
    dismissDeliveryCompleted();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-800 border border-emerald-500/50 rounded-2xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden text-center">
        {/* Top glow bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500"></div>

        {/* Celebration Icon */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-4xl mx-auto mb-4 animate-bounce">
          📦
        </div>

        <h3 className="text-2xl font-extrabold text-white mb-2">Shipment Delivered!</h3>
        <p className="text-sm text-slate-300 mb-6">
          The driver successfully verified the 6-digit OTP and completed offloading.
        </p>

        {/* Info card */}
        <div className="bg-slate-900/70 border border-slate-700/70 rounded-xl p-4 text-left space-y-2 mb-6 text-xs text-slate-300">
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Shipment ID:</span>
            <span className="font-mono text-emerald-400 font-semibold">{deliveryCompleted.shipmentId || deliveryCompleted.shipment?._id}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Verification Method:</span>
            <span className="font-semibold text-white">Digital OTP (Server Verified)</span>
          </div>
          <div className="flex justify-between pb-1">
            <span className="text-slate-400">Delivered At:</span>
            <span className="font-semibold text-slate-200">
              {deliveryCompleted.deliveredAt ? new Date(deliveryCompleted.deliveredAt).toLocaleTimeString() : new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all"
        >
          Great, Dismiss
        </button>
      </div>
    </div>
  );
}

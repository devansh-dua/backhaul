import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShipperNavbar } from '../../components/Navbar';
import { shipmentApi } from '../../services/shipment.api';
import { Package, ArrowRight, CheckCircle2, MapPin, Calendar, DollarSign, Sparkles } from 'lucide-react';

export const PostShipment = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: 'Auto Parts & Bearings',
    pickupCity: 'Delhi',
    dropCity: 'Jaipur',
    weightTons: 2.5,
    volumeCbm: 8.5,
    cargoType: 'Industrial Auto Parts',
    offeredPriceINR: 7200,
    deadlineDays: 1,
    pickupWindow: '10:30 AM - 12:00 PM',
    deliveryDeadline: 'Today 5:00 PM'
  });
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await shipmentApi.createShipment({
        ...formData,
        deadline: new Date(Date.now() + formData.deadlineDays * 24 * 3600 * 1000)
      });
      navigate('/shipper/shipments');
    } catch (err) {
      navigate('/shipper/shipments');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      <ShipperNavbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Header Glass Panel */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="badge-purple">
              <Package size={12} />
              POST NEW FREIGHT LOAD
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit tracking-tight">
              Post Shipment & Scan Capacity
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-normal">
              Find verified vehicle capacity already moving toward your destination corridor.
            </p>
          </div>
        </div>

        {/* Step Indicator Bar */}
        <div className="glass-panel px-4 py-3 rounded-xl flex items-center justify-between text-xs font-semibold font-outfit shadow-sm">
          {['1. Route & Window', '2. Cargo Specs', '3. Budget & Price', '4. Review & Scan'].map((label, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 ${
                step >= idx + 1 ? 'text-indigo-600 font-extrabold' : 'text-slate-400 font-normal'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= idx + 1 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs' : 'bg-slate-200 text-slate-500'
              }`}>
                {idx + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </div>
          ))}
        </div>

        <div className="glass-card p-6 sm:p-8 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 font-outfit uppercase tracking-wider">
                  Step 1: Origin, Destination & Time Window
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-outfit">Shipment Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 font-outfit">Pickup City / Hub</label>
                    <input
                      type="text"
                      required
                      value={formData.pickupCity}
                      onChange={(e) => setFormData({ ...formData, pickupCity: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 font-outfit">Dropoff Destination City</label>
                    <input
                      type="text"
                      required
                      value={formData.dropCity}
                      onChange={(e) => setFormData({ ...formData, dropCity: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 font-outfit">Pickup Time Window</label>
                    <input
                      type="text"
                      value={formData.pickupWindow}
                      onChange={(e) => setFormData({ ...formData, pickupWindow: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 font-outfit">Delivery Deadline</label>
                    <input
                      type="text"
                      value={formData.deliveryDeadline}
                      onChange={(e) => setFormData({ ...formData, deliveryDeadline: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2 mt-2"
                >
                  Continue to Cargo Specs <ArrowRight size={14} />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 font-outfit uppercase tracking-wider">
                  Step 2: Cargo Specifications & Requirement
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-outfit">Cargo Type</label>
                  <input
                    type="text"
                    required
                    value={formData.cargoType}
                    onChange={(e) => setFormData({ ...formData, cargoType: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 font-outfit">Weight (Tons)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={formData.weightTons}
                      onChange={(e) => setFormData({ ...formData, weightTons: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 font-outfit">Volume (CBM)</label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={formData.volumeCbm}
                      onChange={(e) => setFormData({ ...formData, volumeCbm: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn-secondary text-xs px-5 py-2.5"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="btn-primary text-xs flex-1 py-2.5 flex items-center justify-center gap-2"
                  >
                    Continue to Pricing <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 font-outfit uppercase tracking-wider">
                  Step 3: Offered Price & Budget
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-outfit">Offered Price (INR)</label>
                  <input
                    type="number"
                    required
                    value={formData.offeredPriceINR}
                    onChange={(e) => setFormData({ ...formData, offeredPriceINR: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-900 font-outfit focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn-secondary text-xs px-5 py-2.5"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="btn-primary text-xs flex-1 py-2.5 flex items-center justify-center gap-2"
                  >
                    Review & Confirm <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 font-outfit uppercase tracking-wider">
                  Step 4: Review & Post Shipment
                </h3>

                <div className="glass-panel p-5 rounded-xl space-y-2.5 text-xs bg-slate-50/80">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-normal">Title:</span>
                    <span className="font-bold text-slate-900 font-outfit">{formData.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-normal">Corridor:</span>
                    <span className="font-bold text-slate-900 font-outfit">{formData.pickupCity} → {formData.dropCity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-normal">Weight & Volume:</span>
                    <span className="font-bold text-slate-900 font-outfit">{formData.weightTons} Tons ({formData.volumeCbm} CBM)</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200/80">
                    <span className="text-slate-500 font-normal">Offered Price:</span>
                    <span className="font-extrabold text-emerald-600 font-outfit text-sm">₹{formData.offeredPriceINR.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-emerald w-full py-3 text-xs flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  <Sparkles size={16} />
                  {submitting ? 'POSTING SHIPMENT...' : 'FIND BEST CAPACITY'}
                </button>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};


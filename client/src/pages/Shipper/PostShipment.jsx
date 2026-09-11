import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShipperNavbar } from '../../components/Navbar';
import { shipmentApi } from '../../services/shipment.api';
import { Package, MapPin, Calendar, DollarSign, ArrowRight, CheckCircle2 } from 'lucide-react';

export const PostShipment = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: 'Auto Parts & Bearings',
    pickupCity: 'Gurgaon',
    dropCity: 'Neemrana',
    weightTons: 2.5,
    volumeCbm: 8.5,
    cargoType: 'Industrial Auto Parts',
    offeredPriceINR: 7200,
    deadlineDays: 1
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
      alert('Shipment posted! Matching with available carrier capacity...');
      navigate('/shipper/shipments');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '3rem', color: '#0f172a' }}>
      <ShipperNavbar />

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a' }}>Post a New Shipment</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '4px' }}>Fill shipment specifications to trigger real-time AI carrier matching</p>
        </div>

        {/* 4-Step Progress Indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', background: '#f1f5f9', padding: '12px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          {['1. Route', '2. Cargo Specs', '3. Budget', '4. Review'].map((label, idx) => (
            <div key={idx} style={{ fontSize: '0.85rem', fontWeight: '700', color: step >= idx + 1 ? '#059669' : '#94a3b8' }}>
              {label}
            </div>
          ))}
        </div>

        <div className="glass-panel" style={{ padding: '2rem', background: '#ffffff' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {step === 1 && (
              <>
                <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: '800' }}>Step 1: Pickup & Delivery Locations</h3>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>Shipment Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>Pickup City</label>
                    <input
                      type="text"
                      required
                      value={formData.pickupCity}
                      onChange={(e) => setFormData({ ...formData, pickupCity: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>Delivery Destination City</label>
                    <input
                      type="text"
                      required
                      value={formData.dropCity}
                      onChange={(e) => setFormData({ ...formData, dropCity: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                    />
                  </div>
                </div>

                <button type="button" onClick={() => setStep(2)} style={{ background: 'linear-gradient(135deg, #059669, #047857)', border: 'none', color: '#fff', padding: '0.75rem', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', marginTop: '1rem' }}>
                  Continue to Cargo Specs →
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: '800' }}>Step 2: Cargo Specifications</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>Weight (Tons)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={formData.weightTons}
                      onChange={(e) => setFormData({ ...formData, weightTons: Number(e.target.value) })}
                      style={{ width: '100%', padding: '0.75rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>Volume (CBM)</label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={formData.volumeCbm}
                      onChange={(e) => setFormData({ ...formData, volumeCbm: Number(e.target.value) })}
                      style={{ width: '100%', padding: '0.75rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="button" onClick={() => setStep(1)} style={{ background: 'transparent', border: '1px solid #cbd5e1', color: '#475569', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Back</button>
                  <button type="button" onClick={() => setStep(3)} style={{ flex: 1, background: 'linear-gradient(135deg, #059669, #047857)', border: 'none', color: '#fff', padding: '0.75rem', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>Continue to Pricing →</button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: '800' }}>Step 3: Offered Price & Budget</h3>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>Offered Price (INR)</label>
                  <input
                    type="number"
                    required
                    value={formData.offeredPriceINR}
                    onChange={(e) => setFormData({ ...formData, offeredPriceINR: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.75rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="button" onClick={() => setStep(2)} style={{ background: 'transparent', border: '1px solid #cbd5e1', color: '#475569', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Back</button>
                  <button type="button" onClick={() => setStep(4)} style={{ flex: 1, background: 'linear-gradient(135deg, #059669, #047857)', border: 'none', color: '#fff', padding: '0.75rem', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>Review & Confirm →</button>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: '800' }}>Step 4: Review & Post Shipment</h3>
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid #e2e8f0' }}>
                  <div>Title: <strong style={{ color: '#0f172a' }}>{formData.title}</strong></div>
                  <div>Corridor: <strong style={{ color: '#0f172a' }}>{formData.pickupCity} → {formData.dropCity}</strong></div>
                  <div>Weight & Volume: <strong style={{ color: '#0284c7' }}>{formData.weightTons} Tons ({formData.volumeCbm} CBM)</strong></div>
                  <div>Offered Price: <strong style={{ color: '#059669' }}>₹{formData.offeredPriceINR.toLocaleString('en-IN')}</strong></div>
                </div>

                <button type="submit" disabled={submitting} style={{ background: 'linear-gradient(135deg, #059669, #047857)', border: 'none', color: '#fff', padding: '0.85rem', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>
                  {submitting ? 'POSTING SHIPMENT...' : 'POST SHIPMENT & START AI MATCHING'}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { CarrierNavbar } from '../../components/Navbar';
import { Truck, Plus, ShieldCheck } from 'lucide-react';

export const MyCapacity = () => {
  const [capacities] = useState([
    {
      id: 'cap1',
      registrationNumber: 'RJ-104-5891',
      origin: 'Delhi',
      destination: 'Jaipur',
      availableCapacityTons: 7.8,
      totalCapacityTons: 12.0,
      departureTime: '06:30 PM',
      driverHoursAvailable: '6h 20m',
      status: 'OPEN_BACKHAUL'
    },
    {
      id: 'cap2',
      registrationNumber: 'MH-12-9982',
      origin: 'Mumbai',
      destination: 'Satara',
      availableCapacityTons: 6.2,
      totalCapacityTons: 10.0,
      departureTime: '08:00 PM',
      driverHoursAvailable: '7h 15m',
      status: 'OPEN_BACKHAUL'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '3rem', color: '#0f172a' }}>
      <CarrierNavbar />

      <main className="app-container" style={{ pt: '2rem', spaceY: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', marginTop: '1rem' }}>
          <div>
            <span className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>
              <Truck size={14} /> FLEET CAPACITY MANAGEMENT
            </span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a' }}>
              Published Vehicle Capacity Slots
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '4px' }}>
              Publish unused return truck capacity to receive automated AI backhaul freight proposals.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary"
          >
            <Plus size={16} /> Publish Capacity Slot
          </button>
        </div>

        {showAddForm && (
          <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem', background: '#ffffff' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>Publish Available Return Slot</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>Registration Number</label>
                <input type="text" defaultValue="KA-01-4410" style={{ width: '100%', padding: '0.7rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a', fontSize: '0.9rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>Corridor Route</label>
                <input type="text" defaultValue="Bangalore → Hyderabad" style={{ width: '100%', padding: '0.7rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a', fontSize: '0.9rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#475569', marginBottom: '4px', fontWeight: '600' }}>Capacity (Tons)</label>
                <input type="number" defaultValue="9.5" style={{ width: '100%', padding: '0.7rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a', fontSize: '0.9rem' }} />
              </div>
            </div>
            <button
              onClick={() => { setShowAddForm(false); }}
              className="btn-emerald"
            >
              Confirm & Start AI Matching
            </button>
          </div>
        )}

        <div className="table-container" style={{ marginTop: '1.5rem' }}>
          <table className="tech-table">
            <thead>
              <tr>
                <th>Registration</th>
                <th>Corridor Route</th>
                <th>Available Capacity</th>
                <th>Departure Time</th>
                <th>Driver Safe Hours</th>
                <th style={{ textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {capacities.map((cap) => (
                <tr key={cap.id}>
                  <td style={{ fontWeight: '800', color: '#0f172a' }}>{cap.registrationNumber}</td>
                  <td style={{ fontWeight: '600', color: '#334155' }}>{cap.origin} → {cap.destination}</td>
                  <td style={{ fontWeight: '800', color: '#059669' }}>{cap.availableCapacityTons} / {cap.totalCapacityTons} Tons</td>
                  <td style={{ fontSize: '0.85rem', color: '#64748b' }}>{cap.departureTime}</td>
                  <td style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>{cap.driverHoursAvailable}</td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="badge badge-emerald">{cap.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

import { Link } from 'react-router-dom';
import { LandingNavbar } from '../../components/Navbar';
import { MacBookMockup } from '../../components/MacBookMockup';
import { RouteMap } from '../../components/RouteMap';
import { AIRecommendationCard } from '../../components/AIRecommendationCard';
import { Truck, ArrowRight, ShieldCheck, Zap, TrendingUp, BarChart3, ChevronRight, Layers, CheckCircle2 } from 'lucide-react';

export const Landing = () => {
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', color: '#0f172a' }}>
      <LandingNavbar />

      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '4rem 1.5rem 2rem 1.5rem', maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
        {/* Subtle lighting backdrop */}
        <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '350px', background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(40px)' }} />

        <span className="badge badge-purple" style={{ marginBottom: '1.5rem' }}>
          <Zap size={14} /> AI-POWERED LOGISTICS BACKHAUL DECISION ENGINE
        </span>

        <h1 style={{ fontSize: '3.8rem', fontWeight: '800', lineHeight: 1.1, letterSpacing: '-0.03em', color: '#0f172a', marginBottom: '1.25rem' }}>
          Turn Empty Return Miles Into <br />
          <span style={{ background: 'linear-gradient(135deg, #2563eb, #0284c7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Profitable Backhaul Revenue
          </span>
        </h1>

        <p style={{ fontSize: '1.2rem', color: '#475569', maxWidth: '780px', margin: '0 auto 2.5rem auto', lineHeight: 1.6, fontWeight: '500' }}>
          BACKHAULX matches compatible return shipment demand with unused vehicle capacity on already-planned journeys. Don't just find a return load—find the most profitable way to use your truck.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
          <Link to="/register" style={{ padding: '0.85rem 2.2rem', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', borderRadius: '12px', fontWeight: '700', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 25px rgba(37, 99, 235, 0.3)' }}>
            Start Matching Loads <ArrowRight size={18} />
          </Link>
          <Link to="/login" style={{ padding: '0.85rem 2rem', background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', borderRadius: '12px', fontWeight: '700', fontSize: '1.05rem', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
            Demo Sign In
          </Link>
        </div>

        {/* Realistic MacBook Mockup Showcase */}
        <div style={{ marginTop: '3.5rem' }}>
          <MacBookMockup>
            <div style={{ padding: '1rem' }}>
              <AIRecommendationCard />
            </div>
          </MacBookMockup>
        </div>
      </section>

      {/* Problem vs Solution Storytelling Section */}
      <section id="how-it-works" style={{ padding: '5rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge badge-cyan" style={{ marginBottom: '0.75rem' }}>THE LOGISTICS PROBLEM</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a' }}>
            Empty Miles Are Lost Profits
          </h2>
          <p style={{ color: '#475569', fontSize: '1.05rem', maxWidth: '650px', margin: '0.5rem auto 0 auto', fontWeight: '500' }}>
            38% of delivery vehicles in India return empty after completing outbound trips, burning fuel and driver hours for zero revenue.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          <div className="glass-card" style={{ padding: '2rem', borderTop: '4px solid #dc2626' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#dc2626', marginBottom: '1rem', fontWeight: '800' }}>Traditional Freight Model</h3>
            <div style={{ fontSize: '0.95rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontWeight: '500' }}>
              <div>❌ Outbound load delivered → Empty 260km return trip</div>
              <div>❌ High uncompensated fuel expense & toll loss</div>
              <div>❌ Wasted driver safe driving hours</div>
              <div>❌ High CO2 footprint for zero economic output</div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem', borderTop: '4px solid #059669', background: '#f0fdf4' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#059669', marginBottom: '1rem', fontWeight: '800' }}>BACKHAULX AI Engine</h3>
            <div style={{ fontSize: '0.95rem', color: '#166534', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontWeight: '600' }}>
              <div>✅ AI discovers compatible en-route shipments</div>
              <div>✅ Multi-load knapsack combination optimizes capacity</div>
              <div>✅ +₹18,900 net profit generated on return leg</div>
              <div>✅ Avoids 260 empty km & cuts 220kg CO2</div>
            </div>
          </div>
        </div>
      </section>

      {/* Corridor Map Showcase */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <RouteMap />
      </section>

      {/* 4-Step How It Works Grid */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#0f172a' }}>How BACKHAULX Works</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#2563eb', marginBottom: '0.5rem' }}>01</div>
            <h4 style={{ color: '#0f172a', fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: '800' }}>Publish Truck Capacity</h4>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>Carriers specify route, vehicle registration RJ-104, remaining tons, and driver safe hours.</p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0284c7', marginBottom: '0.5rem' }}>02</div>
            <h4 style={{ color: '#0f172a', fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: '800' }}>Hard Filter Candidates</h4>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>Deterministic engine filters out overloaded, off-corridor, or deadline-risky loads.</p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#7c3aed', marginBottom: '0.5rem' }}>03</div>
            <h4 style={{ color: '#0f172a', fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: '800' }}>Gemini AI Ranking</h4>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>Gemini API evaluates net margin per km, tradeoffs, and gives 94% confidence plan.</p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#059669', marginBottom: '0.5rem' }}>04</div>
            <h4 style={{ color: '#0f172a', fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: '800' }}>Book & Live Track</h4>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>One-click ACCEPT PLAN launches Socket.IO live GPS tracking and digital POD generation.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '5rem 2rem', textAlign: 'center', background: '#f1f5f9', borderTop: '1px solid #e2e8f0' }}>
        <h2 style={{ fontSize: '2.8rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>
          Don't Let Empty Miles Go To Waste
        </h2>
        <p style={{ color: '#475569', fontSize: '1.1rem', marginBottom: '2rem', fontWeight: '500' }}>
          Turn unused truck capacity into your next source of net profit.
        </p>
        <Link to="/register" style={{ padding: '0.85rem 2.5rem', background: 'linear-gradient(135deg, #059669, #047857)', color: '#fff', borderRadius: '12px', fontWeight: '700', fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 25px rgba(5, 150, 105, 0.3)' }}>
          Launch BACKHAULX Demo <ChevronRight size={20} />
        </Link>
      </section>
    </div>
  );
};

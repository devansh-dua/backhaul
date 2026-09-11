import { Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from '../pages/Landing/Landing';
import { Login } from '../pages/Auth/Login';
import { Register } from '../pages/Auth/Register';

// Carrier Pages
import { CarrierDashboard } from '../pages/Carrier/CarrierDashboard';
import { MyCapacity } from '../pages/Carrier/MyCapacity';
import { FindLoads } from '../pages/Carrier/FindLoads';
import { CarrierTrips } from '../pages/Carrier/CarrierTrips';
import { CarrierAnalytics } from '../pages/Carrier/CarrierAnalytics';
import { RadarPage } from '../pages/Carrier/RadarPage';
import { OptimizerPage } from '../pages/Carrier/OptimizerPage';
import { WhatIfPage } from '../pages/Carrier/WhatIfPage';
import { MarketIntelligencePage } from '../pages/Carrier/MarketIntelligencePage';
import { CarrierProfile } from '../pages/Carrier/CarrierProfile';
import { DriverCopilotPage } from '../pages/Carrier/DriverCopilotPage';

// Shipper Pages
import { ShipperDashboard } from '../pages/Shipper/ShipperDashboard';
import { PostShipment } from '../pages/Shipper/PostShipment';
import { MyShipments } from '../pages/Shipper/MyShipments';
import { FindCapacity } from '../pages/Shipper/FindCapacity';
import { ShipperTrips } from '../pages/Shipper/ShipperTrips';
import { ShipperAnalytics } from '../pages/Shipper/ShipperAnalytics';
import { ShipperProfile } from '../pages/Shipper/ShipperProfile';

// Shared Live Tracking & AI Copilot
import { LiveTrackingPage } from '../pages/LiveTrackingPage';
import { CopilotFloatingWidget } from '../components/ai/CopilotFloatingWidget';

export const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Carrier & Driver Routes */}
        <Route path="/carrier" element={<CarrierDashboard />} />
        <Route path="/carrier/capacity" element={<MyCapacity />} />
        <Route path="/carrier/capacity/add" element={<MyCapacity />} />
        <Route path="/carrier/loads" element={<FindLoads />} />
        <Route path="/carrier/matches" element={<CarrierDashboard />} />
        <Route path="/carrier/trips" element={<CarrierTrips />} />
        <Route path="/carrier/analytics" element={<CarrierAnalytics />} />
        <Route path="/carrier/radar" element={<RadarPage />} />
        <Route path="/carrier/optimizer" element={<OptimizerPage />} />
        <Route path="/carrier/what-if" element={<WhatIfPage />} />
        <Route path="/carrier/market-intelligence" element={<MarketIntelligencePage />} />
        <Route path="/carrier/profile" element={<CarrierProfile />} />
        <Route path="/driver/copilot" element={<DriverCopilotPage />} />
        <Route path="/carrier/copilot" element={<DriverCopilotPage />} />

        {/* Shipper Routes */}
        <Route path="/shipper" element={<ShipperDashboard />} />
        <Route path="/shipper/post-shipment" element={<PostShipment />} />
        <Route path="/shipper/shipments" element={<MyShipments />} />
        <Route path="/shipper/capacity" element={<FindCapacity />} />
        <Route path="/shipper/matches" element={<MyShipments />} />
        <Route path="/shipper/trips" element={<ShipperTrips />} />
        <Route path="/shipper/analytics" element={<ShipperAnalytics />} />
        <Route path="/shipper/what-if" element={<WhatIfPage />} />
        <Route path="/shipper/profile" element={<ShipperProfile />} />

        {/* Live Tracking */}
        <Route path="/tracking/:tripId" element={<LiveTrackingPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Floating Multilingual Voice AI Copilot Widget */}
      <CopilotFloatingWidget />
    </>
  );
};

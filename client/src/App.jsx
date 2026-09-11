import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { AppRoutes } from './routes/AppRoutes';
import { BookingNotificationModal } from './components/BookingNotificationModal';
import { ShipperAcceptedModal } from './components/ShipperAcceptedModal';
import ShipperOtpBanner from './components/ShipperOtpBanner';
import ShipperDeliveredModal from './components/ShipperDeliveredModal';
import { RatingModal } from './components/RatingModal';
import { useSocket } from './context/SocketContext';
import './index.css';
import './App.css';

function GlobalRatingWrapper() {
  const { ratingPrompt, dismissRatingPrompt } = useSocket();
  return (
    <RatingModal
      isOpen={!!ratingPrompt}
      onClose={dismissRatingPrompt}
      shipmentId={ratingPrompt?.shipmentId}
      tripId={ratingPrompt?.tripId}
      toUserId={ratingPrompt?.partnerId}
      partnerName={ratingPrompt?.partnerName}
      partnerRole={ratingPrompt?.partnerRole}
      onSubmitted={dismissRatingPrompt}
    />
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <BookingNotificationModal />
          <ShipperAcceptedModal />
          <ShipperOtpBanner />
          <ShipperDeliveredModal />
          <GlobalRatingWrapper />
          <AppRoutes />
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

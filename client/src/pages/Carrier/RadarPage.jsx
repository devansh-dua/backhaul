import { CarrierNavbar } from '../../components/Navbar';
import { RadarView } from '../../components/RadarView';

export const RadarPage = () => {
  return (
    <div style={{ background: '#07090e', minHeight: '100vh', paddingBottom: '3rem', color: '#f8fafc' }}>
      <CarrierNavbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem 1.5rem' }}>
        <RadarView />
      </div>
    </div>
  );
};

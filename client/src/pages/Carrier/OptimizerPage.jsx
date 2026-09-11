import { CarrierNavbar } from '../../components/Navbar';
import { MultiLoadOptimizerCard } from '../../components/MultiLoadOptimizerCard';

export const OptimizerPage = () => {
  return (
    <div style={{ background: '#07090e', minHeight: '100vh', paddingBottom: '3rem', color: '#f8fafc' }}>
      <CarrierNavbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem 1.5rem' }}>
        <MultiLoadOptimizerCard />
      </div>
    </div>
  );
};

import { CarrierNavbar } from '../../components/Navbar';
import { WhatIfSimulatorCard } from '../../components/WhatIfSimulatorCard';

export const WhatIfPage = () => {
  return (
    <div style={{ background: '#07090e', minHeight: '100vh', paddingBottom: '3rem', color: '#f8fafc' }}>
      <CarrierNavbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem 1.5rem' }}>
        <WhatIfSimulatorCard />
      </div>
    </div>
  );
};

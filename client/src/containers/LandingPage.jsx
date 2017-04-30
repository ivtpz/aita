import React from 'react';
import LandingVisual from '../components/LandingVisual';

const LandingPage = () => (
  <div>
    <LandingVisual
      data={[0, 1, 2]}
      width={400}
      height={300}
    />
  </div>
);

export default LandingPage;

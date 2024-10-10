import React from 'react';
import { Button } from '../ui/button';

const CallToAction = ({ handleCTAClick }) => {
  return (
    <section className="py-20 bg-blue-600">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Comece sua jornada agora</h2>
        <Button onClick={handleCTAClick} size="lg">Comece Grátis</Button>
      </div>
    </section>
  );
};

export default CallToAction;
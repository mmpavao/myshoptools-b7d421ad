import React from 'react';
import IntegrationCard from './IntegrationCard';
import StripeIntegration from './StripeIntegration';
import { integrations } from '../../data/integrations';

const Integrations = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Available Integrations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration, index) => (
          <IntegrationCard 
            key={index} 
            {...integration}
          />
        ))}
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Stripe Integration</h2>
        <StripeIntegration />
      </div>
    </div>
  );
};

export default Integrations;
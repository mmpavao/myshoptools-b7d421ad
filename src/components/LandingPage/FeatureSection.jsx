import React from 'react';

const FeatureSection = ({ settings }) => {
  return (
    <section className="py-20 bg-white text-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 text-center">Nossas Características</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="feature-item">
            <h3 className="text-xl font-semibold mb-2">Preços Competitivos</h3>
            <p>{settings.competitivePricing}</p>
          </div>
          <div className="feature-item">
            <h3 className="text-xl font-semibold mb-2">Loja Pronta para Vender</h3>
            <p>{settings.readyToSellStore}</p>
          </div>
          <div className="feature-item">
            <h3 className="text-xl font-semibold mb-2">Gestão de Estoque</h3>
            <p>{settings.inventoryManagement}</p>
          </div>
          <div className="feature-item">
            <h3 className="text-xl font-semibold mb-2">Transações Seguras</h3>
            <p>{settings.secureTransactions}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
import React from 'react';
import { CheckCircle } from 'lucide-react';

const FeatureSection = ({ settings }) => {
  const features = [
    { title: 'Preços Competitivos', description: settings.competitivePricing },
    { title: 'Loja Pronta', description: settings.readyToSellStore },
    { title: 'Gestão de Estoque', description: settings.inventoryManagement },
    { title: 'Transações Seguras', description: settings.secureTransactions },
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center text-white">Por que escolher nossa plataforma?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <CheckCircle className="text-purple-500 mr-3" size={24} />
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              </div>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
import React from 'react';
import { Button } from '../ui/button';

const PricingSection = ({ onSelectPlan }) => {
  const plans = [
    { name: 'Básico', price: 'R$ 99/mês', features: ['Feature 1', 'Feature 2', 'Feature 3'] },
    { name: 'Pro', price: 'R$ 199/mês', features: ['Tudo do Básico', 'Feature 4', 'Feature 5'] },
    { name: 'Enterprise', price: 'Personalizado', features: ['Tudo do Pro', 'Feature 6', 'Suporte Dedicado'] },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 text-center">Nossos Planos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div key={index} className="border rounded-lg p-6 text-center">
              <h3 className="text-2xl font-semibold mb-4">{plan.name}</h3>
              <p className="text-3xl font-bold mb-6">{plan.price}</p>
              <ul className="mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="mb-2">{feature}</li>
                ))}
              </ul>
              <Button onClick={() => onSelectPlan(plan)}>Selecionar Plano</Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
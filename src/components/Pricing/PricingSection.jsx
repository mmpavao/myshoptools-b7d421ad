import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Check } from 'lucide-react';

const PricingSection = ({ onSelectPlan }) => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Básico',
      monthlyPrice: 399,
      features: ['Acesso à plataforma', 'Até 100 produtos', 'Suporte por email'],
    },
    {
      name: 'Profissional',
      monthlyPrice: 997,
      features: ['Acesso à plataforma', 'Até 1000 produtos', 'Suporte prioritário', 'API de integração'],
    },
    {
      name: 'Enterprise',
      monthlyPrice: 2997,
      features: ['Acesso à plataforma', 'Produtos ilimitados', 'Suporte 24/7', 'API de integração', 'Gerente de conta dedicado'],
    },
  ];

  const calculatePrice = (monthlyPrice) => {
    const annualPrice = monthlyPrice * 12 * 0.8; // 20% discount
    return isAnnual ? (annualPrice / 12).toFixed(2) : monthlyPrice.toFixed(2);
  };

  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">Escolha o Plano Ideal para Seu Negócio</h2>
        
        <div className="flex justify-center items-center mb-8">
          <span className={`mr-2 ${!isAnnual ? 'font-bold' : ''}`}>Mensal</span>
          <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
          <span className={`ml-2 ${isAnnual ? 'font-bold' : ''}`}>Anual (20% de desconto)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
              <p className="text-4xl font-bold mb-6">
                R$ {calculatePrice(plan.monthlyPrice)}
                <span className="text-sm font-normal">/mês</span>
              </p>
              <ul className="mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center mb-2">
                    <Check className="text-green-500 mr-2" size={20} />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full" 
                onClick={() => onSelectPlan({ ...plan, isAnnual, price: calculatePrice(plan.monthlyPrice) })}
              >
                Contratar Agora
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
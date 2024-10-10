import React from 'react';

const IntegrationsPartnerships = () => {
  return (
    <div className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Integrações e Parcerias</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Parcerias com Empresas de Pagamento</h3>
            <p className="text-gray-600">
              Oferecemos opções de pagamento como Stripe, Mercado Pago, PayPal, 
              além de suporte para pagamento com PIX no Brasil.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Ferramentas de Apoio ao Vendedor</h3>
            <p className="text-gray-600">
              Integramos com Google Sheets, oferecemos APIs personalizadas e outras 
              ferramentas para otimizar a gestão e análise de dados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsPartnerships;
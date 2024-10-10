import React from 'react';

const ForSuppliers = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Para Fornecedores</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Benefícios de Participar</h3>
            <p className="text-gray-600">
              Conecte-se à nossa rede global e aproveite a facilidade de receber 
              pagamentos locais, seja na Europa, China, EUA ou em outros países.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Cadastro e Integração Simples</h3>
            <p className="text-gray-600">
              Nosso processo simplificado permite que fornecedores entrem na plataforma 
              e comecem a vender globalmente com facilidade e rapidez.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForSuppliers;
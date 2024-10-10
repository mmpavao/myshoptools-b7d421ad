import React from 'react';

const SimplifiedLogistics = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Logística Simplificada</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Entrega e Distribuição</h3>
            <p className="text-gray-600">
              Nossa estrutura logística possibilita entrega eficiente e manutenção de estoques, 
              com gestão de devoluções simplificada e rastreamento em tempo real.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Centros Logísticos e Capacidade</h3>
            <p className="text-gray-600">
              Destacamos a capacidade de armazenamento e logística dos nossos centros em 
              Itajaí e São Paulo, garantindo eficácia na distribuição para marketplaces e lojistas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedLogistics;
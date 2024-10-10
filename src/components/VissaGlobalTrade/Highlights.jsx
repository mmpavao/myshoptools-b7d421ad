import React from 'react';

const Highlights = () => {
  const marketplaces = ['Mercado Livre', 'Amazon', 'Shopee', 'Shopify', 'WooCommerce'];

  return (
    <div className="py-16">
      <h2 className="text-3xl font-bold text-center mb-8">Principais Marketplaces e Integrações</h2>
      <div className="flex justify-center space-x-8">
        {marketplaces.map((marketplace, index) => (
          <div key={index} className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mb-2"></div>
            <p>{marketplace}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Highlights;
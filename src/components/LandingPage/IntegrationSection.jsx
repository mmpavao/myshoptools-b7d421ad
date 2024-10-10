import React from 'react';

const IntegrationSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 text-center">Integrações</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Mercado Livre</h3>
            <p className="mb-4">Integre facilmente sua loja com o Mercado Livre para expandir seu alcance.</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Saiba mais</button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Shopee</h3>
            <p className="mb-4">Conecte-se à Shopee e alcance milhões de compradores em potencial.</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Saiba mais</button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Amazon</h3>
            <p className="mb-4">Expanda seu negócio globalmente com nossa integração com a Amazon.</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Saiba mais</button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Shopify</h3>
            <p className="mb-4">Crie uma loja online poderosa com nossa integração Shopify.</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Saiba mais</button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">WooCommerce</h3>
            <p className="mb-4">Integre facilmente com o WooCommerce para gerenciar sua loja WordPress.</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Saiba mais</button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Magento</h3>
            <p className="mb-4">Potencialize sua loja Magento com nossa integração avançada.</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Saiba mais</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationSection;

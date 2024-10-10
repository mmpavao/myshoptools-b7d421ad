import React from 'react';

const MyShopToolsSection = () => {
  return (
    <div className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">MyShopTools - Plataforma para Vendedores e Fornecedores</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Como Funciona</h3>
            <p className="text-gray-600">
              Nossa plataforma facilita a conexão entre fornecedores globais e vendedores, 
              simplificando o processo de dropshipping e e-commerce.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Ferramentas de Integração</h3>
            <p className="text-gray-600">
              Integramos com Amazon, Shopify, Shopee, Mercado Livre, WooCommerce, 
              além de ERPs e CRMs como Bling e Hubspot.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Solução Completa para Dropshippers</h3>
            <p className="text-gray-600">
              Oferecemos uma loja pronta para começar a vender, com integração em 
              vários marketplaces e opção de criação de loja própria.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyShopToolsSection;
import React from 'react';

const ProductSection = ({ featuredProducts }) => {
  const renderProductCard = (product) => (
    <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
      <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-2">{product.description}</p>
        <p className="text-blue-600 font-bold">R$ {product.price.toFixed(2)}</p>
      </div>
    </div>
  );

  return (
    <section className="py-20 bg-gray-100 text-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">Produtos em Destaque</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map(renderProductCard)}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

const ProductSection = () => {
  const featuredProducts = [
    { id: 1, name: 'Smartphone X', price: 'R$ 1.999,00', image: '/images/smartphone.jpg' },
    { id: 2, name: 'Laptop Pro', price: 'R$ 4.499,00', image: '/images/laptop.jpg' },
    { id: 3, name: 'Smartwatch Y', price: 'R$ 899,00', image: '/images/smartwatch.jpg' },
    { id: 4, name: 'Wireless Earbuds', price: 'R$ 299,00', image: '/images/earbuds.jpg' },
  ];

  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 text-center">Produtos em Destaque</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <CardContent className="p-4">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.price}</p>
                <Button className="w-full">Ver Detalhes</Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">Ver Todos os Produtos</Button>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;

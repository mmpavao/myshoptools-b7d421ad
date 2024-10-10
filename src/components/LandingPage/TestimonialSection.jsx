import React from 'react';

const TestimonialSection = () => {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 text-center">Depoimentos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded shadow">
            <p className="text-lg italic">"A plataforma transformou meu negócio! As vendas dispararam!"</p>
            <p className="mt-4 font-semibold">- João Silva</p>
          </div>
          <div className="p-6 bg-white rounded shadow">
            <p className="text-lg italic">"Excelente suporte e integração com fornecedores!"</p>
            <p className="mt-4 font-semibold">- Maria Oliveira</p>
          </div>
          <div className="p-6 bg-white rounded shadow">
            <p className="text-lg italic">"A melhor experiência de dropshipping que já tive!"</p>
            <p className="mt-4 font-semibold">- Carlos Pereira</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;

import React from 'react';

const TestimonialSection = () => (
  <section className="py-20 bg-gray-100 text-gray-800">
    <h2 className="text-4xl font-bold mb-12 text-center">Depoimentos de Clientes</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {[
        { quote: "Esta plataforma revolucionou meu negócio de dropshipping. Minha produtividade aumentou em 200%!", author: "Maria S., Empreendedora" },
        { quote: "A facilidade de gerenciar múltiplos canais de venda é incrível. Recomendo a todos!", author: "João P., Lojista" }
      ].map((testimonial, index) => (
        <div key={index} className="bg-white p-8 rounded-lg shadow-lg">
          <p className="text-xl mb-4 italic">"{testimonial.quote}"</p>
          <p className="font-semibold text-right">- {testimonial.author}</p>
        </div>
      ))}
    </div>
  </section>
);

export default TestimonialSection;
import React from 'react';
import { Button } from "@/components/ui/button";
import { Headphones } from 'lucide-react';

const SupportSection = () => (
  <section className="py-20 bg-gray-100 text-gray-800">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-4xl font-bold mb-8">Suporte ao Cliente de Excelência</h2>
      <div className="flex justify-center items-center mb-8">
        <Headphones className="w-24 h-24 text-blue-600" />
      </div>
      <p className="text-xl mb-8">Nossa equipe de suporte está disponível 24/7 para ajudar você em todas as etapas do seu negócio.</p>
      <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">Fale Conosco</Button>
    </div>
  </section>
);

export default SupportSection;
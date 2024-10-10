import React from 'react';
import { Button } from "@/components/ui/button";

const CallToAction = ({ handleCTAClick }) => (
  <section className="py-20 bg-blue-900 text-white">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-4xl font-bold mb-8">Pronto para Impulsionar suas Vendas?</h2>
      <Button size="lg" className="bg-yellow-400 text-blue-900 hover:bg-yellow-300 transition-all duration-300" onClick={handleCTAClick}>
        Comece seu Teste Gratuito
      </Button>
    </div>
  </section>
);

export default CallToAction;
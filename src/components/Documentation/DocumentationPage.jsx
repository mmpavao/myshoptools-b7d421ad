import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const DocumentationPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Documentação MyShopTools</h1>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Introdução</AccordionTrigger>
          <AccordionContent>
            MyShopTools é uma plataforma completa para gerenciamento de e-commerce. Esta documentação fornece informações detalhadas sobre como utilizar nossos serviços e recursos.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>Primeiros Passos</AccordionTrigger>
          <AccordionContent>
            <ol className="list-decimal list-inside">
              <li>Crie uma conta</li>
              <li>Configure sua loja</li>
              <li>Adicione produtos</li>
              <li>Personalize sua vitrine</li>
              <li>Integre métodos de pagamento</li>
            </ol>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>Gerenciamento de Produtos</AccordionTrigger>
          <AccordionContent>
            Aprenda a adicionar, editar e remover produtos, gerenciar estoque e categorias, e otimizar suas listagens para melhor visibilidade.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>Processamento de Pedidos</AccordionTrigger>
          <AccordionContent>
            Saiba como visualizar, gerenciar e processar pedidos, incluindo integração com sistemas de logística e rastreamento de envios.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger>Integrações</AccordionTrigger>
          <AccordionContent>
            Explore nossas integrações com plataformas de pagamento, marketplaces, e ferramentas de marketing para expandir seu alcance e eficiência.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6">
          <AccordionTrigger>Relatórios e Analytics</AccordionTrigger>
          <AccordionContent>
            Utilize nossos relatórios detalhados para analisar vendas, comportamento do cliente, e desempenho do produto para tomar decisões informadas.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default DocumentationPage;
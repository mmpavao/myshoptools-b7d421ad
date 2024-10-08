import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { StarIcon } from "lucide-react";

const ProductTabs = ({ produto, activeTab, setActiveTab, activeMarketplace }) => {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <StarIcon key={index} className={`w-5 h-5 ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
      <TabsList>
        <TabsTrigger value="descricao">Descrição</TabsTrigger>
        <TabsTrigger value="especificacoes">Especificações</TabsTrigger>
        {activeMarketplace === 'Fornecedor' && (
          <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
        )}
      </TabsList>
      <TabsContent value="descricao">
        <Card>
          <CardContent className="pt-6">
            <p>{produto.descricao}</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="especificacoes">
        <Card>
          <CardContent className="pt-6">
            <ul className="list-disc pl-5">
              <li>Tamanho: 30 x 20 x 10 cm</li>
              <li>Material: Plástico ABS</li>
              <li>Voltagem: Bivolt (110V/220V)</li>
              <li>Peso: 500g</li>
              <li>Cor: Preto</li>
              <li>Garantia: 12 meses</li>
            </ul>
          </CardContent>
        </Card>
      </TabsContent>
      {activeMarketplace === 'Fornecedor' && (
        <TabsContent value="avaliacoes">
          <Card>
            <CardContent className="pt-6">
              {produto.avaliacoes && produto.avaliacoes.length > 0 ? (
                produto.avaliacoes.map((avaliacao, index) => (
                  <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
                    <div className="flex items-center mb-2">
                      <span className="font-semibold mr-2">{avaliacao.userName}</span>
                      {renderStars(avaliacao.nota)}
                      <span className="ml-2 text-sm text-gray-600">{new Date(avaliacao.data).toLocaleDateString()}</span>
                    </div>
                    <p>{avaliacao.comentario}</p>
                  </div>
                ))
              ) : (
                <p>Ainda não há avaliações para este produto.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      )}
    </Tabs>
  );
};

export default ProductTabs;
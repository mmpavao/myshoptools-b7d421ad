import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Vitrine = () => {
  // Simulação de produtos
  const produtos = [
    { id: 1, titulo: 'Produto 1', preco: 100, estoque: 10, vendaSugerida: 150 },
    { id: 2, titulo: 'Produto 2', preco: 200, estoque: 5, vendaSugerida: 300 },
    // Adicione mais produtos conforme necessário
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Vitrine</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {produtos.map((produto) => (
          <Card key={produto.id}>
            <CardHeader>
              <CardTitle>{produto.titulo}</CardTitle>
            </CardHeader>
            <CardContent>
              <img src="/placeholder.svg" alt={produto.titulo} className="w-full h-48 object-cover mb-2" />
              <p>Preço: R$ {produto.preco}</p>
              <p>Estoque: {produto.estoque}</p>
              <p>Venda sugerida: R$ {produto.vendaSugerida}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Detalhes</Button>
              <Button>Importar</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Vitrine;
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DetalheProduto = () => {
  const { id } = useParams();
  const [quantidade, setQuantidade] = useState(1);
  // Simulated product data - replace with actual data fetching
  const produto = {
    id,
    nome: "Kérastase Résistance Bain Force Architecte",
    tipo: "Shampoo",
    tamanho: "250ml",
    preco: 107.90,
    precoOriginal: 175.00,
    desconto: 39,
    marca: "Kérastase",
    avaliacao: 4.5,
    numAvaliacoes: 35,
    descricao: "Shampoo reconstrutor para cabelos danificados...",
    imagens: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    variacoes: {
      tamanhos: ["250ml", "500ml"],
      cores: [],
      voltagem: []
    }
  };

  const handleQuantidadeChange = (delta) => {
    setQuantidade(Math.max(1, quantidade + delta));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Imagem do Produto */}
        <div className="md:w-1/2">
          <img src={produto.imagens[0]} alt={produto.nome} className="w-full h-auto object-cover rounded-lg" />
          <div className="flex mt-4 gap-2">
            {produto.imagens.map((img, index) => (
              <img key={index} src={img} alt={`${produto.nome} ${index + 1}`} className="w-20 h-20 object-cover rounded-lg cursor-pointer" />
            ))}
          </div>
        </div>

        {/* Detalhes do Produto */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{produto.nome}</h1>
          <h2 className="text-xl text-gray-600 mb-4">{produto.tipo} {produto.tamanho}</h2>
          
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-5 h-5 ${i < Math.floor(produto.avaliacao) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-2 text-gray-600">({produto.numAvaliacoes} avaliações)</span>
          </div>

          <div className="mb-4">
            <span className="text-3xl font-bold text-primary">R$ {produto.preco.toFixed(2)}</span>
            <span className="ml-2 text-gray-500 line-through">R$ {produto.precoOriginal.toFixed(2)}</span>
            <span className="ml-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">-{produto.desconto}%</span>
          </div>

          {/* Variações */}
          {Object.entries(produto.variacoes).map(([tipo, opcoes]) => opcoes.length > 0 && (
            <div key={tipo} className="mb-4">
              <h3 className="text-lg font-semibold mb-2 capitalize">{tipo}:</h3>
              <div className="flex gap-2">
                {opcoes.map((opcao) => (
                  <Button key={opcao} variant="outline">{opcao}</Button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantidade e Botão Comprar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border rounded-md">
              <Button variant="outline" onClick={() => handleQuantidadeChange(-1)}>-</Button>
              <span className="px-4">{quantidade}</span>
              <Button variant="outline" onClick={() => handleQuantidadeChange(1)}>+</Button>
            </div>
            <Button className="flex-grow">Comprar</Button>
          </div>

          {/* Marca */}
          <div className="mb-6">
            <img src="/placeholder.svg" alt={produto.marca} className="h-8" />
          </div>

          {/* Tabs de Informações */}
          <Tabs defaultValue="descricao">
            <TabsList>
              <TabsTrigger value="descricao">Descrição</TabsTrigger>
              <TabsTrigger value="especificacoes">Especificações</TabsTrigger>
              <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
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
                    <li>Tipo: {produto.tipo}</li>
                    <li>Tamanho: {produto.tamanho}</li>
                    <li>Marca: {produto.marca}</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="avaliacoes">
              <Card>
                <CardContent className="pt-6">
                  <p>Avaliações dos clientes serão exibidas aqui.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DetalheProduto;
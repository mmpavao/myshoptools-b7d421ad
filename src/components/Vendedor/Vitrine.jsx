import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getProducts, createDocument } from '../../firebase/firebaseOperations';
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';

const Vitrine = () => {
  const [produtos, setProdutos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      const produtosData = await getProducts();
      setProdutos(produtosData);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos.",
        variant: "destructive",
      });
    }
  };

  const handleImportar = async (produto) => {
    try {
      await createDocument('meusProdutos', produto);
      toast({
        title: "Sucesso",
        description: "Produto importado com sucesso!",
      });
      navigate('/meus-produtos');
    } catch (error) {
      console.error("Erro ao importar produto:", error);
      toast({
        title: "Erro",
        description: "Não foi possível importar o produto.",
        variant: "destructive",
      });
    }
  };

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
              <img src={produto.fotos[0] || "/placeholder.svg"} alt={produto.titulo} className="w-full h-48 object-cover mb-2" />
              <p className="text-2xl font-bold text-primary">R$ {produto.preco}</p>
              <p>Estoque: {produto.estoque}</p>
              <p>Venda sugerida: R$ {produto.vendaSugerida}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Detalhes</Button>
              <Button onClick={() => handleImportar(produto)}>Importar</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Vitrine;
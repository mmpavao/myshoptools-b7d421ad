import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import firebaseOperations from '../../firebase/firebaseOperations';
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '../../components/Auth/AuthProvider';

const MeusProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMeusProdutos();
    }
  }, [user]);

  const fetchMeusProdutos = async () => {
    if (!user) return;

    try {
      const produtosData = await firebaseOperations.getMeusProdutos(user.uid);
      setProdutos(produtosData);
    } catch (error) {
      console.error("Erro ao buscar meus produtos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus produtos.",
        variant: "destructive",
      });
    }
  };

  if (produtos.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Meus Produtos</h1>
        <p>Você ainda não importou nenhum produto para sua loja.</p>
        <Link to="/vitrine">
          <Button>Ir para a Vitrine</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Meus Produtos</h1>
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
              <Button variant="outline">Editar</Button>
              <Button variant="destructive">Remover</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MeusProdutos;

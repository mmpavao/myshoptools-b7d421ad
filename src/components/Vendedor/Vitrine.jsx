import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import firebaseOperations from '../../firebase/firebaseOperations';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/Auth/AuthProvider';
import ProdutoCard from './ProdutoCard';

const Vitrine = () => {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchProdutos();
  }, [user]);

  const fetchProdutos = async () => {
    try {
      const produtosData = await firebaseOperations.getProducts();
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

  const handleDetalhes = (produtoId) => {
    navigate(`/produto/${produtoId}`);
  };

  const produtosFiltrados = produtos.filter(produto =>
    produto.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
    produto.sku.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Vitrine</h1>
      <Input
        placeholder="Filtrar por título ou SKU"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="max-w-sm mb-4"
      />
      {produtos.length === 0 ? (
        <p>Carregando produtos...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {produtosFiltrados.map((produto) => (
            <ProdutoCard 
              key={produto.id} 
              produto={produto} 
              onDetalhes={handleDetalhes}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Vitrine;
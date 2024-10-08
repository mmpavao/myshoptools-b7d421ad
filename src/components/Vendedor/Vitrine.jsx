import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import firebaseOperations from '../../firebase/firebaseOperations';
import { useNavigate } from 'react-router-dom';
import ProdutoCard from './ProdutoCard';
import { useAuth } from '../Auth/AuthProvider';

const Vitrine = () => {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [produtosImportados, setProdutosImportados] = useState({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchProdutos();
    if (user) {
      fetchProdutosImportadosStatus();
    }
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

  const fetchProdutosImportadosStatus = async () => {
    try {
      const status = await firebaseOperations.getProdutosImportadosStatus(user.uid);
      setProdutosImportados(status);
    } catch (error) {
      console.error("Erro ao buscar status dos produtos importados:", error);
    }
  };

  const handleDetalhes = (produtoId) => {
    navigate(`/produto/${produtoId}?source=vitrine`);
  };

  const handleImportar = async (produtoId) => {
    if (user) {
      try {
        const produto = produtos.find(p => p.id === produtoId);
        await firebaseOperations.importarProduto(user.uid, produto);
        setProdutosImportados(prev => ({ ...prev, [produtoId]: true }));
        toast({
          title: "Sucesso",
          description: "Produto importado com sucesso!",
        });
      } catch (error) {
        console.error("Erro ao importar produto:", error);
        toast({
          title: "Erro",
          description: "Não foi possível importar o produto.",
          variant: "destructive",
        });
      }
    }
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {produtosFiltrados.map((produto) => (
            <ProdutoCard
              key={produto.id}
              produto={produto}
              onDetalhes={handleDetalhes}
              onImportar={handleImportar}
              isImportado={produtosImportados[produto.id]}
              showExcluirButton={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Vitrine;
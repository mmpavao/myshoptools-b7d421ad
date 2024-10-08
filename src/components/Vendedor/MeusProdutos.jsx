import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import firebaseOperations from '../../firebase/firebaseOperations';
import ProdutoCard from './ProdutoCard';
import MyShopLandingPage from './MyShopLandingPage';
import { useAuth } from '../Auth/AuthProvider';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const MeusProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [produtoParaExcluir, setProdutoParaExcluir] = useState(null);
  const [myShopUrl, setMyShopUrl] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMeusProdutos();
      fetchMyShopUrl();
    }
  }, [user]);

  const fetchMeusProdutos = async () => {
    try {
      const produtosData = await firebaseOperations.getProdutosImportados(user.uid);
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

  const fetchMyShopUrl = async () => {
    try {
      const url = await firebaseOperations.getMyShopUrl(user.uid);
      setMyShopUrl(url);
    } catch (error) {
      console.error("Erro ao buscar URL da loja MyShop:", error);
    }
  };

  const handleDetalhes = (produtoId) => {
    navigate(`/produto/${produtoId}`);
  };

  const handleExcluir = async () => {
    if (!produtoParaExcluir) return;

    try {
      await firebaseOperations.removerProdutoImportado(user.uid, produtoParaExcluir);
      toast({
        title: "Sucesso",
        description: "Produto removido com sucesso.",
      });
      fetchMeusProdutos();
      setProdutoParaExcluir(null);
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o produto.",
        variant: "destructive",
      });
    }
  };

  const produtosFiltrados = produtos.filter(produto =>
    produto.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
    produto.sku.toLowerCase().includes(filtro.toLowerCase())
  );

  const copyMyShopUrl = () => {
    navigator.clipboard.writeText(myShopUrl);
    toast({
      title: "URL Copiada",
      description: "A URL da sua loja MyShop foi copiada para a área de transferência.",
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Meus Produtos</h1>
      <div className="flex justify-between items-center">
        <Input
          placeholder="Filtrar por título ou SKU"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="max-w-sm"
        />
        <div className="space-x-2">
          <MyShopLandingPage produtos={produtos} />
          {myShopUrl && (
            <Button variant="outline" onClick={copyMyShopUrl}>
              Copiar URL da Loja
            </Button>
          )}
        </div>
      </div>
      {produtos.length === 0 ? (
        <p>Você ainda não importou nenhum produto.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {produtosFiltrados.map((produto) => (
            <ProdutoCard
              key={produto.id}
              produto={produto}
              onDetalhes={handleDetalhes}
              onExcluir={() => setProdutoParaExcluir(produto.id)}
              showExcluirButton={true}
            />
          ))}
        </div>
      )}

      <AlertDialog open={!!produtoParaExcluir} onOpenChange={() => setProdutoParaExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este produto? Esta ação também removerá os anúncios de venda dos marketplaces.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleExcluir}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MeusProdutos;
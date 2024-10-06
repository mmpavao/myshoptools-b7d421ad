import { useState, useEffect } from 'react';
import firebaseOperations from '../../firebase/firebaseOperations';

export const useEstoque = () => {
  const [produtos, setProdutos] = useState([]);
  const [novoProduto, setNovoProduto] = useState({
    titulo: '', fotos: [], descricao: '', sku: '', estoque: 0, preco: 0, desconto: 0, tipoDesconto: '%', variacoes: [], vendaSugerida: 0
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      const produtosData = await firebaseOperations.getProducts();
      setProdutos(produtosData);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoProduto(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const uploadPromises = files.map(file => firebaseOperations.uploadProductImage(file, 'temp'));
    try {
      const uploadedUrls = await Promise.all(uploadPromises);
      setNovoProduto(prev => ({ ...prev, fotos: [...prev.fotos, ...uploadedUrls] }));
    } catch (error) {
      console.error("Erro ao fazer upload das imagens:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const produtoParaSalvar = {
        ...novoProduto,
        preco: Number(novoProduto.preco),
        desconto: Number(novoProduto.desconto),
        estoque: Number(novoProduto.estoque),
        vendaSugerida: Number(novoProduto.vendaSugerida)
      };
      if (novoProduto.id) {
        await firebaseOperations.updateProduct(novoProduto.id, produtoParaSalvar);
        console.log("Produto atualizado com sucesso!");
      } else {
        await firebaseOperations.createProduct(produtoParaSalvar);
        console.log("Produto adicionado com sucesso!");
      }
      fetchProdutos();
      setIsDialogOpen(false);
      resetNovoProduto();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await firebaseOperations.deleteProduct(productId);
      console.log("Produto removido com sucesso!");
      fetchProdutos();
    } catch (error) {
      console.error("Erro ao remover produto:", error);
    }
  };

  const handleEditProduct = (produto) => {
    setNovoProduto(produto);
    setIsDialogOpen(true);
  };

  const resetNovoProduto = () => {
    setNovoProduto({
      titulo: '', fotos: [], descricao: '', sku: '', estoque: 0, preco: 0, desconto: 0, tipoDesconto: '%', variacoes: [], vendaSugerida: 0
    });
    setIsDialogOpen(true);
  };

  return {
    produtos,
    novoProduto,
    isDialogOpen,
    filtro,
    handleInputChange,
    handleFileChange,
    handleSubmit,
    handleDeleteProduct,
    setIsDialogOpen,
    setFiltro,
    handleEditProduct,
    resetNovoProduto
  };
};
import { useState, useEffect } from 'react';
import firebaseOperations from '../../firebase/firebaseOperations';
import { parseCurrency } from '../../utils/currencyUtils';
import { chatWithBot } from '../../integrations/openAIOperations';

export const useEstoque = () => {
  const [produtos, setProdutos] = useState([]);
  const [novoProduto, setNovoProduto] = useState({
    titulo: '', fotos: [], descricao: '', sku: '', estoque: 0, preco: 0, desconto: 0, tipoDesconto: '%', variacoes: [], vendaSugerida: 0
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    lowStock: 0,
    bestSellers: 0,
    worstSellers: 0
  });

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      const produtosData = await firebaseOperations.getProducts();
      setProdutos(produtosData);
      calculateStats(produtosData);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const calculateStats = (produtosData) => {
    const newStats = {
      total: produtosData.length,
      lowStock: produtosData.filter(p => p.estoque < 10).length,
      bestSellers: 5, // Placeholder, implement real logic
      worstSellers: 5 // Placeholder, implement real logic
    };
    setStats(newStats);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;

    if (['preco', 'vendaSugerida'].includes(name)) {
      parsedValue = value; // Mantém o valor formatado no estado
    } else if (['estoque', 'desconto'].includes(name)) {
      parsedValue = parseInt(value, 10) || 0;
    }

    setNovoProduto(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    let productId = novoProduto.id;
    
    if (!productId) {
      // Criar um novo produto no Firestore para obter um ID real
      const tempProduct = {
        titulo: 'Produto Temporário',
        fotos: [],
        descricao: '',
        sku: '',
        estoque: 0,
        preco: 0,
        desconto: 0,
        tipoDesconto: '%',
        variacoes: [],
        vendaSugerida: 0
      };
      productId = await firebaseOperations.createProduct(tempProduct);
      setNovoProduto(prev => ({ ...prev, id: productId }));
    }

    const uploadPromises = files.map(file => firebaseOperations.uploadProductImage(file, productId));
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
        preco: parseCurrency(novoProduto.preco),
        vendaSugerida: parseCurrency(novoProduto.vendaSugerida),
        desconto: Number(novoProduto.desconto),
        estoque: Number(novoProduto.estoque)
      };

      if (novoProduto.id) {
        await firebaseOperations.updateProduct(novoProduto.id, produtoParaSalvar);
        console.log("Produto atualizado com sucesso!");
      } else {
        const newProductId = await firebaseOperations.createProduct(produtoParaSalvar);
        console.log("Produto adicionado com sucesso!");
        setNovoProduto(prev => ({ ...prev, id: newProductId }));
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
  };

  const calcularMarkup = () => {
    const precoVenda = Number(novoProduto.vendaSugerida);
    const precoCusto = Number(novoProduto.preco);
    if (precoCusto > 0) {
      const markup = ((precoVenda - precoCusto) / precoCusto * 100).toFixed(2);
      return `${markup}%`;
    }
    return '0%';
  };

  const generateAIContent = async (field, prompt) => {
    try {
      const apiKey = localStorage.getItem('openaiApiKey');
      if (!apiKey) {
        console.error("API key not found");
        return;
      }

      const assistantId = localStorage.getItem('defaultAssistantId');
      if (!assistantId) {
        console.error("Default assistant ID not found");
        return;
      }

      let message;
      if (field === 'titulo') {
        message = `Gere um título atrativo e conciso para um produto com o SKU ${prompt}. O título deve ter no máximo 100 caracteres.`;
      } else if (field === 'descricao') {
        message = `Crie uma descrição detalhada e atrativa para o produto "${prompt}". A descrição deve ter entre 100 e 500 caracteres e destacar os principais benefícios e características do produto.`;
      }

      const response = await chatWithBot(apiKey, assistantId, message);
      
      if (response && response.response) {
        setNovoProduto(prev => ({ ...prev, [field]: response.response.trim() }));
      }
    } catch (error) {
      console.error("Erro ao gerar conteúdo com IA:", error);
    }
  };

  return {
    produtos,
    novoProduto,
    isDialogOpen,
    filtro,
    stats,
    handleInputChange,
    handleFileChange,
    handleSubmit,
    handleDeleteProduct,
    setIsDialogOpen,
    setFiltro,
    handleEditProduct,
    resetNovoProduto,
    calcularMarkup,
    generateAIContent,
  };
};
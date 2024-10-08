import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import firebaseOperations from '../../firebase/firebaseOperations';
import { useAuth } from '../../components/Auth/AuthProvider';
import ProductImages from './ProductImages';
import ProductDetails from './ProductDetails';
import ProductTabs from './ProductTabs';
import RatingForm from './RatingForm';

const DetalheProduto = () => {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [isImportado, setIsImportado] = useState(false);
  const [avaliacaoAtual, setAvaliacaoAtual] = useState({ nota: 0, comentario: '' });
  const [activeTab, setActiveTab] = useState('descricao');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const produtoData = await firebaseOperations.getProduct(id);
        setProduto(produtoData);
        if (user) {
          const importado = await firebaseOperations.verificarProdutoImportado(user.uid, id);
          setIsImportado(importado);
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do produto:", error);
      }
    };

    fetchProduto();
  }, [id, user]);

  const handleImportar = async () => {
    if (!user) {
      console.error("Você precisa estar logado para importar produtos.");
      return;
    }

    try {
      await firebaseOperations.importarProduto(user.uid, produto);
      setIsImportado(true);
      console.log("Produto importado com sucesso!");
      navigate('/meus-produtos');
    } catch (error) {
      console.error("Erro ao importar produto:", error);
    }
  };

  const handleSubmitAvaliacao = async () => {
    try {
      await firebaseOperations.adicionarAvaliacao(id, user.uid, avaliacaoAtual.nota, avaliacaoAtual.comentario);
      console.log("Avaliação enviada com sucesso!");
      setAvaliacaoAtual({ nota: 0, comentario: '' });
      const produtoAtualizado = await firebaseOperations.getProduct(id);
      setProduto(produtoAtualizado);
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
    }
  };

  if (!produto) return <div>Carregando...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <ProductImages fotos={produto.fotos} titulo={produto.titulo} />
        <ProductDetails 
          produto={produto} 
          isImportado={isImportado} 
          handleImportar={handleImportar}
        />
      </div>
      <ProductTabs 
        produto={produto} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
      />
      {activeTab === 'avaliacoes' && (
        <RatingForm 
          avaliacaoAtual={avaliacaoAtual} 
          setAvaliacaoAtual={setAvaliacaoAtual} 
          handleSubmitAvaliacao={handleSubmitAvaliacao}
        />
      )}
    </div>
  );
};

export default DetalheProduto;

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '../Auth/AuthProvider';
import firebaseOperations from '../../firebase/firebaseOperations';
import ProdutoCard from './ProdutoCard';

const MyShopLandingPage = ({ isOpen, onClose, produtos }) => {
  const [landingPageData, setLandingPageData] = useState({
    bannerUrl: '',
    title: '',
    description: '',
    selectedProducts: [],
    footerInfo: '',
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user && isOpen) {
      fetchLandingPageData();
    }
  }, [user, isOpen]);

  const fetchLandingPageData = async () => {
    try {
      const data = await firebaseOperations.getLandingPageData(user.uid);
      if (data) {
        setLandingPageData(data);
      }
    } catch (error) {
      console.error("Erro ao buscar dados da landing page:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLandingPageData(prev => ({ ...prev, [name]: value }));
  };

  const handleProductToggle = (productId) => {
    setLandingPageData(prev => {
      const newSelectedProducts = prev.selectedProducts.includes(productId)
        ? prev.selectedProducts.filter(id => id !== productId)
        : [...prev.selectedProducts, productId];
      return { ...prev, selectedProducts: newSelectedProducts };
    });
  };

  const handleSave = async () => {
    try {
      await firebaseOperations.saveLandingPageData(user.uid, landingPageData);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar dados da landing page:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Configurar Loja MyShop</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            name="bannerUrl"
            value={landingPageData.bannerUrl}
            onChange={handleInputChange}
            placeholder="URL do Banner"
          />
          <Input
            name="title"
            value={landingPageData.title}
            onChange={handleInputChange}
            placeholder="Título da Loja"
          />
          <Textarea
            name="description"
            value={landingPageData.description}
            onChange={handleInputChange}
            placeholder="Descrição da Loja"
          />
          <div className="space-y-2">
            <h3 className="font-semibold">Selecione os produtos para exibir:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {produtos.map((produto) => (
                <div key={produto.id} className="flex flex-col items-center">
                  <ProdutoCard produto={produto} />
                  <input
                    type="checkbox"
                    checked={landingPageData.selectedProducts.includes(produto.id)}
                    onChange={() => handleProductToggle(produto.id)}
                    className="mt-2"
                  />
                </div>
              ))}
            </div>
          </div>
          <Textarea
            name="footerInfo"
            value={landingPageData.footerInfo}
            onChange={handleInputChange}
            placeholder="Informações do Rodapé (contato, políticas, etc.)"
          />
          <Button onClick={handleSave}>Salvar e Publicar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MyShopLandingPage;
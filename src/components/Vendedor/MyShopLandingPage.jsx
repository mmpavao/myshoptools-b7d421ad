import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import firebaseOperations from '../../firebase/firebaseOperations';
import { useAuth } from '../Auth/AuthProvider';

const MyShopLandingPage = ({ produto }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [landingPageData, setLandingPageData] = useState({
    bannerUrl: '',
    title: '',
    description: '',
    selectedProducts: [],
    footerInfo: '',
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchLandingPageData();
    }
  }, [user]);

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

  const handleProductToggle = () => {
    setLandingPageData(prev => {
      const newSelectedProducts = prev.selectedProducts.includes(produto.id)
        ? prev.selectedProducts.filter(id => id !== produto.id)
        : [...prev.selectedProducts, produto.id];
      return { ...prev, selectedProducts: newSelectedProducts };
    });
  };

  const handleSave = async () => {
    try {
      await firebaseOperations.saveLandingPageData(user.uid, landingPageData);
      setIsOpen(false);
    } catch (error) {
      console.error("Erro ao salvar dados da landing page:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>{landingPageData.title ? 'Editar Loja MyShop' : 'Vender em MyShop'}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Editar Landing Page MyShop</DialogTitle>
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
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={landingPageData.selectedProducts.includes(produto.id)}
              onChange={handleProductToggle}
            />
            <span>{produto.titulo}</span>
          </div>
          <Textarea
            name="footerInfo"
            value={landingPageData.footerInfo}
            onChange={handleInputChange}
            placeholder="Informações do Rodapé (contato, políticas, etc.)"
          />
          <Button onClick={handleSave}>Salvar Landing Page</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MyShopLandingPage;
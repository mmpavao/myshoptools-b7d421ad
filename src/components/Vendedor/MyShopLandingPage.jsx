import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ProdutoCard from './ProdutoCard';
import firebaseOperations from '../../firebase/firebaseOperations';
import { useAuth } from '../Auth/AuthProvider';

const MyShopLandingPage = ({ produtos }) => {
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

  const handleProductToggle = (productId) => {
    setLandingPageData(prev => {
      const newSelectedProducts = prev.selectedProducts.includes(productId)
        ? prev.selectedProducts.filter(id => id !== productId)
        : [...prev.selectedProducts, productId];
      return { ...prev, selectedProducts: newSelectedProducts };
    });
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const newSelectedProducts = Array.from(landingPageData.selectedProducts);
    const [reorderedItem] = newSelectedProducts.splice(result.source.index, 1);
    newSelectedProducts.splice(result.destination.index, 0, reorderedItem);

    setLandingPageData(prev => ({ ...prev, selectedProducts: newSelectedProducts }));
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
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="produtos">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {produtos.map((produto, index) => (
                    <Draggable key={produto.id} draggableId={produto.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            checked={landingPageData.selectedProducts.includes(produto.id)}
                            onChange={() => handleProductToggle(produto.id)}
                          />
                          <ProdutoCard produto={produto} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
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
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '../../components/Auth/AuthProvider';
import firebaseOperations from '../../firebase/firebaseOperations';
import { Spinner } from '../ui/spinner';

const MockCheckout = ({ isOpen, onClose, product }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      // Simular processamento do pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Criar pedido fictício
      const pedido = {
        produtoId: product.id,
        titulo: product.titulo,
        preco: product.preco,
        quantidade: 1,
        status: 'Pago',
        dataCompra: new Date().toISOString(),
      };

      // Adicionar pedido aos meus pedidos do vendedor
      if (user) {
        await firebaseOperations.adicionarPedidoVendedor(user.uid, pedido);
      }

      // Adicionar pedido aos pedidos do fornecedor
      await firebaseOperations.adicionarPedidoFornecedor(product.fornecedorId, pedido);

      toast({
        title: "Compra realizada com sucesso!",
        description: "Seu pedido foi processado e registrado.",
      });

      setTimeout(() => {
        setIsProcessing(false);
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Erro ao processar compra:", error);
      toast({
        title: "Erro na compra",
        description: "Não foi possível processar sua compra. Tente novamente.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Checkout - {product.titulo}</DialogTitle>
        </DialogHeader>
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Spinner className="w-12 h-12 mb-4" />
            <p>Processando seu pedido...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="cardNumber">Número do Cartão</Label>
              <Input id="cardNumber" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} required />
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="expiry">Validade</Label>
                <Input id="expiry" name="expiry" placeholder="MM/AA" value={formData.expiry} onChange={handleInputChange} required />
              </div>
              <div className="flex-1">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" name="cvc" value={formData.cvc} onChange={handleInputChange} required />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? 'Processando...' : `Pagar R$ ${product.preco.toFixed(2)}`}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MockCheckout;
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '../../components/Auth/AuthProvider';
import firebaseOperations from '../../firebase/firebaseOperations';
import { Spinner } from '../ui/spinner';

const MockCheckout = ({ isOpen, onClose, product }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleComprar = async () => {
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
        title: "Pagamento aprovado!",
        description: "Seu pedido foi processado com sucesso.",
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
      <DialogContent className="sm:max-w-[300px]">
        <DialogHeader>
          <DialogTitle>Finalizar Compra</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-center mb-4">Produto: {product.titulo}</p>
          <p className="text-center font-bold mb-4">Total: R$ {product.preco.toFixed(2)}</p>
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center">
              <Spinner className="w-8 h-8 mb-2" />
              <p>Processando pagamento...</p>
            </div>
          ) : (
            <Button onClick={handleComprar} className="w-full">
              Pagar Agora
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MockCheckout;
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '../../components/Auth/AuthProvider';
import firebaseOperations from '../../firebase/firebaseOperations';
import { Loader2, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';

const MockCheckout = ({ isOpen, onClose, product }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPurchaseComplete, setIsPurchaseComplete] = useState(false);
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

      setIsProcessing(false);
      setIsPurchaseComplete(true);
      
      // Dispara o efeito de confete
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

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

  const handleConcluir = () => {
    setIsPurchaseComplete(false);
    onClose();
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[300px]">
        <DialogHeader>
          <DialogTitle>{isPurchaseComplete ? "Compra Concluída" : "Finalizar Compra"}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {!isPurchaseComplete ? (
            <>
              <p className="text-center mb-4">Produto: {product.titulo}</p>
              <p className="text-center font-bold mb-4">Total: R$ {product.preco.toFixed(2)}</p>
              <Button 
                onClick={handleComprar} 
                className="w-full" 
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Pagar Agora"
                )}
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <PartyPopper className="h-16 w-16 text-yellow-400 mb-4" />
              <p className="text-center font-bold mb-4">Parabéns! Compra aprovada!</p>
              <Button onClick={handleConcluir} className="w-full">
                Concluir
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MockCheckout;
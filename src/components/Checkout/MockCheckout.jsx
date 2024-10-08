import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '../../components/Auth/AuthProvider';
import firebaseOperations from '../../firebase/firebaseOperations';
import { Loader2, CheckCircle, ShoppingCart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency } from '../../utils/currencyUtils';

const MockCheckout = ({ isOpen, onClose, products = [] }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPurchaseComplete, setIsPurchaseComplete] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const totalAmount = products.reduce((total, product) => total + (product?.preco || 0), 0);

  const handleComprar = async () => {
    setIsProcessing(true);
    try {
      // Simular processamento do pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Criar pedidos fictícios
      const pedidos = products.map(product => ({
        produtoId: product?.id,
        titulo: product?.titulo,
        preco: product?.preco,
        quantidade: 1,
        status: 'Pago',
        dataCompra: new Date().toISOString(),
      }));

      // Adicionar pedidos aos meus pedidos do vendedor
      if (user) {
        await Promise.all(pedidos.map(pedido => 
          firebaseOperations.adicionarPedidoVendedor(user.uid, pedido)
        ));
      }

      // Adicionar pedidos aos pedidos dos fornecedores
      await Promise.all(pedidos.map(pedido => 
        firebaseOperations.adicionarPedidoFornecedor(pedido.produtoId, pedido)
      ));

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

  if (!products || products.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{isPurchaseComplete ? "Compra Concluída" : "Finalizar Compra"}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {!isPurchaseComplete ? (
            <>
              <div className="max-h-60 overflow-y-auto mb-4">
                {products.map((product, index) => (
                  <div key={index} className="flex justify-between items-center mb-2">
                    <span className="text-sm truncate">{product?.titulo}</span>
                    <span className="font-bold">{formatCurrency(product?.preco)}</span>
                  </div>
                ))}
              </div>
              <p className="text-center font-bold mb-4">Total: {formatCurrency(totalAmount)}</p>
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
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Pagar Agora
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <p className="text-center font-bold mb-4">Parabéns! Seu pagamento foi aprovado!</p>
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
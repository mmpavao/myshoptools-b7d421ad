import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '../../components/Auth/AuthProvider';
import firebaseOperations from '../../firebase/firebaseOperations';
import { Loader2, CheckCircle, ShoppingCart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency } from '../../utils/currencyUtils';

const MockCheckout = ({ isOpen, onClose, products = [], onPurchaseComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPurchaseComplete, setIsPurchaseComplete] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const totalAmount = products.reduce((total, product) => total + (product?.preco || 0), 0);

  useEffect(() => {
    if (isPurchaseComplete) {
      const timer = setTimeout(() => {
        handleConcluir();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isPurchaseComplete]);

  const handleComprar = async () => {
    setIsProcessing(true);
    try {
      // Simula o tempo de processamento
      await new Promise(resolve => setTimeout(resolve, 2000));

      const pedidos = products.map(product => ({
        produtoId: product.id,
        titulo: product.titulo,
        preco: product.preco,
        quantidade: 1,
        status: 'Pago',
        dataCompra: new Date().toISOString(),
        sku: product.sku,
      }));

      // Registra os pedidos para o vendedor e o fornecedor
      if (user) {
        await Promise.all(pedidos.map(pedido => 
          firebaseOperations.adicionarPedidoVendedor(user.uid, pedido)
        ));
      }

      await Promise.all(pedidos.map(pedido => 
        firebaseOperations.adicionarPedidoFornecedor(pedido.produtoId, pedido)
      ));

      // Atualiza o estoque
      await Promise.all(products.map(product => 
        firebaseOperations.atualizarEstoque(product.id, Math.max(0, product.estoque - 1))
      ));

      setIsProcessing(false);
      setIsPurchaseComplete(true);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      toast({
        title: "Compra realizada com sucesso!",
        description: "Seu pedido foi processado e registrado.",
        variant: "success",
      });

      onPurchaseComplete();

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

  const truncateTitle = (title, maxLength = 40) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

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
                    <span className="text-sm truncate" title={product?.titulo}>
                      {truncateTitle(product?.titulo || '')}
                    </span>
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
            <div className="flex flex-col items-center bg-green-100 p-6 rounded-lg">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-green-700 mb-2">Parabéns!</h2>
              <p className="text-center text-green-600 mb-4">Sua compra foi aprovada com sucesso!</p>
              <p className="text-center text-green-600">Esta janela será fechada automaticamente.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MockCheckout;
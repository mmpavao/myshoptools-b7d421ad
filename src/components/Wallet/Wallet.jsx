import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthProvider';
import { WalletBalance, TransactionHistory, CheckoutDialog } from './WalletComponents';
import walletOperations from '../../firebase/walletOperations';
import { useToast } from "@/components/ui/use-toast";

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [amount, setAmount] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [installments, setInstallments] = useState('1');
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchWalletData();
    }
  }, [user]);

  const fetchWalletData = async () => {
    try {
      const userBalance = await walletOperations.getWalletBalance(user.uid);
      setBalance(userBalance);
      const transactionHistory = await walletOperations.getWalletHistory(user.uid);
      setHistory(transactionHistory);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados da carteira.",
        variant: "destructive",
      });
    }
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleAddFunds = () => {
    setIsCheckoutOpen(true);
  };

  const handleWithdraw = async () => {
    try {
      const withdrawAmount = parseFloat(amount);
      if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
        throw new Error('Valor inválido para saque');
      }
      await walletOperations.withdrawFunds(user.uid, withdrawAmount);
      fetchWalletData();
      setAmount('');
      toast({
        title: "Sucesso",
        description: `Saque de R$ ${withdrawAmount.toFixed(2)} realizado com sucesso.`,
      });
    } catch (error) {
      console.error('Error withdrawing funds:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível realizar o saque.",
        variant: "destructive",
      });
    }
  };

  const handleTransfer = () => {
    // Implementar lógica de transferência
    console.log('Transferência não implementada');
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const addedAmount = parseFloat(amount);
      if (isNaN(addedAmount) || addedAmount <= 0) {
        throw new Error('Valor inválido para adição de fundos');
      }
      await walletOperations.addFunds(user.uid, addedAmount, paymentMethod);
      fetchWalletData();
      setAmount('');
      setIsCheckoutOpen(false);
      toast({
        title: "Sucesso",
        description: `R$ ${addedAmount.toFixed(2)} adicionados à sua carteira.`,
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Erro",
        description: "Não foi possível processar o pagamento.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Minha Carteira</h1>
      <WalletBalance
        balance={balance}
        amount={amount}
        handleAmountChange={handleAmountChange}
        handleAddFunds={handleAddFunds}
        handleWithdraw={handleWithdraw}
        handleTransfer={handleTransfer}
      />
      <TransactionHistory history={history} />
      <CheckoutDialog
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        installments={installments}
        setInstallments={setInstallments}
        isProcessing={isProcessing}
        handlePaymentSubmit={handlePaymentSubmit}
        amount={parseFloat(amount)}
      />
    </div>
  );
};

export default Wallet;
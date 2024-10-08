import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthProvider';
import walletOperations from '../../firebase/walletOperations';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, parseCurrency, formatInputCurrency } from '../../utils/currencyUtils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import QRCodeFicticio from './QRCodeFicticio';
import { WalletBalance, TransactionHistory, CheckoutDialog } from './WalletComponents';

const Wallet = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [amount, setAmount] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [isProcessing, setIsProcessing] = useState(false);
  const [installments, setInstallments] = useState('1');

  useEffect(() => {
    if (user) fetchWalletData();
  }, [user]);

  const fetchWalletData = async () => {
    try {
      const walletBalance = await walletOperations.getWalletBalance(user.uid);
      setBalance(walletBalance);
      const walletHistory = await walletOperations.getWalletHistory(user.uid);
      setHistory(walletHistory);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados da carteira.",
        variant: "destructive",
      });
    }
  };

  const handleAddFunds = () => setIsCheckoutOpen(true);
  
  const handleWithdraw = async () => {
    try {
      await walletOperations.withdrawFunds(user.uid, parseCurrency(amount));
      setAmount('');
      fetchWalletData();
      toast({
        title: "Sucesso",
        description: "Saque realizado com sucesso.",
        variant: "success",
      });
    } catch (error) {
      console.error('Error withdrawing funds:', error);
      toast({
        title: "Erro",
        description: "Não foi possível realizar o saque.",
        variant: "destructive",
      });
    }
  };

  const handleTransfer = () => {
    toast({
      title: "Em breve",
      description: "Funcionalidade de transferência será implementada em breve.",
      variant: "default",
    });
  };

  const handleCheckoutClose = () => {
    setIsCheckoutOpen(false);
    setPaymentMethod('credit');
    setInstallments('1');
    setIsProcessing(false);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulação de processamento
      const parsedAmount = parseCurrency(amount);
      await walletOperations.addFunds(user.uid, parsedAmount, paymentMethod);
      
      // Gerar a transação
      await walletOperations.createTransaction(user.uid, {
        type: 'credit',
        amount: parsedAmount,
        method: paymentMethod,
        description: `Adição de fundos via ${paymentMethod}`,
        status: 'completed',
      });

      setAmount('');
      fetchWalletData();
      handleCheckoutClose();
      toast({
        title: "Sucesso",
        description: "Fundos adicionados e transação gerada com sucesso.",
        variant: "success",
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Erro",
        description: "Não foi possível processar o pagamento ou gerar a transação.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAmountChange = (e) => {
    const formattedValue = formatInputCurrency(e.target.value);
    setAmount(formattedValue);
  };

  return (
    <div className="space-y-6">
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
        onClose={handleCheckoutClose}
        paymentMethod={paymentMethod} 
        setPaymentMethod={setPaymentMethod}
        installments={installments} 
        setInstallments={setInstallments}
        isProcessing={isProcessing} 
        handlePaymentSubmit={handlePaymentSubmit}
        amount={amount}
      />
    </div>
  );
};

export default Wallet;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthProvider';
import walletOperations from '../../firebase/walletOperations';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from '../../utils/currencyUtils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import QRCodeFicticio from './QRCodeFicticio';

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
    }
  };

  const handleAddFunds = () => setIsCheckoutOpen(true);
  const handleWithdraw = async () => {
    try {
      await walletOperations.withdrawFunds(user.uid, parseFloat(amount));
      setAmount('');
      fetchWalletData();
    } catch (error) {
      console.error('Error withdrawing funds:', error);
    }
  };

  const handleTransfer = () => console.log('Transfer functionality to be implemented');

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
      await new Promise(resolve => setTimeout(resolve, 2000));
      await walletOperations.addFunds(user.uid, parseFloat(amount), paymentMethod);
      setAmount('');
      fetchWalletData();
      handleCheckoutClose();
    } catch (error) {
      console.error('Error processing payment:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <WalletBalance balance={balance} amount={amount} setAmount={setAmount} 
                    handleAddFunds={handleAddFunds} handleWithdraw={handleWithdraw} handleTransfer={handleTransfer} />
      <TransactionHistory history={history} />
      <CheckoutDialog isOpen={isCheckoutOpen} onClose={handleCheckoutClose} 
                      paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
                      installments={installments} setInstallments={setInstallments}
                      isProcessing={isProcessing} handlePaymentSubmit={handlePaymentSubmit} />
    </div>
  );
};

const WalletBalance = ({ balance, amount, setAmount, handleAddFunds, handleWithdraw, handleTransfer }) => (
  <Card>
    <CardHeader>
      <CardTitle>Minha Carteira</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold mb-4">Saldo: {formatCurrency(balance)}</p>
      <div className="flex space-x-2 mb-4">
        <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Valor" />
        <Button onClick={handleAddFunds}>Adicionar Fundos</Button>
        <Button onClick={handleWithdraw} variant="outline">Sacar</Button>
        <Button onClick={handleTransfer} variant="secondary">Transferir</Button>
      </div>
    </CardContent>
  </Card>
);

const TransactionHistory = ({ history }) => (
  <Card>
    <CardHeader>
      <CardTitle>Histórico de Transações</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Método</TableHead>
            <TableHead>Saldo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{new Date(transaction.createdAt).toLocaleString()}</TableCell>
              <TableCell>{transaction.type === 'credit' ? 'Entrada' : 'Saída'}</TableCell>
              <TableCell>{formatCurrency(transaction.amount)}</TableCell>
              <TableCell>{transaction.method}</TableCell>
              <TableCell>{formatCurrency(transaction.balance)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

const CheckoutDialog = ({ isOpen, onClose, paymentMethod, setPaymentMethod, installments, setInstallments, isProcessing, handlePaymentSubmit }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Adicionar Fundos</DialogTitle>
      </DialogHeader>
      <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="credit">Cartão de Crédito</TabsTrigger>
          <TabsTrigger value="pix">PIX</TabsTrigger>
        </TabsList>
        <TabsContent value="credit">
          <form onSubmit={handlePaymentSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Número do Cartão</Label>
                <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Data de Expiração</Label>
                  <Input id="expiry" placeholder="MM/AA" />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" />
                </div>
              </div>
              <div>
                <Label htmlFor="installments">Parcelas</Label>
                <Select value={installments} onValueChange={setInstallments}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione as parcelas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1x sem juros</SelectItem>
                    <SelectItem value="2">2x sem juros</SelectItem>
                    <SelectItem value="3">3x sem juros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando
                  </>
                ) : (
                  'Finalizar Pagamento'
                )}
              </Button>
            </DialogFooter>
          </form>
        </TabsContent>
        <TabsContent value="pix">
          <div className="space-y-4">
            <div className="flex justify-center">
              <QRCodeFicticio />
            </div>
            <Button className="w-full" onClick={() => console.log('Copiar código PIX')}>
              Copiar código PIX
            </Button>
            <DialogFooter>
              <Button onClick={handlePaymentSubmit} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando
                  </>
                ) : (
                  'Finalizar Pagamento'
                )}
              </Button>
            </DialogFooter>
          </div>
        </TabsContent>
      </Tabs>
    </DialogContent>
  </Dialog>
);

export default Wallet;
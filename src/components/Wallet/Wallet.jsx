import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthProvider';
import walletOperations from '../../firebase/walletOperations';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from '../../utils/currencyUtils';

const Wallet = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (user) {
      fetchWalletData();
    }
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

  const handleAddFunds = async () => {
    try {
      await walletOperations.addFunds(user.uid, parseFloat(amount), 'manual_add');
      setAmount('');
      fetchWalletData();
    } catch (error) {
      console.error('Error adding funds:', error);
    }
  };

  const handleWithdraw = async () => {
    try {
      await walletOperations.withdrawFunds(user.uid, parseFloat(amount));
      setAmount('');
      fetchWalletData();
    } catch (error) {
      console.error('Error withdrawing funds:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Minha Carteira</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold mb-4">Saldo: {formatCurrency(balance)}</p>
          <div className="flex space-x-2 mb-4">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Valor"
            />
            <Button onClick={handleAddFunds}>Adicionar Fundos</Button>
            <Button onClick={handleWithdraw} variant="outline">Sacar</Button>
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
};

export default Wallet;
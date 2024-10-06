import React, { useState } from 'react';
import { Button } from '../ui/button';
import firebaseOperations from '../../firebase/firebaseOperations';
import FirebaseTestLog from '../Dashboard/FirebaseTestLog';
import ImageUpload from '../Dashboard/ImageUpload';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { toast } from '@/components/ui/use-toast';

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [isTestingFirebase, setIsTestingFirebase] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pin, setPin] = useState('');

  const handleTestFirebase = async () => {
    setIsTestingFirebase(true);
    setLogs([]);
    await firebaseOperations.testFirebaseOperations((log) => {
      setLogs((prevLogs) => [...prevLogs, log]);
    });
    setIsTestingFirebase(false);
  };

  const handleClearData = async () => {
    if (pin === '1520') {
      try {
        await firebaseOperations.clearAllData();
        toast({
          title: "Sucesso",
          description: "Todos os dados foram apagados com sucesso.",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao apagar os dados: " + error.message,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "PIN Incorreto",
        description: "O PIN inserido está incorreto.",
        variant: "destructive",
      });
    }
    setIsDialogOpen(false);
    setPin('');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-gray-800">Logs e Testes</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Testes do Firebase</h2>
        <Button onClick={handleTestFirebase} disabled={isTestingFirebase}>
          {isTestingFirebase ? 'Executando Testes...' : 'Executar Testes do Firebase'}
        </Button>
        {logs.length > 0 && <FirebaseTestLog logs={logs} />}
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Upload de Imagens</h2>
        <ImageUpload />
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Limpar Banco de Dados</h2>
        <Button onClick={() => setIsDialogOpen(true)} variant="destructive">
          Limpar Todos os Dados
        </Button>
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação irá apagar todos os dados do Firebase, incluindo imagens, mas não os dados de autenticação do usuário logado.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Input
              type="password"
              placeholder="Digite o PIN de 4 dígitos"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={4}
            />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleClearData}>Confirmar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default LogsPage;
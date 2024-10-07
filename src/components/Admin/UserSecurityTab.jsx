import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import firebaseOperations from '../../firebase/firebaseOperations';

const UserSecurityTab = ({ userId, userEmail }) => {
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const handlePasswordReset = async () => {
    setIsResettingPassword(true);
    try {
      await firebaseOperations.sendPasswordResetEmail(userEmail);
      toast({
        title: "Redefinição de Senha",
        description: `Instruções enviadas para ${userEmail}`,
      });
    } catch (error) {
      console.error('Erro ao enviar e-mail de redefinição de senha:', error);
      toast({
        title: "Erro",
        description: "Falha ao enviar e-mail de redefinição de senha. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Segurança da Conta</CardTitle>
        <CardDescription>Opções de segurança do usuário</CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          variant="outline" 
          onClick={handlePasswordReset} 
          disabled={isResettingPassword} 
          className="w-full"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isResettingPassword ? 'animate-spin' : ''}`} />
          {isResettingPassword ? 'Enviando...' : 'Redefinir Senha'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserSecurityTab;
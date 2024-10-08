import React from 'react';
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Mail, Trash2, Power } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import firebaseOperations from '../../firebase/firebaseOperations';

const UserActions = ({ user, isMasterAdmin, onToggleStatus, onDelete }) => {
  if (user.role === 'Master') return null;

  const handlePasswordReset = async () => {
    try {
      await firebaseOperations.sendPasswordResetEmail(user.email);
      toast({
        title: "E-mail de Redefinição Enviado",
        description: `Instruções de redefinição de senha foram enviadas para ${user.email}`,
      });
    } catch (error) {
      console.error('Erro ao enviar e-mail de redefinição de senha:', error);
      toast({
        title: "Erro",
        description: "Falha ao enviar e-mail de redefinição de senha. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex space-x-2">
      {(isMasterAdmin || (user.role !== 'Admin' && user.role !== 'Master')) && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePasswordReset}
            title="Enviar e-mail de redefinição de senha"
          >
            <Mail className="h-4 w-4" />
          </Button>
          
          {isMasterAdmin && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleStatus(user.id, user.status)}
                title={user.status === 'Active' ? 'Desativar usuário' : 'Ativar usuário'}
              >
                <Power className="h-4 w-4" />
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" title="Excluir usuário">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Isso excluirá permanentemente a conta
                      do usuário e removerá todos os dados associados de nossos servidores.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(user.id)}>
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default UserActions;
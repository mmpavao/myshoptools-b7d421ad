import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import firebaseOperations from '../../firebase/firebaseOperations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const UserActions = ({ user, isMasterAdmin, onUserUpdate }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState(user.role);
  const [isActive, setIsActive] = useState(user.status === 'Active');
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setNewRole(user.role);
    setIsActive(user.status === 'Active');
  }, [user]);

  const handleRoleChange = (value) => {
    setNewRole(value);
    setHasChanges(true);
  };

  const handleToggleUserStatus = () => {
    setIsActive(!isActive);
    setHasChanges(true);
  };

  const handlePasswordReset = async () => {
    setIsLoading(true);
    try {
      await firebaseOperations.sendPasswordResetEmail(user.email);
      toast({
        title: "Redefinição de Senha",
        description: `Instruções enviadas para ${user.email}`,
      });
    } catch (error) {
      console.error('Erro ao enviar e-mail de redefinição de senha:', error);
      toast({
        title: "Erro",
        description: "Falha ao enviar e-mail de redefinição de senha. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!hasChanges) return;

    setIsLoading(true);
    try {
      await firebaseOperations.updateUserRole(user.id, newRole);
      await firebaseOperations.updateUserStatus(user.id, isActive ? 'Active' : 'Inactive');
      
      onUserUpdate();
      setIsDialogOpen(false);
      setHasChanges(false);
      toast({
        title: "Alterações Salvas",
        description: "As configurações do usuário foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar configurações do usuário:', error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar as configurações do usuário. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (user.role === 'Master') return null;

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Perfil do Usuário</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <Tabs defaultValue="personal">
          <TabsList>
            <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>Detalhes pessoais do usuário</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div><strong>Nome:</strong> {user.name}</div>
                  <div><strong>E-mail:</strong> {user.email}</div>
                  <div><strong>Telefone:</strong> {user.phone || 'Não fornecido'}</div>
                  <div><strong>Endereço:</strong> {user.address || 'Não fornecido'}</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Usuário</CardTitle>
                <CardDescription>Gerenciar função e status do usuário</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Função do Usuário</span>
                  <Select onValueChange={handleRoleChange} value={newRole}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vendedor">Vendedor</SelectItem>
                      <SelectItem value="Fornecedor">Fornecedor</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      {isMasterAdmin && <SelectItem value="Master">Master</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <span>Status da Conta</span>
                  <Switch
                    checked={isActive}
                    onCheckedChange={handleToggleUserStatus}
                  />
                </div>
                <Button variant="outline" onClick={handlePasswordReset} disabled={isLoading} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {isLoading ? 'Enviando...' : 'Redefinir Senha'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSaveChanges} disabled={!hasChanges || isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserActions;
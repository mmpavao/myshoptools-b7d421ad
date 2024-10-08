import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import firebaseOperations from '../../firebase/firebaseOperations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserInfoTab from './UserInfoTab';
import UserSettingsTab from './UserSettingsTab';
import UserSecurityTab from './UserSecurityTab';
import { logEvent } from '../../utils/logger';

const UserActions = ({ user, isMasterAdmin, onUserUpdate }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userData, setUserData] = useState({ ...user });
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isDialogOpen) {
      fetchUserData();
    } else {
      setUserData({ ...user });
      setHasChanges(false);
      setIsSaving(false);
    }
  }, [isDialogOpen, user]);

  const fetchUserData = async () => {
    try {
      const fetchedUser = await firebaseOperations.getUserById(user.id);
      setUserData(fetchedUser);
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar dados do usuário.",
        variant: "destructive"
      });
    }
  };

  const handleChange = useCallback((field, value) => {
    setUserData(prev => {
      const newData = { ...prev, [field]: value };
      const changed = JSON.stringify(newData) !== JSON.stringify(user);
      setHasChanges(changed);
      logEvent(`Campo alterado: ${field}. Valor: ${value}. Há mudanças: ${changed}`);
      return newData;
    });
  }, [user]);

  const handleSaveChanges = async () => {
    if (!hasChanges) {
      logEvent('Tentativa de salvar sem mudanças');
      return;
    }

    setIsSaving(true);
    logEvent('Iniciando salvamento das alterações do usuário');
    
    try {
      await firebaseOperations.updateUserProfile(user.id, {
        role: userData.role,
        status: userData.status
      });
      
      const updatedUser = await firebaseOperations.getUserById(user.id);
      logEvent(`Usuário atualizado: ${JSON.stringify(updatedUser)}`);
      
      if (updatedUser.role !== userData.role || updatedUser.status !== userData.status) {
        throw new Error('As alterações não foram aplicadas corretamente');
      }
      
      onUserUpdate();
      setIsDialogOpen(false);
      toast({
        title: "Alterações Salvas",
        description: "As configurações do usuário foram atualizadas com sucesso.",
      });
      logEvent('Alterações do usuário salvas com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar configurações do usuário:', error);
      logEvent(`Erro ao salvar alterações do usuário: ${error.message}`, 'error');
      toast({
        title: "Erro",
        description: "Falha ao atualizar as configurações do usuário. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (user.role === 'Master') return null;

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" onClick={() => setIsDialogOpen(true)}>
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Perfil do Usuário</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={userData.avatar} alt={userData.name} />
            <AvatarFallback>{userData.name ? userData.name[0] : 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{userData.name || 'Nome não disponível'}</h3>
            <p className="text-sm text-gray-500">{userData.email || 'Email não disponível'}</p>
          </div>
        </div>

        <Tabs defaultValue="info">
          <TabsList>
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
          </TabsList>
          <TabsContent value="info">
            <UserInfoTab userData={userData} />
          </TabsContent>
          <TabsContent value="settings">
            <UserSettingsTab
              userData={userData}
              isMasterAdmin={isMasterAdmin}
              onChange={handleChange}
            />
          </TabsContent>
          <TabsContent value="security">
            <UserSecurityTab userId={user.id} userEmail={user.email} />
          </TabsContent>
        </Tabs>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSaveChanges} disabled={!hasChanges || isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserActions;
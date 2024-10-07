import React, { useState, useEffect, useCallback } from 'react';
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
import UserInfoTab from './UserInfoTab';
import UserSettingsTab from './UserSettingsTab';
import UserSecurityTab from './UserSecurityTab';

const UserActions = ({ user, isMasterAdmin, onUserUpdate }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userData, setUserData] = useState({ ...user });
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isDialogOpen) {
      setUserData({ ...user });
      setHasChanges(false);
      setIsSaving(false);
    }
  }, [isDialogOpen, user]);

  const handleChange = useCallback((field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  }, []);

  const handleSaveChanges = async () => {
    if (!hasChanges) return;

    setIsSaving(true);
    try {
      await firebaseOperations.updateUserRole(user.id, userData.role);
      await firebaseOperations.updateUserStatus(user.id, userData.status);
      
      onUserUpdate();
      setIsDialogOpen(false);
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
      setIsSaving(false);
      setHasChanges(false);
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Perfil do Usuário</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={userData.avatar} alt={userData.name} />
            <AvatarFallback>{userData.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{userData.name}</h3>
            <p className="text-sm text-gray-500">{userData.email}</p>
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
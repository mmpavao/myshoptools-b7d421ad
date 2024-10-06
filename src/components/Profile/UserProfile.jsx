import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateUserProfile, uploadProfileImage } from '../../firebase/firebaseOperations';
import { PersonalInfoForm } from './PersonalInfoForm';
import { NotificationPreferences } from './NotificationPreferences';
import { SecuritySettings } from './SecuritySettings';

const UserProfile = () => {
  const { user, updateUserContext } = useAuth();
  const [profileImage, setProfileImage] = useState(user?.photoURL || "/placeholder.svg");

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const downloadURL = await uploadProfileImage(file, user.uid);
        setProfileImage(downloadURL);
        updateUserContext({ photoURL: downloadURL });
        toast({
          title: "Imagem de Perfil Atualizada",
          description: "Sua foto de perfil foi atualizada com sucesso.",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar a imagem de perfil.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Perfil do Usuário</h1>
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Dados Pessoais</CardTitle>
              <CardDescription>Atualize suas informações pessoais aqui.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profileImage} alt="Profile" />
                  <AvatarFallback>
                    {user?.displayName?.[0] || user?.email?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Label htmlFor="picture" className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-500">
                    Alterar foto
                  </Label>
                  <Input id="picture" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </div>
              </div>
              <PersonalInfoForm user={user} updateUserContext={updateUserContext} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationPreferences />
        </TabsContent>
        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
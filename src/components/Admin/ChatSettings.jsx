import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { db } from '../../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';

const ChatSettings = () => {
  const [chatEnabled, setChatEnabled] = useState(true);
  const [primaryColor, setPrimaryColor] = useState('#007bff');
  const [secondaryColor, setSecondaryColor] = useState('#6c757d');

  useEffect(() => {
    const fetchChatSettings = async () => {
      const chatSettingsRef = doc(db, 'chat_settings', 'general');
      const chatSettingsSnap = await getDoc(chatSettingsRef);
      if (chatSettingsSnap.exists()) {
        const chatSettingsData = chatSettingsSnap.data();
        setChatEnabled(chatSettingsData.chatEnabled || false);
        setPrimaryColor(chatSettingsData.primaryColor || '#007bff');
        setSecondaryColor(chatSettingsData.secondaryColor || '#6c757d');
      }
    };
    fetchChatSettings();
  }, []);

  const handleSaveChanges = async () => {
    try {
      const chatSettingsRef = doc(db, 'chat_settings', 'general');
      await setDoc(chatSettingsRef, {
        chatEnabled,
        primaryColor,
        secondaryColor
      }, { merge: true });
      toast.success('Configurações do chat salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações. Por favor, tente novamente.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Chat de Suporte</CardTitle>
        <CardDescription>Personalize a aparência e o comportamento do chat de suporte.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="chat-enabled">Ativar Chat de Suporte</Label>
          <Switch
            id="chat-enabled"
            checked={chatEnabled}
            onCheckedChange={setChatEnabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="primary-color">Cor Primária</Label>
          <div className="flex space-x-2">
            <Input
              id="primary-color"
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-12 h-12 p-1"
            />
            <Input
              type="text"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="flex-grow"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="secondary-color">Cor Secundária</Label>
          <div className="flex space-x-2">
            <Input
              id="secondary-color"
              type="color"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              className="w-12 h-12 p-1"
            />
            <Input
              type="text"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              className="flex-grow"
            />
          </div>
        </div>
        <Button onClick={handleSaveChanges}>Salvar Alterações</Button>
      </CardContent>
    </Card>
  );
};

export default ChatSettings;
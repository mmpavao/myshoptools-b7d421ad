import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import firebaseOperations from '../../firebase/firebaseOperations';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    platformName: '',
    logo: null,
    favicon: null,
    banner: null,
    seoDescription: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setSettings(prev => ({ ...prev, [name]: files[0] }));
  };

  const handleSave = async () => {
    try {
      await firebaseOperations.saveSystemSettings(settings);
      toast.success("Configurações do sistema salvas com sucesso");
    } catch (error) {
      console.error("Erro ao salvar configurações do sistema:", error);
      toast.error("Falha ao salvar as configurações do sistema");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Sistema</CardTitle>
        <CardDescription>Gerencie as configurações básicas da plataforma</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="platformName">Nome da Plataforma</Label>
          <Input
            id="platformName"
            name="platformName"
            value={settings.platformName}
            onChange={handleInputChange}
            placeholder="MyShopTools"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="logo">Logo</Label>
          <Input
            id="logo"
            name="logo"
            type="file"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="favicon">Favicon</Label>
          <Input
            id="favicon"
            name="favicon"
            type="file"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="banner">Banner</Label>
          <Input
            id="banner"
            name="banner"
            type="file"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="seoDescription">Descrição SEO</Label>
          <Input
            id="seoDescription"
            name="seoDescription"
            value={settings.seoDescription}
            onChange={handleInputChange}
            placeholder="Descrição para SEO"
          />
        </div>
        <Button onClick={handleSave}>Salvar Alterações</Button>
      </CardContent>
    </Card>
  );
};

export default SystemSettings;
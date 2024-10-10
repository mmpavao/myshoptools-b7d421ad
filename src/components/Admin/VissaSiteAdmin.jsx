import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import firebaseOperations from '../../firebase/firebaseOperations';

const VissaSiteAdmin = () => {
  const [settings, setSettings] = useState({
    title: '',
    subtitle: '',
    description: '',
    logoUrl: '',
    bannerUrl: '',
    contactEmail: '',
    contactPhone: '',
  });

  useEffect(() => {
    fetchVissaSiteSettings();
  }, []);

  const fetchVissaSiteSettings = async () => {
    try {
      const vissaSiteSettings = await firebaseOperations.getVissaSiteSettings();
      if (vissaSiteSettings) {
        setSettings(vissaSiteSettings);
      }
    } catch (error) {
      console.error("Erro ao buscar configurações do site Vissa:", error);
      toast.error("Falha ao carregar as configurações do site Vissa");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      try {
        const uploadedUrl = await firebaseOperations.uploadFile(files[0], `vissa-site/${name}`);
        setSettings(prev => ({ ...prev, [name]: uploadedUrl }));
        toast.success(`${name === 'logoUrl' ? 'Logo' : 'Banner'} atualizado com sucesso`);
      } catch (error) {
        console.error(`Erro ao fazer upload do ${name === 'logoUrl' ? 'logo' : 'banner'}:`, error);
        toast.error(`Falha ao atualizar o ${name === 'logoUrl' ? 'logo' : 'banner'}`);
      }
    }
  };

  const handleSave = async () => {
    try {
      await firebaseOperations.saveVissaSiteSettings(settings);
      toast.success("Configurações do site Vissa salvas com sucesso");
    } catch (error) {
      console.error("Erro ao salvar configurações do site Vissa:", error);
      toast.error("Falha ao salvar as configurações do site Vissa");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Site Vissa</CardTitle>
        <CardDescription>Gerencie as configurações do site Vissa Global Trade</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título Principal</Label>
          <Input id="title" name="title" value={settings.title} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtítulo</Label>
          <Input id="subtitle" name="subtitle" value={settings.subtitle} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea id="description" name="description" value={settings.description} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="logoUrl">Logo</Label>
          <Input id="logoUrl" name="logoUrl" type="file" onChange={handleFileChange} accept="image/*" />
          {settings.logoUrl && (
            <img src={settings.logoUrl} alt="Logo atual" className="mt-2 max-w-xs rounded" />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="bannerUrl">Banner</Label>
          <Input id="bannerUrl" name="bannerUrl" type="file" onChange={handleFileChange} accept="image/*" />
          {settings.bannerUrl && (
            <img src={settings.bannerUrl} alt="Banner atual" className="mt-2 max-w-xs rounded" />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Email de Contato</Label>
          <Input id="contactEmail" name="contactEmail" value={settings.contactEmail} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactPhone">Telefone de Contato</Label>
          <Input id="contactPhone" name="contactPhone" value={settings.contactPhone} onChange={handleInputChange} />
        </div>
        <Button onClick={handleSave}>Salvar Alterações</Button>
      </CardContent>
    </Card>
  );
};

export default VissaSiteAdmin;
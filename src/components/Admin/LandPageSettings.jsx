import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import firebaseOperations from '../../firebase/firebaseOperations';

const LandPageSettings = () => {
  const [settings, setSettings] = useState({
    title: '',
    subtitle: '',
    ctaText: '',
    bannerUrl: '',
    contactEmail: '',
    contactPhone: '',
    footerText: '',
  });

  useEffect(() => {
    fetchLandPageSettings();
  }, []);

  const fetchLandPageSettings = async () => {
    try {
      const landPageSettings = await firebaseOperations.getLandPageSettings();
      if (landPageSettings) {
        setSettings(landPageSettings);
      }
    } catch (error) {
      console.error("Erro ao buscar configurações da LandPage:", error);
      toast.error("Falha ao carregar as configurações da LandPage");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await firebaseOperations.saveLandPageSettings(settings);
      toast.success("Configurações da LandPage salvas com sucesso");
    } catch (error) {
      console.error("Erro ao salvar configurações da LandPage:", error);
      toast.error("Falha ao salvar as configurações da LandPage");
    }
  };

  const handleBannerUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        console.log("Iniciando upload do banner...");
        const uploadedUrl = await firebaseOperations.uploadBannerImage(file);
        console.log("Banner uploaded successfully. URL:", uploadedUrl);
        setSettings(prev => ({ ...prev, bannerUrl: uploadedUrl }));
        toast.success("Banner atualizado com sucesso");
      } catch (error) {
        console.error("Erro detalhado ao fazer upload do banner:", error);
        toast.error(`Falha ao atualizar o banner: ${error.message}`);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações da LandPage</CardTitle>
        <CardDescription>Personalize a página inicial do seu site</CardDescription>
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
          <Label htmlFor="ctaText">Texto do Botão CTA</Label>
          <Input id="ctaText" name="ctaText" value={settings.ctaText} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bannerUpload">Banner</Label>
          <Input id="bannerUpload" type="file" accept="image/*" onChange={handleBannerUpload} />
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
        <div className="space-y-2">
          <Label htmlFor="footerText">Texto do Rodapé</Label>
          <Textarea id="footerText" name="footerText" value={settings.footerText} onChange={handleInputChange} />
        </div>
        <Button onClick={handleSave}>Salvar e Publicar</Button>
      </CardContent>
    </Card>
  );
};

export default LandPageSettings;
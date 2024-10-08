import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
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
    activeVendors: '',
    countriesServed: '',
    competitivePricing: '',
    readyToSellStore: '',
    inventoryManagement: '',
    secureTransactions: '',
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
      toast({
        title: "Erro",
        description: "Falha ao carregar as configurações da LandPage",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await firebaseOperations.saveLandPageSettings(settings);
      toast({
        title: "Sucesso",
        description: "Configurações da LandPage salvas com sucesso",
      });
    } catch (error) {
      console.error("Erro ao salvar configurações da LandPage:", error);
      toast({
        title: "Erro",
        description: "Falha ao salvar as configurações da LandPage",
        variant: "destructive",
      });
    }
  };

  const handleBannerUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const uploadedUrl = await firebaseOperations.uploadBannerImage(file);
        setSettings(prev => ({ ...prev, bannerUrl: uploadedUrl }));
        toast({
          title: "Sucesso",
          description: "Banner atualizado com sucesso",
        });
      } catch (error) {
        console.error("Erro ao fazer upload do banner:", error);
        toast({
          title: "Erro",
          description: "Falha ao atualizar o banner",
          variant: "destructive",
        });
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
          <Label htmlFor="activeVendors">Número de Vendedores Ativos</Label>
          <Input id="activeVendors" name="activeVendors" value={settings.activeVendors} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="countriesServed">Número de Países Atendidos</Label>
          <Input id="countriesServed" name="countriesServed" value={settings.countriesServed} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="competitivePricing">Preços Competitivos (Descrição)</Label>
          <Textarea id="competitivePricing" name="competitivePricing" value={settings.competitivePricing} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="readyToSellStore">Loja Pronta para Vender (Descrição)</Label>
          <Textarea id="readyToSellStore" name="readyToSellStore" value={settings.readyToSellStore} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inventoryManagement">Gestão de Estoque (Descrição)</Label>
          <Textarea id="inventoryManagement" name="inventoryManagement" value={settings.inventoryManagement} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="secureTransactions">Transações Seguras (Descrição)</Label>
          <Textarea id="secureTransactions" name="secureTransactions" value={settings.secureTransactions} onChange={handleInputChange} />
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
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, X } from 'lucide-react';
import firebaseOperations from '../../firebase/firebaseOperations';

const ImageUploadField = ({ label, name, value, onChange, description, onRemove }) => (
  <div className="space-y-2 relative">
    <Label htmlFor={name}>{label}</Label>
    <Input id={name} name={name} type="file" onChange={onChange} accept="image/*" />
    {value && (
      <img src={value} alt={`Current ${label}`} className="mt-2 max-w-xs rounded" />
    )}
    <p className="text-sm text-gray-500">{description}</p>
    {onRemove && (
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute top-0 right-0"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    )}
  </div>
);

const VissaSiteAdmin = () => {
  const [settings, setSettings] = useState({
    title: '',
    subtitle: '',
    description: '',
    logoUrl: '',
    bannerUrl: '',
    contactEmail: '',
    contactPhone: '',
    partnerLogos: {},
    banners: {},
    mapIcons: {},
    officeImages: {},
  });
  const [newPartnerName, setNewPartnerName] = useState('');

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

  const handleFileChange = async (e, category) => {
    const { name, files } = e.target;
    if (files[0]) {
      try {
        const uploadedUrl = await firebaseOperations.uploadFile(files[0], `vissa-site/${category}/${name}`);
        setSettings(prev => ({
          ...prev,
          [category]: { ...prev[category], [name]: uploadedUrl }
        }));
        toast.success(`${name} atualizado com sucesso`);
      } catch (error) {
        console.error(`Erro ao fazer upload do ${name}:`, error);
        toast.error(`Falha ao atualizar o ${name}`);
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

  const handleAddPartner = async () => {
    if (newPartnerName.trim() === '') {
      toast.error("Por favor, insira um nome para o novo parceiro");
      return;
    }
    setSettings(prev => ({
      ...prev,
      partnerLogos: { ...prev.partnerLogos, [newPartnerName]: '' }
    }));
    setNewPartnerName('');
  };

  const handleRemovePartner = (partnerName) => {
    setSettings(prev => {
      const newPartnerLogos = { ...prev.partnerLogos };
      delete newPartnerLogos[partnerName];
      return { ...prev, partnerLogos: newPartnerLogos };
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Site Vissa</CardTitle>
        <CardDescription>Gerencie as configurações do site Vissa Global Trade</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="partners">Parceiros</TabsTrigger>
            <TabsTrigger value="banners">Banners</TabsTrigger>
            <TabsTrigger value="map">Mapa Interativo</TabsTrigger>
            <TabsTrigger value="offices">Escritórios</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
          <TabsContent value="general" className="space-y-4">
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
            <ImageUploadField
              label="Logo"
              name="logoUrl"
              value={settings.logoUrl}
              onChange={(e) => handleFileChange(e, 'logoUrl')}
              description="Tamanho recomendado: 200x100 pixels. Formato: PNG ou JPG. Fundo transparente recomendado."
            />
            <ImageUploadField
              label="Banner Principal"
              name="bannerUrl"
              value={settings.bannerUrl}
              onChange={(e) => handleFileChange(e, 'bannerUrl')}
              description="Tamanho recomendado: 1920x600 pixels. Formato: PNG ou JPG. Resolução mínima: 72 DPI."
            />
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email de Contato</Label>
              <Input id="contactEmail" name="contactEmail" value={settings.contactEmail} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Telefone de Contato</Label>
              <Input id="contactPhone" name="contactPhone" value={settings.contactPhone} onChange={handleInputChange} />
            </div>
          </TabsContent>
          </TabsContent>

          <TabsContent value="partners" className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Input
                placeholder="Nome do novo parceiro"
                value={newPartnerName}
                onChange={(e) => setNewPartnerName(e.target.value)}
              />
              <Button onClick={handleAddPartner}>
                <Plus className="h-4 w-4 mr-2" /> Adicionar Parceiro
              </Button>
            </div>
            {Object.entries(settings.partnerLogos).map(([name, url]) => (
              <ImageUploadField
                key={name}
                label={`Logo ${name}`}
                name={name}
                value={url}
                onChange={(e) => handleFileChange(e, 'partnerLogos')}
                description="Tamanho recomendado: 200x100 pixels. Formato: PNG ou JPG. Fundo transparente recomendado."
                onRemove={() => handleRemovePartner(name)}
              />
            ))}
          </TabsContent>

          <TabsContent value="banners" className="space-y-4">
            <ImageUploadField
              label="Banner Sobre a Vissa"
              name="about"
              value={settings.banners?.about}
              onChange={(e) => handleFileChange(e, 'banners')}
              description="Tamanho recomendado: 1920x600 pixels. Formato: PNG ou JPG. Resolução mínima: 72 DPI."
            />
            <ImageUploadField
              label="Banner Logística"
              name="logistics"
              value={settings.banners?.logistics}
              onChange={(e) => handleFileChange(e, 'banners')}
              description="Tamanho recomendado: 1920x600 pixels. Formato: PNG ou JPG. Resolução mínima: 72 DPI."
            />
          </TabsContent>

          <TabsContent value="map" className="space-y-4">
            <ImageUploadField
              label="Ícone Brasil"
              name="brazil"
              value={settings.mapIcons?.brazil}
              onChange={(e) => handleFileChange(e, 'mapIcons')}
              description="Tamanho recomendado: 50x50 pixels. Formato: PNG com fundo transparente."
            />
            <ImageUploadField
              label="Ícone China"
              name="china"
              value={settings.mapIcons?.china}
              onChange={(e) => handleFileChange(e, 'mapIcons')}
              description="Tamanho recomendado: 50x50 pixels. Formato: PNG com fundo transparente."
            />
            <ImageUploadField
              label="Ícone EUA"
              name="usa"
              value={settings.mapIcons?.usa}
              onChange={(e) => handleFileChange(e, 'mapIcons')}
              description="Tamanho recomendado: 50x50 pixels. Formato: PNG com fundo transparente."
            />
          </TabsContent>

          <TabsContent value="offices" className="space-y-4">
            <ImageUploadField
              label="Escritório São Paulo"
              name="saopaulo"
              value={settings.officeImages?.saopaulo}
              onChange={(e) => handleFileChange(e, 'officeImages')}
              description="Tamanho recomendado: 800x600 pixels. Formato: PNG ou JPG."
            />
            <ImageUploadField
              label="Centro de Distribuição China"
              name="china"
              value={settings.officeImages?.china}
              onChange={(e) => handleFileChange(e, 'officeImages')}
              description="Tamanho recomendado: 800x600 pixels. Formato: PNG ou JPG."
            />
          </TabsContent>
        </Tabs>
        </Tabs>

        <Button onClick={handleSave} className="mt-6">Salvar Alterações</Button>
      </CardContent>
    </Card>
  );
};

export default VissaSiteAdmin;

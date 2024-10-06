import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const OpenAIIntegration = () => {
  const [apiKey, setApiKey] = useState('');
  const [bots, setBots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Aqui você pode adicionar lógica para carregar a chave da API e os bots existentes
    // Por exemplo, fetchApiKey() e fetchBots()
  }, []);

  const handleSaveApiKey = async () => {
    setIsLoading(true);
    try {
      // Aqui você deve implementar a lógica para salvar e testar a chave da API
      // Por exemplo:
      // await saveApiKey(apiKey);
      // await testApiKey(apiKey);
      toast.success('Chave da API salva e testada com sucesso');
      // Atualizar a lista de bots após salvar a chave
      // fetchBots();
    } catch (error) {
      console.error('Erro ao salvar ou testar chave da API:', error);
      toast.error('Falha ao salvar ou testar chave da API');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBot = () => {
    // Implementar lógica para criar um novo bot
    console.log('Criar novo bot');
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Configuração da OpenAI API</DialogTitle>
        <DialogDescription>
          Configure sua chave de API da OpenAI e gerencie seus bots
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <Card>
          <CardHeader>
            <CardTitle>Configuração da Chave de API</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="apiKey" className="text-right">
                Chave da API
              </Label>
              <Input
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="col-span-3"
                type="password"
              />
            </div>
            <Button onClick={handleSaveApiKey} disabled={isLoading} className="mt-4">
              {isLoading ? 'Salvando...' : 'Salvar e Testar Chave'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Criar Novo Bot</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleCreateBot}>Criar Novo Bot</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bots Existentes</CardTitle>
          </CardHeader>
          <CardContent>
            {bots.length > 0 ? (
              bots.map((bot, index) => (
                <div key={index} className="mb-4 p-4 border rounded">
                  <h3 className="text-lg font-semibold">{bot.name}</h3>
                  <p>Criado em: {bot.createdAt}</p>
                  <p>Última edição: {bot.lastEdited || 'Data não disponível'}</p>
                  <p>Modelo: {bot.model}</p>
                  <Button className="mt-2">Editar</Button>
                </div>
              ))
            ) : (
              <p>Nenhum bot criado ainda.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default OpenAIIntegration;
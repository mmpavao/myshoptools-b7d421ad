import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogHeader, DialogTitle, DialogDescription, Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const OpenAIIntegration = () => {
  const [apiKey, setApiKey] = useState('');
  const [bots, setBots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateBotDialogOpen, setIsCreateBotDialogOpen] = useState(false);
  const [newBot, setNewBot] = useState({
    name: '',
    instructions: '',
    model: 'gpt-3.5-turbo',
    temperature: 1,
  });

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

  const handleCreateBot = async () => {
    try {
      // Implementar lógica para criar um novo bot usando a API da OpenAI
      // Por exemplo:
      // const createdBot = await createOpenAIBot(newBot);
      // setBots([...bots, createdBot]);
      toast.success('Bot criado com sucesso!');
      setIsCreateBotDialogOpen(false);
    } catch (error) {
      console.error('Erro ao criar bot:', error);
      toast.error('Falha ao criar bot');
    }
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
            <Dialog open={isCreateBotDialogOpen} onOpenChange={setIsCreateBotDialogOpen}>
              <DialogTrigger asChild>
                <Button>Criar Novo Bot</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Criar Novo Bot</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="botName" className="text-right">
                      Nome do Bot
                    </Label>
                    <Input
                      id="botName"
                      value={newBot.name}
                      onChange={(e) => setNewBot({...newBot, name: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="instructions" className="text-right">
                      Instruções do Sistema
                    </Label>
                    <Textarea
                      id="instructions"
                      value={newBot.instructions}
                      onChange={(e) => setNewBot({...newBot, instructions: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="model" className="text-right">
                      Modelo
                    </Label>
                    <Select
                      value={newBot.model}
                      onValueChange={(value) => setNewBot({...newBot, model: value})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione o modelo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Temperatura: {newBot.temperature}</Label>
                    <Slider
                      value={[newBot.temperature]}
                      onValueChange={(value) => setNewBot({...newBot, temperature: value[0]})}
                      max={1}
                      step={0.1}
                      className="col-span-3"
                    />
                  </div>
                  <div className="col-span-4">
                    <Label>Adicionar Documentos à Base de Conhecimento</Label>
                    <Input type="file" multiple className="mt-2" />
                    <p className="text-sm text-gray-500 mt-1">
                      Formatos permitidos: .txt, .pdf, .doc, .docx, .csv
                    </p>
                  </div>
                </div>
                <Button onClick={handleCreateBot}>Criar Bot</Button>
              </DialogContent>
            </Dialog>
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
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const OpenAIIntegration = () => {
  const [apiKey, setApiKey] = useState('');
  const [bots, setBots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentBot, setCurrentBot] = useState({
    name: '',
    instructions: '',
    model: 'gpt-3.5-turbo',
    temperature: 1,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch API key and bots
    // fetchApiKey();
    // fetchBots();
  }, []);

  const handleSaveApiKey = async () => {
    setIsLoading(true);
    try {
      // Implement API key saving and testing logic
      toast.success('Chave da API salva e testada com sucesso');
    } catch (error) {
      console.error('Erro ao salvar ou testar chave da API:', error);
      toast.error('Falha ao salvar ou testar chave da API');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (bot = null) => {
    if (bot) {
      setCurrentBot(bot);
      setIsEditing(true);
    } else {
      setCurrentBot({
        name: '',
        instructions: '',
        model: 'gpt-3.5-turbo',
        temperature: 1,
      });
      setIsEditing(false);
    }
    setIsDialogOpen(true);
  };

  const handleSaveBot = async () => {
    try {
      if (isEditing) {
        // Update existing bot
        // await updateBot(currentBot);
      } else {
        // Create new bot
        // await createBot(currentBot);
      }
      toast.success(isEditing ? 'Bot atualizado com sucesso!' : 'Bot criado com sucesso!');
      setIsDialogOpen(false);
      // Refresh bots list
      // fetchBots();
    } catch (error) {
      console.error('Erro ao salvar bot:', error);
      toast.error('Falha ao salvar bot');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Integração OpenAI</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Configuração da Chave de API</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              type="password"
              placeholder="Insira sua chave de API OpenAI"
              className="flex-grow"
            />
            <Button onClick={handleSaveApiKey} disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar e Testar'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Seus Bots</CardTitle>
            <Button onClick={() => handleOpenDialog()}>Criar Novo Bot</Button>
          </div>
        </CardHeader>
        <CardContent>
          {bots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bots.map((bot) => (
                <Card key={bot.id} className="p-4">
                  <h3 className="text-lg font-semibold">{bot.name}</h3>
                  <p className="text-sm text-gray-500">Modelo: {bot.model}</p>
                  <Button onClick={() => handleOpenDialog(bot)} className="mt-2">Editar</Button>
                </Card>
              ))}
            </div>
          ) : (
            <p>Nenhum bot criado ainda.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Bot' : 'Criar Novo Bot'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="botName" className="text-right">Nome do Bot</Label>
              <Input
                id="botName"
                value={currentBot.name}
                onChange={(e) => setCurrentBot({...currentBot, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="instructions" className="text-right">Instruções</Label>
              <Textarea
                id="instructions"
                value={currentBot.instructions}
                onChange={(e) => setCurrentBot({...currentBot, instructions: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model" className="text-right">Modelo</Label>
              <Select
                value={currentBot.model}
                onValueChange={(value) => setCurrentBot({...currentBot, model: value})}
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
              <Label className="text-right">Temperatura: {currentBot.temperature}</Label>
              <Slider
                value={[currentBot.temperature]}
                onValueChange={(value) => setCurrentBot({...currentBot, temperature: value[0]})}
                max={1}
                step={0.1}
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleSaveBot}>{isEditing ? 'Atualizar' : 'Criar'} Bot</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OpenAIIntegration;
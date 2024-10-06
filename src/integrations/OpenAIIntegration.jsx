import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { createBot, updateBot, deleteBot, getBots, testOpenAIConnection } from './openAIOperations';
import BotList from './components/BotList';
import BotDialog from './components/BotDialog';
import ImageAnalysisGeneration from './components/ImageAnalysisGeneration';
import AudioTranscriptionSpeech from './components/AudioTranscriptionSpeech';

const OpenAIIntegration = () => {
  const [bots, setBots] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentBot, setCurrentBot] = useState({
    name: '',
    instructions: '',
    model: 'gpt-3.5-turbo',
    temperature: 1,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('Not connected');

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
  };

  const testConnection = async () => {
    try {
      setConnectionStatus('Testing...');
      const isConnected = await testOpenAIConnection(apiKey);
      if (isConnected) {
        setConnectionStatus('Connected');
        toast.success('Successfully connected to OpenAI');
        await fetchBots();
      } else {
        setConnectionStatus('Connection failed');
        toast.error('Failed to connect to OpenAI');
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      setConnectionStatus('Connection error');
      toast.error('Error testing connection to OpenAI');
    }
  };

  const fetchBots = async () => {
    if (!apiKey) {
      console.log('API key is not set. Skipping bot fetch.');
      return;
    }
    try {
      const fetchedBots = await getBots(apiKey);
      setBots(fetchedBots);
    } catch (error) {
      console.error('Error fetching bots:', error);
      toast.error('Failed to fetch bots');
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

  const handleSaveBot = async (botData) => {
    if (!apiKey) {
      toast.error('Please set and test your API key first');
      return;
    }
    try {
      if (isEditing) {
        await updateBot(apiKey, botData.id, botData);
      } else {
        await createBot(apiKey, botData);
      }
      toast.success(isEditing ? 'Bot updated successfully!' : 'Bot created successfully!');
      setIsDialogOpen(false);
      await fetchBots();
    } catch (error) {
      console.error('Error saving bot:', error);
      toast.error('Failed to save bot');
    }
  };

  const handleDeleteBot = async (botId, assistantId) => {
    if (!apiKey) {
      toast.error('Please set and test your API key first');
      return;
    }
    try {
      await deleteBot(apiKey, botId, assistantId);
      toast.success('Bot deleted successfully');
      await fetchBots();
    } catch (error) {
      console.error('Error deleting bot:', error);
      toast.error('Failed to delete bot');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">OpenAI Integration</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>OpenAI API Key</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Input
              type="password"
              value={apiKey}
              onChange={handleApiKeyChange}
              placeholder="Enter your OpenAI API Key"
            />
            <Button onClick={testConnection}>Test Connection</Button>
          </div>
          <p className={`mt-2 ${connectionStatus === 'Connected' ? 'text-green-500 font-semibold' : ''}`}>
            Connection status: {connectionStatus}
          </p>
        </CardContent>
      </Card>

      <BotList
        bots={bots}
        onEdit={handleOpenDialog}
        onDelete={handleDeleteBot}
      />

      <BotDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        currentBot={currentBot}
        isEditing={isEditing}
        onSave={handleSaveBot}
      />

      <ImageAnalysisGeneration apiKey={apiKey} />

      <AudioTranscriptionSpeech apiKey={apiKey} />
    </div>
  );
};

export default OpenAIIntegration;
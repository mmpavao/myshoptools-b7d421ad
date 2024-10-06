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
import IntegrationLogs from './components/IntegrationLogs';

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
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openaiApiKey') || '');
  const [connectionStatus, setConnectionStatus] = useState('Not connected');
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (apiKey) {
      testConnection();
    }
  }, [apiKey]);

  const addLog = (message, type = 'info') => {
    setLogs(prevLogs => [...prevLogs, { message, type, timestamp: new Date() }]);
  };

  const handleApiKeyChange = (e) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);
    localStorage.setItem('openaiApiKey', newApiKey);
  };

  const testConnection = async () => {
    try {
      setConnectionStatus('Testing...');
      addLog('Testing OpenAI connection...');
      const isConnected = await testOpenAIConnection(apiKey);
      if (isConnected) {
        setConnectionStatus('Connected');
        addLog('Successfully connected to OpenAI', 'success');
        toast.success('Successfully connected to OpenAI');
        await fetchBots();
      } else {
        setConnectionStatus('Connection failed');
        addLog('Failed to connect to OpenAI', 'error');
        toast.error('Failed to connect to OpenAI');
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      setConnectionStatus('Connection error');
      addLog(`Error testing connection: ${error.message}`, 'error');
      toast.error('Error testing connection to OpenAI');
    }
  };

  const fetchBots = async () => {
    if (!apiKey) {
      addLog('API key is not set. Skipping bot fetch.', 'warning');
      return;
    }
    try {
      addLog('Fetching bots...');
      const fetchedBots = await getBots(apiKey);
      addLog(`Successfully fetched ${fetchedBots.length} bots`, 'success');
      setBots(fetchedBots);
      toast.success(`Successfully fetched ${fetchedBots.length} bots`);
    } catch (error) {
      console.error('Error fetching bots:', error);
      addLog(`Failed to fetch bots: ${error.message}`, 'error');
      toast.error('Failed to fetch bots: ' + error.message);
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
      addLog('API key is not set. Cannot save bot.', 'error');
      toast.error('Please set and test your API key first');
      return;
    }
    try {
      addLog(`${isEditing ? 'Updating' : 'Creating'} bot: ${botData.name}`);
      if (isEditing) {
        await updateBot(apiKey, botData.id, botData);
      } else {
        await createBot(apiKey, botData);
      }
      addLog(`Bot ${isEditing ? 'updated' : 'created'} successfully`, 'success');
      toast.success(isEditing ? 'Bot updated successfully!' : 'Bot created successfully!');
      setIsDialogOpen(false);
      await fetchBots();
    } catch (error) {
      console.error('Error saving bot:', error);
      addLog(`Failed to save bot: ${error.message}`, 'error');
      toast.error('Failed to save bot');
    }
  };

  const handleDeleteBot = async (botId, assistantId) => {
    if (!apiKey) {
      addLog('API key is not set. Cannot delete bot.', 'error');
      toast.error('Please set and test your API key first');
      return;
    }
    try {
      addLog(`Deleting bot: ${botId}`);
      await deleteBot(apiKey, botId, assistantId);
      addLog('Bot deleted successfully', 'success');
      toast.success('Bot deleted successfully');
      await fetchBots();
    } catch (error) {
      console.error('Error deleting bot:', error);
      addLog(`Failed to delete bot: ${error.message}`, 'error');
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

      <IntegrationLogs logs={logs} />
    </div>
  );
};

export default OpenAIIntegration;
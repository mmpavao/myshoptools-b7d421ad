import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { createBot, updateBot, deleteBot, getBots, testOpenAIConnection } from '../openAIOperations';

export const useOpenAIIntegration = () => {
  const [bots, setBots] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isChatDialogOpen, setIsChatDialogOpen] = useState(false);
  const [currentBot, setCurrentBot] = useState({ name: '', instructions: '', model: 'gpt-3.5-turbo', temperature: 1 });
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

  const handleApiKeyChange = (newApiKey) => {
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
        toast.error('Failed to connect to OpenAI. Please check your API key and try again.');
      }
    } catch (error) {
      setConnectionStatus('Connection error');
      addLog(`Error testing connection: ${error.message}`, 'error');
      toast.error(`Error connecting to OpenAI: ${error.message}`);
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
      addLog(`Failed to fetch bots: ${error.message}`, 'error');
      toast.error(`Failed to fetch bots: ${error.message}`);
    }
  };

  const handleOpenDialog = (bot = null) => {
    setCurrentBot(bot || { name: '', instructions: '', model: 'gpt-3.5-turbo', temperature: 1 });
    setIsEditing(!!bot);
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
      let savedBot;
      if (isEditing) {
        if (!botData.id) {
          throw new Error('Bot ID is missing for update operation');
        }
        savedBot = await updateBot(apiKey, botData.id, botData);
      } else {
        savedBot = await createBot(apiKey, botData);
      }
      if (!savedBot) {
        throw new Error('Failed to save bot: No response from server');
      }
      addLog(`Bot ${isEditing ? 'updated' : 'created'} successfully`, 'success');
      toast.success(isEditing ? 'Bot updated successfully!' : 'Bot created successfully!');
      setIsDialogOpen(false);
      await fetchBots();
    } catch (error) {
      addLog(`Failed to save bot: ${error.message}`, 'error');
      toast.error(`Failed to save bot: ${error.message}`);
    }
  };

  const handleDeleteBot = async (botId, assistantId) => {
    try {
      addLog(`Deleting bot: ${botId}`);
      await deleteBot(apiKey, botId, assistantId);
      addLog('Bot deleted successfully', 'success');
      toast.success('Bot deleted successfully!');
      await fetchBots();
    } catch (error) {
      addLog(`Failed to delete bot: ${error.message}`, 'error');
      toast.error(`Failed to delete bot: ${error.message}`);
    }
  };

  const handleChatWithBot = (bot) => {
    setCurrentBot(bot);
    setIsChatDialogOpen(true);
  };

  return {
    bots,
    isDialogOpen,
    isChatDialogOpen,
    currentBot,
    isEditing,
    apiKey,
    connectionStatus,
    logs,
    handleApiKeyChange,
    testConnection,
    handleOpenDialog,
    handleSaveBot,
    handleDeleteBot,
    handleChatWithBot,
    setIsDialogOpen,
    setIsChatDialogOpen,
  };
};
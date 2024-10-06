import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createBot, updateBot, deleteBot, getBots, addKnowledgeBase, analyzeImage, generateImage, transcribeAudio, textToSpeech } from './openAIOperations';
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

  useEffect(() => {
    fetchBots();
  }, []);

  const fetchBots = async () => {
    try {
      const fetchedBots = await getBots();
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
    try {
      if (isEditing) {
        await updateBot(botData.id, botData);
      } else {
        await createBot(botData);
      }
      toast.success(isEditing ? 'Bot updated successfully!' : 'Bot created successfully!');
      setIsDialogOpen(false);
      fetchBots();
    } catch (error) {
      console.error('Error saving bot:', error);
      toast.error('Failed to save bot');
    }
  };

  const handleDeleteBot = async (botId, assistantId) => {
    try {
      await deleteBot(botId, assistantId);
      toast.success('Bot deleted successfully');
      fetchBots();
    } catch (error) {
      console.error('Error deleting bot:', error);
      toast.error('Failed to delete bot');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">OpenAI Integration</h1>

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

      <ImageAnalysisGeneration />

      <AudioTranscriptionSpeech />
    </div>
  );
};

export default OpenAIIntegration;
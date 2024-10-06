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
import { initializeOpenAI, createBot, updateBot, deleteBot, getBots, addKnowledgeBase, analyzeImage, generateImage, transcribeAudio, textToSpeech } from './openAIOperations';

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
  const [file, setFile] = useState(null);
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');

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

  const handleSaveApiKey = async () => {
    setIsLoading(true);
    try {
      initializeOpenAI(apiKey);
      toast.success('API key saved and tested successfully');
      fetchBots();
    } catch (error) {
      console.error('Error saving or testing API key:', error);
      toast.error('Failed to save or test API key');
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
        await updateBot(currentBot.id, currentBot);
      } else {
        await createBot(currentBot);
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

  const handleAddKnowledgeBase = async (botId, file) => {
    try {
      await addKnowledgeBase(botId, file);
      toast.success('Knowledge base added successfully');
    } catch (error) {
      console.error('Error adding knowledge base:', error);
      toast.error('Failed to add knowledge base');
    }
  };

  const handleAnalyzeImage = async () => {
    if (!file) {
      toast.error('Please select an image to analyze');
      return;
    }
    try {
      const result = await analyzeImage(file);
      toast.success('Image analyzed successfully');
      console.log('Analysis result:', result);
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error('Failed to analyze image');
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt) {
      toast.error('Please enter a prompt for image generation');
      return;
    }
    try {
      const imageUrl = await generateImage(imagePrompt);
      setGeneratedImageUrl(imageUrl);
      toast.success('Image generated successfully');
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image');
    }
  };

  const handleTranscribeAudio = async () => {
    if (!file) {
      toast.error('Please select an audio file to transcribe');
      return;
    }
    try {
      const transcript = await transcribeAudio(file);
      console.log('Transcription:', transcript);
      toast.success('Audio transcribed successfully');
    } catch (error) {
      console.error('Error transcribing audio:', error);
      toast.error('Failed to transcribe audio');
    }
  };

  const handleTextToSpeech = async (text) => {
    try {
      const audioBuffer = await textToSpeech(text);
      const audioUrl = URL.createObjectURL(new Blob([audioBuffer], { type: 'audio/mp3' }));
      const audio = new Audio(audioUrl);
      audio.play();
      toast.success('Text converted to speech successfully');
    } catch (error) {
      console.error('Error converting text to speech:', error);
      toast.error('Failed to convert text to speech');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">OpenAI Integration</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>API Key Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              type="password"
              placeholder="Enter your OpenAI API key"
              className="flex-grow"
            />
            <Button onClick={handleSaveApiKey} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save and Test'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Your Bots</CardTitle>
            <Button onClick={() => handleOpenDialog()}>Create New Bot</Button>
          </div>
        </CardHeader>
        <CardContent>
          {bots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bots.map((bot) => (
                <Card key={bot.id} className="p-4">
                  <h3 className="text-lg font-semibold">{bot.name}</h3>
                  <p className="text-sm text-gray-500">Model: {bot.model}</p>
                  <div className="mt-2 space-x-2">
                    <Button onClick={() => handleOpenDialog(bot)}>Edit</Button>
                    <Button variant="destructive" onClick={() => handleDeleteBot(bot.id, bot.assistantId)}>Delete</Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p>No bots created yet.</p>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Image Analysis and Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="imageUpload">Upload Image for Analysis</Label>
              <Input id="imageUpload" type="file" onChange={(e) => setFile(e.target.files[0])} />
              <Button onClick={handleAnalyzeImage} className="mt-2">Analyze Image</Button>
            </div>
            <div>
              <Label htmlFor="imagePrompt">Image Generation Prompt</Label>
              <Input
                id="imagePrompt"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Enter a prompt for image generation"
              />
              <Button onClick={handleGenerateImage} className="mt-2">Generate Image</Button>
            </div>
            {generatedImageUrl && (
              <img src={generatedImageUrl} alt="Generated" className="mt-4 max-w-full h-auto" />
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Audio Transcription and Text-to-Speech</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="audioUpload">Upload Audio for Transcription</Label>
              <Input id="audioUpload" type="file" onChange={(e) => setFile(e.target.files[0])} />
              <Button onClick={handleTranscribeAudio} className="mt-2">Transcribe Audio</Button>
            </div>
            <div>
              <Label htmlFor="textToSpeech">Text-to-Speech</Label>
              <Textarea
                id="textToSpeech"
                placeholder="Enter text to convert to speech"
              />
              <Button onClick={() => handleTextToSpeech(document.getElementById('textToSpeech').value)} className="mt-2">
                Convert to Speech
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Bot' : 'Create New Bot'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="botName" className="text-right">Bot Name</Label>
              <Input
                id="botName"
                value={currentBot.name}
                onChange={(e) => setCurrentBot({...currentBot, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="instructions" className="text-right">Instructions</Label>
              <Textarea
                id="instructions"
                value={currentBot.instructions}
                onChange={(e) => setCurrentBot({...currentBot, instructions: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model" className="text-right">Model</Label>
              <Select
                value={currentBot.model}
                onValueChange={(value) => setCurrentBot({...currentBot, model: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Temperature: {currentBot.temperature}</Label>
              <Slider
                value={[currentBot.temperature]}
                onValueChange={(value) => setCurrentBot({...currentBot, temperature: value[0]})}
                max={1}
                step={0.1}
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleSaveBot}>{isEditing ? 'Update' : 'Create'} Bot</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OpenAIIntegration;
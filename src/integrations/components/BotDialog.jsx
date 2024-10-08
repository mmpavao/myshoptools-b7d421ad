import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getBotDetails } from '../openAIOperations';
import { toast } from "sonner";

const voices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];

const BotDialog = ({ isOpen, onOpenChange, currentBot, isEditing, onSave, onDelete, apiKey }) => {
  const [botData, setBotData] = useState({ ...currentBot, isActive: currentBot.isActive || false });
  const [avatarPreview, setAvatarPreview] = useState(currentBot.avatar || '');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBotDetails = async () => {
      if (isEditing && currentBot.assistantId) {
        setIsLoading(true);
        try {
          const botDetails = await getBotDetails(apiKey, currentBot.assistantId);
          if (botDetails) {
            setBotData(prevData => ({
              ...prevData,
              ...botDetails,
              isActive: currentBot.isActive || false
            }));
            setAvatarPreview(botDetails.avatar || '');
          } else {
            toast.error('Failed to load bot details. Using default values.');
          }
        } catch (error) {
          console.error('Error fetching bot details:', error);
          toast.error('Failed to load bot details. Please try again.');
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchBotDetails();
  }, [isEditing, currentBot.assistantId, apiKey]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBotData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setBotData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(botData);
  };

  if (isLoading) {
    return <div>Loading bot details...</div>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Bot' : 'Create New Bot'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarPreview} alt="Bot Avatar" />
              <AvatarFallback>{botData.name ? botData.name.charAt(0) : 'B'}</AvatarFallback>
            </Avatar>
            <div>
              <Label htmlFor="avatar">Avatar</Label>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="mt-1"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="botName">Bot Name</Label>
              <Input
                id="botName"
                name="name"
                value={botData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="model">Model</Label>
              <Select
                name="model"
                value={botData.model}
                onValueChange={(value) => setBotData((prev) => ({ ...prev, model: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              name="instructions"
              value={botData.instructions}
              onChange={handleChange}
              rows={4}
            />
          </div>
          <div>
            <Label>Temperature: {botData.temperature}</Label>
            <Slider
              value={[botData.temperature]}
              onValueChange={(value) => setBotData((prev) => ({ ...prev, temperature: value[0] }))}
              max={1}
              step={0.1}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="voice">Voice</Label>
            <Select
              name="voice"
              value={botData.voice || 'alloy'}
              onValueChange={(value) => setBotData((prev) => ({ ...prev, voice: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select voice" />
              </SelectTrigger>
              <SelectContent>
                {voices.map((voice) => (
                  <SelectItem key={voice} value={voice}>
                    {voice}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={botData.isActive}
              onCheckedChange={(checked) => setBotData((prev) => ({ ...prev, isActive: checked }))}
            />
            <Label htmlFor="isActive">Ativar bot no sistema de chat</Label>
          </div>
          <DialogFooter className="flex justify-between items-center">
            {isEditing && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete Bot</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your bot.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(botData.id, botData.assistantId)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button type="submit">{isEditing ? 'Update' : 'Create'} Bot</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BotDialog;
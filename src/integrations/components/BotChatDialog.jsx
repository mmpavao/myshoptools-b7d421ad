import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Paperclip, Mic, Send } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { chatWithBot, analyzeImage, generateImage, transcribeAudio, textToSpeech } from '../openAIOperations';

const BotChatDialog = ({ isOpen, onOpenChange, bot, apiKey }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('alloy'); // Default voice
  const scrollAreaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (content, type = 'text') => {
    if ((!content.trim() && type === 'text') || isLoading) return;

    const userMessage = { role: 'user', content, type };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let botResponse;
      if (type === 'image') {
        botResponse = await analyzeImage(apiKey, content);
      } else if (type === 'audio') {
        const transcription = await transcribeAudio(apiKey, content);
        botResponse = await chatWithBot(apiKey, bot.assistantId, transcription);
        // Convert text response to speech
        const audioUrl = await textToSpeech(apiKey, botResponse, selectedVoice);
        botResponse = { text: botResponse, audioUrl };
      } else {
        botResponse = await chatWithBot(apiKey, bot.assistantId, content);
      }

      const botMessage = { role: 'assistant', content: botResponse, type: type === 'audio' ? 'audio' : 'text' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage = { role: 'assistant', content: 'Desculpe, ocorreu um erro ao processar sua mensagem.', type: 'text' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        handleSendMessage(file, 'image');
      } else {
        // Handle document upload (you may want to add document analysis functionality)
        console.log('Document uploaded:', file.name);
      }
    }
  };

  const handleVoiceChat = () => {
    setIsRecording(!isRecording);
    // Implement voice recording logic here
    // When recording is done, call handleSendMessage with the audio file and type 'audio'
  };

  const voices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chat com {bot.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-[400px]">
          <ScrollArea className="flex-grow" ref={scrollAreaRef}>
            {messages.map((message, index) => (
              <div key={index} className={`mb-2 p-2 rounded ${message.role === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'}`}>
                {message.type === 'audio' ? (
                  <audio src={message.content.audioUrl} controls />
                ) : (
                  message.content
                )}
              </div>
            ))}
          </ScrollArea>
          <div className="flex mt-4 items-center">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(input)}
              placeholder="Digite sua mensagem..."
              className="flex-grow"
              disabled={isLoading}
            />
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileUpload}
              accept="image/*,.pdf,.doc,.docx"
            />
            <Button onClick={() => fileInputRef.current.click()} className="ml-2" disabled={isLoading}>
              <Paperclip size={20} />
            </Button>
            <Button onClick={handleVoiceChat} className="ml-2" disabled={isLoading}>
              <Mic size={20} color={isRecording ? 'red' : 'currentColor'} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="ml-2">Voice</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {voices.map((voice) => (
                  <DropdownMenuItem key={voice} onSelect={() => setSelectedVoice(voice)}>
                    {voice}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => handleSendMessage(input)} className="ml-2" disabled={isLoading}>
              <Send size={20} />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BotChatDialog;
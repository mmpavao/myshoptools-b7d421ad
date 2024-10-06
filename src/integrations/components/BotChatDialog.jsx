import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Paperclip, Mic, Send } from 'lucide-react';
import { chatWithBot, analyzeImage, generateImage, transcribeAudio, textToSpeech } from '../openAIOperations';

const BotChatDialog = ({ isOpen, onOpenChange, bot, apiKey }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isBotRecording, setIsBotRecording] = useState(false);
  const scrollAreaRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (content, type = 'text') => {
    if ((type === 'text' && !content.trim()) || isLoading) return;

    const userMessage = { role: 'user', content, type };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsBotTyping(true);

    try {
      let botResponse;
      if (type === 'image') {
        botResponse = await analyzeImage(apiKey, content);
      } else if (type === 'audio') {
        setIsBotRecording(true);
        const transcription = await transcribeAudio(apiKey, content);
        botResponse = await chatWithBot(apiKey, bot.assistantId, transcription);
        const audioUrl = await textToSpeech(apiKey, botResponse, bot.voice || 'alloy');
        botResponse = { text: botResponse, audioUrl, transcription };
      } else if (type === 'generate-image') {
        const imageUrl = await generateImage(apiKey, content);
        botResponse = { text: 'Imagem gerada com sucesso:', imageUrl };
      } else {
        botResponse = await chatWithBot(apiKey, bot.assistantId, content);
      }

      const botMessage = { 
        role: 'assistant', 
        content: botResponse, 
        type: type === 'audio' ? 'audio' : type === 'generate-image' ? 'image' : 'text' 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage = { role: 'assistant', content: 'Desculpe, ocorreu um erro ao processar sua mensagem.', type: 'text' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsBotTyping(false);
      setIsBotRecording(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        handleSendMessage(file, 'image');
      } else {
        console.log('Document uploaded:', file.name);
      }
    }
  };

  const handleVoiceChat = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          handleSendMessage(audioBlob, 'audio');
          audioChunksRef.current = [];
        };
        mediaRecorderRef.current.start();
        setIsRecording(true);
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
      });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

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
                  <div>
                    {message.role === 'user' && message.content.transcription && (
                      <p className="mb-2">{message.content.transcription}</p>
                    )}
                    <audio src={message.content.audioUrl} controls />
                    {message.role === 'assistant' && message.content.text && (
                      <p className="mt-2">{message.content.text}</p>
                    )}
                  </div>
                ) : message.type === 'image' ? (
                  <img src={message.content.imageUrl} alt="Generated" className="max-w-full h-auto" />
                ) : (
                  message.content
                )}
              </div>
            ))}
            {isBotTyping && (
              <div className="mb-2 p-2 rounded bg-gray-100">
                <p>Digitando...</p>
              </div>
            )}
            {isBotRecording && (
              <div className="mb-2 p-2 rounded bg-gray-100">
                <p>Gravando áudio...</p>
              </div>
            )}
          </ScrollArea>
          <div className="flex mt-4 items-center">
            <div className="flex-grow relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(input)}
                placeholder="Digite sua mensagem..."
                className="pr-10"
                disabled={isLoading}
              />
              <Button 
                onClick={() => handleSendMessage(input)} 
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                disabled={isLoading}
              >
                <Send size={20} />
              </Button>
            </div>
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BotChatDialog;
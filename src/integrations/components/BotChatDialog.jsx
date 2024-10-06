import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { chatWithBot } from '../openAIOperations';

const BotChatDialog = ({ isOpen, onOpenChange, bot, apiKey }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const botResponse = await chatWithBot(apiKey, bot.assistantId, input);
      const botMessage = { role: 'assistant', content: botResponse };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error chatting with bot:', error);
      const errorMessage = { role: 'assistant', content: 'Desculpe, ocorreu um erro ao processar sua mensagem.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
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
                {message.content}
              </div>
            ))}
          </ScrollArea>
          <div className="flex mt-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Digite sua mensagem..."
              className="flex-grow"
              disabled={isLoading}
            />
            <Button onClick={handleSendMessage} className="ml-2" disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Enviar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BotChatDialog;
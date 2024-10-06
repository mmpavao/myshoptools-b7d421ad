import React, { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '../Auth/AuthProvider';
import { addDoc, collection, serverTimestamp, query, where, getDocs, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { chatWithBot } from '../../integrations/openAIOperations';
import { toast } from 'sonner';

const ChatWindow = ({ onClose, onlineAgents, apiKey }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();
  const [activeBots, setActiveBots] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('zilda');
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    const fetchActiveBots = async () => {
      const botsQuery = query(collection(db, 'bots'), where('isActive', '==', true));
      const botsSnapshot = await getDocs(botsQuery);
      setActiveBots(botsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchActiveBots();

    // Listen for new messages
    const messagesQuery = query(
      collection(db, 'messages'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'asc')
    );
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [user.uid]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        text: message,
        createdAt: new Date(),
        userId: user.uid,
        userName: user.displayName || user.email,
        agentId: selectedAgent
      };

      try {
        if (selectedAgent === 'zilda') {
          if (!apiKey) {
            toast.error('OpenAI API key is not set. Please configure it in your settings.');
            return;
          }
          const zildaBot = activeBots.find(bot => bot.name.toLowerCase() === 'zilda');
          if (zildaBot) {
            await addDoc(collection(db, 'messages'), newMessage);
            const response = await chatWithBot(apiKey, zildaBot.assistantId, message);
            await addDoc(collection(db, 'messages'), {
              text: response.response,
              createdAt: new Date(),
              userId: 'zilda',
              userName: 'Zilda (Bot)',
              agentId: 'zilda'
            });
          } else {
            console.error('Zilda bot not found');
            toast.error('Zilda bot is not available. Please try again later.');
          }
        } else {
          await addDoc(collection(db, 'messages'), newMessage);
        }
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
        toast.error('Failed to send message. Please try again.');
      }
    }
  };

  return (
    <Card className="w-80 h-96 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Chat</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.userId === user.uid ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-2 rounded-lg ${msg.userId === user.uid ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                <p className="text-sm">{msg.text}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">{msg.userName}</p>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Select value={selectedAgent} onValueChange={setSelectedAgent}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an agent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="zilda">Zilda (Bot)</SelectItem>
            {onlineAgents.map(agent => (
              <SelectItem key={agent.id} value={agent.id}>
                {agent.displayName || agent.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex w-full space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatWindow;

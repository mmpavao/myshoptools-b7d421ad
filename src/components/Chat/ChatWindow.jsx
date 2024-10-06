import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../Auth/AuthProvider';
import { addDoc, collection, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

const ChatWindow = ({ onClose, onlineAgents }) => {
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const [activeBots, setActiveBots] = useState([]);

  useEffect(() => {
    const fetchActiveBots = async () => {
      const botsQuery = query(collection(db, 'bots'), where('isActive', '==', true));
      const botsSnapshot = await getDocs(botsQuery);
      setActiveBots(botsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchActiveBots();
  }, []);

  const handleSendMessage = async () => {
    if (message.trim()) {
      try {
        await addDoc(collection(db, 'messages'), {
          text: message,
          createdAt: serverTimestamp(),
          userId: user.uid,
          userName: user.displayName || user.email,
        });
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
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
      <CardContent className="flex-grow overflow-y-auto">
        <div>
          <p className="font-semibold mb-2">Atendentes online:</p>
          <ul className="space-y-1">
            {onlineAgents.map(agent => (
              <li key={agent.id} className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                {agent.displayName || agent.email}
              </li>
            ))}
            {activeBots.map(bot => (
              <li key={bot.id} className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                {bot.name} (Bot)
              </li>
            ))}
          </ul>
          {/* Here you can add the logic to display messages */}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
          />
          <Button onClick={handleSendMessage}>Enviar</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatWindow;
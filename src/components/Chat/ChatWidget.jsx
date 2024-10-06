import React, { useState, useEffect } from 'react';
import { MessageCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../Auth/AuthProvider';
import ChatWindow from './ChatWindow';
import { db } from '../../firebase/config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { user } = useAuth();
  const [onlineAgents, setOnlineAgents] = useState([]);

  useEffect(() => {
    if (user) {
      const agentsQuery = query(collection(db, 'users'), where('role', 'in', ['Admin', 'Master']), where('isOnline', '==', true));
      const unsubscribe = onSnapshot(agentsQuery, (snapshot) => {
        setOnlineAgents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleChatOption = () => {
    setShowChat(true);
    setIsOpen(false);
  };

  const handleWhatsAppOption = () => {
    window.open('https://wa.me/+1407300181', '_blank');
    setIsOpen(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && !showChat && (
        <div className="mb-2 flex flex-col space-y-2">
          <Button onClick={handleChatOption} variant="secondary" className="justify-start">
            <MessageSquare className="mr-2 h-4 w-4" />
            Chat
          </Button>
          <Button onClick={handleWhatsAppOption} variant="secondary" className="justify-start">
            <MessageCircle className="mr-2 h-4 w-4" />
            WhatsApp
          </Button>
        </div>
      )}
      {showChat && (
        <ChatWindow onClose={() => setShowChat(false)} onlineAgents={onlineAgents} />
      )}
      {!showChat && (
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full w-12 h-12 flex items-center justify-center"
        >
          <MessageCircle />
        </Button>
      )}
    </div>
  );
};

export default ChatWidget;
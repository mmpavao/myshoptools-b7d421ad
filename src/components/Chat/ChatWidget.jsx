import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../Auth/AuthProvider';
import ChatWindow from './ChatWindow';
import { db } from '../../firebase/config';
import { collection, query, where, onSnapshot, doc, getDoc, getDocs } from 'firebase/firestore';

const ChatWidget = () => {
  const [showChat, setShowChat] = useState(false);
  const { user } = useAuth();
  const [onlineAgents, setOnlineAgents] = useState([]);
  const [apiKey, setApiKey] = useState('');
  const [activeBots, setActiveBots] = useState([]);

  useEffect(() => {
    if (user) {
      const agentsQuery = query(
        collection(db, 'users'),
        where('role', 'in', ['Admin', 'Master']),
        where('isOnline', '==', true)
      );
      const unsubscribe = onSnapshot(agentsQuery, (snapshot) => {
        setOnlineAgents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

      // Fetch API key from user's settings
      const fetchApiKey = async () => {
        const userSettingsRef = doc(db, 'user_settings', user.uid);
        const userSettingsSnap = await getDoc(userSettingsRef);
        if (userSettingsSnap.exists()) {
          const userData = userSettingsSnap.data();
          setApiKey(userData.openai_api_key || '');
        }
      };
      fetchApiKey();

      // Fetch active bots
      const fetchActiveBots = async () => {
        const botsQuery = query(collection(db, 'bots'), where('isActive', '==', true));
        const botsSnapshot = await getDocs(botsQuery);
        setActiveBots(botsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      };
      fetchActiveBots();

      return () => unsubscribe();
    }
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {showChat ? (
        <ChatWindow 
          onClose={() => setShowChat(false)} 
          onlineAgents={onlineAgents} 
          apiKey={apiKey}
          activeBots={activeBots}
          setActiveBots={setActiveBots}
        />
      ) : (
        <Button
          onClick={() => setShowChat(true)}
          className="rounded-full w-12 h-12 flex items-center justify-center"
        >
          <MessageCircle />
        </Button>
      )}
    </div>
  );
};

export default ChatWidget;
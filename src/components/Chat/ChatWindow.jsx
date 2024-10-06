import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Paperclip, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '../Auth/AuthProvider';
import { addDoc, collection, serverTimestamp, query, where, getDocs, onSnapshot, orderBy } from 'firebase/firestore';
import { db, getOpenAIApiKey } from '../../firebase/config';
import { chatWithBot, transcribeAudio, textToSpeech, analyzeDocument } from '../../integrations/openAIOperations';
import { toast } from 'sonner';

const ChatWindow = ({ onClose, onlineAgents, activeBots, setActiveBots }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();
  const [selectedAgent, setSelectedAgent] = useState('zilda');
  const scrollAreaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isBotResponding, setIsBotResponding] = useState(false);
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    const fetchActiveBots = async () => {
      const botsQuery = query(collection(db, 'bots'), where('isActive', '==', true));
      const botsSnapshot = await getDocs(botsQuery);
      setActiveBots(botsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchActiveBots();

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
  }, [user.uid, setActiveBots]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (content, type = 'text') => {
    if ((type === 'text' && !content.trim()) || isBotResponding) return;

    const newMessage = {
      text: content,
      createdAt: serverTimestamp(),
      userId: user.uid,
      userName: user.displayName || user.email,
      agentId: selectedAgent,
      type: type
    };

    try {
      setIsBotResponding(true);
      await addDoc(collection(db, 'messages'), newMessage);

      if (selectedAgent === 'zilda') {
        const apiKey = getOpenAIApiKey();
        if (!apiKey) {
          throw new Error('OpenAI API key is not configured. Please contact the administrator.');
        }
        const zildaBot = activeBots.find(bot => bot.name.toLowerCase() === 'zilda');
        if (!zildaBot) {
          throw new Error('Zilda bot is not available. Please try again later.');
        }

        let botResponse;
        if (type === 'file') {
          botResponse = await analyzeDocument(apiKey, content);
        } else if (type === 'audio') {
          const transcription = await transcribeAudio(apiKey, content);
          botResponse = await chatWithBot(apiKey, zildaBot.assistantId, transcription);
          const audioUrl = await textToSpeech(apiKey, botResponse.response, zildaBot.voice || 'alloy');
          botResponse = { ...botResponse, audioUrl };
        } else {
          botResponse = await chatWithBot(apiKey, zildaBot.assistantId, content);
        }

        await addDoc(collection(db, 'messages'), {
          text: botResponse.response,
          createdAt: serverTimestamp(),
          userId: 'zilda',
          userName: 'Zilda (Bot)',
          agentId: 'zilda',
          type: type === 'audio' ? 'audio' : 'text',
          audioUrl: botResponse.audioUrl
        });

        if (botResponse.efficiency) {
          toast.success(`Bot efficiency: ${botResponse.efficiency}%`);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(`Failed to send message: ${error.message}`);
    } finally {
      setMessage('');
      setIsBotResponding(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleSendMessage(file, 'file');
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
          const audioBlob = new Blob([event.data], { type: 'audio/wav' });
          handleSendMessage(audioBlob, 'audio');
        };
        mediaRecorderRef.current.start();
        setIsRecording(true);
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
        toast.error('Failed to access microphone. Please check your permissions.');
      });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <Card className="w-96 h-[500px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between py-2">
        <CardTitle className="text-lg">Chat</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full px-4" ref={scrollAreaRef}>
          {messages.map((msg, index) => (
            <div key={index} className={`mb-4 ${msg.userId === user.uid ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-3 rounded-lg ${msg.userId === user.uid ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                {msg.type === 'audio' ? (
                  <audio src={msg.audioUrl} controls className="max-w-full" />
                ) : (
                  <p className="text-sm">{msg.text}</p>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">{msg.userName}</p>
            </div>
          ))}
          {isBotResponding && (
            <div className="mb-4 text-left">
              <div className="inline-block p-3 rounded-lg bg-gray-200">
                <p className="text-sm">Typing...</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 p-4">
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
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(message)}
            className="flex-grow"
          />
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileUpload}
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv"
          />
          <Button onClick={() => fileInputRef.current.click()} disabled={isBotResponding} size="icon">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button onClick={handleVoiceChat} disabled={isBotResponding} size="icon">
            <Mic className="h-4 w-4" color={isRecording ? 'red' : 'currentColor'} />
          </Button>
          <Button onClick={() => handleSendMessage(message)} disabled={isBotResponding} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatWindow;
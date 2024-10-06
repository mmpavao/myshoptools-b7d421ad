import React, { useState } from 'react';
import { MessageCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthProvider';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleChatOption = () => {
    navigate('/chat');
    setIsOpen(false);
  };

  const handleWhatsAppOption = () => {
    window.open('https://wa.me/+1407300181', '_blank');
    setIsOpen(false);
  };

  if (!user) {
    return null; // Don't render the widget if there's no logged-in user
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
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
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full w-12 h-12 flex items-center justify-center"
      >
        <MessageCircle />
      </Button>
    </div>
  );
};

export default ChatWidget;
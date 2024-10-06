import React, { useState } from 'react';
import { MessageCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleChatOption = () => {
    navigate('/chat');
    setIsOpen(false);
  };

  const handleWhatsAppOption = () => {
    window.open('https://wa.me/yourphonenumber', '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="mb-2 flex flex-col space-y-2">
          <Button onClick={handleChatOption} variant="secondary">
            <MessageSquare className="mr-2 h-4 w-4" />
            Chat
          </Button>
          <Button onClick={handleWhatsAppOption} variant="secondary">
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
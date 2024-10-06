import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ChatAdmin = () => {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(false);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    // Aqui você pode carregar os chats do banco de dados
    // Por enquanto, vamos usar dados fictícios
    setChats([
      { id: 1, user: 'João Silva', lastMessage: 'Olá, preciso de ajuda!' },
      { id: 2, user: 'Maria Souza', lastMessage: 'Quando meu pedido será entregue?' },
    ]);
  }, []);

  const handleStatusChange = (checked) => {
    setIsOnline(checked);
    // Aqui você atualizaria o status do usuário no banco de dados
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Administração do Chat</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Seu Status</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={user?.photoURL} alt={user?.displayName} />
              <AvatarFallback>{user?.displayName?.[0]}</AvatarFallback>
            </Avatar>
            <span>{user?.displayName}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>{isOnline ? 'Online' : 'Offline'}</span>
            <Switch checked={isOnline} onCheckedChange={handleStatusChange} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Chats Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {chats.map((chat) => (
                <li key={chat.id} className="flex justify-between items-center">
                  <span>{chat.user}</span>
                  <Button variant="outline" size="sm">Atender</Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Área do Chat</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Aqui você implementaria a interface do chat */}
            <p className="text-center text-gray-500">Selecione um chat para começar a atender</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatAdmin;
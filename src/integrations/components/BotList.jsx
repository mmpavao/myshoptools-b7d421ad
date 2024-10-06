import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, MessageSquare, Thermometer, Zap } from 'lucide-react';
import { format, isValid } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return isValid(date) ? format(date, 'PPpp') : 'Invalid date';
};

const BotList = ({ bots, onEdit, onChat }) => (
  <Card className="mb-6">
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle>Your Bots</CardTitle>
        <Button onClick={() => onEdit()}>Create New Bot</Button>
      </div>
    </CardHeader>
    <CardContent>
      {bots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bots.map((bot) => (
            <Card key={bot.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary to-primary-foreground p-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16 border-2 border-white">
                    <AvatarImage src={bot.avatar} alt={bot.name || 'Bot'} />
                    <AvatarFallback className="text-2xl">{bot.name ? bot.name.charAt(0) : 'B'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold text-white">{bot.name || 'Unnamed Bot'}</h3>
                    <p className="text-sm text-primary-foreground/80">Model: {bot.model || 'Unknown'}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm font-medium">Efficiency</span>
                  </div>
                  <span className="text-sm font-bold">{bot.efficiency || 0}%</span>
                </div>
                <Progress value={bot.efficiency || 0} className="h-2 mb-4" />
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">Created: {formatDate(bot.createdAt)}</p>
                  <p className="text-gray-600">Updated: {formatDate(bot.updatedAt)}</p>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button size="sm" variant="outline" onClick={() => onEdit(bot)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button size="sm" variant="default" onClick={() => onChat(bot)}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p>No bots created yet.</p>
      )}
    </CardContent>
  </Card>
);

export default BotList;
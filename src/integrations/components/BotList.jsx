import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, MessageSquare, Thermometer } from 'lucide-react';
import { format, isValid } from 'date-fns';

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bots.map((bot) => (
            <Card key={bot.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{bot.name}</h3>
                <div className="flex space-x-2">
                  <Button size="icon" variant="ghost" onClick={() => onEdit(bot)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => onChat(bot)}>
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-2">Model: {bot.model}</p>
              <p className="text-xs text-gray-400">Created: {formatDate(bot.createdAt)}</p>
              <p className="text-xs text-gray-400">Updated: {formatDate(bot.updatedAt)}</p>
              <div className="flex items-center mt-2">
                <Thermometer className="h-4 w-4 mr-2 text-blue-500" />
                <div className="bg-gray-200 h-2 flex-grow rounded-full">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${bot.efficiency}%` }}
                  ></div>
                </div>
                <span className="text-xs ml-2">{bot.efficiency}%</span>
              </div>
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
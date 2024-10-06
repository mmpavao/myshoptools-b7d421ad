import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BotList = ({ bots, onEdit, onDelete }) => (
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
              <h3 className="text-lg font-semibold">{bot.name}</h3>
              <p className="text-sm text-gray-500">Model: {bot.model}</p>
              <div className="mt-2 space-x-2">
                <Button onClick={() => onEdit(bot)}>Edit</Button>
                <Button variant="destructive" onClick={() => onDelete(bot.id, bot.assistantId)}>Delete</Button>
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
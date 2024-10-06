import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const BotDialog = ({ isOpen, onOpenChange, currentBot, isEditing, onSave }) => {
  const [botData, setBotData] = React.useState(currentBot);

  React.useEffect(() => {
    setBotData(currentBot);
  }, [currentBot]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBotData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(botData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Bot' : 'Create New Bot'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="botName">Bot Name</Label>
            <Input
              id="botName"
              name="name"
              value={botData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              name="instructions"
              value={botData.instructions}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="model">Model</Label>
            <Select
              name="model"
              value={botData.model}
              onValueChange={(value) => setBotData((prev) => ({ ...prev, model: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Temperature: {botData.temperature}</Label>
            <Slider
              value={[botData.temperature]}
              onValueChange={(value) => setBotData((prev) => ({ ...prev, temperature: value[0] }))}
              max={1}
              step={0.1}
            />
          </div>
          <Button type="submit">{isEditing ? 'Update' : 'Create'} Bot</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BotDialog;
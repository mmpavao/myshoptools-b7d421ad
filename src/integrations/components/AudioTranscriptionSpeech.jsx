import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { transcribeAudio, textToSpeech } from '../openAIOperations';

const AudioTranscriptionSpeech = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');

  const handleTranscribeAudio = async () => {
    if (!file) {
      toast.error('Please select an audio file to transcribe');
      return;
    }
    try {
      const transcript = await transcribeAudio(file);
      console.log('Transcription:', transcript);
      toast.success('Audio transcribed successfully');
    } catch (error) {
      console.error('Error transcribing audio:', error);
      toast.error('Failed to transcribe audio');
    }
  };

  const handleTextToSpeech = async () => {
    if (!text) {
      toast.error('Please enter text to convert to speech');
      return;
    }
    try {
      const audioBuffer = await textToSpeech(text);
      const audioUrl = URL.createObjectURL(new Blob([audioBuffer], { type: 'audio/mp3' }));
      const audio = new Audio(audioUrl);
      audio.play();
      toast.success('Text converted to speech successfully');
    } catch (error) {
      console.error('Error converting text to speech:', error);
      toast.error('Failed to convert text to speech');
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Audio Transcription and Text-to-Speech</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="audioUpload">Upload Audio for Transcription</Label>
            <Input id="audioUpload" type="file" onChange={(e) => setFile(e.target.files[0])} />
            <Button onClick={handleTranscribeAudio} className="mt-2">Transcribe Audio</Button>
          </div>
          <div>
            <Label htmlFor="textToSpeech">Text-to-Speech</Label>
            <Textarea
              id="textToSpeech"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to convert to speech"
            />
            <Button onClick={handleTextToSpeech} className="mt-2">
              Convert to Speech
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioTranscriptionSpeech;
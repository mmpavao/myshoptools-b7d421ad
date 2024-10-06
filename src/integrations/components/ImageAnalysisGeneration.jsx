import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { analyzeImage, generateImage } from '../openAIOperations';

const ImageAnalysisGeneration = () => {
  const [file, setFile] = useState(null);
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');

  const handleAnalyzeImage = async () => {
    if (!file) {
      toast.error('Please select an image to analyze');
      return;
    }
    try {
      const result = await analyzeImage(file);
      toast.success('Image analyzed successfully');
      console.log('Analysis result:', result);
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error('Failed to analyze image');
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt) {
      toast.error('Please enter a prompt for image generation');
      return;
    }
    try {
      const imageUrl = await generateImage(imagePrompt);
      setGeneratedImageUrl(imageUrl);
      toast.success('Image generated successfully');
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image');
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Image Analysis and Generation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="imageUpload">Upload Image for Analysis</Label>
            <Input id="imageUpload" type="file" onChange={(e) => setFile(e.target.files[0])} />
            <Button onClick={handleAnalyzeImage} className="mt-2">Analyze Image</Button>
          </div>
          <div>
            <Label htmlFor="imagePrompt">Image Generation Prompt</Label>
            <Input
              id="imagePrompt"
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              placeholder="Enter a prompt for image generation"
            />
            <Button onClick={handleGenerateImage} className="mt-2">Generate Image</Button>
          </div>
          {generatedImageUrl && (
            <img src={generatedImageUrl} alt="Generated" className="mt-4 max-w-full h-auto" />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageAnalysisGeneration;
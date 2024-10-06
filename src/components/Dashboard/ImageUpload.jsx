import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';
import { uploadFile } from '../../firebase/firebaseOperations';
import { toast } from '@/components/ui/use-toast';

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo para fazer upload.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const filePath = `uploads/${Date.now()}_${file.name}`;
      await uploadFile(file, filePath, (progress) => {
        setUploadProgress(progress);
      });

      toast({
        title: "Sucesso",
        description: "Imagem enviada com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      toast({
        title: "Erro",
        description: `Falha ao enviar a imagem: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Upload de Imagem</h2>
      <Input type="file" onChange={handleFileChange} accept="image/*" />
      <Button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? 'Enviando...' : 'Enviar Imagem'}
      </Button>
      {uploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} />
          <p>{uploadProgress.toFixed(0)}% concluído</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
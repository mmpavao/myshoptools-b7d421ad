import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';
import firebaseOperations from '../../firebase/firebaseOperations';
import StoredImages from './StoredImages';

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadLogs, setUploadLogs] = useState([]);
  const [storedImages, setStoredImages] = useState([]);

  useEffect(() => {
    fetchStoredImages();
  }, []);

  const fetchStoredImages = async () => {
    try {
      const images = await firebaseOperations.listStorageFiles();
      setStoredImages(images);
    } catch (error) {
      console.error("Error fetching stored images:", error);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const addLog = (message, status = 'info') => {
    setUploadLogs(prev => [...prev, { message, status, timestamp: new Date().toLocaleTimeString() }]);
  };

  const handleUpload = async () => {
    if (!file) {
      console.error("Por favor, selecione um arquivo para fazer upload.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadLogs([]);
    addLog("Iniciando upload...");

    try {
      const filePath = `uploads/${Date.now()}_${file.name}`;
      addLog(`Enviando arquivo: ${file.name}`);
      await firebaseOperations.uploadFile(file, filePath, (progress) => {
        setUploadProgress(progress);
        addLog(`Progresso: ${progress.toFixed(0)}%`);
      });

      addLog("Upload concluído com sucesso!", "success");
      console.log("Imagem enviada com sucesso!");
      fetchStoredImages();
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      addLog(`Erro no upload: ${error.message}`, "error");
      if (error.code === 'storage/unauthorized') {
        addLog("Erro de autorização. Verifique as regras do Firebase Storage.", "error");
      } else if (error.name === 'AbortError' || error.message.includes('Failed to fetch')) {
        addLog("Erro de CORS detectado. Verifique as configurações do Firebase e do seu navegador.", "error");
      }
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  return (
    <div className="space-y-6">
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
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Log de Upload</h3>
        <div className="bg-gray-100 p-4 rounded-md max-h-40 overflow-y-auto">
          {uploadLogs.map((log, index) => (
            <p key={index} className={`text-sm ${log.status === 'error' ? 'text-red-600' : log.status === 'success' ? 'text-green-600' : 'text-gray-700'}`}>
              [{log.timestamp}] {log.message}
            </p>
          ))}
        </div>
      </div>

      <StoredImages images={storedImages} onRefresh={fetchStoredImages} />
    </div>
  );
};

export default ImageUpload;
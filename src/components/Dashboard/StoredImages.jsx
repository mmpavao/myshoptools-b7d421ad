import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { toast } from '@/components/ui/use-toast';
import { deleteFile } from '../../firebase/firebaseOperations';

const StoredImages = ({ images, onRefresh }) => {
  const [availableImages, setAvailableImages] = useState([]);

  useEffect(() => {
    setAvailableImages(images);
  }, [images]);

  const handleImageError = async (e, image) => {
    e.target.src = '/placeholder.svg';
    e.target.alt = 'Imagem não disponível';
    console.error(`Erro ao carregar imagem: ${image.name}`);
    
    try {
      // Tenta deletar o arquivo que não existe mais
      await deleteFile(`${image.folder}/${image.name}`);
      console.log(`Arquivo removido do Storage: ${image.name}`);
    } catch (deleteError) {
      console.error(`Erro ao tentar remover arquivo do Storage: ${deleteError}`);
    }

    // Remove a imagem da lista de imagens disponíveis
    setAvailableImages(prevImages => prevImages.filter(img => img.name !== image.name));

    toast({
      title: "Imagem Removida",
      description: `A imagem ${image.name} não está mais disponível e foi removida da lista.`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Imagens Armazenadas</h2>
        <Button onClick={onRefresh}>Atualizar Lista</Button>
      </div>
      {availableImages.length === 0 ? (
        <p>Nenhuma imagem encontrada.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {availableImages.map((image, index) => (
            <div key={index} className="border rounded-md p-2">
              <img 
                src={image.url} 
                alt={image.name} 
                className="w-full h-32 object-cover mb-2"
                onError={(e) => handleImageError(e, image)}
              />
              <p className="text-sm truncate">{image.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoredImages;
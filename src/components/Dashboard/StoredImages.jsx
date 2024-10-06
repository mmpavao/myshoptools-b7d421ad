import React from 'react';
import { Button } from '../ui/button';

const StoredImages = ({ images, onRefresh }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Imagens Armazenadas</h2>
        <Button onClick={onRefresh}>Atualizar Lista</Button>
      </div>
      {images.length === 0 ? (
        <p>Nenhuma imagem encontrada.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="border rounded-md p-2">
              <img src={image.url} alt={image.name} className="w-full h-32 object-cover mb-2" />
              <p className="text-sm truncate">{image.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoredImages;
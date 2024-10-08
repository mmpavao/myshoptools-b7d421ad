import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const ProductImages = ({ fotos, titulo }) => {
  const [fotoPrincipal, setFotoPrincipal] = useState(fotos[0] || "/placeholder.svg");

  const handleThumbnailClick = (foto) => {
    setFotoPrincipal(foto);
  };

  const renderImage = (img, index, isThumbnail = false) => (
    <div 
      key={index} 
      className={`relative pb-[100%] overflow-hidden rounded-lg ${isThumbnail ? 'cursor-pointer' : ''}`}
      onClick={isThumbnail ? () => handleThumbnailClick(img) : undefined}
    >
      <img 
        src={img} 
        alt={`${titulo} ${index + 1}`} 
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );

  return (
    <div className="md:w-1/2">
      {renderImage(fotoPrincipal, 0)}
      <div className="grid grid-cols-4 gap-2 mt-4">
        {fotos.slice(0, 4).map((img, index) => renderImage(img, index, true))}
      </div>
      {fotos.length > 4 && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="link" className="mt-2 w-full">
              Ver todas as fotos
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <div className="grid grid-cols-3 gap-4">
              {fotos.map((img, index) => renderImage(img, index, true))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProductImages;
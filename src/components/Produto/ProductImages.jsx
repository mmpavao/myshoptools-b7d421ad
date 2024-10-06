import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const ProductImages = ({ fotos, titulo }) => {
  const [fotoPrincipal, setFotoPrincipal] = useState(fotos[0] || "/placeholder.svg");

  const handleThumbnailClick = (foto) => {
    setFotoPrincipal(foto);
  };

  return (
    <div className="md:w-1/2">
      <img src={fotoPrincipal} alt={titulo} className="w-full h-auto object-cover rounded-lg mb-4" />
      <div className="grid grid-cols-4 gap-2">
        {fotos.slice(0, 4).map((img, index) => (
          <img 
            key={index} 
            src={img} 
            alt={`${titulo} ${index + 1}`} 
            className="w-full h-24 object-cover rounded-lg cursor-pointer" 
            onClick={() => handleThumbnailClick(img)}
          />
        ))}
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
              {fotos.map((img, index) => (
                <img 
                  key={index} 
                  src={img} 
                  alt={`${titulo} ${index + 1}`} 
                  className="w-full h-auto object-cover rounded-lg cursor-pointer" 
                  onClick={() => handleThumbnailClick(img)}
                />
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProductImages;
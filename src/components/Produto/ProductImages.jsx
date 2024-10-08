import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Download } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ProductImages = ({ fotos, titulo, activeMarketplace }) => {
  const [fotoPrincipal, setFotoPrincipal] = useState(fotos[0] || "/placeholder.svg");

  const handleThumbnailClick = (foto) => {
    setFotoPrincipal(foto);
  };

  const handleDownload = (imageUrl) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${titulo.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        className="absolute inset-0 w-full h-full object-cover border-l-[3px] border-r-[3px] border-primary"
      />
      {activeMarketplace === 'Fornecedor' && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-white bg-opacity-70 hover:bg-opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(img);
                }}
              >
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Baixar imagem</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
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
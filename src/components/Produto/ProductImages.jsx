import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Download, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ProductImages = ({ fotos, titulo, activeMarketplace }) => {
  const [fotoPrincipal, setFotoPrincipal] = useState('/placeholder.svg');
  const [fotosValidas, setFotosValidas] = useState([]);
  const [erroCarregamento, setErroCarregamento] = useState(false);

  useEffect(() => {
    const validarFotos = async () => {
      const fotosVerificadas = await Promise.all(
        fotos.map(async (foto) => {
          try {
            const response = await fetch(foto, { method: 'HEAD' });
            return response.ok ? foto : null;
          } catch {
            return null;
          }
        })
      );
      const fotosValidas = fotosVerificadas.filter(Boolean);
      setFotosValidas(fotosValidas);
      setFotoPrincipal(fotosValidas[0] || '/placeholder.svg');
      setErroCarregamento(fotosValidas.length === 0);
    };

    validarFotos();
  }, [fotos]);

  const handleThumbnailClick = (foto) => {
    setFotoPrincipal(foto);
  };

  const handleDownload = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${titulo.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao baixar a imagem:', error);
    }
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

  if (erroCarregamento) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro ao carregar imagens</AlertTitle>
        <AlertDescription>
          Não foi possível carregar as imagens do produto. Por favor, tente novamente mais tarde.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="md:w-1/2">
      {renderImage(fotoPrincipal, 0)}
      <div className="grid grid-cols-4 gap-2 mt-4">
        {fotosValidas.slice(0, 4).map((img, index) => renderImage(img, index, true))}
      </div>
      {fotosValidas.length > 4 && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="link" className="mt-2 w-full">
              Ver todas as fotos
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <div className="grid grid-cols-3 gap-4">
              {fotosValidas.map((img, index) => renderImage(img, index, true))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProductImages;
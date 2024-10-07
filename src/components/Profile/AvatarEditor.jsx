import React, { useState, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Cropper from 'react-easy-crop';
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";
import { SpinnerDefault } from "@/components/ui/spinners";

const AvatarEditor = ({ onSave, currentAvatar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentAvatar) {
      setImage(currentAvatar);
    }
  }, [currentAvatar]);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = useCallback(async () => {
    if (croppedAreaPixels) {
      setIsSaving(true);
      try {
        const croppedImage = await getCroppedImg(image, croppedAreaPixels);
        await onSave(croppedImage);
        setIsOpen(false);
        toast({
          title: "Avatar Atualizado",
          description: "Seu avatar foi atualizado com sucesso.",
        });
      } catch (error) {
        console.error('Error cropping image:', error);
        toast({
          title: "Erro",
          description: "Não foi possível processar a imagem. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    }
  }, [croppedAreaPixels, image, onSave]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Editar Avatar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Avatar</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="flex items-center space-x-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="avatar-upload"
            />
            <label
              htmlFor="avatar-upload"
              className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Escolher arquivo
            </label>
            {!image && <span className="text-sm text-gray-500">Nenhum arquivo escolhido</span>}
          </div>
          {image && (
            <div className="relative h-64 w-full mt-4">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
          )}
          {image && (
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(value) => setZoom(value[0])}
              className="mt-4"
            />
          )}
          <Button onClick={handleSave} className="mt-4" disabled={isSaving}>
            {isSaving ? (
              <>
                <SpinnerDefault className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Avatar'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarEditor;

// Helper function to crop the image
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // This line is crucial
    image.src = url;
  });

const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/jpeg');
  });
};
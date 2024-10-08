import React, { useState, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Cropper from 'react-easy-crop';
import { getCroppedImg } from "../../utils/imageUtils";
import { toast } from "@/components/ui/use-toast";

const AvatarEditor = ({ onSave, currentAvatar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const fileInputRef = useRef(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImage(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSelectImage = () => {
    fileInputRef.current.click();
  };

  const handleSave = async () => {
    try {
      if (!image) {
        throw new Error("No image selected");
      }
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      const blob = await fetch(croppedImage).then(r => r.blob());
      const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
      await onSave(file);
      setIsOpen(false);
      setImage(null);
      toast({
        title: "Avatar Updated",
        description: "Your avatar has been successfully updated.",
      });
    } catch (error) {
      console.error('Error saving avatar:', error);
      toast({
        title: "Error",
        description: "Failed to update avatar. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Change Avatar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Avatar</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center">
            {image ? (
              <div className="relative w-64 h-64">
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
            ) : (
              <div className="w-64 h-64 bg-gray-200 flex items-center justify-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="avatar-upload"
                />
                <Button variant="outline" onClick={handleSelectImage}>Select Image</Button>
              </div>
            )}
          </div>
          {image && (
            <Button onClick={handleSave}>Save</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarEditor;
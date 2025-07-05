import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Upload } from "lucide-react";

interface PhotoUploadProps {
  currentPhoto: string;
  onPhotoChange: (photo: string) => void;
  isInPPD: boolean;
  onIsInPPDChange: (isInPPD: boolean) => void;
}

export function PhotoUpload({ currentPhoto, onPhotoChange, isInPPD, onIsInPPDChange }: PhotoUploadProps) {
  const [previewUrl, setPreviewUrl] = useState(currentPhoto);

  // Update preview when currentPhoto changes
  useEffect(() => {
    setPreviewUrl(currentPhoto);
  }, [currentPhoto]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Файл занадто великий. Максимальний розмір - 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewUrl(base64String);
        onPhotoChange(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Фото особи"
            className="w-full h-full object-cover"
            onError={() => setPreviewUrl('')}
          />
        ) : (
          <div className="text-muted-foreground flex flex-col items-center">
            <Camera className="w-12 h-12 mb-2" />
            <span>Додати фото</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <Button
            variant="outline"
            className="w-full"
            onClick={handleCameraClick}
          >
            <Upload className="w-4 h-4 mr-2" />
            Завантажити фото
          </Button>
        </div>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={isInPPD}
            onChange={(e) => onIsInPPDChange(e.target.checked)}
          />
          <span>Знаходиться в ППД</span>
        </label>
      </div>
    </div>
  );
}
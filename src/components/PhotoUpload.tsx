import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PhotoUploadProps {
  currentPhoto: string;
  onPhotoChange: (photo: string) => void;
  isInPPD: boolean;
  onIsInPPDChange: (isInPPD: boolean) => void;
  absenceStatus: string;
  onAbsenceStatusChange: (status: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
}

export function PhotoUpload({
  currentPhoto,
  onPhotoChange,
  isInPPD,
  onIsInPPDChange,
  absenceStatus,
  onAbsenceStatusChange,
  status,
  onStatusChange,
}: PhotoUploadProps) {
  const [previewUrl, setPreviewUrl] = useState(currentPhoto);
  const { theme } = useTheme();

  // Update preview when currentPhoto changes
  useEffect(() => {
    setPreviewUrl(currentPhoto);
  }, [currentPhoto]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const absenceStatusOptions = [
    { value: "не_вказано", label: "Не вказано" },
    { value: "відпустка", label: "Відпустка" },
    { value: "короткострокове_лікування", label: "Короткострокове лікування" },
    { value: "довгострокове_лікування", label: "Довгострокове лікування" },
    { value: "відрядження", label: "Відрядження" },
    { value: "декрет", label: "Декрет" },
    { value: "РВБД", label: "Район Ведення Бойових Дій" },
    { value: "навчання", label: "Навчання" },
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("Файл занадто великий. Максимальний розмір - 5MB");
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
      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden max-w-[300px]">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Фото особи"
            className="w-full h-full object-cover"
            onError={() => setPreviewUrl("")}
          />
        ) : (
          <img
            src={theme === "dark" ? "/photo-placeholder-dark.jpeg" : "/photo-placeholder-light.png"}
            alt="Додати фото"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="space-y-2 max-w-[300px]">
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
          {previewUrl && (
            <Button
              variant="destructive"
              onClick={() => {
                setPreviewUrl("");
                onPhotoChange("");
              }}
            >
              Видалити
            </Button>
          )}
        </div>
      </div>
      <div className="space-y-4 mt-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="isInPPD"
            checked={isInPPD}
            onCheckedChange={onIsInPPDChange}
          />
          <Label htmlFor="isInPPD">В ППД</Label>
        </div>

        {!isInPPD && (
          <div className="space-y-2">
            <Label htmlFor="absenceStatus">Причина відсутності</Label>
            <Select
              value={absenceStatus}
              onValueChange={(value) => {
                onAbsenceStatusChange(value);
                onStatusChange(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Оберіть статус відсутності" />
              </SelectTrigger>
              <SelectContent>
                {absenceStatusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Document } from '@/lib/data';
import { v4 as uuidv4 } from 'uuid';

interface DocumentUploadProps {
  onDocumentAdd: (document: Document) => void;
  onDocumentRemove: (documentId: string) => void;
  documents: Document[];
}

export function DocumentUpload({ onDocumentAdd, onDocumentRemove, documents }: DocumentUploadProps) {
  const [documentName, setDocumentName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Use file name if document name is not provided
    const finalDocumentName = documentName.trim() || file.name.split('.')[0];

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Будь ласка, завантажте зображення (JPEG, PNG, GIF) або PDF файл');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const document: Document = {
          id: uuidv4(),
          name: finalDocumentName,
          type: file.type,
          data: reader.result as string,
          uploadDate: new Date().toISOString(),
        };
        onDocumentAdd(document);
        setDocumentName('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Помилка при завантаженні документа');
    }
  };

  const handleDownload = (doc: Document) => {
    try {
      const link = document.createElement('a');
      link.href = doc.data;
      link.download = `${doc.name}.${doc.type.split('/')[1]}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Помилка при завантаженні документа');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="documentName">Назва документа (необов'язково)</Label>
        <Input
          id="documentName"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          placeholder="Введіть назву документа або використовуйте ім'я файлу"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <Label htmlFor="documentFile">Файл документа (зображення або PDF)</Label>
        <Input
          id="documentFile"
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          accept="image/*,.pdf"
        />
      </div>

      {documents.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Завантажені документи:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between bg-secondary p-3 rounded-lg"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{doc.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(doc.uploadDate).toLocaleDateString('uk-UA')}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(doc)}
                  >
                    Завантажити
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDocumentRemove(doc.id)}
                  >
                    Видалити
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PhotoUpload } from "@/components/PhotoUpload";
import { addPerson, getPerson } from "@/lib/data";

const EditPerson = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNewPerson = name === 'new';
  
  const [formData, setFormData] = useState({
    fullName: isNewPerson ? "" : decodeURIComponent(name || ""),
    birthDate: "",
    phoneNumber: "",
    registrationPlace: "",
    passportNumber: "",
    taxId: "",
    address: "",
    familyStatus: "",
    relatives: "",
    education: "",
    militaryService: "",
    position: "",
    militaryRank: "",
    rank: "",
    additionalInfo1: "",
    additionalInfo2: "",
    photo: ""
  });

  // Load existing data on component mount
  useEffect(() => {
    const loadPerson = async () => {
      if (!isNewPerson && name) {
        const person = await getPerson(decodeURIComponent(name));
        if (person) {
          setFormData(person);
        }
      }
    };
    loadPerson();
  }, [name, isNewPerson]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      if (!formData.fullName.trim()) {
        toast({
          title: "Помилка",
          description: "Будь ласка, введіть П.І.Б.",
          variant: "destructive",
        });
        return;
      }

      // Prepare data for saving
      const dataToSave = {
        ...formData,
        photo: formData.photo || '', // Ensure photo is never undefined
      };

      // Save to IndexedDB with original name for handling name changes
      const originalName = isNewPerson ? undefined : decodeURIComponent(name || "");
      await addPerson(dataToSave, originalName);
      
      toast({
        title: "Дані збережено",
        description: `Інформація про ${formData.fullName} успішно збережена`,
      });
      
      // Navigate back after a short delay
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error('Error saving person:', error);
      toast({
        title: "Помилка",
        description: "Не вдалося зберегти дані",
        variant: "destructive",
      });
    }
  };

  const formFields = [
    // Basic Information
    { section: "Основна інформація", fields: [
      { label: "П.І.Б.", field: "fullName", type: "text" },
      { label: "Дата народження", field: "birthDate", type: "date" },
      { label: "Номер телефону", field: "phoneNumber", type: "text" },
    ]},
    
    // General Information
    { section: "Загальні відомості", fields: [
      { label: "Місце реєстрації", field: "registrationPlace", type: "text" },
      { label: "Номер та серія паспорта", field: "passportNumber", type: "text" },
      { label: "ІПН", field: "taxId", type: "text" },
      { label: "Адреса проживання", field: "address", type: "text" },
      { label: "Сімейний стан", field: "familyStatus", type: "text" },
      { label: "Родичі", field: "relatives", type: "textarea" },
      { label: "Освіта", field: "education", type: "text" },
      { label: "Закінчений НЗ", field: "militaryService", type: "text" },
    ]},
    
    // Military Information
    { section: "Військові відомості", fields: [
      { label: "Посада", field: "position", type: "text" },
      { label: "ВОС", field: "militaryRank", type: "text" },
      { label: "Звання", field: "rank", type: "text" },
      { label: "Додаткова інформація 1", field: "additionalInfo1", type: "text" },
      { label: "Додаткова інформація 2", field: "additionalInfo2", type: "text" },
    ]},
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="mb-4"
          >
            ← Назад до списку
          </Button>
          <h1 className="text-2xl font-bold text-foreground">
            {isNewPerson ? "Додавання нової особи" : `Редагування особи: ${formData.fullName}`}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Photo Section */}
          <div className="lg:col-span-1">
            <Card className="p-4 bg-secondary h-fit">
              <PhotoUpload
                currentPhoto={formData.photo}
                onPhotoChange={(photo) => handleInputChange("photo", photo)}
              />
            </Card>
          </div>

          {/* Form Section - 2 Column Layout */}
          <div className="lg:col-span-4 space-y-6">
            {formFields.map((section, sectionIndex) => (
              <Card key={sectionIndex} className="p-6">
                <div className="bg-primary text-primary-foreground p-3 rounded-lg mb-6">
                  <h3 className="font-semibold text-center">{section.section}</h3>
                </div>
                
                <div className="space-y-4">
                  {section.fields.map((fieldConfig, fieldIndex) => (
                    <div key={fieldIndex} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                      {/* Description Column */}
                      <div className="flex items-center">
                        <Label className="bg-accent text-accent-foreground px-4 py-2 rounded text-sm font-medium w-full text-center">
                          {fieldConfig.label}
                        </Label>
                      </div>
                      
                      {/* Input Column */}
                      <div>
                        {fieldConfig.type === "textarea" ? (
                          <Textarea
                            value={formData[fieldConfig.field as keyof typeof formData]}
                            onChange={(e) => handleInputChange(fieldConfig.field, e.target.value)}
                            className="w-full"
                            rows={3}
                            placeholder={`Введіть ${fieldConfig.label.toLowerCase()}`}
                          />
                        ) : (
                          <Input
                            type={fieldConfig.type}
                            value={formData[fieldConfig.field as keyof typeof formData]}
                            onChange={(e) => handleInputChange(fieldConfig.field, e.target.value)}
                            className="w-full"
                            placeholder={fieldConfig.type === "date" ? "" : `Введіть ${fieldConfig.label.toLowerCase()}`}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}

            {/* Save Button */}
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => navigate("/")}>
                Скасувати
              </Button>
              <Button onClick={handleSave} className="bg-primary text-primary-foreground">
                Зберегти дані
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPerson;
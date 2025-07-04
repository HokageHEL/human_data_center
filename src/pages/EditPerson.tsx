import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const EditPerson = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: decodeURIComponent(name || ""),
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
    photo: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log("Saving person data:", formData);
    // Here you would typically save to a database
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="mb-4"
          >
            ← Назад до списку
          </Button>
          <h1 className="text-2xl font-bold text-foreground">
            Редагування особи
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Photo Section */}
          <div className="lg:col-span-1">
            <Card className="p-4 bg-secondary">
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-4">
                <span className="text-muted-foreground">ФОТО</span>
              </div>
              <Input
                placeholder="URL фото"
                value={formData.photo}
                onChange={(e) => handleInputChange("photo", e.target.value)}
              />
            </Card>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-3 space-y-6">
            {/* Basic Info */}
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label className="text-sm font-medium">П.І.Б.</Label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">ДАТА НАРОДЖЕННЯ</Label>
                  <Input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange("birthDate", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">НОМЕР ТЕЛЕФОНУ</Label>
                  <Input
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </Card>

            {/* General Information */}
            <Card className="p-6">
              <div className="bg-primary text-primary-foreground p-3 rounded-lg mb-4">
                <h3 className="font-semibold text-center">ЗАГАЛЬНІ ВІДОМОСТІ</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="bg-accent text-accent-foreground px-3 py-2 rounded text-sm font-medium">
                      Місце реєстрації
                    </Label>
                    <Input
                      value={formData.registrationPlace}
                      onChange={(e) => handleInputChange("registrationPlace", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="row-span-6">
                    <div className="h-full bg-muted rounded-lg"></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="bg-accent text-accent-foreground px-3 py-2 rounded text-sm font-medium">
                      Номер та серія паспорта
                    </Label>
                    <Input
                      value={formData.passportNumber}
                      onChange={(e) => handleInputChange("passportNumber", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="bg-accent text-accent-foreground px-3 py-2 rounded text-sm font-medium">
                      ІПН
                    </Label>
                    <Input
                      value={formData.taxId}
                      onChange={(e) => handleInputChange("taxId", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="bg-accent text-accent-foreground px-3 py-2 rounded text-sm font-medium">
                      Адреса проживання
                    </Label>
                    <Input
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="bg-accent text-accent-foreground px-3 py-2 rounded text-sm font-medium">
                      Сімейний стан
                    </Label>
                    <Input
                      value={formData.familyStatus}
                      onChange={(e) => handleInputChange("familyStatus", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="bg-accent text-accent-foreground px-3 py-2 rounded text-sm font-medium">
                      Родичі
                    </Label>
                    <Textarea
                      value={formData.relatives}
                      onChange={(e) => handleInputChange("relatives", e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="bg-accent text-accent-foreground px-3 py-2 rounded text-sm font-medium">
                      Освіта
                    </Label>
                    <Input
                      value={formData.education}
                      onChange={(e) => handleInputChange("education", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="bg-accent text-accent-foreground px-3 py-2 rounded text-sm font-medium">
                      Закінчений НЗ
                    </Label>
                    <Input
                      value={formData.militaryService}
                      onChange={(e) => handleInputChange("militaryService", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Military Information */}
            <Card className="p-6">
              <div className="bg-primary text-primary-foreground p-3 rounded-lg mb-4">
                <h3 className="font-semibold text-center">ВІЙСЬКОВІ ВІДОМОСТІ</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="bg-accent text-accent-foreground px-3 py-2 rounded text-sm font-medium">
                      Посада
                    </Label>
                    <Input
                      value={formData.position}
                      onChange={(e) => handleInputChange("position", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="bg-accent text-accent-foreground px-3 py-2 rounded text-sm font-medium">
                      ВОС
                    </Label>
                    <Input
                      value={formData.militaryRank}
                      onChange={(e) => handleInputChange("militaryRank", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="bg-accent text-accent-foreground px-3 py-2 rounded text-sm font-medium">
                      Звання
                    </Label>
                    <Input
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Additional empty fields as shown in the reference */}
                <div className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="bg-accent text-accent-foreground px-3 py-2 rounded text-sm font-medium">
                        Додаткова інформація 1
                      </Label>
                      <Input className="mt-1" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="bg-accent text-accent-foreground px-3 py-2 rounded text-sm font-medium">
                        Додаткова інформація 2
                      </Label>
                      <Input className="mt-1" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => navigate("/")}>
                Скасувати
              </Button>
              <Button onClick={handleSave} className="bg-primary text-primary-foreground">
                Зберегти
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPerson;
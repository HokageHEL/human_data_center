import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useBeforeUnload, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { generatePersonDocument } from "@/lib/docx-generator";
import { Packer } from "docx";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DocumentUpload } from "@/components/DocumentUpload";
import { useToast } from "@/hooks/use-toast";
import { PhotoUpload } from "@/components/PhotoUpload";
import { PPDSection } from "@/components/form/PPDSection";
import { addPerson, getPerson, getPersonIncludingDeleted, deletePerson, permanentlyDeletePerson, restorePerson, Document } from "@/lib/data";
import { GeneralInfoSection } from "@/components/form/GeneralInfoSection";
import { MilitaryDataSection } from "@/components/form/MilitaryDataSection";
import {
  calculateSalary,
  DEPARTMENTS_BY_UNIT,
  MILITARY_RANKS,
} from "@/lib/constants";

const EditPerson = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const isNewPerson = name === "new";
  const isFromArchive = searchParams.get("from") === "archive";
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [formData, setFormData] = useState({
    // Загальні дані
    fullName: isNewPerson ? "" : name ? decodeURIComponent(name) : "",
    passportNumber: "",
    taxId: "",
    registrationPlace: "",
    address: "",
    familyStatus: "",
    relatives: "",
    education: "",
    gender: "Ч" as "Ч" | "Ж",
    birthDate: "",
    phoneNumber: "",
    photo: "",
    documents: [] as Document[],
    additionalInfo: "",

    // Військові дані
    position: "",
    militaryRank: "",
    lastRankDate: "",
    positionRank: "",
    fitnessStatus: "придатний" as "придатний" | "обмежено придатний",
    medicalCommissionNumber: "",
    medicalCommissionDate: "",
    unit: "",
    department: "не_вибрано",
    militarySpecialty: "",
    tariffCategory: 0,
    salary: 0,
    serviceType: "мобілізація" as "мобілізація" | "контракт",
    serviceStartDate: "",
    servicePeriods: "",
    previousServicePlaces: "",
    contractEndDate: "",
    extendedUntilDemobilization: false,
    militaryDocumentNumber: "",
    shpoNumber: "",
    combatExperienceStatus: false,
    combatExperienceNumber: "",
    combatPeriods: "",
    BMT: false,
    BMTUnit: "",
    professionCourse: false,
    professionCourseValue: "",

    // Military orders
    appointedBy: "",
    appointmentOrderNumber: "",
    appointmentOrderDate: "",
    enrollmentOrderNumber: "",
    enrollmentOrderDate: "",
    dismissalOrderNumber: "",
    dismissalOrderDate: "",

    isInPPD: false,
    absenceStatus: "не_вказано" as
      | "не_вказано"
      | "відпустка"
      | "короткострокове лікування"
      | "довгострокове лікування"
      | "відрядження"
      | "декрет"
      | "РВБД"
      | "навчання",
  });

  // Load existing data on component mount
  useEffect(() => {
    const loadPerson = async () => {
      if (!isNewPerson && name) {
        try {
          // Use getPersonIncludingDeleted if coming from archive, otherwise use regular getPerson
          const person = isFromArchive 
            ? await getPersonIncludingDeleted(name)
            : await getPerson(name);
          
          if (person) {
            setFormData({
              ...person,
              documents: person.documents || [],
            });
            setHasUnsavedChanges(false);
          } else {
            toast({
              title: "Помилка",
              description: "Особу не знайдено",
              variant: "destructive",
            });
            navigate(isFromArchive ? "/archive" : "/");
          }
        } catch (error) {
          console.error("Error loading person:", error);
          toast({
            title: "Помилка",
            description: "Помилка завантаження даних",
            variant: "destructive",
          });
          navigate(isFromArchive ? "/archive" : "/");
        }
      }
    };
    loadPerson();
  }, [name, isNewPerson, navigate, toast, isFromArchive]);

  const handleDocumentAdd = (document: Document) => {
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, document],
    }));
    setHasUnsavedChanges(true);
    toast({
      title: "Документ додано",
      description: `Документ "${document.name}" успішно додано`,
    });
  };

  const handleDocumentRemove = (documentId: string) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((doc) => doc.id !== documentId),
    }));
    setHasUnsavedChanges(true);
    toast({
      title: "Документ видалено",
      description: "Документ успішно видалено",
    });
  };

  useBeforeUnload(
    useCallback(
      (event) => {
        if (hasUnsavedChanges) {
          event.preventDefault();
          return (event.returnValue =
            "Ви маєте незбережені зміни. Ви впевнені, що хочете залишити сторінку?");
        }
      },
      [hasUnsavedChanges]
    )
  );

  // Listen for navigation attempts from Header
  useEffect(() => {
    const handleUnsavedChangesCheck = (event: CustomEvent) => {
      if (hasUnsavedChanges) {
        if (
          window.confirm(
            "Ви маєте незбережені зміни. Ви впевнені, що хочете залишити сторінку?"
          )
        ) {
          navigate(event.detail.targetPath);
        }
      } else {
        navigate(event.detail.targetPath);
      }
    };

    window.addEventListener(
      "checkUnsavedChanges",
      handleUnsavedChangesCheck as EventListener
    );

    return () => {
      window.removeEventListener(
        "checkUnsavedChanges",
        handleUnsavedChangesCheck as EventListener
      );
    };
  }, [hasUnsavedChanges, navigate]);

  const handleNavigateBack = () => {
    if (hasUnsavedChanges) {
      if (
        window.confirm(
          "Ви маєте незбережені зміни. Ви впевнені, що хочете залишити сторінку?"
        )
      ) {
        navigate(isFromArchive ? "/archive" : "/");
      }
    } else {
      navigate(isFromArchive ? "/archive" : "/");
    }
  };

  const handleDelete = async () => {
    const confirmMessage = isFromArchive 
      ? "Ви впевнені, що хочете остаточно видалити цю особу?"
      : "Ви впевнені, що хочете видалити цю особу?";
    
    if (window.confirm(confirmMessage)) {
      try {
        if (isFromArchive) {
          await permanentlyDeletePerson(formData.fullName);
          toast({
            title: "Успішно",
            description: `${formData.fullName} остаточно видалено`,
          });
        } else {
          await deletePerson(formData.fullName);
          toast({
            title: "Успішно",
            description: `${formData.fullName} видалено`,
          });
        }
        navigate(isFromArchive ? "/archive" : "/");
      } catch (error) {
        console.error("Error deleting person:", error);
        toast({
          title: "Помилка",
          description: isFromArchive ? "Не вдалося остаточно видалити особу" : "Не вдалося видалити особу",
          variant: "destructive",
        });
      }
    }
  };

  const handleInputChange = (
    field: string,
    value: string | number | boolean | Document[]
  ) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };

      if (field === "isInPPD" && value === true) {
        newData.absenceStatus = "не_вказано";
      }

      return newData;
    });
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    setHasUnsavedChanges(false);
    try {
      // If viewing from archive, restore the person instead of saving
      if (isFromArchive && name) {
        await restorePerson(name);
        toast({
          title: "Успіх",
          description: "Особу відновлено успішно",
        });
        navigate("/"); // Navigate to home page after restore
        return;
      }

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
        photo: formData.photo || "", // Ensure photo is never undefined
      };

      // Save to IndexedDB with original name for handling name changes
      const originalName = isNewPerson
        ? undefined
        : decodeURIComponent(name || "");
      await addPerson(dataToSave, originalName);

      toast({
        title: "Дані збережено",
        description: `Інформація про ${formData.fullName} успішно збережена`,
      });

      // Navigate back after a short delay
      setTimeout(() => {
        navigate(isFromArchive ? "/archive" : "/");
      }, 300);
    } catch (error) {
      console.error("Error saving person:", error);
      toast({
        title: "Помилка",
        description: "Не вдалося зберегти дані",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Функція для розрахунку віку на основі дати народження
  const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">
              {isNewPerson
                ? "Додавання нової особи"
                : `Редагування особи: ${formData.fullName}`}
            </h1>
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={handleNavigateBack}>
              Назад
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                if (!formData.fullName.trim()) {
                  toast({
                    title: "Помилка",
                    description: "Будь ласка, введіть П.І.Б.",
                    variant: "destructive",
                  });
                  return;
                }

                try {
                  const doc = generatePersonDocument(formData);
                  const blob = await Packer.toBlob(doc);
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `${formData.fullName}_картка.docx`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(url);

                  toast({
                    title: "Успішно",
                    description: "Документ Word успішно створено",
                  });
                } catch (error) {
                  console.error("Error generating Word document:", error);
                  toast({
                    title: "Помилка",
                    description: "Не вдалося створити документ Word",
                    variant: "destructive",
                  });
                }
              }}
            >
              Експорт в Word
            </Button>
            {!isNewPerson && (
              <Button variant="destructive" onClick={handleDelete}>
                Видалити
              </Button>
            )}
            <Button onClick={handleSave}>{isFromArchive ? "Відновити" : "Зберегти"}</Button>
          </div>
        </div>
        <Card className="p-6 w-full">
          <div className="text-xl font-semibold mb-4">Основна інформація</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Прізвище, ім'я, по-батькові</Label>
              <Input
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Петренко Іван Васильович"
              />
            </div>
            <div className="space-y-2">
              <Label>№ ШПО</Label>
              <Input
                value={formData.shpoNumber}
                onChange={(e) =>
                  handleInputChange("shpoNumber", e.target.value)
                }
                placeholder="8"
              />
            </div>
            <div className="space-y-2">
              <Label>Стать</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleInputChange("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть стать" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ч">Чоловіча</SelectItem>
                  <SelectItem value="Ж">Жіноча</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Дата народження</Label>
              <div className="flex gap-2 items-center">
                <DatePicker
                  value={formData.birthDate}
                  onChange={(value) => handleInputChange("birthDate", value)}
                  className={
                    calculateAge(formData.birthDate) >= 55
                      ? "border-red-500"
                      : ""
                  }
                  placeholder="24.04.2003"
                />
                <span
                  className={`w-64 ${
                    calculateAge(formData.birthDate) >= 55 ? "text-red-500" : ""
                  }
                  `}
                >
                  Вік: {calculateAge(formData.birthDate)}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Номер телефону</Label>
              <Input
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                placeholder="1234567890"
              />
            </div>
            <div className="space-y-2">
              <Label>Військове звання</Label>
              <Select
                value={formData.militaryRank}
                onValueChange={(value) =>
                  handleInputChange("militaryRank", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть звання" />
                </SelectTrigger>
                <SelectContent>
                  {MILITARY_RANKS.map(({ rank, color }) => (
                    <SelectItem key={rank} value={rank} className={color}>
                      {rank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Посада</Label>
              <Input
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                placeholder="оператор"
              />
            </div>
          </div>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Загальні дані</h2>
            <div className="space-y-4">
              <PhotoUpload
                currentPhoto={formData.photo}
                onPhotoChange={(photoData) =>
                  handleInputChange("photo", photoData)
                }
              />
              <PPDSection
                isInPPD={formData.isInPPD}
                onIsInPPDChange={(isInPPD) =>
                  handleInputChange("isInPPD", isInPPD)
                }
                absenceStatus={formData.absenceStatus}
                onAbsenceStatusChange={(status) =>
                  handleInputChange("absenceStatus", status)
                }
                onStatusChange={(status) => handleInputChange("status", status)}
              />
              <GeneralInfoSection
                formData={formData}
                onInputChange={handleInputChange}
              />
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Військові дані</h2>
            <div className="space-y-4">
              <MilitaryDataSection
                formData={formData}
                onInputChange={handleInputChange}
                militaryRanks={MILITARY_RANKS}
                departmentsByUnit={DEPARTMENTS_BY_UNIT}
                calculateSalary={calculateSalary}
              />
            </div>
          </Card>

          <Card className="p-4 md:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Додаткова інформація</h2>
            <div className="space-y-4">
              <Textarea
                value={formData.additionalInfo}
                onChange={(e) =>
                  handleInputChange("additionalInfo", e.target.value)
                }
                placeholder="Введіть додаткову інформацію"
                className="min-h-[150px]"
              />
            </div>
          </Card>

          <Card className="p-4 md:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Документи</h2>
            <DocumentUpload
              onDocumentAdd={handleDocumentAdd}
              onDocumentRemove={handleDocumentRemove}
              documents={formData.documents}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditPerson;

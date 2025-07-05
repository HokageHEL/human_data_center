import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useBeforeUnload } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { generatePersonDocument } from "@/lib/docx-generator";
import { Packer } from "docx";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import * as Select from "@radix-ui/react-select";
import { ChevronDown as ChevronDownIcon, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const SelectField = ({
  value,
  onChange,
  options,
  placeholder = "Оберіть...",
}: {
  value: string;
  onChange: (value: string) => void;
  options: FieldOption[];
  placeholder?: string;
}) => (
  <Select.Root value={value} onValueChange={onChange}>
    <Select.Trigger className="w-full inline-flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-10">
      <Select.Value placeholder={placeholder} />
      <Select.Icon>
        <ChevronDownIcon />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
        <Select.Viewport className="p-1">
          {options.map((option) => (
            <Select.Item
              key={option.value}
              value={option.value}
              className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${option.className || ""}`}
            >
              <Select.ItemText>{option.label}</Select.ItemText>
              <Select.ItemIndicator className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                <Check className="h-4 w-4" />
              </Select.ItemIndicator>
            </Select.Item>
          ))}
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

const ChevronDownIcon = () => (
  <svg
    width="12"
    height="8"
    viewBox="0 0 12 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 1L6 6L11 1"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
import { useToast } from "@/hooks/use-toast";
import { PhotoUpload } from "@/components/PhotoUpload";
import { addPerson, getPerson } from "@/lib/data";

const EditPerson = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNewPerson = name === "new";
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

    // Військові дані
    position: "",
    militaryRank: "",
    positionRank: "",
    fitnessStatus: "придатний" as "придатний" | "обмежено придатний",
    medicalCommissionInfo: "",
    unit: "",
    department: "",
    militarySpecialty: "",
    tariffCategory: 0,
    salary: 0,
    serviceType: "мобілізація" as "мобілізація" | "контракт",
    serviceStartDate: "",
    servicePeriods: "",
    unitStartDate: "",
    previousServicePlaces: "",
    contractEndDate: "",
    militaryDocumentNumber: "",
    shpoNumber: "",
    combatExperienceStatus: false,
    combatExperienceNumber: "",
    combatPeriods: "",
    isInPPD: false,
  });

  // Load existing data on component mount
  useEffect(() => {
    const loadPerson = async () => {
      if (!isNewPerson && name) {
        console.log('Route parameter name:', name);
        try {
          const person = await getPerson(name); // No need to decode here, getPerson handles it
          console.log('Loaded person data:', person);
          if (person) {
            setFormData(person);
            setHasUnsavedChanges(false);
          } else {
            console.log('Person not found in database');
            toast({
              title: "Помилка",
              description: "Особу не знайдено",
              variant: "destructive",
            });
            navigate('/');
          }
        } catch (error) {
          console.error('Error loading person:', error);
          toast({
            title: "Помилка",
            description: "Помилка завантаження даних",
            variant: "destructive",
          });
          navigate('/');
        }
      }
    };
    loadPerson();
  }, [name, isNewPerson, navigate, toast]);

  useBeforeUnload(
    useCallback(
      (event) => {
        if (hasUnsavedChanges) {
          event.preventDefault();
          return (event.returnValue = "Ви маєте незбережені зміни. Ви впевнені, що хочете залишити сторінку?");
        }
      },
      [hasUnsavedChanges]
    )
  );

  const handleNavigateBack = () => {
    if (hasUnsavedChanges) {
      if (window.confirm("Ви маєте незбережені зміни. Ви впевнені, що хочете залишити сторінку?")) {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  };

  interface FieldOption {
    value: string;
    label: string;
    className?: string;
  }

  interface FieldConfig {
    label: string;
    field: string;
    type: "text" | "textarea" | "date" | "number" | "select" | "switch";
    options?: FieldOption[];
    show?: boolean;
    readonly?: boolean;
    onChange?: (value: any) => void;
  }

  interface FormSection {
    section: string;
    fields: FieldConfig[];
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    setHasUnsavedChanges(false);
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
        navigate("/");
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

  // Список військових звань з кольорами
  const militaryRanks = [
    { rank: "солдат", color: "" },
    { rank: "старший солдат", color: "" },
    { rank: "молодший сержант", color: "text-green-600" },
    { rank: "сержант", color: "text-green-600" },
    { rank: "старший сержант", color: "text-green-600" },
    { rank: "головний сержант", color: "text-green-600" },
    { rank: "штаб-сержант", color: "text-green-600" },
    { rank: "майстер-сержант", color: "text-green-600" },
    { rank: "старший майстер-сержант", color: "text-green-600" },
    { rank: "головний майстер-сержант", color: "text-green-600" },
    { rank: "молодший лейтенант", color: "text-red-600" },
    { rank: "лейтенант", color: "text-red-600" },
    { rank: "старший лейтенант", color: "text-red-600" },
    { rank: "капітан", color: "text-red-600" },
    { rank: "майор", color: "text-red-600" },
    { rank: "підполковник", color: "text-red-600" },
    { rank: "полковник", color: "text-red-600" },
    // { rank: "бригадний генерал", color: "" },
    // { rank: "генерал-майор", color: "" },
    // { rank: "генерал-лейтенант", color: "" },
    // { rank: "генерал", color: "" }
  ];

  // Список відділів за підрозділами
  const departmentsByUnit: Record<string, string[]> = {
    Управління: ["Командування", "Штаб", "Служба ОДТ", "Група логістики"],
    "Основні підрозділи": [
      "Група бойового управління",
      "Група збору та обробки інформації",
      "Група об'єктової розвідки",
      "Група збору інформації №1",
      "Група збору інформації №2",
      "Група збору інформації №3",
    ],
    "Підрозділи забезпечення": [
      "Польовий вузол зв'язку - Апаратна",
      "Польовий вузол зв'язку - Радіостанція",
      "Група автоматизації",
      "Взвод матеріального забезпечення - Автомобільне відділення",
      "Взвод матеріального забезпечення - Господарче відділення",
    ],
  };

  const formFields = [
    {
      section: "Загальні дані",
      fields: [
        { label: "П.І.Б.", field: "fullName", type: "text" },
        { label: "Номер та серія паспорта", field: "passportNumber", type: "text" },
        { label: "ІПН", field: "taxId", type: "text" },
        { label: "Місце реєстрації", field: "registrationPlace", type: "text" },
        { label: "Адреса проживання", field: "address", type: "text" },
        { label: "Сімейний стан", field: "familyStatus", type: "text" },
        { label: "Родичі", field: "relatives", type: "textarea" },
        { label: "Освіта", field: "education", type: "textarea" },
        {
          label: "Стать",
          field: "gender",
          type: "select",
          options: [
            { value: "Ч", label: "Чоловіча" },
            { value: "Ж", label: "Жіноча" },
          ],
        },
        { label: "Дата народження", field: "birthDate", type: "date" },
        { label: "Номер телефону", field: "phoneNumber", type: "text" },
      ],
    },
    {
      section: "Військові дані",
      fields: [
        { label: "Посада", field: "position", type: "text" },
        {
          label: "Військове звання",
          field: "militaryRank",
          type: "select",
          options: militaryRanks.map(({ rank, color }) => ({
            value: rank,
            label: rank,
            className: color,
          })),
        },
        {
          label: "Військове звання (за посадою)",
          field: "positionRank",
          type: "select",
          options: militaryRanks.map(({ rank, color }) => ({
            value: rank,
            label: rank,
            className: color,
          })),
        },
        {
          label: "Придатність до військової служби",
          field: "fitnessStatus",
          type: "select",
          options: [
            { value: "придатний", label: "Придатний" },
            { value: "обмежено придатний", label: "Обмежено придатний" },
          ],
        },
        {
          label: "Номер висновку ВЛК",
          field: "medicalCommissionNumber",
          type: "text",
          show: formData.fitnessStatus === "обмежено придатний",
        },
        {
          label: "Дата висновку ВЛК",
          field: "medicalCommissionDate",
          type: "date",
          show: formData.fitnessStatus === "обмежено придатний",
        },
        {
          label: "Підрозділ",
          field: "unit",
          type: "select",
          options: Object.keys(departmentsByUnit).map((unit) => ({
            value: unit,
            label: unit,
          })),
          onChange: (value) => {
            handleInputChange("department", ""); // Скидаємо відділ при зміні підрозділу
          },
        },
        {
          label: "Відділ",
          field: "department",
          type: "select",
          options: formData.unit
            ? departmentsByUnit[formData.unit]?.map((dept) => ({
                value: dept,
                label: dept,
              })) || []
            : [],
          show: formData.unit && formData.unit !== "",
        },
        { label: "ВОС", field: "militarySpecialty", type: "text" },
        {
          label: "Тарифний розряд",
          field: "tariffCategory",
          type: "number",
          onChange: (value) =>
            handleInputChange("salary", calculateSalary(value)),
        },
        { label: "Оклад", field: "salary", type: "number", readonly: true },
        {
          label: "Тип служби",
          field: "serviceType",
          type: "select",
          options: [
            { value: "мобілізація", label: "Мобілізація" },
            { value: "контракт", label: "Контракт" },
          ],
        },
        {
          label: "Дата призову / укладення контракту",
          field: "serviceStartDate",
          type: "date",
        },
        {
          label: "Періоди проходження служби",
          field: "servicePeriods",
          type: "textarea",
        },
        {
          label: "У військовій частині з",
          field: "unitStartDate",
          type: "date",
        },
        {
          label: "Попередні місця служби",
          field: "previousServicePlaces",
          type: "textarea",
        },
        {
          label: "Дата закінчення контракту",
          field: "contractEndDate",
          type: "date",
          show: formData.serviceType === "контракт",
        },
        {
          label: "Номер військового документа",
          field: "militaryDocumentNumber",
          type: "text",
        },
        { label: "Номер ШПО", field: "shpoNumber", type: "text" },
        {
          label: "УБД",
          field: "combatExperienceStatus",
          type: "switch",
        },
        {
          label: "№ УБД",
          field: "combatExperienceNumber",
          type: "text",
          show: formData.combatExperienceStatus,
        },
        {
          label: "Періоди участі у бойових діях",
          field: "combatPeriods",
          type: "textarea",
        },
      ],
    },
  ];

  // Функція для розрахунку окладу на основі тарифного розряду
  const calculateSalary = (tariffCategory: number): number => {
    // Тут можна додати логіку розрахунку окладу
    return tariffCategory * 1000; // Приклад формули
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <Button variant="outline" onClick={handleNavigateBack}>
              Назад
            </Button>
            <h1 className="text-2xl font-bold">
              {isNewPerson ? "Додавання нової особи" : `Редагування особи: ${formData.fullName}`}
            </h1>
          </div>
          <div className="space-x-2">
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
                  const link = document.createElement('a');
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
                  console.error('Error generating Word document:', error);
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
            <Button onClick={handleSave}>Зберегти</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Photo Section */}
          <Card className="p-4 bg-secondary h-fit">
            <PhotoUpload
              currentPhoto={formData.photo}
              onPhotoChange={(photo) => handleInputChange("photo", photo)}
              isInPPD={formData.isInPPD}
              onIsInPPDChange={(isInPPD) => handleInputChange("isInPPD", isInPPD)}
            />
          </Card>

          {/* Form Section */}
          <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {formFields.map(({ section, fields }) => (
                <Card key={section} className="p-6 space-y-4">
                  <h2 className="text-2xl font-bold">{section}</h2>
                  {fields
                    .filter((field) => field.show !== false)
                    .map((field) => (
                      <div key={field.field} className="space-y-2">
                        <Label>{field.label}</Label>
                        {field.type === "text" && (
                          <Input
                            value={formData[field.field as keyof typeof formData] as string}
                            onChange={(e) => handleInputChange(field.field, e.target.value)}
                            placeholder={`Введіть ${field.label.toLowerCase()}`}
                            readOnly={field.readonly}
                          />
                        )}
                        {field.type === "textarea" && (
                          <Textarea
                            value={formData[field.field as keyof typeof formData] as string}
                            onChange={(e) => handleInputChange(field.field, e.target.value)}
                            placeholder={`Введіть ${field.label.toLowerCase()}`}
                            readOnly={field.readonly}
                          />
                        )}
                        {field.type === "date" && (
                          <Input
                            type="date"
                            value={formData[field.field as keyof typeof formData] as string}
                            onChange={(e) => handleInputChange(field.field, e.target.value)}
                            readOnly={field.readonly}
                          />
                        )}
                        {field.type === "number" && (
                          <Input
                            type="number"
                            value={formData[field.field as keyof typeof formData] as number}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 0;
                              handleInputChange(field.field, value);
                              field.onChange?.(value);
                            }}
                            readOnly={field.readonly}
                          />
                        )}
                        {field.type === "select" && field.options && (
                          <SelectField
                            value={formData[field.field as keyof typeof formData] as string}
                            onChange={(value) => {
                              handleInputChange(field.field, value);
                              field.onChange?.(value);
                            }}
                            options={field.options}
                            placeholder={`Оберіть ${field.label.toLowerCase()}`}
                          />
                        )}
                        {field.type === "switch" && (
                          <div className="flex items-center space-x-2">
                            <Switch
                              id={field.field}
                              checked={formData[field.field as keyof typeof formData] as boolean}
                              onCheckedChange={(checked) => handleInputChange(field.field, checked)}
                            />
                            <Label htmlFor={field.field}>Наявний</Label>
                          </div>
                        )}
                      </div>
                    ))}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPerson;

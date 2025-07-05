import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useBeforeUnload } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import * as Select from "@radix-ui/react-select";
import { ChevronDown as ChevronDownIcon, Check } from "lucide-react";

const SelectField = ({
  value,
  onChange,
  options,
  placeholder = "Оберіть...",
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
              className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${
                option.className || ""
              }`}
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
    fullName: isNewPerson ? "" : decodeURIComponent(name || ""),
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
        const person = await getPerson(decodeURIComponent(name));
        if (person) {
          setFormData(person);
          setHasUnsavedChanges(false);
        }
      }
    };
    loadPerson();
  }, [name, isNewPerson]);

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
  }

  interface FieldConfig {
    label: string;
    field: string;
    type: "text" | "textarea" | "date" | "number" | "select" | "checkbox";
    options?: FieldOption[];
    show?: boolean;
    readonly?: boolean;
    onChange?: (value: any) => void;
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
      }, 1000);
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
    // Загальні дані
    {
      section: "Загальні дані",
      fields: [
        { label: "П.І.Б.", field: "fullName", type: "text" },
        {
          label: "Номер та серія паспорта",
          field: "passportNumber",
          type: "text",
        },
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

    // Військові дані
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
          type: "checkbox",
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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={handleNavigateBack}
            className="mb-4"
          >
            ← Назад до списку
          </Button>
          <h1 className="text-2xl font-bold text-foreground">
            {isNewPerson
              ? "Додавання нової особи"
              : `Редагування особи: ${formData.fullName}`}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Photo Section */}
          <div className="lg:col-span-1">
            <Card className="p-4 bg-secondary h-fit">
              <PhotoUpload
                currentPhoto={formData.photo}
                onPhotoChange={(photo) => handleInputChange("photo", photo)}
                isInPPD={formData.isInPPD}
                onIsInPPDChange={(isInPPD) =>
                  handleInputChange("isInPPD", isInPPD)
                }
              />
            </Card>
          </div>

          {/* Form Section - 2 Column Layout */}
          <div className="lg:col-span-4 space-y-6">
            {formFields.map((section, sectionIndex) => (
              <Card key={sectionIndex} className="p-6">
                <div className="bg-primary text-primary-foreground p-3 rounded-lg mb-6">
                  <h3 className="font-semibold text-center">
                    {section.section}
                  </h3>
                </div>

                <div className="space-y-4">
                  {section.fields.map(
                    (fieldConfig, fieldIndex) =>
                      fieldConfig.show !== false && (
                        <div
                          key={fieldIndex}
                          className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start"
                        >
                          {/* Description Column */}
                          <div className="flex items-center">
                            <Label className="bg-accent text-accent-foreground px-4 py-2 rounded text-sm font-medium w-full text-center">
                              {fieldConfig.label}
                            </Label>
                          </div>

                          {/* Input Column */}
                          <div>
                            <>
                              {fieldConfig.type === "textarea" && (
                                <Textarea
                                  value={
                                    formData[
                                      fieldConfig.field as keyof typeof formData
                                    ] as string
                                  }
                                  onChange={(e) =>
                                    handleInputChange(
                                      fieldConfig.field,
                                      e.target.value
                                    )
                                  }
                                  className="w-full"
                                  rows={3}
                                  placeholder={`Введіть ${fieldConfig.label.toLowerCase()}`}
                                />
                              )}
                              {(fieldConfig.type === "text" ||
                                fieldConfig.type === "date" ||
                                fieldConfig.type === "number") && (
                                <Input
                                  type={fieldConfig.type}
                                  value={
                                    formData[
                                      fieldConfig.field as keyof typeof formData
                                    ]
                                  }
                                  onChange={(e) => {
                                    const value =
                                      fieldConfig.type === "number"
                                        ? Number(e.target.value)
                                        : e.target.value;
                                    handleInputChange(fieldConfig.field, value);
                                    fieldConfig.onChange?.(value);
                                  }}
                                  className="w-full"
                                  placeholder={
                                    fieldConfig.type === "date"
                                      ? ""
                                      : `Введіть ${fieldConfig.label.toLowerCase()}`
                                  }
                                  readOnly={fieldConfig.readonly}
                                />
                              )}
                              {fieldConfig.type === "select" && (
                                <SelectField
                                  value={
                                    formData[
                                      fieldConfig.field as keyof typeof formData
                                    ] as string
                                  }
                                  onChange={(value) => {
                                    handleInputChange(fieldConfig.field, value);
                                    fieldConfig.onChange?.(value);
                                  }}
                                  options={fieldConfig.options || []}
                                  placeholder={`Оберіть ${fieldConfig.label.toLowerCase()}`}
                                />
                              )}
                              {fieldConfig.type === "checkbox" && (
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    checked={
                                      formData[
                                        fieldConfig.field as keyof typeof formData
                                      ] as boolean
                                    }
                                    onCheckedChange={(checked) => {
                                      handleInputChange(
                                        fieldConfig.field,
                                        checked
                                      );
                                      fieldConfig.onChange?.(checked);
                                    }}
                                  />
                                  <span>Наявний</span>
                                </div>
                              )}
                            </>
                          </div>
                        </div>
                      )
                  )}
                </div>
              </Card>
            ))}

            {/* Save Button */}
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => navigate("/")}>
                Скасувати
              </Button>
              <Button
                onClick={handleSave}
                className="bg-primary text-primary-foreground"
              >
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

import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useBeforeUnload } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { generatePersonDocument } from "@/lib/docx-generator";
import { Packer } from "docx";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { DocumentUpload } from "@/components/DocumentUpload";
import { useToast } from "@/hooks/use-toast";
import { PhotoUpload } from "@/components/PhotoUpload";
import { addPerson, getPerson, deletePerson, Document } from "@/lib/data";
import { platform } from "os";

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
  placeholder?: string;
}

interface FormSection {
  section: string;
  fields: FieldConfig[];
}

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
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-full">
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent>
      {options.map((option) => (
        <SelectItem
          key={option.value}
          value={option.value}
          className={option.className}
        >
          {option.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

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
    unitStartDate: "",
    previousServicePlaces: "",
    contractEndDate: "",
    militaryDocumentNumber: "",
    shpoNumber: "",
    combatExperienceStatus: false,
    combatExperienceNumber: "",
    combatPeriods: "",
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

  const renderField = (field: FieldConfig) => {
    if (field.show === false) return null;

    return (
      <div key={field.field} className="space-y-2">
        <Label>{field.label}</Label>
        {field.type === "text" && (
          <Input
            value={formData[field.field as keyof typeof formData] as string}
            onChange={(e) => handleInputChange(field.field, e.target.value)}
            placeholder={
              field.placeholder || `Введіть ${field.label.toLowerCase()}`
            }
            readOnly={field.readonly}
          />
        )}
        {field.type === "textarea" && (
          <Textarea
            value={formData[field.field as keyof typeof formData] as string}
            onChange={(e) => handleInputChange(field.field, e.target.value)}
            placeholder={
              field.placeholder || `Введіть ${field.label.toLowerCase()}`
            }
            readOnly={field.readonly}
          />
        )}
        {field.type === "date" && (
          <div className="flex gap-2 items-center">
            <Input
              type="date"
              value={formData[field.field as keyof typeof formData] as string}
              onChange={(e) => handleInputChange(field.field, e.target.value)}
              readOnly={field.readonly}
            />
          </div>
        )}
        {field.type === "number" && (
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={
              (formData[field.field as keyof typeof formData] as number) || ""
            }
            onChange={(e) => {
              const numericValue = e.target.value.replace(/[^0-9]/g, "");
              const value = numericValue === "" ? 0 : parseInt(numericValue);
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
            placeholder={
              field.placeholder || `Оберіть ${field.label.toLowerCase()}`
            }
          />
        )}
        {field.type === "switch" && (
          <div className="flex items-center space-x-2">
            <Switch
              id={field.field}
              checked={
                formData[field.field as keyof typeof formData] as boolean
              }
              onCheckedChange={(checked) =>
                handleInputChange(field.field, checked)
              }
            />
            <Label htmlFor={field.field}>Наявний</Label>
          </div>
        )}
      </div>
    );
  };

  // Load existing data on component mount
  useEffect(() => {
    const loadPerson = async () => {
      if (!isNewPerson && name) {
        try {
          const person = await getPerson(name);
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
            navigate("/");
          }
        } catch (error) {
          console.error("Error loading person:", error);
          toast({
            title: "Помилка",
            description: "Помилка завантаження даних",
            variant: "destructive",
          });
          navigate("/");
        }
      }
    };
    loadPerson();
  }, [name, isNewPerson, navigate, toast]);

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

  const handleNavigateBack = () => {
    if (hasUnsavedChanges) {
      if (
        window.confirm(
          "Ви маєте незбережені зміни. Ви впевнені, що хочете залишити сторінку?"
        )
      ) {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Ви впевнені, що хочете видалити цю особу?")) {
      try {
        await deletePerson(formData.fullName);
        toast({
          title: "Успішно",
          description: `${formData.fullName} видалено`,
        });
        navigate("/");
      } catch (error) {
        console.error("Error deleting person:", error);
        toast({
          title: "Помилка",
          description: "Не вдалося видалити особу",
          variant: "destructive",
        });
      }
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };

      // Скидаємо статус відсутності, якщо особа в ППД
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
        {
          label: "Прізвище Імʼя По-батькові",
          field: "fullName",
          type: "text",
          placeholder: "Петренко Іван Васильович",
        },
        {
          label: "Номер та серія паспорта",
          field: "passportNumber",
          type: "text",
          placeholder: "12",
        },
        {
          label: "ІПН",
          field: "taxId",
          type: "text",
          placeholder: "123658912",
        },
        {
          label: "Місце реєстрації",
          field: "registrationPlace",
          type: "text",
          placeholder: "Вінниця",
        },
        {
          label: "Адреса проживання",
          field: "address",
          type: "text",
          placeholder: "вул. Хрещатик, 12",
        },
        {
          label: "Родичі",
          field: "relatives",
          type: "textarea",
          placeholder: `мама, папа`,
        },
        {
          label: "Освіта",
          field: "education",
          type: "textarea",
          placeholder: `НТУУ "КПІ"`,
        },
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
        {
          label: "Номер телефону",
          field: "phoneNumber",
          type: "text",
          placeholder: "0971234567",
        },
      ],
    },
    {
      section: "Військові дані",
      fields: [
        {
          label: "Посада",
          field: "position",
          type: "text",
          placeholder: "оператор",
        },

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
          label: "Дата присвоєння останнього звання",
          field: "lastRankDate",
          type: "date",
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
          placeholder: "123456789",
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
            handleInputChange("department", "не_вибрано"); // Скидаємо відділ при зміні підрозділу
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
        {
          label: "ВОС",
          field: "militarySpecialty",
          type: "text",
          placeholder: "041256",
        },
        {
          label: "Тарифний розряд",
          field: "tariffCategory",
          type: "number",
          placeholder: "4",
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
          label: "У військовій частині з",
          field: "unitStartDate",
          type: "date",
        },
        {
          label: "Дата закінчення контракту",
          field: "contractEndDate",
          type: "date",
          show: formData.serviceType === "контракт",
        },
        {
          label: "Періоди проходження служби",
          field: "servicePeriods",
          type: "textarea",
          placeholder: "01.01.2022 - 31.12.2022",
        },
        {
          label: "Попередні місця служби",
          field: "previousServicePlaces",
          type: "textarea",
          placeholder: "A0000",
        },
        {
          label: "Номер військового документа",
          field: "militaryDocumentNumber",
          type: "text",
          placeholder: "1234567SN",
        },
        {
          label: "Номер ШПО",
          field: "shpoNumber",
          type: "text",
          placeholder: "8",
        },
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
          placeholder: "123456789",
        },
        {
          label: "Періоди участі у бойових діях",
          field: "combatPeriods",
          type: "textarea",
          placeholder: "01.09.1939 -- 02.09.1945",
        },
      ],
    },
  ];

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

  const calculateSalary = (tariffCategory: number): number => {
    const tariffToSalary: Record<number, number> = {
      60: 10150,
      59: 10010,
      58: 9870,
      57: 9730,
      56: 9590,
      55: 9440,
      54: 9300,
      53: 9160,
      52: 9020,
      51: 8880,
      50: 8740,
      49: 8600,
      48: 8460,
      47: 8320,
      46: 8180,
      45: 8030,
      44: 7890,
      43: 7750,
      42: 7610,
      41: 7470,
      40: 7330,
      39: 7190,
      38: 7050,
      37: 6910,
      36: 6770,
      35: 6630,
      34: 6480,
      33: 6340,
      32: 6200,
      31: 6060,
      30: 5920,
      29: 5780,
      28: 5640,
      27: 5500,
      26: 5360,
      25: 5220,
      24: 5070,
      23: 4930,
      22: 4790,
      21: 4650,
      20: 4510,
      19: 4370,
      18: 4230,
      17: 4090,
      16: 3950,
      15: 3810,
      14: 3660,
      13: 3520,
      12: 3440,
      11: 3350,
      10: 3260,
      9: 3170,
      8: 3080,
      7: 3000,
      6: 2910,
      5: 2820,
      4: 2730,
      3: 2640,
      2: 2550,
      1: 2470,
    };
    return tariffToSalary[tariffCategory] || 0;
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
            <Button onClick={handleSave}>Зберегти</Button>
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
                <Input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) =>
                    handleInputChange("birthDate", e.target.value)
                  }
                  className={
                    calculateAge(formData.birthDate) >= 55
                      ? "border-red-500"
                      : ""
                  }
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
                  {militaryRanks.map(({ rank, color }) => (
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
                isInPPD={formData.isInPPD}
                onIsInPPDChange={(isInPPD) =>
                  handleInputChange("isInPPD", isInPPD)
                }
                absenceStatus={formData.absenceStatus}
                onAbsenceStatusChange={(status) =>
                  handleInputChange("absenceStatus", status)
                }
                status={formData.status || formData.absenceStatus}
                onStatusChange={(status) => handleInputChange("status", status)}
              />
              {formFields[0].fields.map((field) => renderField(field))}
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Військові дані</h2>
            <div className="space-y-4">
              {formFields[1].fields.map((field) => renderField(field))}
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

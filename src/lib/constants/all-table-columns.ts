// Complete table column definitions based on Person interface

export interface TableColumn {
  field: string;
  label: string;
  width: number;
  minWidth?: number;
  maxWidth?: number;
  category: "military" | "personal" | "system";
  subcategory?: string;
}

// All possible table columns based on Person interface
export const ALL_TABLE_COLUMNS: TableColumn[] = [
  // System/Generated fields
  {
    field: "shpoNumber",
    label: "№",
    width: 60,
    minWidth: 10,
    maxWidth: 120,
    category: "system",
  },
  {
    field: "completionPercentage",
    label: "Заповнено",
    width: 120,
    minWidth: 10,
    maxWidth: 150,
    category: "system",
  },
  {
    field: "isInPPD",
    label: "ППД",
    width: 100,
    minWidth: 10,
    maxWidth: 120,
    category: "system",
  },

  // Personal Information
  {
    field: "fullName",
    label: "ПІБ",
    width: 300,
    minWidth: 10,
    maxWidth: 350,
    category: "personal",
  },
  {
    field: "age",
    label: "Вік",
    width: 61,
    minWidth: 10,
    maxWidth: 100,
    category: "personal",
  },
  {
    field: "passportNumber",
    label: "Номер паспорта",
    width: 150,
    minWidth: 10,
    maxWidth: 200,
    category: "personal",
  },
  {
    field: "taxId",
    label: "ІПН",
    width: 120,
    minWidth: 10,
    maxWidth: 150,
    category: "personal",
  },
  {
    field: "registrationPlace",
    label: "Місце реєстрації",
    width: 200,
    minWidth: 10,
    maxWidth: 300,
    category: "personal",
  },
  {
    field: "address",
    label: "Адреса проживання",
    width: 200,
    minWidth: 10,
    maxWidth: 300,
    category: "personal",
  },
  {
    field: "familyStatus",
    label: "Сімейний стан",
    width: 150,
    minWidth: 10,
    maxWidth: 200,
    category: "personal",
  },
  {
    field: "relatives",
    label: "Родичі",
    width: 200,
    minWidth: 10,
    maxWidth: 300,
    category: "personal",
  },
  {
    field: "education",
    label: "Освіта",
    width: 150,
    minWidth: 10,
    maxWidth: 200,
    category: "personal",
  },
  {
    field: "gender",
    label: "Стать",
    width: 100,
    minWidth: 10,
    maxWidth: 120,
    category: "personal",
  },
  {
    field: "birthDate",
    label: "Дата народження",
    width: 150,
    minWidth: 10,
    maxWidth: 200,
    category: "personal",
  },
  {
    field: "phoneNumber",
    label: "Номер телефону",
    width: 150,
    minWidth: 10,
    maxWidth: 200,
    category: "personal",
  },
  {
    field: "additionalInfo",
    label: "Додаткова інформація",
    width: 200,
    minWidth: 10,
    maxWidth: 300,
    category: "personal",
  },

  // Military Information
  {
    field: "position",
    label: "Посада",
    width: 200,
    minWidth: 10,
    maxWidth: 300,
    category: "military",
    subcategory: "Посада та звання",
  },
  {
    field: "militaryRank",
    label: "Військове звання",
    width: 150,
    minWidth: 10,
    maxWidth: 250,
    category: "military",
    subcategory: "Посада та звання",
  },
  {
    field: "lastRankDate",
    label: "Дата останнього звання",
    width: 150,
    minWidth: 10,
    maxWidth: 200,
    category: "military",
    subcategory: "Посада та звання",
  },
  {
    field: "positionRank",
    label: "Посадове звання",
    width: 150,
    minWidth: 10,
    maxWidth: 200,
    category: "military",
    subcategory: "Посада та звання",
  },
  {
    field: "fitnessStatus",
    label: "Придатність",
    width: 150,
    minWidth: 10,
    maxWidth: 200,
    category: "military",
    subcategory: "Медичні дані",
  },
  {
    field: "medicalCommissionNumber",
    label: "№ мед. комісії",
    width: 150,
    minWidth: 10,
    maxWidth: 200,
    category: "military",
    subcategory: "Медичні дані",
  },
  {
    field: "medicalCommissionDate",
    label: "Дата мед. комісії",
    width: 150,
    minWidth: 10,
    maxWidth: 200,
    category: "military",
    subcategory: "Медичні дані",
  },
  {
    field: "unit",
    label: "Підрозділ",
    width: 150,
    minWidth: 10,
    maxWidth: 200,
    category: "military",
    subcategory: "Підрозділ та спеціальність",
  },
  {
    field: "department",
    label: "Відділ",
    width: 150,
    minWidth: 10,
    maxWidth: 200,
    category: "military",
    subcategory: "Підрозділ та спеціальність",
  },
  {
    field: "militarySpecialty",
    label: "Військова спеціальність",
    width: 200,
    minWidth: 10,
    maxWidth: 300,
    category: "military",
    subcategory: "Підрозділ та спеціальність",
  },
  {
    field: "tariffCategory",
    label: "Тарифний розряд",
    width: 150,
    minWidth: 10,
    maxWidth: 200,
    category: "military",
    subcategory: "Підрозділ та спеціальність",
  },
  {
    field: "salary",
    label: "Оклад",
    width: 120,
    minWidth: 10,
    maxWidth: 150,
    category: "military",
    subcategory: "Підрозділ та спеціальність",
  },
  {
    field: "serviceType",
    label: "Тип служби",
    width: 120,
    minWidth: 10,
    maxWidth: 150,
    category: "military",
    subcategory: "Інформація про службу",
  },
  {
    field: "serviceStartDate",
    label: "Початок служби",
    width: 150,
    minWidth: 10,
    maxWidth: 200,
    category: "military",
    subcategory: "Інформація про службу",
  },
  {
    field: "servicePeriods",
    label: "Періоди служби",
    width: 200,
    minWidth: 10,
    maxWidth: 300,
    category: "military",
    subcategory: "Інформація про службу",
  },
  {
    field: "previousServicePlaces",
    label: "Попередні місця служби",
    width: 200,
    minWidth: 10,
    maxWidth: 300,
    category: "military",
    subcategory: "Інформація про службу",
  },
  {
    field: "contractEndDate",
    label: "Кінець контракту",
    width: 150,
    minWidth: 10,
    maxWidth: 200,
    category: "military",
    subcategory: "Інформація про службу",
  },
  {
    field: "extendedUntilDemobilization",
    label: "До оголошення демобілізації",
    width: 200,
    minWidth: 10,
    maxWidth: 250,
    category: "military",
    subcategory: "Інформація про службу",
  },
  {
    field: "militaryDocumentNumber",
    label: "№ військового документа",
    width: 180,
    minWidth: 10,
    maxWidth: 250,
    category: "military",
    subcategory: "Документи та бойовий досвід",
  },
  {
    field: "combatExperienceStatus",
    label: "Бойовий досвід",
    width: 150,
    minWidth: 10,
    maxWidth: 200,
    category: "military",
    subcategory: "Документи та бойовий досвід",
  },
  {
    field: "combatExperienceNumber",
    label: "№ бойового досвіду",
    width: 150,
    minWidth: 10,
    maxWidth: 200,
    category: "military",
    subcategory: "Документи та бойовий досвід",
  },
  {
    field: "combatPeriods",
    label: "Періоди бойових дій",
    width: 200,
    minWidth: 10,
    maxWidth: 300,
    category: "military",
    subcategory: "Документи та бойовий досвід",
  },
  {
    field: "BMT",
    label: "БЗВП",
    width: 100,
    minWidth: 10,
    maxWidth: 120,
    category: "military",
    subcategory: "Навчання та підготовка",
  },
  {
    field: "BMTUnit",
    label: "Частина БЗВП",
    width: 200,
    minWidth: 10,
    maxWidth: 300,
    category: "military",
    subcategory: "Навчання та підготовка",
  },
  {
    field: "professionCourse",
    label: "ФАХ",
    width: 150,
    minWidth: 10,
    maxWidth: 200,
    category: "military",
    subcategory: "Навчання та підготовка",
  },
  {
    field: "professionCourseValue",
    label: "ВОС за ФАХом",
    width: 200,
    minWidth: 10,
    maxWidth: 300,
    category: "military",
    subcategory: "Навчання та підготовка",
  },
  // Military orders
  {
    field: "appointedBy",
    label: "Ким призначений",
    width: 200,
    minWidth: 10,
    maxWidth: 300,
    category: "military",
    subcategory: "Накази та призначення",
  },
  {
    field: "appointmentOrderNumber",
    label: "№ наказу про призначення",
    width: 200,
    minWidth: 10,
    maxWidth: 300,
    category: "military",
    subcategory: "Накази та призначення",
  },
  {
    field: "appointmentOrderDate",
    label: "Дата наказу про призначення",
    width: 200,
    minWidth: 10,
    maxWidth: 300,
    category: "military",
    subcategory: "Накази та призначення",
  },
  {
    field: "enrollmentOrderNumber",
    label: "№ наказу про зарахування",
    width: 200,
    minWidth: 10,
    maxWidth: 300,
    category: "military",
    subcategory: "Накази та призначення",
  },
  {
    field: "enrollmentOrderDate",
    label: "Дата наказу про зарахування",
    width: 200,
    minWidth: 10,
    maxWidth: 300,
    category: "military",
    subcategory: "Накази та призначення",
  },
  {
    field: "dismissalOrderNumber",
    label: "№ наказу про виключення",
    width: 200,
    minWidth: 10,
    maxWidth: 300,
    category: "military",
    subcategory: "Накази та призначення",
  },
  {
    field: "dismissalOrderDate",
    label: "Дата наказу про виключення",
    width: 200,
    minWidth: 10,
    maxWidth: 300,
    category: "military",
    subcategory: "Накази та призначення",
  },
  {
    field: "status",
    label: "Статус",
    width: 150,
    minWidth: 10,
    maxWidth: 200,
    category: "military",
    subcategory: "Інформація про службу",
  },
];

// Default visible columns (same as current DEFAULT_TABLE_COLUMNS)
export const DEFAULT_VISIBLE_COLUMNS = [
  "shpoNumber",
  "fullName",
  "militaryRank",
  "position",
  "unit",
  "isInPPD",
];

// Local storage key for visible columns
export const VISIBLE_COLUMNS_STORAGE_KEY = "visibleTableColumns";

// Helper function to get visible columns based on user preferences
export const getVisibleColumns = (): string[] => {
  try {
    const stored = localStorage.getItem(VISIBLE_COLUMNS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_VISIBLE_COLUMNS;
  } catch (error) {
    console.error("Error getting visible columns:", error);
    return DEFAULT_VISIBLE_COLUMNS;
  }
};

// Helper function to save visible columns to localStorage
export const saveVisibleColumns = (columns: string[]): void => {
  try {
    localStorage.setItem(VISIBLE_COLUMNS_STORAGE_KEY, JSON.stringify(columns));
    // Dispatch custom event to notify components about column changes
    window.dispatchEvent(
      new CustomEvent("columnVisibilityChanged", {
        detail: { columns },
      })
    );
  } catch (error) {
    console.error("Failed to save visible columns:", error);
  }
};

// Helper function to get table columns configuration based on visible columns
export const getTableColumnsConfig = (
  visibleColumns?: string[]
): TableColumn[] => {
  const visible = visibleColumns || getVisibleColumns();

  // Create a map for quick lookup of column definitions
  const columnMap = new Map(ALL_TABLE_COLUMNS.map((col) => [col.field, col]));

  // Return columns in the order they appear in the visible array
  return visible
    .map((field) => columnMap.get(field))
    .filter((col): col is TableColumn => col !== undefined);
};

// Table configuration constants

export interface TableColumn {
  field: string;
  label: string;
  width: number; // width in pixels
  minWidth?: number;
  maxWidth?: number;
}

export const DEFAULT_TABLE_COLUMNS: TableColumn[] = [
  { field: "shpoNumber", label: "№", width: 60, minWidth: 10, maxWidth: 120 },
  { field: "fullName", label: "ПІБ", width: 300, minWidth: 10, maxWidth: 350 },
  {
    field: "militaryRank",
    label: "Військове звання",
    width: 150,
    minWidth: 10,
    maxWidth: 250,
  },
  {
    field: "position",
    label: "Посада",
    width: 200,
    minWidth: 10,
    maxWidth: 300,
  },
  {
    field: "birthDate",
    label: "Дата народження",
    width: 150,
    minWidth: 10,
    maxWidth: 200,
  },
  { field: "age", label: "Вік", width: 60, minWidth: 10, maxWidth: 100 },
  {
    field: "completionPercentage",
    label: "Заповнено",
    width: 120,
    minWidth: 10,
    maxWidth: 150,
  },
  { field: "gender", label: "Стать", width: 100, minWidth: 10, maxWidth: 120 },
];

// Fields that should be excluded from exports
export const EXPORT_EXCLUDED_FIELDS = ["completionPercentage", "isInPPD"];

// Helper function to get export columns
export const getExportColumns = (columns: TableColumn[]): TableColumn[] => {
  return columns.filter((col) => !EXPORT_EXCLUDED_FIELDS.includes(col.field));
};

// Local storage key for table columns
export const TABLE_COLUMNS_STORAGE_KEY = "tableColumns";

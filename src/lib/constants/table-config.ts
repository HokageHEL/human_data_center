// Table configuration constants

export interface TableColumn {
  field: string;
  label: string;
  width: string;
}

export const DEFAULT_TABLE_COLUMNS: TableColumn[] = [
  { field: "shpoNumber", label: "№", width: "w-[80px]" },
  { field: "fullName", label: "ПІБ", width: "w-[200px]" },
  { field: "militaryRank", label: "Військове звання", width: "w-[150px]" },
  { field: "position", label: "Посада", width: "w-[150px]" },
  { field: "birthDate", label: "Дата народження", width: "w-[150px]" },
  { field: "age", label: "Вік", width: "w-[80px]" },
  { field: "completionPercentage", label: "Заповнено", width: "w-[120px]" },
  { field: "gender", label: "Стать", width: "w-[100px]" },
];

// Fields that should be excluded from exports
export const EXPORT_EXCLUDED_FIELDS = ['completionPercentage', 'isInPPD'];

// Helper function to get export columns
export const getExportColumns = (columns: TableColumn[]): TableColumn[] => {
  return columns.filter(col => !EXPORT_EXCLUDED_FIELDS.includes(col.field));
};

// Local storage key for table columns
export const TABLE_COLUMNS_STORAGE_KEY = 'tableColumns';
/**
 * Constants index file
 * Re-exports all constants for easier importing
 */

// Salary constants
export {
  TARIFF_TO_SALARY,
  calculateSalary,
} from './salary';

// Organization constants
export {
  DEPARTMENTS_BY_UNIT,
  getUnits,
  getDepartmentsByUnit,
} from './organization';

// Status constants
export {
  STATUS_LABELS,
  getStatusKeys,
  getStatusLabel,
  getStatusEntries,
} from './status';

// Military constants
export {
  MILITARY_RANKS,
  getMilitaryRankNames,
  RANK_CATEGORIES,
  isRankInCategory,
  type MilitaryRank,
} from './military';

// Form options constants
export * from './form-options';

// Table configuration constants
export {
  DEFAULT_TABLE_COLUMNS,
  EXPORT_EXCLUDED_FIELDS,
  getExportColumns,
  TABLE_COLUMNS_STORAGE_KEY,
  type TableColumn,
} from './table-config';

// Person field definitions
export * from './person-fields';
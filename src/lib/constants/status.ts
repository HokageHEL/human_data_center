/**
 * Status constants and labels
 * Defines status types and their display labels
 */
export const STATUS_LABELS: Record<string, string> = {
  не_вказано: "Не вказано",
  відпустка: "Відпустка",
  короткострокове_лікування: "Короткострокове лікування",
  довгострокове_лікування: "Довгостроковому лікування",
  відрядження: "Відрядження",
  декрет: "Декрет",
  РВБД: "Район Ведення Бойових Дій",
  навчання: "Навчання",
};

/**
 * Get all available status keys
 * @returns Array of status keys
 */
export const getStatusKeys = (): string[] => {
  return Object.keys(STATUS_LABELS);
};

/**
 * Get display label for a status
 * @param status - The status key
 * @returns The display label for the status
 */
export const getStatusLabel = (status: string): string => {
  return STATUS_LABELS[status] || status;
};

/**
 * Get all status entries as key-value pairs
 * @returns Array of [key, label] tuples
 */
export const getStatusEntries = (): [string, string][] => {
  return Object.entries(STATUS_LABELS);
};
// Form options constants for various select fields

export const ABSENCE_STATUS_OPTIONS = [
  { value: "не_вказано", label: "Не вказано" },
  { value: "відпустка", label: "Відпустка" },
  { value: "короткострокове_лікування", label: "Короткострокове лікування" },
  { value: "довгострокове_лікування", label: "Довгострокове лікування" },
  { value: "відрядження", label: "Відрядження" },
  { value: "декрет", label: "Декрет" },
  { value: "РВБД", label: "Район Ведення Бойових Дій" },
  { value: "навчання", label: "Навчання" },
] as const;

export const FITNESS_STATUS_OPTIONS = [
  { value: "придатний", label: "Придатний" },
  { value: "обмежено придатний", label: "Обмежено придатний" },
] as const;

export const SERVICE_TYPE_OPTIONS = [
  { value: "мобілізація", label: "Мобілізація" },
  { value: "контракт", label: "Контракт" },
] as const;

export const GENDER_OPTIONS = [
  { value: "Ч", label: "Чоловіча" },
  { value: "Ж", label: "Жіноча" },
] as const;

// Type definitions
export type AbsenceStatusValue = typeof ABSENCE_STATUS_OPTIONS[number]['value'];
export type FitnessStatusValue = typeof FITNESS_STATUS_OPTIONS[number]['value'];
export type ServiceTypeValue = typeof SERVICE_TYPE_OPTIONS[number]['value'];
export type GenderValue = typeof GENDER_OPTIONS[number]['value'];

// Helper functions
export const getAbsenceStatusLabel = (value: string): string => {
  const option = ABSENCE_STATUS_OPTIONS.find(opt => opt.value === value);
  return option?.label || value;
};

export const getFitnessStatusLabel = (value: string): string => {
  const option = FITNESS_STATUS_OPTIONS.find(opt => opt.value === value);
  return option?.label || value;
};

export const getServiceTypeLabel = (value: string): string => {
  const option = SERVICE_TYPE_OPTIONS.find(opt => opt.value === value);
  return option?.label || value;
};

export const getGenderLabel = (value: string): string => {
  const option = GENDER_OPTIONS.find(opt => opt.value === value);
  return option?.label || value;
};
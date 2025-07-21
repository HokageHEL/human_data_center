/**
 * Organizational structure constants
 * Defines departments by organizational units
 */
export const DEPARTMENTS_BY_UNIT: Record<string, string[]> = {
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

/**
 * Get all available units
 * @returns Array of unit names
 */
export const getUnits = (): string[] => {
  return Object.keys(DEPARTMENTS_BY_UNIT);
};

/**
 * Get departments for a specific unit
 * @param unit - The unit name
 * @returns Array of department names for the unit
 */
export const getDepartmentsByUnit = (unit: string): string[] => {
  return DEPARTMENTS_BY_UNIT[unit] || [];
};
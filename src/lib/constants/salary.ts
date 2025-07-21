/**
 * Salary calculation constants
 * Maps tariff categories to corresponding salary amounts
 */
export const TARIFF_TO_SALARY: Record<number, number> = {
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

/**
 * Calculate salary based on tariff category
 * @param tariffCategory - The tariff category number
 * @returns The corresponding salary amount
 */
export const calculateSalary = (tariffCategory: number): number => {
  return TARIFF_TO_SALARY[tariffCategory] || 0;
};
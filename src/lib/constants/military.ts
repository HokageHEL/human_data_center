/**
 * Military ranks constants
 * Defines military ranks with their display colors and hierarchy
 */
export interface MilitaryRank {
  rank: string;
  color: string;
}

export const MILITARY_RANKS: MilitaryRank[] = [
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

/**
 * Get military ranks as simple string array for sorting
 * @returns Array of rank names in hierarchical order
 */
export const getMilitaryRankNames = (): string[] => {
  return MILITARY_RANKS.map(rank => rank.rank);
};

/**
 * Get rank categories for filtering
 */
export const RANK_CATEGORIES = {
  OFFICERS: [
    "молодший лейтенант",
    "лейтенант",
    "старший лейтенант",
    "капітан",
    "майор",
    "підполковник",
    "полковник",
  ],
  SERGEANTS: [
    "молодший сержант",
    "сержант",
    "старший сержант",
    "головний сержант",
    "штаб-сержант",
    "майстер-сержант",
    "старший майстер-сержант",
    "головний майстер-сержант",
  ],
  SOLDIERS: ["солдат", "старший солдат"],
};

/**
 * Check if a rank belongs to a specific category
 * @param rank - The military rank to check
 * @param category - The category to check against
 * @returns True if the rank belongs to the category
 */
export const isRankInCategory = (rank: string, category: keyof typeof RANK_CATEGORIES): boolean => {
  return RANK_CATEGORIES[category].includes(rank.toLowerCase());
};
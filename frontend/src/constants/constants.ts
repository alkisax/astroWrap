import type { Planet, Element, Modality } from "../types/types";

// frontend\src\constants\constants.ts
export const url = `${import.meta.env.VITE_API_URL}/api/astro/calculate`;
export const interpretationUrl = import.meta.env.VITE_API_URL;

export const colors = {
  bg: "#0f0f1a",
  panel: "rgba(20, 20, 30, 0.7)",
  primary: "#f5a623", // πορτοκαλοκίτρινο
  secondary: "#6c63ff", // μωβ/astro vibe
  text: "#ffffff",
  dim: "#aaaaaa",
};

export const signs = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

export const planets: Planet[] = [
  "Sun",
  "Moon",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Uranus",
  "Neptune",
  "Pluto",
];

export const mainPoints: string[] = [
  ...planets,
  'ASC',
  'MC'
]

export const signToModality: Record<string, Modality> = {
  Aries: "Cardinal",
  Cancer: "Cardinal",
  Libra: "Cardinal",
  Capricorn: "Cardinal",
  Taurus: "Fixed",
  Leo: "Fixed",
  Scorpio: "Fixed",
  Aquarius: "Fixed",
  Gemini: "Mutable",
  Virgo: "Mutable",
  Sagittarius: "Mutable",
  Pisces: "Mutable",
};

export const planetIcons: Record<string, string> = {
  Sun: "☀️",
  Moon: "🌙",
  Mercury: "☿️",
  Venus: "♀",
  Mars: "♂",
  Jupiter: "♃",
  Saturn: "♄",
  Uranus: "♅",
  Neptune: "♆",
  Pluto: "♇",
  ASC: "⬆️",
  MC: "MC",
};

export const planetSymbolToName: Record<string, string> = {
  "☉": "Sun",
  "☾": "Moon",
  "☿": "Mercury",
  "♀": "Venus",
  "♂": "Mars",
  "♃": "Jupiter",
  "♄": "Saturn",
  "♅": "Uranus",
  "♆": "Neptune",
  "♇": "Pluto",
};

export const planetToNaturalHouse: Record<string, number[]> = {
  Sun: [5],
  Moon: [4],
  Mercury: [3, 6],
  Venus: [2, 7],
  Mars: [1, 8],
  Jupiter: [9, 12],
  Saturn: [10, 11],
  Uranus: [11],
  Neptune: [12],
  Pluto: [8],
};

export const signToPlanet: Record<string, Planet> = {
  Aries: "Mars",
  Taurus: "Venus",
  Gemini: "Mercury",
  Cancer: "Moon",
  Leo: "Sun",
  Virgo: "Mercury",
  Libra: "Venus",
  // Scorpio: "Mars",
  Scorpio: "Pluto",
  Sagittarius: "Jupiter",
  Capricorn: "Saturn",
  // Aquarius: "Saturn",
  // Pisces: "Jupiter",
  Aquarius: "Uranus",
  Pisces: "Neptune",
};

export const signToElement: Record<string, Element> = {
  Aries: "Fire",
  Leo: "Fire",
  Sagittarius: "Fire",

  Taurus: "Earth",
  Virgo: "Earth",
  Capricorn: "Earth",

  Gemini: "Air",
  Libra: "Air",
  Aquarius: "Air",

  Cancer: "Water",
  Scorpio: "Water",
  Pisces: "Water",
};

export const aspectIcons: Record<string, string> = {
  conjunction: "☌",
  sextile: "⚹",
  square: "□",
  trine: "△",
  opposition: "☍",
};

export const aspectDefs = [
  { type: "conjunction", angle: 0, orb: 8 },
  { type: "sextile", angle: 60, orb: 4 },
  { type: "square", angle: 90, orb: 6 },
  { type: "trine", angle: 120, orb: 6 },
  { type: "opposition", angle: 180, orb: 8 },
];

export const signIcons: Record<string, string> = {
  Aries: "♈",
  Taurus: "♉",
  Gemini: "♊",
  Cancer: "♋",
  Leo: "♌",
  Virgo: "♍",
  Libra: "♎",
  Scorpio: "♏",
  Sagittarius: "♐",
  Capricorn: "♑",
  Aquarius: "♒",
  Pisces: "♓",
};

export const planetKeywords = {
  Sun: ["ego", "identity", "will", "vitality"],
  Moon: ["emotions", "instinct", "needs", "home"],
  Mercury: ["communication", "thinking", "learning", "logic"],
  Venus: ["love", "beauty", "attraction", "values"],
  Mars: ["action", "drive", "conflict", "desire"],
  Jupiter: ["growth", "luck", "expansion", "beliefs"],
  Saturn: ["discipline", "limits", "responsibility", "structure"],
  Uranus: ["rebellion", "change", "innovation", "freedom"],
  Neptune: ["dreams", "illusion", "spirituality", "escape"],
  Pluto: ["power", "transformation", "control", "rebirth"],
  ASC: ["self", "appearance", "persona", "first impression"],
};

export const signKeywords = {
  Aries: ["initiative", "impulse", "action", "fire", "ruler ♂"],
  Taurus: ["stability", "material", "patience", "earth", "ruler ♀"],
  Gemini: ["communication", "curiosity", "duality", "air", "ruler ☿"],
  Cancer: ["emotion", "home", "care", "water", "ruler ☾"],
  Leo: ["expression", "ego", "creativity", "fire", "ruler ☉"],
  Virgo: ["analysis", "detail", "service", "earth", "ruler ☿"],
  Libra: ["balance", "relationships", "harmony", "air", "ruler ♀"],
  Scorpio: ["intensity", "secrets", "power", "water", "ruler ♂ (♇)"],
  Sagittarius: ["exploration", "truth", "freedom", "fire", "ruler ♃"],
  Capricorn: ["discipline", "ambition", "structure", "earth", "ruler ♄"],
  Aquarius: ["innovation", "rebellion", "collective", "air", "ruler ♄ (♅)"],
  Pisces: ["dreams", "intuition", "escape", "water", "ruler ♃ (♆)"],
};

export const houseKeywords = {
  1: ["self", "appearance", "identity"],
  2: ["money", "values", "possessions"],
  3: ["communication", "siblings", "learning"],
  4: ["home", "roots", "family"],
  5: ["creativity", "romance", "pleasure"],
  6: ["work", "health", "routine"],
  7: ["relationships", "partners", "others"],
  8: ["transformation", "sex", "shared resources"],
  9: ["travel", "beliefs", "philosophy"],
  10: ["career", "status", "public image"],
  11: ["friends", "groups", "goals"],
  12: ["subconscious", "isolation", "hidden"],
};

export const rulers: Record<string, { traditional: string; modern?: string }> =
  {
    Aries: { traditional: "♂" },
    Taurus: { traditional: "♀" },
    Gemini: { traditional: "☿" },
    Cancer: { traditional: "☾" },
    Leo: { traditional: "☉" },
    Virgo: { traditional: "☿" },
    Libra: { traditional: "♀" },
    Scorpio: { traditional: "♂", modern: "♇" },
    Sagittarius: { traditional: "♃" },
    Capricorn: { traditional: "♄" },
    Aquarius: { traditional: "♄", modern: "♅" },
    Pisces: { traditional: "♃", modern: "♆" },
  };

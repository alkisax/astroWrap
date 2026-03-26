// frontend\src\constants\constants.ts
export const url = "http://localhost:3011/api/astro/calculate";

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

export const signToPlanet: Record<string, string> = {
  Aries: "Mars",
  Taurus: "Venus",
  Gemini: "Mercury",
  Cancer: "Moon",
  Leo: "Sun",
  Virgo: "Mercury",
  Libra: "Venus",
  Scorpio: "Mars",
  Sagittarius: "Jupiter",
  Capricorn: "Saturn",
  Aquarius: "Saturn",
  Pisces: "Jupiter",
};

export const aspectIcons: Record<string, string> = {
  conjunction: "☌",
  sextile: "⚹",
  square: "□",
  trine: "△",
  opposition: "☍",
};

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

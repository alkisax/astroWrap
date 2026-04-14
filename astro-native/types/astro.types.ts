export type AstroHouseSystem =
  | "placidus"
  | "koch"
  | "campanus"
  | "whole-sign"
  | "equal-house"
  | "regiomontanus"
  | "topocentric";

export type AstroZodiacSystem = "tropical" | "sidereal";

export type AstroAspectType =
  | "major"
  | "minor"
  | "conjunction"
  | "opposition"
  | "trine"
  | "square"
  | "sextile"
  | "quincunx"
  | "quintile"
  | "septile"
  | "semi-square"
  | "semi-sextile";

export interface CalculateChartInput {
  year: number;
  month: number; // 1-12 από client/controller
  day: number;
  hour: number;
  minute: number;
  latitude: number;
  longitude: number;
  houseSystem?: AstroHouseSystem;
  zodiac?: AstroZodiacSystem;
  aspectTypes?: AstroAspectType[];
  aspectPoints?: string[];
  aspectWithPoints?: string[];
  customOrbs?: Partial<Record<string, number>>;
  language?: string;
}

export interface BasicPlacement {
  key: string;
  label?: string;
  sign?: string;
  house?: number | null;
  retrograde?: boolean;
  longitude?: number | null;
}

export interface BasicAspect {
  point1Key?: string;
  point1Label?: string;
  point2Key?: string;
  point2Label?: string;
  type?: string;
  orb?: number | null;
  orbFormatted?: string | null;
}

export interface ChartSummary {
  ascendant: BasicPlacement | null;
  midheaven: BasicPlacement | null;
  sun: BasicPlacement | null;
  moon: BasicPlacement | null;
  mercury: BasicPlacement | null;
  venus: BasicPlacement | null;
  mars: BasicPlacement | null;
  jupiter: BasicPlacement | null;
  saturn: BasicPlacement | null;
  uranus: BasicPlacement | null;
  neptune: BasicPlacement | null;
  pluto: BasicPlacement | null;
  northNode: BasicPlacement | null;
  southNode: BasicPlacement | null;
  lilith: BasicPlacement | null;
  houses: Array<{
    house: number;
    sign?: string;
    longitude?: number | null;
  }>;
  aspects: BasicAspect[];
  raw?: unknown;
}

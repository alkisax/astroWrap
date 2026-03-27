// src/types/astro.types.ts

export interface BasicPlacement {
  key: string;
  label?: string;
  sign?: string;
  house?: number | null;
  retrograde?: boolean;
  longitude?: number | null;
}

export interface House {
  house: number;
  sign?: string;
  longitude?: number | null;
}

export interface Aspect {
  point1Key: string;
  point1Label: string;
  point2Key: string;
  point2Label: string;
  type: string;
  orb?: number;
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

  houses: House[];
  aspects?: Aspect[];
}

export type DateType = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

export type Planet =
  | "Sun"
  | "Moon"
  | "Mercury"
  | "Venus"
  | "Mars"
  | "Jupiter"
  | "Saturn"
  | "Uranus"
  | "Neptune"
  | "Pluto";

export type Element = "Fire" | "Earth" | "Air" | "Water";
export type Modality = "Cardinal" | "Fixed" | "Mutable";

// gia aspects σε ASC MC
export type Point = {
  key: string;
  label: string;
  longitude: number;
};

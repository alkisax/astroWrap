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
}
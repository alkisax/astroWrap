// utils/buildEagleGrid.ts

import { planets } from "../constants/constants";
import type { Aspect } from "../types/types";

export type buildTransitAspectsGridCell = Aspect | null;

export type buildTransitAspectsGrid = {
  rows: string[]; // T-planets
  cols: string[]; // N-planets
  grid: buildTransitAspectsGridCell[][];
};

export const buildTransitAspectsGrid = (aspects: Aspect[]): buildTransitAspectsGrid => {
  const grid: buildTransitAspectsGridCell[][] = planets.map(tPlanet =>
    planets.map(nPlanet => {
      const found = aspects.find(a =>
        a.point1Label === `T-${tPlanet}` &&
        a.point2Label === `N-${nPlanet}`
      );

      return found ?? null;
    })
  );

  return {
    rows: planets,
    cols: planets,
    grid,
  };
};
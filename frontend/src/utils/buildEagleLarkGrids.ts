// utils/buildEagleLarkGrids.ts

// import { planetToNaturalHouse } from "../constants/constants";
import type { ChartSummary, Aspect, Planet, EagleGrid } from "../types/types";
import { computeHouseRulers } from "./houseRulers";

const planetMap = (data: ChartSummary) => ({
  Sun: data.sun,
  Moon: data.moon,
  Mercury: data.mercury,
  Venus: data.venus,
  Mars: data.mars,
  Jupiter: data.jupiter,
  Saturn: data.saturn,
  Uranus: data.uranus,
  Neptune: data.neptune,
  Pluto: data.pluto,
});

const getPlanet = (data: ChartSummary, key: string) => {
  const map = planetMap(data);

  const foundKey = Object.keys(map).find(
    (k) => k.toLowerCase() === key.toLowerCase(),
  ) as Planet | undefined;

  return foundKey ? map[foundKey] : undefined;
};

const getRuledHouses = (
  data: ChartSummary,
  planetName: string
): number[] => {
  const rulers = computeHouseRulers(data);

  return rulers
    .filter((r) => r.ruler === planetName)
    .map((r) => r.house);
};

// const getRuledHouses = (planetName: string): number[] => {
//   return planetToNaturalHouse[planetName] ?? [];
// };

export const buildEagleLarkGrids = (
  radix: ChartSummary,
  transit: ChartSummary,
  aspects: Aspect[],
): EagleGrid[] => {
  return aspects.map((a) => {
    const tName = a.point1Label.replace("T-", "");
    const nName = a.point2Label.replace("N-", "");

    const tNatal = getPlanet(radix, tName);
    const nNatal = getPlanet(radix, nName);
    const tTransit = getPlanet(transit, tName);

    return {
      transitPlanet: tName,
      natalPlanet: nName,
      aspect: a.type,
      orb: a.orb,

      // 🔹 cause
      cause: {
        transitNatalHouse: tNatal?.house ?? null,
        natalHouse: nNatal?.house ?? null,
      },

      // 🔹 action
      action: {
        transitHouse: tTransit?.house ?? null,
      },

      // 🔹 effect
      effect: {
        transitRules: getRuledHouses(radix, tName),
        natalRules: getRuledHouses(radix, nName),
        // transitRules: getRuledHouses(tName),
        // natalRules: getRuledHouses(nName),
      },
    };
  });
};

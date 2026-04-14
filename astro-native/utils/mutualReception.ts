import type { BasicPlacement, ChartSummary, Planet } from "../types/types";
import { planets, signToPlanet } from "../constants/constants";

export const getMutualReceptions = (data: ChartSummary) => {
  const planetMap: Record<Planet, BasicPlacement | null> = {
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
  };

  const receptions: string[][] = [];

  for (const p1 of planets) {
    const sign1 = planetMap[p1]?.sign;
    if (!sign1) continue;

    const ruler1 = signToPlanet[sign1];

    const sign2 = planetMap[ruler1]?.sign;
    if (!sign2) continue;

    const ruler2 = signToPlanet[sign2];

    if (ruler2 === p1 && p1 !== ruler1) {
      receptions.push([p1, ruler1]);
    }
  }

  // remove duplicates (A-B, B-A)
  const unique = Array.from(
    new Set(receptions.map((pair) => pair.sort().join("-"))),
  ).map((str) => str.split("-"));

  return unique;
};

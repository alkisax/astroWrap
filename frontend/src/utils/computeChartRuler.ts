import type { ChartSummary } from "../types/types";
import { planetSymbolToName, rulers } from "../constants/constants";
import { getZodiacSign, getHouse } from "./angleToAstro";

export function computeChartRuler(data: ChartSummary) {
  const asc = data.ascendant;

  if (!asc?.longitude) return null;

  // 1. βρίσκουμε ASC sign
  const ascSign = getZodiacSign(asc.longitude);

  // 2. βρίσκουμε ruler symbol (π.χ. ♂)
  const rulerSymbol = rulers[ascSign]?.traditional;

  if (!rulerSymbol) return null;

  // 3. symbol → planet name
  const rulerPlanet = planetSymbolToName[rulerSymbol];

  if (!rulerPlanet) return null;

  // 4. βρίσκουμε το planet object μέσα στο data
  const planetMap = {
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

  const planetData = planetMap[rulerPlanet as keyof typeof planetMap];

  if (!planetData?.longitude) return null;

  // 5. compute sign + house
  const sign = getZodiacSign(planetData.longitude);
  const cusps = data.houses.map((h) => h.longitude ?? 0);
  const house = getHouse(planetData.longitude, cusps);

  return {
    planet: rulerPlanet,
    sign,
    house,
  };
}

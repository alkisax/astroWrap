import type { ChartSummary } from "../types/types";
import { getZodiacSign, getHouse } from "./astroHelpers";
import { signToPlanet } from "../constants/constants";

export const computeHouseRulers = (data: ChartSummary) => {
  const cusps = data.houses.map((h) => h.longitude ?? 0);

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

  return cusps.map((cuspDeg, i) => {
    const houseNumber = i + 1;

    const sign = getZodiacSign(cuspDeg);
    const ruler = signToPlanet[sign];

    const rulerData = planetMap[ruler as keyof typeof planetMap];

    if (!rulerData?.longitude) {
      return {
        house: houseNumber,
        sign,
        ruler,
        inSign: null,
        inHouse: null,
      };
    }

    const inSign = getZodiacSign(rulerData.longitude);
    const inHouse = getHouse(rulerData.longitude, cusps);

    return {
      house: houseNumber,
      sign,
      ruler,
      inSign,
      inHouse,
    };
  });
};
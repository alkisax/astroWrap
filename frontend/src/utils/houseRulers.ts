import type { ChartSummary } from "../types/types";
// παιρνει τις γωνίες των πλανητών και μου λεει σε ποιο ζώδιο είναι 
// και δημιουργεί απο cusps ranges γωνιών για τον κάθε οίκο (και άρα μπορω να δώ και σε ποιον οικο είναι και το κάθε ζωδιο)
import { getZodiacSign, getHouse } from "./angleToAstro";
import { signToPlanet } from "../constants/constants";

export const computeHouseRulers = (data: ChartSummary) => {
  // παίρνουμε τις γωνίες των οικων απο circular-natal-horoscope-js
  const cusps = data.houses.map((h) => h.longitude ?? 0);

  // παίρνουμε τις γωνίες των πλανητών απο circular-natal-horoscope-js
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

    // βρίσκουμε το ζώδιο της ακμής του οίκου
    const sign = getZodiacSign(cuspDeg);
    // βρίσκουμε τον κυβερνήτη του ζωδίου
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

    // βρίσκουμε ΠΟΥ βρίσκεται ο κυβερνήτης (sign + house)
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
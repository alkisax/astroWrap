// frontend\src\utils\computeChartRuler.ts
import type { ChartSummary } from "../types/types";
import { planetSymbolToName, rulers } from "../constants/constants";
// παιρνει τις γωνίες των πλανητών και μου λεει σε ποιο ζώδιο είναι 
// και δημιουργεί απο cusps ranges γωνιών για τον κάθε οίκο (και άρα μπορω να δώ και σε ποιον οικο είναι και το κάθε ζωδιο)
import { getZodiacSign, getHouse } from "./angleToAstro";

export const computeChartRuler = (data: ChartSummary) => {

  const asc = data.ascendant;

  // asc lgn → η γωνία του asc
  if (asc?.longitude == null) return null; 

  // 1. βρίσκουμε ASC sign
  const ascSign = getZodiacSign(asc.longitude);

  // 2. βρίσκουμε ruler symbol (π.χ. ♂)
  const rulerSymbol = rulers[ascSign]?.traditional;

  if (!rulerSymbol) return null;

  // 3. symbol → planet name
  // είναι λιγο cumbersome αλλα στα constants εχω μια [] με key sign και data planet symbol. οπότε πρέπει να κανουμε μια περιττή μετατροπή του symbol σε name. TODO το [] των πλανητών εκτός απο όνομα να έχει και symbol. Όπως και το [] των ζωδίων να έχει symbol 
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

  if (planetData?.longitude == null) return null;

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

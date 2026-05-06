// utils/TwoChartsAspectFinder.ts

/*
  🔮 TWO CHART ASPECTS (Synastry / Transit Aspects)

  Αυτός ο helper βρίσκει αστρολογικές όψεις μεταξύ δύο charts.
  Συνήθως:
  
  - Transit → Natal
  - Person A → Person B (synastry)

  Η λογική:
  
  1. Παίρνουμε βασικά σημεία από τα δύο charts
     (πλανήτες + angles όπως ASC / MC)

  2. Υπολογίζουμε την γωνιακή απόσταση
     μεταξύ κάθε ζευγαριού σημείων.

  3. Ελέγχουμε αν η απόσταση ταιριάζει
     με γνωστές όψεις:
     
     conjunction = 0°
     sextile = 60°
     square = 90°
     trine = 120°
     opposition = 180°

  4. Αν η απόσταση είναι μέσα στο επιτρεπτό orb,
     καταγράφεται ως aspect.

  Το αποτέλεσμα χρησιμοποιείται για:
  
  - synastry analysis
  - transit interpretation
  - compatibility scoring
  - LLM prompts
  - cross-chart tables
*/

import { aspectDefs } from "../constants/constants";
import type { ChartSummary, Aspect, Point } from "../types/types";

type RawPoint = {
  key?: string;
  label?: string;
  longitude?: number | null;
};

// υπολογίζει την μικρότερη γωνιακή απόσταση
// μεταξύ δύο σημείων στον ζωδιακό κύκλο
const angleDiff = (a: number, b: number) => {
  let diff = Math.abs(a - b);
  if (diff > 180) diff = 360 - diff;
  return diff;
};

const isPoint = (p: unknown): p is Point => {
  const pt = p as RawPoint;

  return (
    typeof pt === "object" &&
    pt !== null &&
    typeof pt.longitude === "number" &&
    typeof pt.key === "string" &&
    typeof pt.label === "string"
  );
};

// βασικά σημεία που συμμετέχουν
// στους cross-chart aspect υπολογισμούς
const allowedKeys = [
  "sun",
  "moon",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
  "ascendant",
  "midheaven",
];

// εξάγει valid astro points από ChartSummary
const getPoints = (data: ChartSummary): Point[] => {
  const base = allowedKeys
    .map((k) => data[k as keyof ChartSummary])
    .filter((p): p is Point => isPoint(p));

  return base;
};

// main synastry / transit aspect finder
export const findTwoChartAspects = (
  radix: ChartSummary,
  transit: ChartSummary,
): Aspect[] => {
  const results: Aspect[] = [];

  const radixPoints = getPoints(radix);
  const transitPoints = getPoints(transit);

  const isAngle = (key: string) => key === "ascendant" || key === "midheaven";

  // συγκρίνουμε κάθε transit point
  // με κάθε radix point
  for (const t of transitPoints) {
    for (const r of radixPoints) {
      const diff = angleDiff(t.longitude, r.longitude);

      for (const asp of aspectDefs) {
        // πόσο κοντά είμαστε στην θεωρητική aspect γωνία
        const orb = Math.abs(diff - asp.angle);

        const maxOrb =
          isAngle(t.key) || isAngle(r.key) ? Math.min(asp.orb, 3) : asp.orb;

        // αν είμαστε μέσα στο orb,
        // τότε θεωρούμε ότι υπάρχει aspect
        if (orb <= maxOrb) {
          results.push({
            point1Key: t.key,
            point1Label: `T-${t.label}`,
            point2Key: r.key,
            point2Label: `N-${r.label}`,
            type: asp.type,
            orb,
          });
        }
      }
    }
  }

  // sort:
  // οι πιο ακριβείς όψεις πρώτες
  return results.sort((a, b) => (a.orb ?? 999) - (b.orb ?? 999));
};

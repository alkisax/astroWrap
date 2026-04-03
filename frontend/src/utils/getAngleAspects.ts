// frontend\src\utils\getAngleAspects.ts

// Δεν χρησιμοποιούμε τα aspects που επιστρέφει το circular-natal-horoscope-js γιατί:
// 1) δεν περιλαμβάνει aspects με angles (Ascendant, Midheaven),
// 2) χρησιμοποιεί μεγαλύτερα orbs που δεν είναι κατάλληλα για angles,
// 3) περιέχει extra points (nodes, stars) που δεν θέλουμε.
// Για αυτό κάνουμε custom υπολογισμό μόνο για angle–planet aspects με πιο αυστηρά criteria.

// Τα aspects είναι γωνιακές σχέσεις μεταξύ δύο σημείων (πλανήτες ή angles) στον ζωδιακό κύκλο.
// Υπολογίζονται βρίσκοντας τη διαφορά μοιρών (0–180°) και ελέγχοντας αν είναι κοντά σε βασικές γωνίες (0°, 60°, 90°, 120°, 180°) μέσα σε ένα επιτρεπτό περιθώριο (orb).

import { aspectDefs } from "../constants/constants";
import type { Aspect, ChartSummary, Point } from "../types/types";

// ενα απλό map των σημαντικών γωνιών με τα ονόματά τους
// επισης αυστηροποιούμε το orb για asc mc isAngle (τα κανονικά orb είναι στο aspectDefs → constants)
const baseDefs = (isAngle: boolean) =>
  isAngle
    ? [
        { type: "conjunction", angle: 0, orb: 3 },
        { type: "sextile", angle: 60, orb: 3 },
        { type: "square", angle: 90, orb: 3 },
        { type: "trine", angle: 120, orb: 3 },
        { type: "opposition", angle: 180, orb: 3 },
      ]
    : aspectDefs;

// παίρνουμε απο τον user ένα orβ weight και με αυτό πολλαπλασιάζουμε τα orbs 0→1 τα μειώνει % και περισσότερο τα αυξάνει
const applyOrbWeight = (
  defs: { type: string; angle: number; orb: number }[],
  weight: number,
) => defs.map((d) => ({ ...d, orb: d.orb * weight }));

// helper func, υπολογίζει την διαφορά δύο γωνιών, αν είναι μεγαλύτερη απο 180 κάνει προσαρμογή απο την άλλη πλευρα (190→10)
const angleDiff = (a: number, b: number) => {
  let diff = Math.abs(a - b);
  if (diff > 180) diff = 360 - diff;
  return diff;
};

type RawPoint = {
  key?: string;
  label?: string;
  longitude?: number | null;
};

// η κύρια συνάρτησή μου, παίρνει απο το home τα data του circular-natal-horoscope-js. Moy επιστρέφει κάτι σαν πχ Sun(sun) - Moon(moon) - square - orb:2
export const getAngleAspects = (data: ChartSummary): Aspect[] => {
  const result: Aspect[] = [];

  const asc = data.ascendant;
  const mc = data.midheaven;

  if (asc?.longitude == null || mc?.longitude == null) return [];

  // προσθέτω δύο ακόμα σημεια για asc mc γιατί δεν μου υπολογιζε τέτοια aspects το circular-natal-horoscope-js.
  const angles: Point[] = [
    { key: "ascendant", label: "Ascendant", longitude: asc.longitude },
    { key: "midheaven", label: "Midheaven", longitude: mc.longitude },
  ];

  // επειδή τα points στα data έχουν διαφορες μορφες και τελος πάντων δεν τις γνωρίζει η TS αυτός είναι ένας type guard που βεβαιώνει πως το σημείο είναι obj, υπάρχει και τα fields του είναι number/string/string
  // (p: unknown): p is Point δεν είναι return type. Λέει στην TypeScript: “αν επιστρέψω true → τότε το p είναι Point” η func επιστρέφει boolean
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

  // παίρνει όλα τα σημεία, ελέγχει οτι είναι valid και κρατάει μόνο τους πλανήτες και οχι τα asc mc. Εδω είναι η σημαντική εισαγωγή των data (γωνίες/lng πλανητών)
  const planets = Object.values(data).filter(
    (p): p is Point =>
      isPoint(p) && p.key !== "ascendant" && p.key !== "midheaven",
  );

  // νέο: ενώνουμε angles + planets για να κάνουμε full aspect calculation
  const allPoints: Point[] = [...angles, ...planets];

  // loop σε όλα τα ζευγάρια (χωρίς duplicates)
  for (let i = 0; i < allPoints.length; i++) {
    for (let j = i + 1; j < allPoints.length; j++) {
      const p1 = allPoints[i];
      const p2 = allPoints[j];

      // υπολογίζει την διαφορά δύο γωνιών
      const diff = angleDiff(p1.longitude, p2.longitude);

      // αν ένα απο τα δύο είναι angle → stricter orb
      const isAngle =
        p1.key === "ascendant" ||
        p1.key === "midheaven" ||
        p2.key === "ascendant" ||
        p2.key === "midheaven";

      // definitions των aspects (dynamic ανάλογα angle ή όχι)
      const defs = applyOrbWeight(
        baseDefs(isAngle),
        1, // προσωρινά default, μετά βάζεις userWeight
      );

      // defs = λίστα πιθανών aspects (conjunction, square κλπ)
      for (const asp of defs) {
        // αν η γωνία είναι πχ 94 → 94-90=4
        const orb = Math.abs(diff - asp.angle);

        // αν είναι μέσα στο επιτρεπτό orb δημιουργεί ένα aspect
        if (orb <= asp.orb) {
          const newAspect: Aspect = {
            point1Key: p1.key,
            point1Label: p1.label,
            point2Key: p2.key,
            point2Label: p2.label,
            type: asp.type,
            orb,
          };

          // έλεγχός για αποφυγή duplicate
          const exists = result.some(
            (r) =>
              r.point1Key === newAspect.point1Key &&
              r.point2Key === newAspect.point2Key &&
              r.type === newAspect.type,
          );

          // και αν δεν υπάρχει το κανει push στο [] των aspects
          if (!exists) result.push(newAspect);
        }
      }
    }
  }

  return result;
};

// frontend/src/utils/houseOverlayBiwheelHeler.ts

import type { BasicPlacement, ChartSummary } from '../types/types';

/**
 * 
 * 🧠 HOUSE OVERLAY (SYNΑSTRY CORE LOGIC)

 * - Παίρνει 2 charts (A και B)
 * - Για κάθε πλανήτη του ενός chart:
 *    → βρίσκει σε ποιο house του άλλου chart πέφτει (με βάση longitude)
 * - επιστρέφει λίστα από overlays
 *
 * ΤΙ ΣΗΜΑΙΝΕΙ ΑΣΤΡΟΛΟΓΙΚΑ:
 * - Είναι το βασικότερο layer του synastry
 * - Δείχνει ΠΟΥ επηρεάζει ο ένας τον άλλον
 *
 * Παραδείγματα:
 * - Venus (B) στο 7ο του A → σχέση / attraction
 * - Mars (B) στο 12ο του A → unconscious tension
 * - Sun (A) στο 4ο του B → emotional bonding
 *
 * 👉 Αυτό ΔΕΝ είναι aspect (γωνία)
 * 👉 Είναι "τοποθέτηση" μέσα στη ζωή του άλλου
 */


/**
 * 🔥 βρίσκει σε ποιο house πέφτει ένα longitude
 *
 * λογική:
 * - κάθε house είναι ένα interval μεταξύ 2 cusps
 * - αν longitude είναι μέσα σε αυτό το interval → ανήκει στο house
 *
 * καλύπτει και wrap-around (πχ 350° → 20°)
 */
export const getHouseFromLongitude = (
  longitude: number,
  cusps: { house: number; longitude: number }[],
): number | null => {
  if (!cusps || cusps.length !== 12) return null;

  for (let i = 0; i < 12; i++) {
    const current = cusps[i];
    const next = cusps[(i + 1) % 12];

    const start = current.longitude;
    const end = next.longitude;

    // 🔁 περίπτωση wrap (πχ 350 → 20)
    if (start > end) {
      if (longitude >= start || longitude < end) {
        return current.house;
      }
    } else {
      if (longitude >= start && longitude < end) {
        return current.house;
      }
    }
  }

  return null;
};


/**
 * 🔥 τύπος για αποτέλεσμα overlay
 */
type Overlay = {
  planet: string;
  fromChart: 'A' | 'B';     // από ποιο chart έρχεται ο πλανήτης
  inHouseOf: 'A' | 'B';     // σε ποιο chart πέφτει
  house: number | null;     // σε ποιο house
};


/**
 * 🔥 ποιοι πλανήτες συμμετέχουν
 */
const allowedKeys = [
  'sun',
  'moon',
  'mercury',
  'venus',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
  'pluto',
];


/**
 * 🔥 strict type για valid planet
 * εγγυάται ότι έχουμε usable δεδομένα
 */
type ValidPlanet = BasicPlacement & {
  longitude: number;
  label: string;
};


/**
 * 🔥 παίρνει planets + angles (ASC, MC)
 * και επιστρέφει μόνο valid entries
 */
const getPlanets = (data: ChartSummary): ValidPlanet[] => {
  // 🔹 βασικοί πλανήτες
  const base = allowedKeys.map(
    k => data[k as keyof ChartSummary] as BasicPlacement | null,
  );

  // 🔹 angles (πολύ σημαντικά στο synastry)
  const extra = [
    data.ascendant,
    data.midheaven,
  ];

  // 🔹 καθαρισμός
  return [...base, ...extra].filter(
    (p): p is ValidPlanet =>
      p !== null &&
      typeof p.longitude === 'number' &&
      typeof p.label === 'string',
  );
};


/**
 * 🔥 καθαρίζει cusps (κρατά μόνο valid longitudes)
 */
const getValidCusps = (houses: ChartSummary['houses']) => {
  return houses.filter(
    (h): h is { house: number; longitude: number } =>
      typeof h.longitude === 'number',
  );
};


/**

 * 🔥 MAIN FUNCTION
 * Λογική:
 *
 * 1. Παίρνουμε όλους τους πλανήτες του A και του B
 * 2. Παίρνουμε τα houses (cusps) του A και του B
 *
 * 3. Για κάθε πλανήτη του B:
 *    ➜ βρίσκουμε σε ποιο house του A πέφτει
 *
 * 4. Για κάθε πλανήτη του A:
 *    ➜ βρίσκουμε σε ποιο house του B πέφτει
 *
 * 5. επιστρέφουμε combined αποτέλεσμα
 */
export const buildHouseOverlay = (
  chartA: ChartSummary,
  chartB: ChartSummary,
): Overlay[] => {
  const results: Overlay[] = [];

  const planetsA = getPlanets(chartA);
  const planetsB = getPlanets(chartB);

  const cuspsA = getValidCusps(chartA.houses);
  const cuspsB = getValidCusps(chartB.houses);

  // 🔁 B planets μέσα στα houses του A
  for (const p of planetsB) {
    const house = getHouseFromLongitude(p.longitude, cuspsA);

    results.push({
      planet: p.label,
      fromChart: 'B',
      inHouseOf: 'A',
      house,
    });
  }

  // 🔁 A planets μέσα στα houses του B
  for (const p of planetsA) {
    const house = getHouseFromLongitude(p.longitude, cuspsB);

    results.push({
      planet: p.label,
      fromChart: 'A',
      inHouseOf: 'B',
      house,
    });
  }

  return results;
};
// frontend/src/utils/natalChartShakeJSONTreeHelper.ts

/**
 * 🎯 LIGHT LLM MODE (natal)
 *
 * κρατάμε:
 * - βασικούς πλανήτες + angles
 * - chart ruler
 * - balance (elements/modalities)
 * - top aspects (dedupe + relevance)
 * - dignities
 * - dispositors (μόνο summary)
 *
 * πετάμε:
 * - duplicate data (points vs analysis.planets)
 * - raw longitude noise
 */

type PlanetName =
  | 'Sun'
  | 'Moon'
  | 'Mercury'
  | 'Venus'
  | 'Mars'
  | 'Jupiter'
  | 'Saturn'
  | 'ASC'
  | 'MC'
  | 'Ascendant'
  | 'Midheaven';

type PlanetItem = {
  planet: string;
  sign: string;
  house: number | null;
};

type Aspect = {
  point1?: string;
  point2?: string;
  type?: string;
  orb?: number;
};

type Dignity = {
  planet: string;
  dignity: string;
};

type DispositorSummary = {
  loops?: string[];
  backbone?: string[];
};

type Payload = {
  meta?: unknown;
  houses?: unknown;
  analysis?: {
    planets?: unknown;
    chartRuler?: unknown;
    balance?: unknown;
    aspects?: unknown;
    dignities?: unknown;
    dynamics?: unknown;
  };
};

// 🔥 allowed planets
const ALLOWED_PLANETS: PlanetName[] = [
  'Sun',
  'Moon',
  'Mercury',
  'Venus',
  'Mars',
  'Jupiter',
  'Saturn',
  'ASC',
  'MC',
  'Ascendant',
  'Midheaven',
];

// 🔒 type guards
const isPlanetArray = (arr: unknown): arr is PlanetItem[] =>
  Array.isArray(arr);

const isAspectArray = (arr: unknown): arr is Aspect[] =>
  Array.isArray(arr);

const isDignityArray = (arr: unknown): arr is Dignity[] =>
  Array.isArray(arr);

// 🔥 normalize
// const normalize = (v?: string): string => (v ?? '').toLowerCase();

// 🔥 dedupe aspects
// const dedupeAspects = (arr: Aspect[]): Aspect[] => {
//   const seen = new Set<string>();

//   return arr.filter((a) => {
//     const p1 = normalize(a.point1);
//     const p2 = normalize(a.point2);

//     if (!p1 || !p2 || p1 === p2) return false;

//     const key = [p1, p2].sort().join('|') + `|${a.type}`;

//     if (seen.has(key)) return false;

//     seen.add(key);
//     return true;
//   });
// };

// 🔥 relevance filter
// const isRelevantAspect = (a: Aspect): boolean => {
// const allowed = [
//   'sun',
//   'moon',
//   'mercury',
//   'venus',
//   'mars',
//   'jupiter',
//   'saturn',
//   'uranus',
//   'neptune',
//   'pluto',
//   'ascendant',
//   'midheaven',
// ]

//   return (
//     allowed.includes(normalize(a.point1)) &&
//     allowed.includes(normalize(a.point2))
//   );
// };

// 🔥 scoring για sorting
// Μετατρέπει το orb σε score
// μικρό orb → μεγάλο score → πιο σημαντικό
// μεγάλο orb → μικρό score
// παράδειγμα: orb 0.5 → score 9.5
// const getAspectScore = (a: Aspect): number => {
//   const orb = a.orb ?? 10;

//   // όσο μικρότερο orb → πιο σημαντικό
//   return 10 - orb;
// };

// 🔥 top aspects
// sort by importance (orb) → κρατάει μόνο τα top 5
// const selectTopAspects = (arr: Aspect[], limit = 5): Aspect[] => {
//   return [...arr]
//     .sort((a, b) => getAspectScore(b) - getAspectScore(a))
//     .slice(0, limit);
// };

// 🔥 filter planets
const filterPlanets = (planets: PlanetItem[]): PlanetItem[] => {
  return planets.filter((p) =>
    ALLOWED_PLANETS.includes(p.planet as PlanetName),
  );
};

// 🔥 simplify dignities
const simplifyDignities = (arr: Dignity[]): Dignity[] => {
  return arr.map((d) => ({
    planet: d.planet,
    dignity: d.dignity,
  }));
};

// 🔥 extract dispositors summary (όχι full chains)
const extractDispositorSummary = (dynamics: unknown): DispositorSummary => {
  if (!dynamics || typeof dynamics !== 'object') return {};

  const d = dynamics as {
    loops?: string[];
    backbone?: string[];
  };

  return {
    loops: d.loops ?? [],
    backbone: d.backbone ?? [],
  };
};

// 🔥 main
export const natalChartShakeJSONTreeHelper = (
  payload: Payload | null | undefined,
) => {
  if (!payload) return null;

  const planets = isPlanetArray(payload.analysis?.planets)
    ? filterPlanets(payload.analysis.planets)
    : [];

const aspects = isAspectArray(payload.analysis?.aspects)
  ? payload.analysis.aspects
  : [];

  const dignities = isDignityArray(payload.analysis?.dignities)
    ? simplifyDignities(payload.analysis.dignities)
    : [];

  const dispositors = extractDispositorSummary(
    payload.analysis?.dynamics,
  );

  // console.log('RAW ASPECTS:', payload.analysis?.aspects)
  return {
    meta: payload.meta,
    planets,
    houses: payload.houses,
    chartRuler: payload.analysis?.chartRuler,
    balance: payload.analysis?.balance,
    aspects,
    dignities,
    dispositors,
  };
};
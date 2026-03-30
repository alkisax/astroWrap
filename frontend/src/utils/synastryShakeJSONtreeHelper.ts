// frontend\src\utils\synastryShakeJSONtreeHelper.ts

/**
 * 🎯 LIGHT LLM MODE (aggressive + weighted)
 *
 * κρατάμε:
 * - personal planets + Jupiter + Saturn + angles
 * - top 5 aspects (weighted score = importance - orb)
 * - overlay μόνο για relevant planets
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

type Aspect = {
  point1Key?: string;
  point1Label?: string;
  point2Key?: string;
  point2Label?: string;
  type?: string;
  orb?: number;
};

type OverlayItem = {
  planet: string;
  fromChart: 'A' | 'B';
  inHouseOf: 'A' | 'B';
  house: number | null;
};

type PlanetItem = {
  planet: string;
  sign: string;
  house: number | null;
};

type PayloadWithAnalysis = {
  meta?: unknown;
  houses?: unknown;
  analysis?: {
    planets?: unknown;
    chartRuler?: unknown;
  };
};

type BiwheelPayload = {
  cross?: {
    aspects?: unknown;
    overlay?: unknown;
  };
};

export type CleanChartPayload = {
  meta?: unknown;
  planets?: PlanetItem[];
  houses?: unknown;
  chartRuler?: unknown;
};

export type CleanCrossPayload = {
  aspects: Aspect[];
  overlay: {
    A: OverlayItem[];
    B: OverlayItem[];
  };
};

export type CleanSynastryPayload = {
  chartA: CleanChartPayload;
  chartB: CleanChartPayload;
  cross: CleanCrossPayload;
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
const isAspectArray = (arr: unknown): arr is Aspect[] => Array.isArray(arr);
const isOverlayArray = (arr: unknown): arr is OverlayItem[] =>
  Array.isArray(arr);
const isPlanetArray = (arr: unknown): arr is PlanetItem[] =>
  Array.isArray(arr);

// 🔥 normalize key
const normalizeAspectKey = (a: Aspect): string => {
  const p1 = a.point1Key ?? a.point1Label ?? '';
  const p2 = a.point2Key ?? a.point2Label ?? '';
  const sorted = [p1, p2].sort().join('|');

  return `${sorted}|${a.type ?? ''}`;
};

// 🔥 dedupe + remove identity
const dedupeAspects = (arr: Aspect[]): Aspect[] => {
  const seen = new Set<string>();

  return arr.filter((a) => {
    const p1 = a.point1Key ?? a.point1Label ?? '';
    const p2 = a.point2Key ?? a.point2Label ?? '';

    if (p1 === p2) return false;

    const key = normalizeAspectKey(a);

    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
};

// 🔥 strict relevance filter (AND)
const isRelevantAspect = (a: Aspect): boolean => {
  const p1 = (a.point1Key ?? '').toLowerCase();
  const p2 = (a.point2Key ?? '').toLowerCase();

  const allowed = [
    'sun',
    'moon',
    'mercury',
    'venus',
    'mars',
    'jupiter',
    'saturn',
    'ascendant',
    'midheaven',
  ];

  return allowed.includes(p1) && allowed.includes(p2);
};

// 🔥 importance weights
const getPlanetWeight = (planet: string): number => {
  const p = planet.toLowerCase();

  if (p === 'sun' || p === 'moon') return 10;
  if (p === 'venus' || p === 'mars') return 8;
  if (p === 'mercury') return 7;
  if (p === 'jupiter' || p === 'saturn') return 6;
  if (p === 'ascendant' || p === 'midheaven') return 7;

  return 0;
};

// 🔥 compute score
const getAspectScore = (a: Aspect): number => {
  const p1 = a.point1Key ?? '';
  const p2 = a.point2Key ?? '';

  const weight =
    getPlanetWeight(p1) + getPlanetWeight(p2);

  const orb = a.orb ?? 10;

  return weight - orb;
};

// 🔥 sort by score (desc)
const sortByScore = (arr: Aspect[]): Aspect[] => {
  return [...arr].sort(
    (a, b) => getAspectScore(b) - getAspectScore(a),
  );
};

// 🔥 keep top 5
const limitAspects = (arr: Aspect[], limit = 5): Aspect[] =>
  arr.slice(0, limit);

// 🔥 filter planets
const filterPlanets = (planets: PlanetItem[]): PlanetItem[] => {
  return planets.filter((p) =>
    ALLOWED_PLANETS.includes(p.planet as PlanetName),
  );
};

// 🔥 group overlay
const groupOverlay = (overlay: OverlayItem[]) => ({
  A: overlay.filter(
    (o) =>
      o.fromChart === 'B' &&
      ALLOWED_PLANETS.includes(o.planet as PlanetName),
  ),
  B: overlay.filter(
    (o) =>
      o.fromChart === 'A' &&
      ALLOWED_PLANETS.includes(o.planet as PlanetName),
  ),
});

// 🔥 clean chart
const cleanChartPayload = (
  payload: PayloadWithAnalysis | null | undefined,
): CleanChartPayload => {
  if (!payload) return {};

  const planets = isPlanetArray(payload.analysis?.planets)
    ? filterPlanets(payload.analysis.planets)
    : undefined;

  return {
    meta: payload.meta,
    planets,
    houses: payload.houses,
    chartRuler: payload.analysis?.chartRuler,
  };
};

// 🔥 clean cross (with scoring)
const cleanCrossPayload = (
  payload: BiwheelPayload | null | undefined,
): CleanCrossPayload => {
  const rawAspects = isAspectArray(payload?.cross?.aspects)
    ? payload.cross!.aspects
    : [];

  const rawOverlay = isOverlayArray(payload?.cross?.overlay)
    ? payload.cross!.overlay
    : [];

  const filteredAspects = limitAspects(
    sortByScore(
      dedupeAspects(rawAspects).filter(isRelevantAspect),
    ),
  );

  return {
    aspects: filteredAspects,
    overlay: groupOverlay(rawOverlay),
  };
};

export const synastryShakeJSONtreeHelper = (
  radixPayload: PayloadWithAnalysis | null | undefined,
  transitPayload: PayloadWithAnalysis | null | undefined,
  biwheelPayload: BiwheelPayload | null | undefined,
): CleanSynastryPayload => {
  return {
    chartA: cleanChartPayload(radixPayload),
    chartB: cleanChartPayload(transitPayload),
    cross: cleanCrossPayload(biwheelPayload),
  };
};
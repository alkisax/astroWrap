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
  | "Sun"
  | "Moon"
  | "Mercury"
  | "Venus"
  | "Mars"
  | "Jupiter"
  | "Saturn"
  | "ASC"
  | "MC"
  | "Ascendant"
  | "Midheaven";

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
  "Sun",
  "Moon",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "ASC",
  "MC",
  "Ascendant",
  "Midheaven",
];

// type guards
// const isPlanetArray = (arr: unknown): arr is PlanetItem[] => Array.isArray(arr);

const isAspectArray = (arr: unknown): arr is Aspect[] => Array.isArray(arr);

const isDignityArray = (arr: unknown): arr is Dignity[] => Array.isArray(arr);

// filter planets
const normalizePlanet = (p: string) => {
  if (p === 'asc') return 'ASC';
  if (p === 'mc') return 'MC';
  return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
};


const filterPlanets = (planets: PlanetItem[]): PlanetItem[] => {
  return planets.filter((p) =>
    ALLOWED_PLANETS.includes(normalizePlanet(p.planet) as PlanetName)
  );
};

// simplify dignities
const simplifyDignities = (arr: Dignity[]): Dignity[] => {
  return arr.map((d) => ({
    planet: d.planet,
    dignity: d.dignity,
  }));
};

// 🔥 extract dispositors summary (όχι full chains)
const extractDispositorSummary = (dynamics: unknown): DispositorSummary => {
  if (!dynamics || typeof dynamics !== "object") return {};

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
  planetInfo: PlanetItem[],
) => {
  if (!payload) return null;

  // const planets = isPlanetArray((payload as any).planetInfo)
  //   ? filterPlanets((payload as any).planetInfo)
  //   : [];

  const planets = filterPlanets(planetInfo);

  const aspects = isAspectArray(payload.analysis?.aspects)
    ? payload.analysis.aspects
    : [];

  const dignities = isDignityArray(payload.analysis?.dignities)
    ? simplifyDignities(payload.analysis.dignities)
    : [];

  const dispositors = extractDispositorSummary(payload.analysis?.dynamics);

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

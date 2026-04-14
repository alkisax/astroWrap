// utils/TwoChartsAspectFinder.ts

import { aspectDefs } from "../constants/constants";
import type { ChartSummary, Aspect, Point } from "../types/types";

type RawPoint = {
  key?: string;
  label?: string;
  longitude?: number | null;
};

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

const getPoints = (data: ChartSummary): Point[] => {
  const base = allowedKeys
    .map((k) => data[k as keyof ChartSummary])
    .filter((p): p is Point => isPoint(p));

  return base;
};

export const findTwoChartAspects = (
  radix: ChartSummary,
  transit: ChartSummary,
): Aspect[] => {
  const results: Aspect[] = [];

  const radixPoints = getPoints(radix);
  const transitPoints = getPoints(transit);

  const isAngle = (key: string) => key === "ascendant" || key === "midheaven";

  for (const t of transitPoints) {
    for (const r of radixPoints) {
      const diff = angleDiff(t.longitude, r.longitude);

      for (const asp of aspectDefs) {
        const orb = Math.abs(diff - asp.angle);

        const maxOrb =
          isAngle(t.key) || isAngle(r.key) ? Math.min(asp.orb, 3) : asp.orb;

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

  return results.sort((a, b) => (a.orb ?? 999) - (b.orb ?? 999));
};

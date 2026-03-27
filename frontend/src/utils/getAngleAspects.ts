import { aspectDefs } from "../constants/constants";
import type { Aspect, ChartSummary, Point } from "../types/types";

const getAspectDefs = (isAngle: boolean) =>
  isAngle
    ? [
        { type: "conjunction", angle: 0, orb: 3 },
        { type: "sextile", angle: 60, orb: 2 },
        { type: "square", angle: 90, orb: 3 },
        { type: "trine", angle: 120, orb: 3 },
        { type: "opposition", angle: 180, orb: 3 },
      ]
    : aspectDefs;

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

export const getAngleAspects = (data: ChartSummary): Aspect[] => {
  const result: Aspect[] = [];

  const asc = data.ascendant;
  const mc = data.midheaven;

  if (asc?.longitude == null || mc?.longitude == null) return [];

  const angles: Point[] = [
    { key: "ascendant", label: "Ascendant", longitude: asc.longitude },
    { key: "midheaven", label: "Midheaven", longitude: mc.longitude },
  ];

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

  const planets = Object.values(data).filter(
    (p): p is Point =>
      isPoint(p) && p.key !== "ascendant" && p.key !== "midheaven",
  );

  for (const angle of angles) {
    for (const planet of planets) {
      const diff = angleDiff(angle.longitude, planet.longitude);

      const defs = getAspectDefs(true); // 🔥 important

      for (const asp of defs) {
        const orb = Math.abs(diff - asp.angle);

        if (orb <= asp.orb) {
          const newAspect: Aspect = {
            point1Key: angle.key,
            point1Label: angle.label,
            point2Key: planet.key,
            point2Label: planet.label,
            type: asp.type,
            orb,
          };

          const exists = result.some(
            (r) =>
              r.point1Key === newAspect.point1Key &&
              r.point2Key === newAspect.point2Key &&
              r.type === newAspect.type,
          );

          if (!exists) result.push(newAspect);
        }
      }
    }
  }

  return result;
};

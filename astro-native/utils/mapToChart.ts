// utils/mapToChart.ts
import type { ChartSummary } from "../types/types";

export function mapToChartData(data: ChartSummary, visiblePlanets: string[]) {
  const all = {
    Sun: [data.sun?.longitude ?? 0],
    Moon: [data.moon?.longitude ?? 0],
    Mercury: [data.mercury?.longitude ?? 0],
    Venus: [data.venus?.longitude ?? 0],
    Mars: [data.mars?.longitude ?? 0],
    Jupiter: [data.jupiter?.longitude ?? 0],
    Saturn: [data.saturn?.longitude ?? 0],
    Uranus: [data.uranus?.longitude ?? 0],
    Neptune: [data.neptune?.longitude ?? 0],
    Pluto: [data.pluto?.longitude ?? 0],
  };

  const filtered = Object.fromEntries(
    Object.entries(all).filter(([key]) => visiblePlanets.includes(key)),
  );

  return {
    planets: filtered,
    cusps: data.houses.map((h) => h.longitude ?? 0),
  };
}

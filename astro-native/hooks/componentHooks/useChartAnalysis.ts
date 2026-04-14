// frontend\src\hooks\componentHooks\useChartAnalysis.ts

import { useMemo } from "react";
import type {
  ChartSummary,
  CustomAspect,
  CustomChartRuler,
  CustomDignity,
  CustomDispositor,
  CustomDynamics,
  CustomHouseRuler,
  DignityType,
  Planet,
  PlanetKey,
} from "../../types/types";

import { computeHouseRulers } from "../../utils/houseRulers";
import { getAngleAspects } from "../../utils/getAngleAspects";
import {
  calculateElementBalance,
  calculateModalityBalance,
} from "../../utils/balanceCalculator";
import { getZodiacSign } from "../../utils/angleToAstro";
import { getAllDispositors } from "../../utils/dispositorCalculator";
import {
  detriment,
  domicile,
  exaltation,
  fall,
} from "../../constants/dignities";
import { getMutualReceptions } from "../../utils/mutualReception";
import { planets } from "../../constants/constants";
import { computeChartRuler } from "../../utils/computeChartRuler";

export const useChartAnalysis = (
  data: ChartSummary | null,
  userOrb: number,
) => {
  const toPlanetKey = (p: Planet): PlanetKey => p.toLowerCase() as PlanetKey;

  // 🔥 HOUSE RULERS
  const houseRulers = useMemo<CustomHouseRuler[]>(() => {
    if (!data) return [];

    return computeHouseRulers(data).map((r) => ({
      ...r,
      ruler: r.ruler.toLowerCase(),
    }));
  }, [data]);

  // 🔥 ASPECTS
  const aspects = useMemo<CustomAspect[]>(() => {
    if (!data) return [];

    const allowed = [
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
    ];

    // ⚠️ SOURCE OF TROUTH για όλα τα aspects. Είτε στο ui είτε στο shaken json
    const finalAspects = getAngleAspects(data, userOrb)
      .filter(
        (a) => allowed.includes(a.point1Key) && allowed.includes(a.point2Key),
      )
      .sort((a, b) => (a.orb ?? 10) - (b.orb ?? 10)) // 🔥 σημαντικό
      .slice(0, 10) // ή 3 ή 5
      .map((a) => ({
        point1: a.point1Key,
        point2: a.point2Key,
        type: a.type,
        orb: a.orb ?? null,
      }));

      return finalAspects
  }, [data, userOrb]);

  // 🔥 BALANCE
  const elements = useMemo(() => {
    if (!data) return null;
    return calculateElementBalance(data);
  }, [data]);

  const modalities = useMemo(() => {
    if (!data) return null;
    return calculateModalityBalance(data);
  }, [data]);

  // 🔥 DIGNITIES
  const dignities = useMemo<CustomDignity[]>(() => {
    if (!data) return [];

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

    return planets
      .map((p): CustomDignity | null => {
        const val = planetMap[p]?.longitude;
        if (val == null) return null;

        const sign = getZodiacSign(val);

        let dignity = "neutral" as DignityType;

        if (domicile[p]?.includes(sign)) dignity = "domicile";
        else if (exaltation[p] === sign) dignity = "exaltation";
        else if (detriment[p]?.includes(sign)) dignity = "detriment";
        else if (fall[p] === sign) dignity = "fall";

        return {
          planet: toPlanetKey(p),
          sign,
          dignity,
        };
      })
      .filter((x): x is CustomDignity => x !== null);
  }, [data]);

  // 🔥 DISPOSITORS
  const dispositors = useMemo<CustomDispositor[]>(() => {
    if (!data) return [];

    return getAllDispositors(data).map((d) => ({
      ...d,
      planet: d.planet.toLowerCase(),
    }));
  }, [data]);

  // 🔥 DYNAMICS
  const dynamics = useMemo<CustomDynamics | null>(() => {
    if (!data) return null;

    const all = getAllDispositors(data);

    const toKey = (p: string): PlanetKey => p.toLowerCase() as PlanetKey;

    const backbone = Array.from(
      new Set(
        all
          .filter((r) => r.result.type === "final")
          .map((r) => {
            const chain = r.result.chain;
            return toKey(chain[chain.length - 1]);
          }),
      ),
    );

    const loops = Array.from(
      new Set(
        all
          .filter((r) => r.result.type === "loop" && r.result.loopStart)
          .map((r) => toKey(r.result.loopStart!)),
      ),
    );

    const mutualReceptions = getMutualReceptions(data).map(
      ([a, b]) => [toKey(a), toKey(b)] as [PlanetKey, PlanetKey],
    );

    return { backbone, loops, mutualReceptions };
  }, [data]);

  const chartRuler = useMemo<CustomChartRuler | null>(() => {
    if (!data) return null;
    return computeChartRuler(data);
  }, [data]);

  return {
    houseRulers,
    aspects,
    balance: elements && modalities ? { elements, modalities } : null,
    dignities,
    dispositors,
    dynamics,
    chartRuler,
  };
};

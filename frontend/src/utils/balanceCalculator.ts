// frontend\src\utils\balanceCalculator.ts

// εχω εναν πίνακα με τι modal/element είναι κάθε ζωδιο στο constants και απλως μετράει πόσα απο τι έχω

import { signToElement, signToModality } from "../constants/constants";
import type { ChartSummary, Modality, Element } from "../types/types";

// απο τα data
const getPlanetSigns = (data: ChartSummary) => [
  data.sun?.sign,
  data.moon?.sign,
  data.mercury?.sign,
  data.venus?.sign,
  data.mars?.sign,
  data.jupiter?.sign,
  data.saturn?.sign,
  data.uranus?.sign,
  data.neptune?.sign,
  data.pluto?.sign,
].filter((s): s is string => !!s);

export const calculateElementBalance = (data: ChartSummary) => {
  const counts: Record<Element, number> = {
    Fire: 0,
    Earth: 0,
    Air: 0,
    Water: 0,
  };

  for (const sign of getPlanetSigns(data)) {
    const el = signToElement[sign];
    if (el) counts[el]++;
  }

  return counts;
};

export const calculateModalityBalance = (data: ChartSummary) => {
  const counts: Record<Modality, number> = {
    Cardinal: 0,
    Fixed: 0,
    Mutable: 0,
  };

  for (const sign of getPlanetSigns(data)) {
    const mod = signToModality[sign];
    if (mod) counts[mod]++;
  }

  return counts;
};
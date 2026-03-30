// frontend/src/utils/synastryCompatibilityHelper.ts

import type { CleanSynastryPayload } from './synastryShakeJSONtreeHelper';

type Score = {
  attraction: number;
  emotional: number;
  communication: number;
  stability: number;
  overall: number;
};

type ExplanationItem = {
  type: 'aspect' | 'overlay';
  text: string;
  score: number;
};

type ScoreWithExplanation = {
  scores: Score;
  explanations: {
    attraction: ExplanationItem[];
    emotional: ExplanationItem[];
    communication: ExplanationItem[];
    stability: ExplanationItem[];
    overall: ExplanationItem[];
  };
};

// 🔥 βάρη aspects
const aspectWeights: Record<string, number> = {
  conjunction: 3,
  trine: 2,
  sextile: 1.5,
  square: -2,
  opposition: -2.5,
};

// 🔥 normalize planet key
const getPlanet = (key?: string): string => (key ?? '').toLowerCase();

// 🔥 base scoring (χωρίς special logic)
const scoreAspect = (type?: string, orb?: number): number => {
  const base = aspectWeights[type ?? ''] ?? 0;

  // 🔥 cutoff → αγνοούμε πολύ loose aspects
  if ((orb ?? 10) > 3) return 0;

  const orbPenalty = (orb ?? 5) * 0.3;

  return base - orbPenalty;
};

// 🔥 polarity fix για συγκεκριμένα ζευγάρια (πχ Venus-Mars)
const getAdjustedAspectScore = (
  p1: string,
  p2: string,
  type?: string,
  orb?: number,
): number => {
  const base = scoreAspect(type, orb);

  // 🔥 Venus-Mars → κρατά attraction ακόμα και σε hard aspects
  if (
    (p1 === 'venus' && p2 === 'mars') ||
    (p1 === 'mars' && p2 === 'venus')
  ) {
    if (type === 'square' || type === 'opposition') {
      return Math.abs(base) * 0.8;
    }
  }

  return base;
};

// 🔥 normalization πιο σταθερό (χωρίς random scaling)
const normalize = (sum: number): number => {
  return Math.max(0, Math.min(10, 5 + sum));
};

// 🔥 overlay generic rules
const overlayRules = (o: {
  planet: string;
  house: number | null;
}): { type: keyof Score; score: number } | null => {
  const p = o.planet.toLowerCase();
  const h = o.house ?? -1;

  // 💖 attraction
  if ((p === 'venus' || p === 'mars') && h === 7) {
    return { type: 'attraction', score: 2 };
  }

  // 🌙 emotional
  if (p === 'moon' && (h === 4 || h === 7)) {
    return { type: 'emotional', score: 2 };
  }

  // 🧠 communication
  if (p === 'mercury' && (h === 3 || h === 7)) {
    return { type: 'communication', score: 1.5 };
  }

  // 🪨 stability
  if (p === 'saturn' && (h === 7 || h === 10)) {
    return { type: 'stability', score: 1.5 };
  }

  return null;
};

// 🔥 main
export const computeCompatibility = (
  data: CleanSynastryPayload,
): ScoreWithExplanation => {
  let attraction = 0;
  let emotional = 0;
  let communication = 0;
  let stability = 0;
  let total = 0;

  const explanations = {
    attraction: [] as ExplanationItem[],
    emotional: [] as ExplanationItem[],
    communication: [] as ExplanationItem[],
    stability: [] as ExplanationItem[],
    overall: [] as ExplanationItem[],
  };

  // 🔥 aspects loop
  data.cross.aspects.forEach((a) => {
    const p1 = getPlanet(a.point1Key);
    const p2 = getPlanet(a.point2Key);

    const s = getAdjustedAspectScore(p1, p2, a.type, a.orb);

    total += s;

    const text = `${p1} ${a.type} ${p2} (orb ${a.orb?.toFixed(2)})`;

    // 🔹 overall
    explanations.overall.push({
      type: 'aspect',
      text,
      score: s,
    });

    // 💖 attraction
    if (['venus', 'mars'].includes(p1) || ['venus', 'mars'].includes(p2)) {
      const other = p1 === 'venus' || p1 === 'mars' ? p2 : p1;

      let label = 'Attraction aspect';

      if (
        (p1 === 'venus' && p2 === 'mars') ||
        (p1 === 'mars' && p2 === 'venus')
      ) {
        label = 'Venus-Mars (strong attraction)';
      } else if (other === 'moon') {
        label = 'Moon-Venus/Mars (romantic/emotional attraction)';
      } else if (other === 'sun') {
        label = 'Sun-Venus/Mars (natural attraction)';
      }

      const finalScore =
        label === 'Venus-Mars (strong attraction)' ? s * 1.3 : s;

      attraction += finalScore;

      explanations.attraction.push({
        type: 'aspect',
        text: `${label}: ${text}`,
        score: finalScore,
      });
    }

    // 🌙 emotional
    if (p1 === 'moon' || p2 === 'moon') {
      const other = p1 === 'moon' ? p2 : p1;

      let label = 'Moon aspect';

      if (other === 'venus') label = 'Moon-Venus (emotional harmony)';
      else if (other === 'mars')
        label = 'Moon-Mars (emotional tension/passion)';
      else if (other === 'saturn') label = 'Moon-Saturn (emotional heaviness)';
      else if (other === 'sun') label = 'Moon-Sun (core emotional bond)';

      let finalScore = s;

      if (other === 'venus') finalScore *= 1.2;
      if (other === 'saturn') finalScore *= 1.2;

      emotional += finalScore;

      explanations.emotional.push({
        type: 'aspect',
        text: `${label}: ${text}`,
        score: finalScore,
      });
    }

    // 🧠 communication
    if (p1 === 'mercury' || p2 === 'mercury') {
      const other = p1 === 'mercury' ? p2 : p1;

      let label = 'Mercury aspect';

      if (other === 'mercury') label = 'Mercury-Mercury (communication flow)';
      else if (other === 'venus')
        label = 'Mercury-Venus (pleasant communication)';
      else if (other === 'mars') label = 'Mercury-Mars (arguments)';
      else if (other === 'saturn')
        label = 'Mercury-Saturn (serious/heavy communication)';
      else if (other === 'moon')
        label = 'Mercury-Moon (emotional communication)';

      let finalScore = s;

      if (other === 'mercury') finalScore *= 1.2;
      if (other === 'mars') finalScore *= 1.1;

      communication += finalScore;

      explanations.communication.push({
        type: 'aspect',
        text: `${label}: ${text}`,
        score: finalScore,
      });
    }

    // 🪨 stability
    if (p1 === 'saturn' || p2 === 'saturn') {
      const other = p1 === 'saturn' ? p2 : p1;

      let label = 'Saturn aspect';

      if (other === 'venus') label = 'Saturn-Venus (long-term bonding)';
      else if (other === 'moon') label = 'Saturn-Moon (emotional burden)';
      else if (other === 'sun') label = 'Saturn-Sun (pressure/responsibility)';
      else if (other === 'mercury')
        label = 'Saturn-Mercury (serious communication)';
      else if (other === 'mars') label = 'Saturn-Mars (blocked energy)';

      let finalScore = s;

      if (other === 'venus') finalScore *= 1.3;
      if (other === 'moon') finalScore *= 1.2;

      stability += finalScore;

      explanations.stability.push({
        type: 'aspect',
        text: `${label}: ${text}`,
        score: finalScore,
      });
    }
  });

  // 🔥 overlay contributions (generic rules)
  data.cross.overlay.A.forEach((o) => {
    const rule = overlayRules(o);

    if (!rule) return;

    if (rule.type === 'attraction') attraction += rule.score;
    if (rule.type === 'emotional') emotional += rule.score;
    if (rule.type === 'communication') communication += rule.score;
    if (rule.type === 'stability') stability += rule.score;

    explanations[rule.type].push({
      type: 'overlay',
      text: `${o.planet} in house ${o.house}`,
      score: rule.score,
    });
  });

  return {
    scores: {
      attraction: normalize(attraction),
      emotional: normalize(emotional),
      communication: normalize(communication),
      stability: normalize(stability),
      overall: normalize(total),
    },
    explanations,
  };
};
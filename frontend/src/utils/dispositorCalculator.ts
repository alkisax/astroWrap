import type { ChartSummary } from "../types/types";
import { signToPlanet } from "../constants/constants";

type Result = {
  chain: string[];
  type: "final" | "loop";
  loopStart?: string;
};

const planetMap = (data: ChartSummary) => ({
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
});

export function getDispositorChain(
  startPlanet: string,
  data: ChartSummary
): Result {
  const visited: string[] = [];
  const chain: string[] = [];

  const planets = planetMap(data);

  let current = startPlanet;

  while (true) {
    // loop detection
    if (visited.includes(current)) {
      return {
        chain,
        type: "loop",
        loopStart: current,
      };
    }

    visited.push(current);

    const placement = planets[current as keyof typeof planets];

    if (!placement?.sign) {
      return {
        chain,
        type: "loop",
      };
    }

    const ruler = signToPlanet[placement.sign];

    // safety (αν κάτι πάει στραβά)
    if (!ruler) {
      return {
        chain,
        type: "loop",
      };
    }

    chain.push(ruler);

    // final dispositor
    if (ruler === current) {
      return {
        chain,
        type: "final",
      };
    }

    current = ruler;
  }
}

export function getAllDispositors(data: ChartSummary) {
  const planets = [
    "Sun",
    "Moon",
    "Mercury",
    "Venus",
    "Mars",
    "Jupiter",
    "Saturn",
    "Uranus",
    "Neptune",
    "Pluto",
  ];

  return planets.map((p) => ({
    planet: p,
    result: getDispositorChain(p, data),
  }));
}
import { signs } from "../constants/constants";

export function getZodiacSign(deg: number) {
  const index = Math.floor(deg / 30);
  return signs[index];
}

export function getHouse(deg: number, cusps: number[]) {
  for (let i = 0; i < cusps.length; i++) {
    const current = cusps[i];
    const next = cusps[(i + 1) % cusps.length];

    if (current < next) {
      if (deg >= current && deg < next) return i + 1;
    } else {
      // wrap 360 → 0
      if (deg >= current || deg < next) return i + 1;
    }
  }
  return null;
}


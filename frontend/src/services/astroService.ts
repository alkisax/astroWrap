// src/services/astroService.ts

import { Horoscope, Origin } from 'circular-natal-horoscope-js';
import type {
  ChartSummary,
  Aspect,
  BasicPlacement,
} from '../types/types';

// 🔥 input type (κρατάς αυτό αν δεν υπάρχει αλλού)
export type CalculateChartInput = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  latitude: number;
  longitude: number;
  houseSystem?: string;
  zodiac?: string;
};

// 🔥 MAIN
export const calculateChart = (
  input: CalculateChartInput
): ChartSummary => {
  const origin = new Origin({
    year: input.year,
    month: input.month - 1,
    date: input.day,
    hour: input.hour,
    minute: input.minute,
    latitude: input.latitude,
    longitude: input.longitude,
  });

  const horoscope = new Horoscope({
    origin,
    houseSystem: input.houseSystem || 'placidus',
    zodiac: input.zodiac || 'tropical',
    aspectTypes: ['major'],
  });

  return {
    ascendant: mapPlacement('ascendant', horoscope?.Ascendant),
    midheaven: mapPlacement('midheaven', horoscope?.Midheaven),

    sun: mapPlacement('sun', horoscope?.CelestialBodies?.sun),
    moon: mapPlacement('moon', horoscope?.CelestialBodies?.moon),
    mercury: mapPlacement('mercury', horoscope?.CelestialBodies?.mercury),
    venus: mapPlacement('venus', horoscope?.CelestialBodies?.venus),
    mars: mapPlacement('mars', horoscope?.CelestialBodies?.mars),
    jupiter: mapPlacement('jupiter', horoscope?.CelestialBodies?.jupiter),
    saturn: mapPlacement('saturn', horoscope?.CelestialBodies?.saturn),
    uranus: mapPlacement('uranus', horoscope?.CelestialBodies?.uranus),
    neptune: mapPlacement('neptune', horoscope?.CelestialBodies?.neptune),
    pluto: mapPlacement('pluto', horoscope?.CelestialBodies?.pluto),

    houses: mapHouses(horoscope?.Houses),
    aspects: mapAspects(horoscope?.Aspects?.all),
  };
};

// 🔥 placement mapper
const mapPlacement = (
  key: string,
  source: unknown
): BasicPlacement | null => {
  if (!source || typeof source !== 'object') return null;

  const s = source as {
    label?: string;
    Sign?: { label?: string; key?: string };
    sign?: string;
    House?: { id?: number };
    house?: { id?: number } | number;
    isRetrograde?: boolean;
    retrograde?: boolean;
    ChartPosition?: {
      Ecliptic?: { DecimalDegrees?: number };
      Horizon?: { DecimalDegrees?: number };
    };
  };

  return {
    key,
    label: s.label,
    sign: s.Sign?.label || s.Sign?.key || s.sign || undefined,
    house:
      s.House?.id ??
      (typeof s.house === 'object' ? s.house?.id : s.house) ??
      null,
    retrograde: s.isRetrograde ?? s.retrograde ?? false,
    longitude:
      s.ChartPosition?.Ecliptic?.DecimalDegrees ??
      s.ChartPosition?.Horizon?.DecimalDegrees ??
      null,
  };
};

// 🔥 houses mapper
type RawHouse = {
  Sign?: { label?: string; key?: string };
  sign?: string;
  ChartPosition?: {
    StartPosition?: {
      Ecliptic?: { DecimalDegrees?: number };
    };
  };
};

const mapHouses = (houses: unknown[] = []) => {
  return houses
    .filter((h): h is RawHouse => typeof h === 'object' && h !== null)
    .map((house, index) => ({
      house: index + 1,
      sign: house.Sign?.label || house.Sign?.key || house.sign || undefined,
      longitude:
        house.ChartPosition?.StartPosition?.Ecliptic?.DecimalDegrees ??
        undefined,
    }));
};

// 🔥 aspects mapper
type RawAspect = {
  point1Key?: string;
  point1?: { key?: string; label?: string };
  point1Label?: string;

  point2Key?: string;
  point2?: { key?: string; label?: string };
  point2Label?: string;

  aspectKey?: string;
  type?: string;

  orb?: number | null;
};

const mapAspects = (aspects: unknown[] = []): Aspect[] => {
  return aspects
    .filter((a): a is RawAspect => typeof a === 'object' && a !== null)
    .map((aspect): Aspect => ({
      point1Key: aspect.point1Key || aspect.point1?.key || '',
      point1Label: aspect.point1Label || aspect.point1?.label || '',
      point2Key: aspect.point2Key || aspect.point2?.key || '',
      point2Label: aspect.point2Label || aspect.point2?.label || '',
      type: (aspect.aspectKey || aspect.type || '').toLowerCase(),
      orb: aspect.orb ?? undefined,
    }))
    .filter((a) => a.point1Key && a.point2Key && a.type)
    .slice(0, 10);
};
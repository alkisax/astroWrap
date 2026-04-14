// frontend\src\hooks\componentHooks\useChartDataDebug.ts
import { useMemo } from 'react'
import type {
  ChartSummary,
  BasicPlacement,
  CustomPlanetInfo,
  CustomChartRuler,
  CustomBalance,
  CustomHouseRuler,
  CustomAspect,
  CustomDignity,
  CustomDispositor,
  CustomDynamics
} from '../../types/types'

type Params = {
  data: ChartSummary | null
  visiblePlanets: string[]
  date: Date | null
  coords: { lat: number; lng: number } | null
  customPlanetInfo: CustomPlanetInfo[]
  customChartRuler: CustomChartRuler | null
  customBalance: CustomBalance | null
  customHouseRulers: CustomHouseRuler[]
  customAspects: CustomAspect[]
  customDignities: CustomDignity[]
  customDispositors: CustomDispositor[]
  customDynamics: CustomDynamics | null
}

// 🔥 helper
const extractPlanets = (data: ChartSummary): Record<string, BasicPlacement> => {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) =>
      value && typeof value === 'object' && 'longitude' in value
    )
  )
}

export const useChartDataDebug = (params: Params) => {

  return useMemo(() => {
    const {
      data,
      visiblePlanets,
      date,
      coords,
      customPlanetInfo,
      customChartRuler,
      customBalance,
      customHouseRulers,
      customAspects,
      customDignities,
      customDispositors,
      customDynamics,
    } = params

    if (!data || !date || !coords) return null

    const allPoints = extractPlanets(data)

    const filteredPlanets = Object.fromEntries(
      Object.entries(allPoints).filter(([key]) =>
        visiblePlanets.includes(key.charAt(0).toUpperCase() + key.slice(1))
      )
    )

    const points = {
      ...filteredPlanets,
      ascendant: data.ascendant,
      midheaven: data.midheaven,
    }

    return {
      meta: {
        date: date.toISOString(),
        location: coords,
        zodiac: 'tropical',
        houseSystem: 'placidus'
      },
      points,
      houses: data.houses,
      analysis: {
        planets: customPlanetInfo,
        chartRuler: customChartRuler,
        balance: customBalance,
        houseRulers: customHouseRulers,
        aspects: customAspects,
        dignities: customDignities,
        dispositors: customDispositors,
        dynamics: customDynamics
      }
    }

  }, [params])
}
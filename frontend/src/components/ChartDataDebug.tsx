// src/components/ChartDataDebug.tsx
import type { ChartSummary, BasicPlacement, CustomPlanetInfo, CustomChartRuler, CustomBalance, CustomHouseRuler } from '../types/types'

type Props = {
  data: ChartSummary
  visiblePlanets: string[]
  date: Date
  coords: { lat: number; lng: number }
  customPlanetInfo: CustomPlanetInfo[]
  customChartRuler: CustomChartRuler | null
  customBalance: CustomBalance | null
  customHouseRulers: CustomHouseRuler[]
}

// 🔥 helper για να μαζέψουμε τα flat fields
const extractPlanets = (data: ChartSummary): Record<string, BasicPlacement> => {
  const entries = Object.entries(data)

  const placements = entries.filter(([, value]) => {
    // κρατάμε μόνο objects που έχουν longitude (πλανήτες + angles)
    return (
      value &&
      typeof value === 'object' &&
      'longitude' in value
    )
  })

  return Object.fromEntries(placements)
}

const ChartDataDebug = ({
  data,
  visiblePlanets,
  date,
  coords,
  customPlanetInfo,
  customChartRuler,
  customBalance,
  customHouseRulers
}: Props) => {

  const allPoints = extractPlanets(data)

  // 🔥 filter visible
  const filteredPlanets = Object.fromEntries(
    Object.entries(allPoints).filter(([key]) =>
      visiblePlanets.includes(key.charAt(0).toUpperCase() + key.slice(1))
    )
  )

  const payload = {
    meta: {
      date: date.toISOString(),
      location: coords,
      zodiac: 'tropical',
      houseSystem: 'placidus'
    },

    points: filteredPlanets, // 🔥 planets + asc + mc μαζί

    houses: data.houses,
    aspects: data.aspects ?? [],

    customPlanetInfo,
    customChartRuler,
    customBalance,
    customHouseRulers,
    analysis: {}
  }

  return (
    <div
      style={{
        padding: '16px',
        borderRadius: '12px',
        background: 'rgba(0,0,0,0.6)',
        border: '1px solid rgba(255,255,255,0.1)',
        overflow: 'auto',
        maxHeight: '400px'
      }}
    >
      <pre style={{ fontSize: '12px', color: '#ccc' }}>
        {JSON.stringify(payload, null, 2)}
      </pre>
    </div>
  )
}

export default ChartDataDebug
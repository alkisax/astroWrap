import { useMemo } from 'react'
import type {
  ChartSummary,
  CustomAspect,
  CustomDignity,
  CustomDispositor,
  CustomDynamics,
  CustomHouseRuler,
  DignityType,
  Planet,
  PlanetKey
} from '../../types/types'

import { computeHouseRulers } from '../../utils/houseRulers'
import { getAngleAspects } from '../../utils/getAngleAspects'
import { calculateElementBalance, calculateModalityBalance } from '../../utils/balanceCalculator'
import { getZodiacSign } from '../../utils/astroHelpers'
import { getAllDispositors } from '../../utils/dispositorCalculator'
import { detriment, domicile, exaltation, fall } from '../../constants/dignities'
import { getMutualReceptions } from '../../utils/mutualReception'
import { planets } from '../../constants/constants'

export const useChartAnalysis = (data: ChartSummary) => {

  const toPlanetKey = (p: Planet): PlanetKey =>
    p.toLowerCase() as PlanetKey

  const houseRulers = useMemo<CustomHouseRuler[]>(() =>
    computeHouseRulers(data).map(r => ({
      ...r,
      ruler: r.ruler.toLowerCase(),
    })),
    [data]
  )

  const aspects = useMemo<CustomAspect[]>(() => {
    const allowed = ['sun','moon','mercury','venus','mars','jupiter','saturn','uranus','neptune','pluto']

    return [
      ...(data.aspects ?? []),
      ...getAngleAspects(data)
    ]
      .filter(a => allowed.includes(a.point1Key) && allowed.includes(a.point2Key))
      .map(a => ({
        point1: a.point1Key,
        point2: a.point2Key,
        type: a.type,
        orb: a.orb ?? null
      }))
  }, [data])

  const elements = useMemo(() => calculateElementBalance(data), [data])
  const modalities = useMemo(() => calculateModalityBalance(data), [data])

  const dignities = useMemo<CustomDignity[]>(() => {
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
      Pluto: data.pluto
    }

    return planets
      .map((p): CustomDignity | null => {
        const val = planetMap[p]?.longitude
        if (val == null) return null

        const sign = getZodiacSign(val)

        let dignity = 'neutral' as DignityType

        if (domicile[p]?.includes(sign)) dignity = 'domicile'
        else if (exaltation[p] === sign) dignity = 'exaltation'
        else if (detriment[p]?.includes(sign)) dignity = 'detriment'
        else if (fall[p] === sign) dignity = 'fall'

        return {
          planet: toPlanetKey(p),
          sign,
          dignity
        }
      })
      .filter((x): x is CustomDignity => x !== null)
  }, [data])

  const dispositors = useMemo<CustomDispositor[]>(() =>
    getAllDispositors(data).map(d => ({
      ...d,
      planet: d.planet.toLowerCase()
    })),
    [data]
  )

  const dynamics = useMemo<CustomDynamics>(() => {
    const all = getAllDispositors(data)

    const toKey = (p: string): PlanetKey =>
      p.toLowerCase() as PlanetKey

    const backbone = Array.from(
      new Set(
        all
          .filter(r => r.result.type === 'final')
          .map(r => {
            const chain = r.result.chain
            return toKey(chain[chain.length - 1])
          })
      )
    )

    const loops = Array.from(
      new Set(
        all
          .filter(r => r.result.type === 'loop' && r.result.loopStart)
          .map(r => toKey(r.result.loopStart!))
      )
    )

    const mutualReceptions = getMutualReceptions(data)
      .map(([a, b]) => [toKey(a), toKey(b)] as [PlanetKey, PlanetKey])

    return { backbone, loops, mutualReceptions }
  }, [data])

  return {
    houseRulers,
    aspects,
    balance: { elements, modalities },
    dignities,
    dispositors,
    dynamics
  }
}
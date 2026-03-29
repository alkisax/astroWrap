// components/BasicChartInfo.tsx

import type {
  ChartSummary,
  CustomAspect,
  CustomBalance,
  CustomChartRuler,
  CustomDignity,
  CustomDispositor,
  CustomDynamics,
  CustomHouseRuler,
  CustomPlanetInfo,
  DignityType,
  Planet,
  PlanetKey
} from '../types/types'

import { Paper, Button, Group } from '@mantine/core'
import { colors, planets } from '../constants/constants'

import PlanetTable from './PlanetTable'
import ChartRuler from './ChartRuler'
import BalanceSummary from './BalanceSummary'
import MostImportantAspects from './MostImportantAspects'
import HouseRulers from './HouseRulers'
import EssentialDignities from './EssentialDignities'
import DispositorTree from './DispositorTree'

import { useEffect, useMemo, useState } from 'react'
import { useMediaQuery } from '@mantine/hooks'

import { computeHouseRulers } from '../utils/houseRulers'
import { getAngleAspects } from '../utils/getAngleAspects'
import {
  calculateElementBalance,
  calculateModalityBalance
} from '../utils/balanceCalculator'
import { getZodiacSign } from '../utils/astroHelpers'
import { getAllDispositors } from '../utils/dispositorCalculator'
import { detriment, domicile, exaltation, fall } from '../constants/dignities'
import { getMutualReceptions } from '../utils/mutualReception'

type Props = {
  data: ChartSummary
  setCustomPlanetInfo: (info: CustomPlanetInfo[]) => void
  setCustomChartRuler: (ruler: CustomChartRuler | null) => void
  setCustomBalance: (balance: CustomBalance) => void
  setCustomHouseRulers: (rulers: CustomHouseRuler[]) => void
  setCustomAspects: (a: CustomAspect[]) => void
  setCustomDignities: (d: CustomDignity[]) => void
  setCustomDispositors: (d: CustomDispositor[]) => void
  setCustomDynamics: (d: CustomDynamics | null) => void
}

const BasicChartInfo = ({
  data,
  setCustomPlanetInfo,
  setCustomChartRuler,
  setCustomBalance,
  setCustomHouseRulers,
  setCustomAspects,
  setCustomDignities,
  setCustomDispositors,
  setCustomDynamics,
}: Props) => {
  const [showAspects, setShowAspects] = useState(false)
  const [showHouses, setShowHouses] = useState(false)
  const [showDignities, setShowDignities] = useState(false)
  const [showTree, setShowTree] = useState(false)

  const isMobile = useMediaQuery('(max-width:768px)')

  // 🔥 1. HOUSE RULERS (normalize keys)
  const houseRulers = useMemo<CustomHouseRuler[]>(() =>
    computeHouseRulers(data).map(r => ({
      ...r,
      ruler: r.ruler.toLowerCase(),
    })),
    [data])

  // 🔥 2. ASPECTS (KEYS όχι labels)
  const aspects = useMemo<CustomAspect[]>(() => {
    const allowedPoints = [
      'sun', 'moon', 'mercury', 'venus', 'mars',
      'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'
    ]
    return [
      ...(data.aspects ?? []),
      ...getAngleAspects(data)
    ]
      .filter(a =>
        allowedPoints.includes(a.point1Key) &&
        allowedPoints.includes(a.point2Key)
      )
      .map(a => ({
        point1: a.point1Key,
        point2: a.point2Key,
        type: a.type,
        orb: a.orb ?? null
      }))
  }, [data])

  // 🔥 3. BALANCE
  const elements = useMemo(() => calculateElementBalance(data), [data])
  const modalities = useMemo(() => calculateModalityBalance(data), [data])

  // 🔥 4. DIGNITIES (normalize planet key)
  const toPlanetKey = (p: Planet): PlanetKey =>
    p.toLowerCase() as PlanetKey

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

        let dignity: DignityType = 'neutral'

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

  // 🔥 5. DISPOSITORS (normalize)
  const dispositors = useMemo<CustomDispositor[]>(() =>
    getAllDispositors(data).map(d => ({
      ...d,
      planet: d.planet.toLowerCase()
    })),
    [data])

  const dynamics = useMemo<CustomDynamics>(() => {
    const allDispositors = getAllDispositors(data)
    const toPlanetKey = (p: string): PlanetKey =>
      p.toLowerCase() as PlanetKey

    const backbone = Array.from(
      new Set(
        allDispositors
          .filter(r => r.result.type === 'final')
          .map(r => {
            const chain = r.result.chain
            return toPlanetKey(chain[chain.length - 1]) // ✅ τελευταίος
          })
      )
    )

    const loops = Array.from(
      new Set(
        allDispositors
          .filter(r => r.result.type === 'loop' && r.result.loopStart)
          .map(r => toPlanetKey(r.result.loopStart!))
      )
    )

    const mutualReceptions = getMutualReceptions(data)
      .map(([a, b]) => [toPlanetKey(a), toPlanetKey(b)] as [PlanetKey, PlanetKey])

    return {
      backbone,
      loops,
      mutualReceptions
    }
  }, [data])

  useEffect(() => {
    setCustomHouseRulers(houseRulers)
    setCustomBalance({ elements, modalities })
    setCustomAspects(aspects)
    setCustomDignities(dignities)
    setCustomDispositors(dispositors)
    setCustomDynamics(dynamics)
  }, [houseRulers, elements, modalities, aspects, dignities, dispositors, setCustomHouseRulers, setCustomBalance, setCustomAspects, setCustomDignities, setCustomDispositors, dynamics, setCustomDynamics])

  return (
    <>
      <Paper
        p='md'
        radius='md'
        style={{
          width: '100%',
          maxWidth: '1700px',
          margin: '20px auto',
          background: colors.panel,
          backdropFilter: 'blur(1px)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: colors.text
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '10px',
            alignItems: 'stretch'
          }}
        >
          <div>
            <PlanetTable
              data={data}
              setCustomPlanetInfo={setCustomPlanetInfo}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <ChartRuler
              data={data}
              setCustomChartRuler={setCustomChartRuler}
            />

            <BalanceSummary
              data={data}
              setCustomBalance={setCustomBalance}
            />

            <Group grow>
              <Button size='xs' onClick={() => setShowAspects(v => !v)}>⭐</Button>
              <Button size='xs' onClick={() => setShowHouses(v => !v)}>🏠</Button>
              <Button size='xs' onClick={() => setShowDignities(v => !v)}>👑</Button>
              <Button size='xs' onClick={() => setShowTree(v => !v)}>🌳</Button>
            </Group>
          </div>
        </div>
      </Paper>

      <div style={{ width: '100%', maxWidth: '700px', margin: '10px auto' }}>
        {showAspects && <MostImportantAspects data={data} />}
        {showHouses && <HouseRulers data={data} setCustomHouseRulers={setCustomHouseRulers} />}
        {showDignities && <EssentialDignities data={data} />}
        {showTree && <DispositorTree data={data} />}
      </div>
    </>
  )
}

export default BasicChartInfo
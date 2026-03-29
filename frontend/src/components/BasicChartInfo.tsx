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
} from '../types/types'

import { Paper, Button, Group } from '@mantine/core'
import { colors } from '../constants/constants'

import PlanetTable from './PlanetTable'
import ChartRuler from './ChartRuler'
import BalanceSummary from './BalanceSummary'
import MostImportantAspects from './MostImportantAspects'
import HouseRulers from './HouseRulers'
import EssentialDignities from './EssentialDignities'
import DispositorTree from './DispositorTree'

import { useEffect, useState } from 'react'
import { useMediaQuery } from '@mantine/hooks'
import { useChartAnalysis } from '../hooks/componentHooks/useChartAnalysis'

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

  const {
    houseRulers,
    aspects,
    balance,
    dignities,
    dispositors,
    dynamics
  } = useChartAnalysis(data)

  useEffect(() => {
    setCustomHouseRulers(houseRulers)
    setCustomBalance(balance)
    setCustomAspects(aspects)
    setCustomDignities(dignities)
    setCustomDispositors(dispositors)
    setCustomDynamics(dynamics)
  }, [houseRulers, aspects, dignities, dispositors, setCustomHouseRulers, setCustomBalance, setCustomAspects, setCustomDignities, setCustomDispositors, dynamics, setCustomDynamics, balance])

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
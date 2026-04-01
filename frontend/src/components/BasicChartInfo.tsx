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
import ReactMarkdown from 'react-markdown';
import { colors } from '../constants/constants'

import PlanetTable from './PlanetTable'
import ChartRuler from './ChartRuler'
import BalanceSummary from './BalanceSummary'
import MostImportantAspects from './MostImportantAspects'
import HouseRulers from './HouseRulers'
import EssentialDignities from './EssentialDignities'
import DispositorTree from './DispositorTree'

import { useEffect, useRef, useState } from 'react'
import { useMediaQuery } from '@mantine/hooks'
import { useChartAnalysis } from '../hooks/componentHooks/useChartAnalysis'
import { CircularProgress } from '@mui/material'

type Props = {
  data: ChartSummary
  handleLLMInterpretation: () => void
  llmLoading: boolean
  llmError: string | null
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
  handleLLMInterpretation,
  llmLoading,
  llmError,
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
  const [showLLM, setShowLLM] = useState(false);
  const [llmResult, setLlmResult] = useState<string | null>(null);

  const isMobile = useMediaQuery('(max-width:768px)')

  const {
    houseRulers,
    aspects,
    balance,
    dignities,
    dispositors,
    dynamics
  } = useChartAnalysis(data)

  const firstRun = useRef(true)
  const resultRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    if (showLLM && llmResult && resultRef.current) {
      resultRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [showLLM, llmResult]);

  useEffect(() => {
    if (!firstRun.current) return
    firstRun.current = false

    setCustomHouseRulers(houseRulers)
    if (balance) {
      setCustomBalance(balance)
    }
    setCustomAspects(aspects)
    setCustomDignities(dignities)
    setCustomDispositors(dispositors)
    setCustomDynamics(dynamics)

  }, [aspects, balance, dignities, dispositors, dynamics, houseRulers, setCustomAspects, setCustomBalance, setCustomDignities, setCustomDispositors, setCustomDynamics, setCustomHouseRulers])

  const handleLLMClick = async () => {
    setShowLLM(true);

    try {
      const res = await (handleLLMInterpretation as () => Promise<string | null>)(); setLlmResult(res); // 👈 θα το φτιάξουμε στο hook
    } catch {
      setLlmResult(null);
    }
  };

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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Group justify="center">
                <Button size='xs' onClick={() => setShowAspects(v => !v)}>⭐</Button>
                <Button size='xs' onClick={() => setShowHouses(v => !v)}>🏠</Button>
                <Button size='xs' onClick={() => setShowDignities(v => !v)}>👑</Button>
                <Button size='xs' onClick={() => setShowTree(v => !v)}>🌳</Button>
              </Group>

              {/* 🔽 LLM button */}
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <Button
                  size='md'
                  onClick={handleLLMClick}
                  disabled={llmLoading}
                  style={{
                    whiteSpace: 'normal',
                    lineHeight: '1.3',
                    display: 'block',
                    margin: '0 auto',
                    width: '280px',
                  }}
                >
                  {llmLoading ? (
                    <CircularProgress size={18} />
                  ) : llmError ? (
                    'Error ❌'
                  ) : (
                    <>
                      call Lark 🦜 <br />
                      (openAI chart interpretation)
                    </>
                  )}
                </Button>
              </div>

            </div>
          </div>
        </div>
      </Paper>

      <div style={{ width: '100%', maxWidth: '700px', margin: '10px auto' }}>
        {showAspects && <MostImportantAspects data={data} />}
        {showHouses && <HouseRulers data={data} setCustomHouseRulers={setCustomHouseRulers} />}
        {showDignities && <EssentialDignities data={data} />}
        {showTree && <DispositorTree data={data} />}
        {showLLM && llmResult && (
          <Paper
            ref={resultRef}
            p="md"
            radius="md"
            style={{
              width: '100%',
              maxWidth: '700px',
              margin: '10px auto',
              background: colors.panel,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: colors.text,
            }}
          >
            <div style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              <ReactMarkdown>
                {llmResult || ''}
              </ReactMarkdown>
            </div>
          </Paper>
        )}
      </div>
    </>
  )
}

export default BasicChartInfo
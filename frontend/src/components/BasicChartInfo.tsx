// frontend\src\components\BasicChartInfo.tsx

// το component που συγκεντρώνει όλα τα report για το single chart. Το βασικό του input είναι τα data τα οποια τα κάνει process στα διαφορα sub-components και render
// μεγάλο μέρος της λογικής του component είναι το useChartAnalysis
import { useEffect, useRef, useState } from 'react'
import { useMediaQuery } from '@mantine/hooks'

import { Paper, Button, Group } from '@mantine/core'
import { CircularProgress } from '@mui/material'
import ReactMarkdown from 'react-markdown'

import { useChartAnalysis } from '../hooks/componentHooks/useChartAnalysis'

import PlanetTable from './usedInAllChartsReports/PlanetTable'
import ChartRuler from './singleChartReports/ChartRuler'
import BalanceSummary from './singleChartReports/BalanceSummary'
import MostImportantAspects from './usedInAllChartsReports/MostImportantAspects'
import HouseRulers from './usedInAllChartsReports/HouseRulers'
import EssentialDignities from './singleChartReports/EssentialDignities'
import DispositorTree from './singleChartReports/DispositorTree'

import { colors } from '../constants/constants'

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

type Props = {
  data: ChartSummary
  userOrb: number
  handleLLMInterpretation: () => void
  llmLoading: boolean
  llmError: string | null
  // ολα αυτά τα custom είναι συμπτύξεις των διάφορων reports για να φτιαχτεί ένα απλοποιημένο json, γινονται expose απο το hook για να περαστουν στα διαφορα αρχεία οι setters και να μπορώ να έχω ένα ενιαίο state useHome όπου και κατασκευάζεται το json
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
  userOrb,
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
    dynamics,
  } = useChartAnalysis(data, userOrb)

  // τα χρησιμοποιούμε για να κάνουμε scroll οταν ολοκληρωθεί η openai αναφορα 
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

  // φέρνουμε απο όλα τα sub-components τα state για την δημιουργία του json 
  useEffect(() => {

    // TODO (πιθανο bug / γινετε καλύτερα) επιτρέπει το useEffect να τρέξει μόνο 1 φορά μπήκε για να κόψει bug με συνεχή rerender
    // if (!firstRun.current) return
    firstRun.current = false

    setCustomHouseRulers(houseRulers)
    setCustomAspects(aspects)
    setCustomDignities(dignities)
    setCustomDispositors(dispositors)
    setCustomDynamics(dynamics)
    if (balance) { //type guard για null - To πρόβλημα είναι τοι περνάμε και setCustomBalance στο <BalanceSummary setCustomBalance={setCustomBalance} /> αλλα δεν θα το διορθώσουμε τώρα
      setCustomBalance(balance)
    }

    // FIX: αφαιρέθηκε το firstRun hack που έκρυβε το πραγματικό πρόβλημα (stale state)
    // Το αρχικό issue ήταν infinite rerender επειδή το useEffect έκανε setState
    // με dependencies που άλλαζαν reference σε κάθε render (π.χ. balance object)
    //
    // Λύση:
    // - κρατήσαμε ως trigger ΜΟΝΟ stable computed values (aspects + λοιπά από hook)
    // - αφαιρέθηκε το balance από deps (new object κάθε render → loop)
    // - το hook (useChartAnalysis) είναι πλέον single source of truth για aspects
    // - το useEffect λειτουργεί σαν "sync προς payload" μόνο όταν αλλάζουν πραγματικά τα δεδομένα
    // αποτέλεσμα:
    // ✔ no infinite loop
    // ✔ no stale data
    // ✔ shaken === UI (sync μέσω aspects)
    // eslint-disable μπήκε γιατί συνειδητά ΔΕΝ θέλουμε όλα τα deps (θα ξαναφέρει loop)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aspects, dignities, dispositors, dynamics, houseRulers])

  const handleLLMClick = async () => {
    setShowLLM(true);

    try {
      const res = await (handleLLMInterpretation as () => Promise<string | null>)();
      setLlmResult(res); //δες Hook useChartAnalysis
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
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', // responsive για μία ή δύο στήλες αν mobile/desktop
            gap: '10px',
            alignItems: 'stretch'
          }}
        >
          <div>
            {/* υπολογίζει και κάνει render τον βασικό πίνακα με sign/house/planet
            σημαντικό κομμάτι της λογικής του βρίσκετε μέσα στα util helpers getZodiacSign, getHouse μεσα στην AngleToAstro (βρίσκει γωνίες ζωδίων και υπολογίζει οίκους με βάση τα cusps)
            in: data και setter για συγκεντρωτικό json στο useHome */}
            <PlanetTable
              data={data}
              setCustomPlanetInfo={setCustomPlanetInfo}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* 
            // μου υπολογίζει και render τον chartRuler σημαντικό κομματι της λογικής είναι στην helperFunction computeChartRuler
            // in: data απο home και setter για συγκεντρωτικο json απο useHome
            // Ο chart ruler είναι ο πλανήτης που κυβερνά το ζώδιο του Ascendant (ωροσκόπου), άρα θεωρείται ο βασικός “κυβερνήτης” όλου του χάρτη. Υπολογίζεται απλά: βρίσκεις το ζώδιο του ASC και μετά τον πλανήτη που το κυβερνά (π.χ. Aries → Mars, Libra → Venus).Είναι σαν “κεντρικός άξονας προσωπικότητας” .
            */}
            <ChartRuler
              data={data}
              setCustomChartRuler={setCustomChartRuler}
            />

            {/* 
            // in: data απο home και setter για συγκεντρωτικο json απο useHome
            // σημαντικά είναι τα utils calculateElementBalance, calculateModalityBalance (και τα δύο in: data)
            */}
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
        {showAspects && <MostImportantAspects data={data} aspects={aspects} />}
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
              {/* το chatGPT συχνα μου επιστρέφει markdown */}
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
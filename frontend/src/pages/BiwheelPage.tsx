// frontend/src/pages/BiwheelPage.tsx

import { colors } from '../constants/constants'

import ChartFormBiwheel from '../components/biwheel/ChartFormBiwheel'
import PlanetSelector from '../components/controlls/PlanetSelector'
import PlanetTable from '../components/PlanetTable'
import InnerChart from '../components/biwheel/InnerChart'
import OuterChart from '../components/biwheel/OuterChart'
import TwoChartsAspectsTable from '../components/biwheel/TwoChartsAspectsTable'
import HouseRulers from '../components/HouseRulers'
import MostImportantAspects from '../components/MostImportantAspects'
import TransitAspectsGrid from '../components/TransitAspectsGrid'
import EagleLarkGridList from '../components/biwheel/EagleLarkGridList'

import { Accordion, Button, Grid, Paper } from '@mantine/core'

import { useBiwheelPage } from '../hooks/componentHooks/useBiwheelPage'
import HouseOverlayBiwheel from '../components/biwheel/HouseOverlayBiwheel'
import { useEffect, useRef, useState } from 'react'
import { CircularProgress, useMediaQuery } from '@mui/material'
import ReactMarkdown from 'react-markdown'
import CompatibilityViewer from '../components/biwheel/CompatibilityViewer'
import { useEagleLarkLLm } from '../hooks/componentHooks/useEagleLarkLLm'
import { QuestionModal } from './QuestionModal'


const BiwheelPage = () => {
  const [llmResult, setLlmResult] = useState<string | null>(null);
  const [showLLM, setShowLLM] = useState(false);

  const [showQuestionModal, setShowQuestionModal] = useState(false)

  // 🔥 όλη η λογική έρχεται από hook
  const {
    radixData,
    transitData,
    radixChart,
    transitChart,
    houseOverlay,

    // inputs
    setRadixInput,
    setTransitInput,

    // ui state
    selectedPlanets,
    setSelectedPlanets,

    radixCustomPlanetInfo,
    transitCustomPlanetInfo,
    // setters (για payload creation)
    setRadixCustomPlanetInfo,
    setTransitCustomPlanetInfo,
    setRadixCustomHouseRulers,
    setTransitCustomHouseRulers,

    eagleGrids,

    // debug payloads (optional)
    // radixPayload,
    // transitPayload
    compatibility,

    handleBiwheelLLM,
    llmLoading,
    llmError,

  } = useBiwheelPage()

  const {
    selectedTopics,
    setSelectedTopics,
    userQuestion,
    setUserQuestion,
    handleQuestionSubmit,
    llmEagleLarkResult,
    llmEagleLarkLoading,
    llmEagleLarkError,
    // eagleLarkLlmPayloadJSON
  } = useEagleLarkLLm({
    eagleGrids,
    radixCustomPlanetInfo,
    transitCustomPlanetInfo,
  })

  // console.log("eagleLarkLlmPayloadJSON: ", eagleLarkLlmPayloadJSON);


  const handleLLMClick = async () => {
    setShowLLM(true);

    const res = await handleBiwheelLLM();
    setLlmResult(res);
  };

  const resultRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useMediaQuery("(max-width:768px)");

  useEffect(() => {
    if (showLLM && llmResult && resultRef.current) {
      resultRef.current.scrollIntoView({
        behavior: isMobile ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  }, [showLLM, llmResult]);

  useEffect(() => {
    if (llmEagleLarkResult && resultRef.current) {
      resultRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [llmEagleLarkResult])

  // 🔥 GUARD → μέχρι να έχουμε data ΔΕΝ κάνουμε render charts
  if (!radixData || !transitData || !radixChart || !transitChart) {
    return (
      <>
        {/* 📝 form για input */}
        <ChartFormBiwheel
          onSubmit={({ radix, transit }) => {
            setRadixInput(radix)
            setTransitInput(transit)
          }}
        />

        {/* 🪐 planet filter */}
        <PlanetSelector
          selected={selectedPlanets}
          setSelected={setSelectedPlanets}
        />
      </>
    )
  }


  // 🔥 DEBUG (αν θες)
  // console.log('radixData:', radixData)
  // console.log('transitData:', transitData)
  // console.log('radixPayload:', radixPayload)
  // console.log('transitPayload:', transitPayload)
  // console.log('overlay:', houseOverlay)


  return (
    <>
      {/* ======================= */}
      {/* 🪐 BIWHEEL CHARTS */}
      {/* ======================= */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap',
          padding: '20px'
        }}
      >
        {/* 🔵 RADIX */}
        <div>
          <h3 style={{ textAlign: 'center', color: 'white' }}>Radix</h3>
          <InnerChart
            planets={radixChart.planets}
            cusps={radixChart.cusps}
          />
        </div>

        {/* 🔴 TRANSITS */}
        <div>
          <h3 style={{ textAlign: 'center', color: 'white' }}>Transits</h3>
          <OuterChart
            planets={transitChart.planets}
            cusps={transitChart.cusps}
          />
        </div>
      </div>


      {/* ======================= */}
      {/* 🧾 PLANET TABLES */}
      {/* ======================= */}
      <div
        style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}
      >
        {/* RADIX */}
        <div>
          <h3 style={{ textAlign: 'center', color: 'white' }}>Radix</h3>
          <PlanetTable
            data={radixData}
            setCustomPlanetInfo={setRadixCustomPlanetInfo}
          />
        </div>

        {/* TRANSITS */}
        <div>
          <h3 style={{ textAlign: 'center', color: 'white' }}>Transits</h3>
          <PlanetTable
            data={transitData}
            setCustomPlanetInfo={setTransitCustomPlanetInfo}
          />
        </div>
      </div>


      {/* ======================= */}
      {/* 🧭 CONTROLS */}
      {/* ======================= */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px',
          padding: '10px'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '20px',
            width: 'fit-content',
            margin: '0 auto',
            alignItems: 'stretch'
          }}
        >
          <ChartFormBiwheel
            onSubmit={({ radix, transit }) => {
              setRadixInput(radix)
              setTransitInput(transit)
            }}
          />

          <PlanetSelector
            selected={selectedPlanets}
            setSelected={setSelectedPlanets}
          />
        </div>
      </div>

      {/* 🔮 LLM BIWHEEL */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
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
              (relationship analysis)
            </>
          )}
        </Button>

        <Button
          size='md'
          onClick={() => setShowQuestionModal(true)}
          style={{
            display: 'block',
            margin: '10px auto 0',
            width: '280px',
          }}
        >
          ask specific question
        </Button>



        <QuestionModal
          opened={showQuestionModal}
          onClose={() => setShowQuestionModal(false)}
          selectedTopics={selectedTopics}
          setSelectedTopics={setSelectedTopics}
          userQuestion={userQuestion}
          setUserQuestion={setUserQuestion}
          onSubmit={() => {
            handleQuestionSubmit()
            setShowQuestionModal(false)
          }}
          llmEagleLarkLoading={llmEagleLarkLoading}
          llmEagleLarkError={llmEagleLarkError}
        />

      </div>

      {llmEagleLarkResult && (
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
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
            <ReactMarkdown>{llmEagleLarkResult}</ReactMarkdown>
          </div>
        </Paper>
      )}

      {showLLM && llmResult && (
        <Paper
          ref={resultRef}
          p="md"
          radius="md"
          style={{
            width: "100%",
            maxWidth: "700px",
            margin: "10px auto",
            background: colors.panel,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: colors.text,
          }}
        >
          <CompatibilityViewer compatibility={compatibility} />
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
            <ReactMarkdown>{llmResult}</ReactMarkdown>
          </div>
        </Paper>
      )}

      {/* ======================= */}
      {/* 📊 ANALYSIS ACCORDION */}
      {/* ======================= */}
      <Accordion
        variant='unstyled'
        multiple
        defaultValue={[]}
        styles={{
          control: {
            color: colors.text,
            fontWeight: 500
          },
          label: {
            color: colors.text
          }
        }}
      >

        {/* 🏠 RADIX vs TRANSIT */}
        <Accordion.Item value='radix-transit'>
          <Accordion.Control>
            🪐 Radix / Transit Analysis
          </Accordion.Control>

          <Accordion.Panel>
            <Grid gutter='md' mb='md'>
              <Grid.Col span={6}>
                <HouseRulers
                  data={radixData}
                  setCustomHouseRulers={setRadixCustomHouseRulers}
                />
                <MostImportantAspects data={radixData} />
              </Grid.Col>

              <Grid.Col span={6}>
                <HouseRulers
                  data={transitData}
                  setCustomHouseRulers={setTransitCustomHouseRulers}
                />
                <MostImportantAspects data={transitData} />
              </Grid.Col>
            </Grid>
          </Accordion.Panel>
        </Accordion.Item>


        {/* 🔮 TRANSIT ASPECTS TABLE */}
        <Accordion.Item value='two-chart'>
          <Accordion.Control>
            🔮 Transit Aspects Table
          </Accordion.Control>

          <Accordion.Panel>
            <TwoChartsAspectsTable
              radix={radixData}
              transit={transitData}
            />
          </Accordion.Panel>
        </Accordion.Item>


        {/* 🧩 GRID */}
        <Accordion.Item value='grid'>
          <Accordion.Control>
            🧩 Transit Grid
          </Accordion.Control>

          <Accordion.Panel>
            <TransitAspectsGrid
              radix={radixData}
              transit={transitData}
            />
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="overlay">
          <Accordion.Control>
            🏠 House Overlay
          </Accordion.Control>

          <Accordion.Panel>
            <HouseOverlayBiwheel overlays={houseOverlay} />
          </Accordion.Panel>
        </Accordion.Item>


        {/* 🦅 EAGLE / LARK */}
        <Accordion.Item value='eagle'>
          <Accordion.Control>
            🦅 Eagle
          </Accordion.Control>

          <Accordion.Panel>
            <EagleLarkGridList
              radix={radixData}
              transit={transitData}
            />
          </Accordion.Panel>
        </Accordion.Item>

      </Accordion>
    </>
  )
}

export default BiwheelPage
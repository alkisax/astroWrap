// frontend/src/pages/BiwheelPage.tsx

import { colors } from '../constants/constants'

import ChartFormBiwheel from '../components/biwheel/ChartFormBiwheel'
import PlanetSelector from '../components/PlanetSelector'
import PlanetTable from '../components/PlanetTable'
import InnerChart from '../components/biwheel/InnerChart'
import OuterChart from '../components/biwheel/OuterChart'
import TwoChartsAspectsTable from '../components/biwheel/TwoChartsAspectsTable'
import HouseRulers from '../components/HouseRulers'
import MostImportantAspects from '../components/MostImportantAspects'
import TransitAspectsGrid from '../components/TransitAspectsGrid'
import EagleLarkGridList from '../components/biwheel/EagleLarkGridList'

import { Accordion, Grid } from '@mantine/core'

import { useBiwheelPage } from '../hooks/componentHooks/useBiwheelPage'
import HouseOverlayBiwheel from '../components/biwheel/HouseOverlayBiwheel'

const BiwheelPage = () => {

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

    // setters (για payload creation)
    setRadixCustomPlanetInfo,
    setTransitCustomPlanetInfo,
    setRadixCustomHouseRulers,
    setTransitCustomHouseRulers,

    // debug payloads (optional)
    // radixPayload,
    // transitPayload

  } = useBiwheelPage()


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
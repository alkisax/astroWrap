/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
// import AstroChartTransits from "../components/AstroChartTransits";
import { mapToChartData } from "../utils/mapToChart";
import type { ChartInput, ChartSummary, CustomHouseRuler, CustomPlanetInfo } from "../types/types";
import { colors, url } from "../constants/constants";
import ChartFormBiwheel from "../components/biwheel/ChartFormBiwheel";
import PlanetSelector from "../components/PlanetSelector";
import PlanetTable from "../components/PlanetTable";
import InnerChart from "../components/biwheel/InnerChart";
import OuterChart from "../components/biwheel/OuterChart";
import TwoChartsAspectsTable from "../components/biwheel/TwoChartsAspectsTable";
import HouseRulers from "../components/HouseRulers";
import MostImportantAspects from "../components/MostImportantAspects";
import { Accordion, Grid } from "@mantine/core";
import TransitAspectsGrid from "../components/TransitAspectsGrid";
import EagleLarkGridList from "../components/biwheel/EagleLarkGridList";
import { useChartDataDebug } from "../hooks/componentHooks/useChartDataDebug";
import { useChartAnalysis } from "../hooks/componentHooks/useChartAnalysis";

const BiwheelPage = () => {
  // 🔹 raw api data
  const [radixData, setRadixData] = useState<ChartSummary | null>(null);
  const [transitData, setTransitData] = useState<ChartSummary | null>(null);

  // 🔹 inputs
  const [radixInput, setRadixInput] = useState<ChartInput | null>(null);
  const [transitInput, setTransitInput] = useState<ChartInput | null>(null);

  // 🔹 shared planet filter
  const [selectedPlanets, setSelectedPlanets] = useState<string[]>([
    "Sun",
    "Moon",
    "Mercury",
    "Venus",
    "Mars",
    "Jupiter",
    "Saturn",
    "Uranus",
    "Neptune",
    "Pluto",
  ]);

  //  για την δημιουργία του json
  // RADIX
  const [radixCustomPlanetInfo, setRadixCustomPlanetInfo] = useState<CustomPlanetInfo[]>([])
  const [radixCustomHouseRulers, setRadixCustomHouseRulers] = useState<CustomHouseRuler[]>([])

  // // TRANSIT
  const [transitCustomPlanetInfo, setTransitCustomPlanetInfo] = useState<CustomPlanetInfo[]>([])
  const [transitCustomHouseRulers, setTransitCustomHouseRulers] = useState<CustomHouseRuler[]>([])


  // 🔥 fetch RADIX
  useEffect(() => {
    if (!radixInput) return;

    const fetchRadix = async () => {
      try {
        const res = await axios.post(url, {
          year: radixInput.date.getFullYear(),
          month: radixInput.date.getMonth() + 1,
          day: radixInput.date.getDate(),
          hour: radixInput.date.getHours(),
          minute: radixInput.date.getMinutes(),
          latitude: radixInput.lat,
          longitude: radixInput.lng,
          houseSystem: "placidus",
          zodiac: "tropical",
        });

        setRadixData(res.data);
      } catch (err) {
        console.error("Radix error:", err);
      }
    };

    fetchRadix();
  }, [radixInput]);

  // 🔥 fetch TRANSITS
  useEffect(() => {
    if (!transitInput) return;

    const fetchTransit = async () => {
      try {
        const res = await axios.post(url, {
          year: transitInput.date.getFullYear(),
          month: transitInput.date.getMonth() + 1,
          day: transitInput.date.getDate(),
          hour: transitInput.date.getHours(),
          minute: transitInput.date.getMinutes(),
          latitude: transitInput.lat,
          longitude: transitInput.lng,
          houseSystem: "placidus",
          zodiac: "tropical",
        });

        setTransitData(res.data);
      } catch (err) {
        console.error("Transit error:", err);
      }
    };

    fetchTransit();
  }, [transitInput]);

  const radixAnalysis = useChartAnalysis(radixData)
  const transitAnalysis = useChartAnalysis(transitData)

  const radixPayload = useChartDataDebug({
    data: radixData,
    visiblePlanets: selectedPlanets,
    date: radixInput?.date ?? null,
    coords: radixInput
      ? { lat: radixInput.lat, lng: radixInput.lng }
      : null,

    customPlanetInfo: radixCustomPlanetInfo,
    customChartRuler: radixAnalysis.chartRuler,
    customBalance: radixAnalysis.balance,
    customHouseRulers: radixCustomHouseRulers,
    customAspects: radixAnalysis.aspects,
    customDignities: radixAnalysis.dignities,
    customDispositors: radixAnalysis.dispositors,
    customDynamics: radixAnalysis.dynamics,
  })

  const transitPayload = useChartDataDebug({
    data: transitData,
    visiblePlanets: selectedPlanets,
    date: radixInput?.date ?? null,
    coords: radixInput
      ? { lat: radixInput.lat, lng: radixInput.lng }
      : null,

    customPlanetInfo: transitCustomPlanetInfo,
    customChartRuler: transitAnalysis.chartRuler,
    customBalance: transitAnalysis.balance,
    customHouseRulers: transitCustomHouseRulers,
    customAspects: transitAnalysis.aspects,
    customDignities: transitAnalysis.dignities,
    customDispositors: transitAnalysis.dispositors,
    customDynamics: transitAnalysis.dynamics,
  })

  // if (!radixData || !transitData || !radixInput || !transitInput) {
  //   return
  // }

  // ⛔ ακόμα δεν έχουμε data
  if (!radixData || !transitData) {
    return (
      <>
        <ChartFormBiwheel
          onSubmit={({ radix, transit }) => {
            setRadixInput(radix);
            setTransitInput(transit);
          }}
        />

        <PlanetSelector
          selected={selectedPlanets}
          setSelected={setSelectedPlanets}
        />
      </>
    );
  }

  // 🔥 map data → astrochart format
  const radixChart = mapToChartData(radixData, selectedPlanets);
  const transitChart = mapToChartData(transitData, selectedPlanets);

  console.log("radixData:", radixData);
  console.log("transitData:", transitData);
  console.log("radix json creator: ", radixPayload);
  console.log("transit json creator: ", transitPayload);

  return (
    <>
      {/* <AstroChartTransits
          radixPlanets={radixChart.planets}
          radixCusps={radixChart.cusps}
          transitPlanets={transitChart.planets}
          transitCusps={transitChart.cusps}
        /> */}
      {/* 🪐 BIWHEEL */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          flexWrap: "wrap", // 🔥 responsive
          padding: "20px",
        }}
      >
        {/* RADIX */}
        <div>
          <h3 style={{ textAlign: "center", color: "white" }}>Radix</h3>
          <InnerChart
            planets={radixChart.planets}
            cusps={radixChart.cusps}
          />
        </div>

        {/* TRANSITS */}
        <div>
          <h3 style={{ textAlign: "center", color: "white" }}>Transits</h3>
          <OuterChart
            planets={transitChart.planets}
            cusps={transitChart.cusps}
          />
        </div>
      </div>

      {/* 🧾 TABLES */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {/* RADIX */}
        <div>
          <h3 style={{ textAlign: "center", color: "white" }}>Radix</h3>
          <PlanetTable data={radixData} setCustomPlanetInfo={setRadixCustomPlanetInfo} />
        </div>

        {/* TRANSITS */}
        <div>
          <h3 style={{ textAlign: "center", color: "white" }}>Transits</h3>
          <PlanetTable data={transitData} setCustomPlanetInfo={setTransitCustomPlanetInfo} />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
          padding: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "20px",
            width: "fit-content",
            margin: "0 auto",
            alignItems: "stretch",
          }}
        >
          <ChartFormBiwheel
            onSubmit={({ radix, transit }) => {
              setRadixInput(radix);
              setTransitInput(transit);
            }}
          />

          <PlanetSelector
            selected={selectedPlanets}
            setSelected={setSelectedPlanets}
          />
        </div>
      </div>

      <Accordion
        variant="unstyled"
        multiple
        defaultValue={[]}
        styles={{
          control: {
            color: colors.text, // ✅ αυτό θες
            fontWeight: 500,
          },
          label: {
            color: colors.text, // extra safety
          },
        }}
      >
        {/* 🏠 House + Aspects */}
        <Accordion.Item value="radix-transit">
          <Accordion.Control>
            🪐 Radix / Transit Analysis
          </Accordion.Control>

          <Accordion.Panel>
            <Grid gutter="md" mb="md">
              <Grid.Col span={6}>
                <HouseRulers data={radixData} setCustomHouseRulers={setRadixCustomHouseRulers} />
                <MostImportantAspects data={radixData} />
              </Grid.Col>

              <Grid.Col span={6}>
                <HouseRulers data={transitData} setCustomHouseRulers={setTransitCustomHouseRulers} />
                <MostImportantAspects data={transitData} />
              </Grid.Col>
            </Grid>
          </Accordion.Panel>
        </Accordion.Item>

        {/* 🔮 Transit Aspects Table */}
        <Accordion.Item value="two-chart">
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

        {/* 🧩 Grid */}
        <Accordion.Item value="grid">
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

        {/* 🦅 Eagle*/}
        <Accordion.Item value="eagle">
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
  );
};

export default BiwheelPage;
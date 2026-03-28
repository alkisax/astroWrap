import { useEffect, useState } from "react";
import axios from "axios";
// import AstroChartTransits from "../components/AstroChartTransits";
import { mapToChartData } from "../utils/mapToChart";
import type { ChartInput, ChartSummary } from "../types/types";
import { url } from "../constants/constants";
import ChartFormBiwheel from "../components/biwheel/ChartFormBiwheel";
import PlanetSelector from "../components/PlanetSelector";
import PlanetTable from "../components/PlanetTable";
import InnerChart from "../components/biwheel/InnerChart";
import OuterChart from "../components/biwheel/OuterChart";

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
          <PlanetTable data={radixData} />
        </div>

        {/* TRANSITS */}
        <div>
          <h3 style={{ textAlign: "center", color: "white" }}>Transits</h3>
          <PlanetTable data={transitData} />
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
    </>
  );
};

export default BiwheelPage;
// src/App.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import AstroChart from "../components/AstroChart";
import { mapToChartData } from "../utils/mapToChart";
import type { ChartSummary } from "../types/types"
import { url } from '../constants/constants';
import PlanetTable from "../components/PlanetTable";
import ChartRuler from "../components/ChartRuler";
import MostImportantAspects from "../components/MostImportantAspects";
import DispositorTree from "../components/DispositorTree";
import EssentialDignities from "../components/EssentialDignities";
import HouseRulers from "../components/HouseRulers";
import BalanceSummary from "../components/BalanceSummary";
import BasicControls from "../components/BasicControlls";

const Home = () => {
  const [data, setData] = useState<ChartSummary | null>(null);
  const [visiblePlanets, setVisiblePlanets] = useState<string[]>([
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
  const [date, setDate] = useState<Date>(new Date());
  const [coords, setCoords] = useState({
    lat: 37.9838,
    lng: 23.7275,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post(url, {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
          hour: date.getHours(),
          minute: date.getMinutes(),
          latitude: coords.lat,
          longitude: coords.lng,
          houseSystem: "placidus",
          zodiac: "tropical",
        });

        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [date, coords]);

  const handleSubmit = (input: {
    date: Date;
    lat: number;
    lng: number;
  }) => {
    setDate(input.date);

    setCoords({
      lat: input.lat,
      lng: input.lng,
    });
  };

  console.log(data);

  if (!data) return <div>Loading...</div>;

  const chartData = mapToChartData(data, visiblePlanets);

  return (

    <>
<div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: "20px",
    marginTop: "20px",
  }}
>
    <div
    style={{
      display: "flex",
      gap: "20px",
      padding: "20px",
      borderRadius: "16px",
      background: "rgba(20,20,30,0.6)",
      backdropFilter: "blur(2px)",
      border: "1px solid rgba(255,255,255,0.1)",
      alignItems: "center",
    }}
  >
  <BasicControls
    onSubmit={handleSubmit}
    visiblePlanets={visiblePlanets}
    setVisiblePlanets={setVisiblePlanets}
    date={date}
    setDate={setDate}
    coords={coords}
  />

  <AstroChart {...chartData} />    
  </div>

</div>

      <div>


        <div style={{ width: "50vw", margin: "40px auto" }}>
          <MostImportantAspects data={data} />
          <PlanetTable data={data} />
          <ChartRuler data={data} />
          <BalanceSummary data={data} />
          <HouseRulers data={data} />
          <EssentialDignities data={data} />
          <DispositorTree data={data} />

        </div>
      </div>
    </>
  );
}

export default Home;
// src/App.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import AstroChart from "../components/AstroChart";
import { mapToChartData } from "../utils/mapToChart";
import type { ChartSummary } from "../types/types"
import { url } from '../constants/constants';
import ChartForm from "../components/ChartForm";
import PlanetTable from "../components/PlanetTable";
import ChartRuler from "../components/ChartRuler";
import MostImportantAspects from "../components/MostImportantAspects";
import DispositorTree from "../components/DispositorTree";
import TimeControls from "../components/TimeControls";

const Home = () => {
  const [data, setData] = useState<ChartSummary | null>(null);
  const [date, setDate] = useState({
    year: 1981,
    month: 1,
    day: 1,
    hour: 23,
    minute: 30,
  });
  const [coords, setCoords] = useState({
    lat: 37.9838,
    lng: 23.7275,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post(url, {
          ...date,
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
    setDate({
      year: input.date.getFullYear(),
      month: input.date.getMonth() + 1,
      day: input.date.getDate(),
      hour: input.date.getHours(),
      minute: input.date.getMinutes(),
    });

    setCoords({
      lat: input.lat,
      lng: input.lng,
    });
  };

  console.log(data);

  if (!data) return <div>Loading...</div>;

  const chartData = mapToChartData(data);

  return (

    <>
      <ChartForm onSubmit={handleSubmit} />
      <div>
        <AstroChart {...chartData} />

        <TimeControls date={date} setDate={setDate} coords={coords} />

        <div style={{ width: "50vw", margin: "40px auto" }}>
          <PlanetTable data={data} />
          <ChartRuler data={data} />
          <DispositorTree data={data} />
          <MostImportantAspects data={data} />
        </div>
      </div>
    </>
  );
}

export default Home;
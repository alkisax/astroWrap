// src/App.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import AstroChart from "./components/AstroChart";
import { mapToChartData } from "./utils/mapToChart";
import type { ChartSummary } from "./types/types"
import { url } from './constants/constants';

function App() {
  const [data, setData] = useState<ChartSummary | null>(null);

  useEffect(() => {
    axios
      .post(url, {
        year: 1981,
        month: 1,
        day: 1,
        hour: 23,
        minute: 30,
        latitude: 37.9838,
        longitude: 23.7275,
        houseSystem: "placidus",
        zodiac: "tropical",
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  if (!data) return <div>Loading...</div>;

  const chartData = mapToChartData(data);

  return (
    <div>
      <h1>Astro Chart</h1>
      <AstroChart {...chartData} />
    </div>
  );
}

export default App;
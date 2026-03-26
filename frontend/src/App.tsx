// src/App.tsx
import { Button, Group, Text, Paper } from "@mantine/core";
import { useEffect, useState } from "react";
import axios from "axios";
import AstroChart from "./components/AstroChart";
import { mapToChartData } from "./utils/mapToChart";
import type { ChartSummary } from "./types/types"
import { url } from './constants/constants';
import ChartForm from "./components/ChartForm";
import PlanetTable from "./components/PlanetTable";
import ChartRuler from "./components/ChartRuler";
import MostImportantAspects from "./components/MostImportantAspects";
import DispositorTree from "./components/DispositorTree";

function App() {
  const [data, setData] = useState<ChartSummary | null>(null);
  const [date, setDate] = useState({
    year: 1981,
    month: 1,
    day: 1,
    hour: 23,
    minute: 30,
  });

  useEffect(() => {
    axios
      .post(url, {
        ...date,
        latitude: 37.9838,
        longitude: 23.7275,
        houseSystem: "placidus",
        zodiac: "tropical",
      })
      .then((res) => setData(res.data))
      .catch(console.error);
  }, [date]);

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

  const handleSubmit = (input: {
    date: Date;
    lat: number;
    lng: number;
  }) => {
    const payload = {
      year: input.date.getFullYear(),
      month: input.date.getMonth() + 1,
      day: input.date.getDate(),
      hour: input.date.getHours(),
      minute: input.date.getMinutes(),
      latitude: input.lat,
      longitude: input.lng,
      houseSystem: "placidus",
      zodiac: "tropical",
    };

    axios
      .post(url, payload)
      .then((res) => setData(res.data))
      .catch(console.error);
  };


  function addDays(dateObj: typeof date, days: number) {
    const d = new Date(
      dateObj.year,
      dateObj.month - 1,
      dateObj.day,
      dateObj.hour,
      dateObj.minute
    );

    d.setDate(d.getDate() + days);

    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
      hour: d.getHours(),
      minute: d.getMinutes(),
    };
  }

  function addHours(dateObj: typeof date, hours: number) {
    const d = new Date(
      dateObj.year,
      dateObj.month - 1,
      dateObj.day,
      dateObj.hour,
      dateObj.minute
    );

    d.setHours(d.getHours() + hours);

    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
      hour: d.getHours(),
      minute: d.getMinutes(),
    };
  }

  // console.log(data);


  if (!data) return <div>Loading...</div>;

  const chartData = mapToChartData(data);

  return (

    <>
      <ChartForm onSubmit={handleSubmit} />
      <div>
        <AstroChart {...chartData} />

        <Paper withBorder p="sm" radius="md" style={{ maxWidth: 400, margin: "20px auto" }}>
          <Text ta="center" size="sm" mb="xs">
            {`${date.day}/${date.month}/${date.year} ${date.hour}:${String(date.minute).padStart(2, "0")} — Athens`}
          </Text>

          <Group justify="center" gap="xs">
            <Button size="xs" variant="light" onClick={() => setDate((d) => addDays(d, -1))}>
              -1d
            </Button>

            <Button size="xs" variant="light" onClick={() => setDate((d) => addDays(d, 1))}>
              +1d
            </Button>

            <Button size="xs" variant="outline" onClick={() => setDate((d) => addHours(d, -1))}>
              -1h
            </Button>

            <Button size="xs" variant="outline" onClick={() => setDate((d) => addHours(d, 1))}>
              +1h
            </Button>
          </Group>
        </Paper>

        <div style={{ width: "50vw", margin: "40px auto" }}>
          <PlanetTable data={data} />
          <ChartRuler data={data} />
          <MostImportantAspects data={data} />
          <DispositorTree data={data} />
        </div>
      </div>
    </>
  );
}

export default App;
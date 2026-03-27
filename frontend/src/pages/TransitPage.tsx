import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import AstroChart from "../components/AstroChart";
import { planets, url } from "../constants/constants";
import type { ChartSummary } from "../types/types";
import { mapToChartData } from "../utils/mapToChart";

type TransitPoint = {
  date: Date;
  longitude: number;
};

const CHART_SIZE = 600;
const CENTER = CHART_SIZE / 2;

// 👉 πιο μέσα στο ring των πλανητών
const PATH_RADIUS = 200;

const planetSpeed: Record<string, number> = {
  moon: 13,
  mercury: 1.2,
  venus: 1.2,
  sun: 1,
  mars: 0.5,
  jupiter: 0.08,
  saturn: 0.03,
  uranus: 0.01,
  neptune: 0.006,
  pluto: 0.004,
};

const getStepHours = (start: Date, end: Date, planet: string) => {
  const diffMs = end.getTime() - start.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  const speed = planetSpeed[planet.toLowerCase()] || 1;
  const totalMovement = diffDays * speed;

  const steps = Math.max(10, Math.min(200, Math.floor(totalMovement)));
  const hoursPerStep = (diffDays * 24) / steps;

  return Math.max(1, Math.round(hoursPerStep));
};

const toXY = (
  angle: number,
  r: number,
  cx: number,
  cy: number,
  ascOffset: number
) => {
  // 🔥 το σωστό transformation
  const adjusted = angle - ascOffset + 180;

  const rad = (adjusted - 90) * (Math.PI / 180);

  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
};

const normalizePath = (points: TransitPoint[]) => {
  if (points.length === 0) return points;

  const fixed: TransitPoint[] = [points[0]];

  for (let i = 1; i < points.length; i++) {
    const prev = fixed[i - 1].longitude;
    let curr = points[i].longitude;

    if (Math.abs(curr - prev) > 180) {
      if (curr > prev) curr -= 360;
      else curr += 360;
    }

    fixed.push({
      ...points[i],
      longitude: curr,
    });
  }

  return fixed;
};

const buildPath = (
  points: TransitPoint[],
  ascOffset: number
) => {
  return points
    .map((p, i) => {
      const { x, y } = toXY(
        p.longitude,
        PATH_RADIUS,
        CENTER,
        CENTER,
        ascOffset
      );
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
};

const capitalizePlanet = (planet: string) =>
  planet.charAt(0).toUpperCase() + planet.slice(1);

export default function TransitPage() {
  const [start, setStart] = useState("2026-01-01T12:00");
  const [end, setEnd] = useState("2026-02-10T12:00");
  const [planet, setPlanet] = useState("sun");
  const [points, setPoints] = useState<TransitPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ChartSummary | null>(null);

  const fetchChart = useCallback(async () => {
    try {
      const d = new Date(start);

      const res = await axios.post(url, {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        day: d.getDate(),
        hour: d.getHours(),
        minute: d.getMinutes(),
        latitude: 37.9838,
        longitude: 23.7275,
        houseSystem: "placidus",
        zodiac: "tropical",
      });

      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [start]);

  const fetchPath = useCallback(async () => {
    setLoading(true);

    try {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const stepHours = getStepHours(startDate, endDate, planet);

      const dates: Date[] = [];
      const current = new Date(startDate);

      while (current <= endDate) {
        dates.push(new Date(current));
        current.setHours(current.getHours() + stepHours);
      }

      const responses = await Promise.all(
        dates.map((d) =>
          axios.post(url, {
            year: d.getFullYear(),
            month: d.getMonth() + 1,
            day: d.getDate(),
            hour: d.getHours(),
            minute: d.getMinutes(),
            latitude: 37.9838,
            longitude: 23.7275,
            houseSystem: "placidus",
            zodiac: "tropical",
          })
        )
      );

      const result: TransitPoint[] = responses
        .map((res, i) => {
          const key = planet.toLowerCase();
          const planetData = res.data?.[key];

          if (!planetData || planetData.longitude == null) {
            return null;
          }

          return {
            date: dates[i],
            longitude: planetData.longitude,
          };
        })
        .filter((p): p is TransitPoint => p !== null);

      setPoints(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [start, end, planet]);

  useEffect(() => {
    fetchChart();
  }, [fetchChart]);

  const visiblePlanets = useMemo(
    () => [capitalizePlanet(planet)],
    [planet]
  );

  const chartData = data
    ? mapToChartData(data, visiblePlanets)
    : null;

  const normalizedPoints = useMemo(
    () => normalizePath(points),
    [points]
  );

  const ascOffset = data?.ascendant?.longitude || 0;

  // 🔥 σημαντικό: ξεκινάει από τον ίδιο τον πλανήτη
  const planetData = data?.[planet as keyof ChartSummary];
  const currentPlanetLon = (planetData && 'longitude' in planetData) ? planetData.longitude : undefined;

  const finalPoints = useMemo(() => {
    if (currentPlanetLon == null) return normalizedPoints;

    return [
      { date: new Date(start), longitude: currentPlanetLon },
      ...normalizedPoints,
    ];
  }, [currentPlanetLon, normalizedPoints, start]);

  const pathD = useMemo(
    () => buildPath(finalPoints, ascOffset),
    [finalPoints, ascOffset]
  );

  return (
    <Box p={4}>
      <Typography variant="h5" mb={2}>
        🔴 Transit Path
      </Typography>

      <Box display="flex" gap={2} mb={4} flexWrap="wrap">
        <TextField
          label="Start"
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="End"
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          select
          label="Planet"
          value={planet}
          onChange={(e) => setPlanet(e.target.value)}
          sx={{ minWidth: 140 }}
        >
          {planets.map((p) => (
            <MenuItem key={p} value={p.toLowerCase()}>
              {p}
            </MenuItem>
          ))}
        </TextField>

        <Button variant="contained" onClick={fetchPath} disabled={loading}>
          {loading ? "Loading..." : "Generate"}
        </Button>
      </Box>

      <Box
        sx={{
          position: "relative",
          width: `${CHART_SIZE}px`,
          height: `${CHART_SIZE}px`,
          margin: "0 auto",
        }}
      >
        {chartData && <AstroChart {...chartData} />}

        <svg
          width={CHART_SIZE}
          height={CHART_SIZE}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
          }}
        >
          {/* path */}
          <path d={pathD} stroke="red" strokeWidth={2.5} fill="none" />

          {/* start dot */}
          {finalPoints.length > 0 && (() => {
            const p = finalPoints[0];
            const { x, y } = toXY(
              p.longitude,
              PATH_RADIUS,
              CENTER,
              CENTER,
              ascOffset
            );

            return <circle cx={x} cy={y} r={4} fill="red" />;
          })()}
        </svg>
      </Box>
    </Box>
  );
}
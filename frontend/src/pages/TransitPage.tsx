// import { useCallback, useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";
// import AstroChart from "../components/AstroChart";
// import { planets, url } from "../constants/constants";
// import type { ChartSummary } from "../types/types";
// import { mapToChartData } from "../utils/mapToChart";

// /**
//  * 🔹 Κάθε σημείο της τροχιάς ενός transit
//  * date → πότε
//  * longitude → μοίρες στον ζωδιακό κύκλο
//  */
// type TransitPoint = {
//   date: Date;
//   longitude: number;
//   asc?: number;
// };

// /**
//  * 🔹 Σταθερές για το rendering του chart
//  */
// const CHART_SIZE = 600;
// const CENTER = CHART_SIZE / 2;

// // 👉 ακτίνα της κόκκινης γραμμής (μέσα από τους πλανήτες)
// const PATH_RADIUS = 200;

// /**
//  * 🔹 Προσεγγιστικές ταχύτητες πλανητών (deg/day)
//  * χρησιμοποιούνται για adaptive sampling (πόσα points θα πάρουμε)
//  */
// const planetSpeed: Record<string, number> = {
//   moon: 13,
//   mercury: 1.2,
//   venus: 1.2,
//   sun: 1,
//   mars: 0.5,
//   jupiter: 0.08,
//   saturn: 0.03,
//   uranus: 0.01,
//   neptune: 0.006,
//   pluto: 0.004,
// };

// /**
//  * 🔹 Υπολογίζει κάθε πόσες ώρες θα πάρουμε sample
//  * ώστε:
//  * - γρήγοροι πλανήτες → πολλά points
//  * - αργοί → λιγότερα
//  */
// const getStepHours = (start: Date, end: Date, planet: string) => {
//   const diffMs = end.getTime() - start.getTime();
//   const diffDays = diffMs / (1000 * 60 * 60 * 24);

//   const speed = planetSpeed[planet.toLowerCase()] || 1;
//   const totalMovement = diffDays * speed;

//   const steps = Math.max(10, Math.min(200, Math.floor(totalMovement)));
//   const hoursPerStep = (diffDays * 24) / steps;

//   return Math.max(1, Math.round(hoursPerStep));
// };

// /**
//  * 🔹 Μετατροπή longitude → (x,y) πάνω στον κύκλο
//  *
//  * πολύ σημαντικό:
//  * - αφαιρούμε ascOffset (ώστε chart rotation)
//  * - +180 για alignment με chart system
//  * - -90 για να ξεκινάει από πάνω (12η ώρα)
//  */
// const toXY = (
//   angle: number,
//   r: number,
//   cx: number,
//   cy: number,
//   ascOffset: number
// ) => {
//   const adjusted = angle - ascOffset + 180;
//   const rad = (adjusted - 90) * (Math.PI / 180);

//   return {
//     x: cx + r * Math.cos(rad),
//     y: cy + r * Math.sin(rad),
//   };
// };

// /**
//  * 🔹 Fix για discontinuity στα 0°/360°
//  *
//  * χωρίς αυτό:
//  * π.χ. 359° → 2° θα έκανε γραμμή across chart ❌
//  *
//  * με αυτό:
//  * το μετατρέπει σε continuous κίνηση ✔
//  */
// const normalizePath = (points: TransitPoint[]) => {
//   if (points.length === 0) return points;

//   const fixed: TransitPoint[] = [points[0]];

//   for (let i = 1; i < points.length; i++) {
//     const prev = fixed[i - 1].longitude;
//     let curr = points[i].longitude;

//     if (Math.abs(curr - prev) > 180) {
//       if (curr > prev) curr -= 360;
//       else curr += 360;
//     }

//     fixed.push({
//       ...points[i],
//       longitude: curr,
//     });
//   }

//   return fixed;
// };

// /**
//  * 🔹 Δημιουργεί SVG path (M/L commands)
//  * από τα σημεία
//  */
// const buildPath = (
//   points: TransitPoint[],
//   ascOffset: number
// ) => {
//   return points
//     .map((p, i) => {
//       const { x, y } = toXY(
//         p.longitude,
//         PATH_RADIUS,
//         CENTER,
//         CENTER,
//         ascOffset
//       );
//       return `${i === 0 ? "M" : "L"} ${x} ${y}`;
//     })
//     .join(" ");
// };

// /**
//  * 🔹 Capitalize για UI
//  */
// const capitalizePlanet = (planet: string) =>
//   planet.charAt(0).toUpperCase() + planet.slice(1);

// export default function TransitPage() {

//   /**
//    * 🔹 STATE
//    */
//   const [start, setStart] = useState("2026-01-01T12:00");
//   const [end, setEnd] = useState("2026-02-10T12:00");
//   const [planet, setPlanet] = useState("sun");

//   const [points, setPoints] = useState<TransitPoint[]>([]);
//   const [loading, setLoading] = useState(false);

//   // natal chart data
//   const [data, setData] = useState<ChartSummary | null>(null);

//   /**
//    * 🔹 Fetch natal chart (για ascendant + initial θέση πλανήτη)
//    */
//   const fetchChart = useCallback(async () => {
//     try {
//       const d = new Date(start);

//       const res = await axios.post(url, {
//         year: d.getFullYear(),
//         month: d.getMonth() + 1,
//         day: d.getDate(),
//         hour: d.getHours(),
//         minute: d.getMinutes(),
//         latitude: 37.9838,
//         longitude: 23.7275,
//         houseSystem: "placidus",
//         zodiac: "tropical",
//       });

//       setData(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   }, [start]);

//   /**
//    * 🔹 Fetch transit path
//    *
//    * Λογική:
//    * - σπάμε το διάστημα σε βήματα
//    * - κάνουμε πολλά API calls
//    * - παίρνουμε μόνο longitude του συγκεκριμένου πλανήτη
//    */
//   const fetchPath = useCallback(async () => {
//     setLoading(true);

//     try {
//       const startDate = new Date(start);
//       const endDate = new Date(end);
//       const stepHours = getStepHours(startDate, endDate, planet);

//       const dates: Date[] = [];
//       const current = new Date(startDate);

//       while (current <= endDate) {
//         dates.push(new Date(current));
//         current.setHours(current.getHours() + stepHours);
//       }

//       const responses = await Promise.all(
//         dates.map((d) =>
//           axios.post(url, {
//             year: d.getFullYear(),
//             month: d.getMonth() + 1,
//             day: d.getDate(),
//             hour: d.getHours(),
//             minute: d.getMinutes(),
//             latitude: 37.9838,
//             longitude: 23.7275,
//             houseSystem: "placidus",
//             zodiac: "tropical",
//           })
//         )
//       );

//       const result: TransitPoint[] = responses
//         .map((res, i) => {
//           const key = planet.toLowerCase();
//           const planetData = res.data?.[key];
//           const asc = res.data?.ascendant?.longitude;

//           if (!planetData || planetData.longitude == null || asc == null) {
//             return null;
//           }

//           return {
//             date: dates[i],
//             longitude: planetData.longitude,
//             asc, // 👈 κράτα και αυτό
//           };
//         })
//         .filter(Boolean) as TransitPoint[];

//       setPoints(result);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }, [start, end, planet]);

//   /**
//    * 🔹 load natal όταν αλλάζει start
//    */
//   useEffect(() => {
//     fetchChart();
//   }, [fetchChart]);

//   /**
//    * 🔹 εμφανίζουμε μόνο τον επιλεγμένο πλανήτη
//    */
//   const visiblePlanets = useMemo(
//     () => [capitalizePlanet(planet)],
//     [planet]
//   );

//   /**
//    * 🔹 μετατροπή API → AstroChart format
//    */
//   const chartData = data
//     ? mapToChartData(data, visiblePlanets)
//     : null;

//   // /**
//   //  * 🔹 normalize path (fix wrap-around)
//   //  */
//   // const normalizedPoints = useMemo(
//   //   () => normalizePath(points),
//   //   [points]
//   // );

//   /**
//    * 🔹 rotation του chart (ascendant)
//    */
//   const ascOffset = data?.ascendant?.longitude || 0;

//   /**
//    * 🔹 παίρνουμε την αρχική θέση του πλανήτη
//    */
//   const planetData = data?.[planet as keyof ChartSummary];
//   const currentPlanetLon =
//     (planetData && 'longitude' in planetData)
//       ? planetData.longitude
//       : undefined;

//   /**
//    * 🔥 σημαντικό:
//    * ξεκινάμε το path από το ίδιο το σημείο του πλανήτη
//    */
//   const finalPoints = useMemo(() => {
//     if (currentPlanetLon == null) return points;

//     return [
//       { date: new Date(start), longitude: currentPlanetLon },
//       ...points,
//     ];
//   }, [currentPlanetLon, points, start]);

//   // 🔹 reference frame (natal asc)
//   const referenceAsc = ascOffset;

//   // 🔹 φέρνουμε όλα τα points στο ίδιο coordinate system
//   const alignedPoints = useMemo(() => {
//     return finalPoints.map((p, i) => {

//       // 🔥 το πρώτο point (natal) ΔΕΝ το πειράζουμε
//       if (i === 0) return p;

//       if (p.asc == null) return p;

//       const corrected = p.longitude - (p.asc - referenceAsc);

//       return {
//         ...p,
//         longitude: corrected
//       };
//     });
//   }, [finalPoints, referenceAsc]);

//   const normalizedAlignedPoints = useMemo(() => {
//     return normalizePath(alignedPoints);
//   }, [alignedPoints]);

//   /**
//    * 🔹 build SVG path
//    */
//   const pathD = useMemo(
//     () => buildPath(normalizedAlignedPoints, referenceAsc),
//     [normalizedAlignedPoints, referenceAsc]
//   );

//   /**
//    * 🔹 UI
//    */
//   return (
//     <Box p={4}>
//       <Typography variant="h5" mb={2}>
//         🔴 Transit Path
//       </Typography>

//       {/* controls */}
//       <Box display="flex" gap={2} mb={4} flexWrap="wrap">
//         <TextField
//           label="Start"
//           type="datetime-local"
//           value={start}
//           onChange={(e) => setStart(e.target.value)}
//           InputLabelProps={{ shrink: true }}
//         />

//         <TextField
//           label="End"
//           type="datetime-local"
//           value={end}
//           onChange={(e) => setEnd(e.target.value)}
//           InputLabelProps={{ shrink: true }}
//         />

//         <TextField
//           select
//           label="Planet"
//           value={planet}
//           onChange={(e) => setPlanet(e.target.value)}
//           sx={{ minWidth: 140 }}
//         >
//           {planets.map((p) => (
//             <MenuItem key={p} value={p.toLowerCase()}>
//               {p}
//             </MenuItem>
//           ))}
//         </TextField>

//         <Button variant="contained" onClick={fetchPath} disabled={loading}>
//           {loading ? "Loading..." : "Generate"}
//         </Button>
//       </Box>

//       {/* chart container */}
//       <Box
//         sx={{
//           position: "relative",
//           width: `${CHART_SIZE}px`,
//           height: `${CHART_SIZE}px`,
//           margin: "0 auto",
//         }}
//       >
//         {/* base chart */}
//         {chartData && <AstroChart {...chartData} />}

//         {/* overlay svg */}
//         <svg
//           width={CHART_SIZE}
//           height={CHART_SIZE}
//           style={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             pointerEvents: "none",
//           }}
//         >
//           {/* 🔴 transit line */}
//           <path d={pathD} stroke="red" strokeWidth={2.5} fill="none" />

//           {/* 🔴 start point */}
//           {finalPoints.length > 0 && (() => {
//             const p = normalizedAlignedPoints[0];;
//             const { x, y } = toXY(
//               p.longitude,
//               PATH_RADIUS,
//               CENTER,
//               CENTER,
//               ascOffset
//             );

//             return <circle cx={x} cy={y} r={4} fill="red" />;
//           })()}
//         </svg>
//       </Box>
//     </Box>
//   );
// }
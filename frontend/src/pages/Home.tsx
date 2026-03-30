// src/App.tsx
import { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import { url } from '../constants/constants';
// import ChartDataDebug from "../components/ChartDataDebug";

import AstroChart from "../components/AstroChart";
import { mapToChartData } from "../utils/mapToChart";
import type { ChartSummary, CustomAspect, CustomBalance, CustomChartRuler, CustomDignity, CustomDispositor, CustomDynamics, CustomHouseRuler, CustomPlanetInfo } from "../types/types"
import BasicControls from "../components/BasicControlls";
import { useMediaQuery } from "@mui/material";
import BasicChartInfo from "../components/BasicChartInfo";
import { calculateChart } from '../services/astroService';
import { useChartDataDebug } from "../hooks/componentHooks/useChartDataDebug";
import { natalChartShakeJSONTreeHelper } from "../utils/natalChartShakeJSONTreeHelper";

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

  // για την δημιουργία του συγκεντρωτικού json πρέπει να περάσουμε όλους τους υπολογισμούς στον parent για αυτό φτιάχνουμε state
  const [customPlanetInfo, setCustomPlanetInfo] = useState<CustomPlanetInfo[]>([])
  const [customChartRuler, setCustomChartRuler] = useState<CustomChartRuler | null>(null)
  const [customBalance, setCustomBalance] = useState<CustomBalance | null>(null)
  const [customHouseRulers, setCustomHouseRulers] = useState<CustomHouseRuler[]>([])
  const [customAspects, setCustomAspects] = useState<CustomAspect[]>([])
  const [customDignities, setCustomDignities] = useState<CustomDignity[]>([])
  const [customDispositors, setCustomDispositors] = useState<CustomDispositor[]>([])
  const [customDynamics, setCustomDynamics] = useState<CustomDynamics | null>(null)
  // const [shaken, setShaken] = useState<unknown>(null)

  const payload = useChartDataDebug({
    data,
    visiblePlanets,
    date,
    coords,
    customPlanetInfo,
    customChartRuler,
    customBalance,
    customHouseRulers,
    customAspects,
    customDignities,
    customDispositors,
    customDynamics,
  });

  const shaken = useMemo(() => {
    if (!payload) return null;
    return natalChartShakeJSONTreeHelper(payload);
  }, [payload]);
  console.log("shaken: ", shaken);
  

  const chart = useMemo(() => {
    try {
      return calculateChart({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        latitude: coords.lat,
        longitude: coords.lng,
        houseSystem: 'placidus',
        zodiac: 'tropical',
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }, [date, coords]);

  // 🔥 sync → effect (allowed pattern)
  useEffect(() => {
    setData(chart);
  }, [chart]);


  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await axios.post(url, {
  //         year: date.getFullYear(),
  //         month: date.getMonth() + 1,
  //         day: date.getDate(),
  //         hour: date.getHours(),
  //         minute: date.getMinutes(),
  //         latitude: coords.lat,
  //         longitude: coords.lng,
  //         houseSystem: "placidus",
  //         zodiac: "tropical",
  //       });

  //       setData(res.data);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   fetchData();
  // }, [date, coords]);

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

  // console.log(data);

  const isMobile = useMediaQuery("(max-width:768px)");

  if (!data) return <div>Loading...</div>;

  const chartData = mapToChartData(data, visiblePlanets);

  return (

    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
          padding: isMobile ? "10px" : "0px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column", // 🔥 σημαντικό
            gap: "20px",
            width: "100%",
            maxWidth: "1000px", // 🔥 1 source of truth
          }}
        >
          {/* 🔝 TOP PANEL */}
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: "20px",
              padding: "20px",
              borderRadius: "16px",
              background: "rgba(20,20,30,0.6)",
              backdropFilter: "blur(1px)",
              border: "1px solid rgba(255,255,255,0.1)",
              alignItems: "stretch",
              width: "100%",
            }}
          >
            {/* MOBILE: chart FIRST */}
            {isMobile && (
              <div style={{ width: "100%" }}>
                <AstroChart {...chartData} />
              </div>
            )}

            {/* DESKTOP: controls */}
            {!isMobile && (
              <BasicControls
                onSubmit={handleSubmit}
                visiblePlanets={visiblePlanets}
                setVisiblePlanets={setVisiblePlanets}
                date={date}
                setDate={setDate}
                coords={coords}
              />
            )}

            {/* DESKTOP: chart */}
            {!isMobile && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <AstroChart {...chartData} />
              </div>
            )}

            {/* MOBILE: controls κάτω */}
            {isMobile && (
              <BasicControls
                onSubmit={handleSubmit}
                visiblePlanets={visiblePlanets}
                setVisiblePlanets={setVisiblePlanets}
                date={date}
                setDate={setDate}
                coords={coords}
              />
            )}
          </div>

          {/* 🔽 BOTTOM PANEL (ALWAYS SAME WIDTH) */}
          <BasicChartInfo
            data={data}
            setCustomPlanetInfo={setCustomPlanetInfo}
            setCustomChartRuler={setCustomChartRuler}
            setCustomBalance={setCustomBalance}
            setCustomHouseRulers={setCustomHouseRulers}
            setCustomAspects={setCustomAspects}
            setCustomDignities={setCustomDignities}
            setCustomDispositors={setCustomDispositors}
            setCustomDynamics={setCustomDynamics}
          />
        </div>
      </div>

      {/* <ChartDataDebug
        data={data}
        visiblePlanets={visiblePlanets}
        date={date}
        coords={coords}
        customPlanetInfo={customPlanetInfo}
        customChartRuler={customChartRuler}
        customBalance={customBalance}
        customHouseRulers={customHouseRulers}
        customAspects={customAspects}
        customDignities={customDignities}
        customDispositors={customDispositors}
        customDynamics={customDynamics}
        // setShaken={setShaken}
      /> */}
    </>
  );
}

export default Home;
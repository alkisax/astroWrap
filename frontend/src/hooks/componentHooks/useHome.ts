// frontend\src\hooks\componentHooks\useHome.ts
import { useEffect, useMemo, useState } from "react";
import { calculateChart } from "../../services/astroService";
import { getSingleChartInterpretation } from "../../services/llmService";
import { useChartDataDebug } from "./useChartDataDebug";
import { natalChartShakeJSONTreeHelper } from "../../utils/natalChartShakeJSONTreeHelper";

import type {
  ChartSummary,
  CustomAspect,
  CustomBalance,
  CustomChartRuler,
  CustomDignity,
  CustomDispositor,
  CustomDynamics,
  CustomHouseRuler,
  CustomPlanetInfo,
} from "../../types/types";

export const useHome = () => {
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

  const [date, setDate] = useState<Date>(new Date()); // δηλαδή default ωρα και μερα "Τωρα"
  const [coords, setCoords] = useState({
    lat: 37.9838, //  default αθήνα
    lng: 23.7275,
  });
  const [userOrb, setUserOrb] = useState<number>(1);

  // 🔹 custom state
  const [customPlanetInfo, setCustomPlanetInfo] = useState<CustomPlanetInfo[]>(
    [],
  );
  const [customChartRuler, setCustomChartRuler] =
    useState<CustomChartRuler | null>(null);
  const [customBalance, setCustomBalance] = useState<CustomBalance | null>(
    null,
  );
  const [customHouseRulers, setCustomHouseRulers] = useState<
    CustomHouseRuler[]
  >([]);
  const [customAspects, setCustomAspects] = useState<CustomAspect[]>([]);
  const [customDignities, setCustomDignities] = useState<CustomDignity[]>([]);
  const [customDispositors, setCustomDispositors] = useState<
    CustomDispositor[]
  >([]);
  const [customDynamics, setCustomDynamics] = useState<CustomDynamics | null>(
    null,
  );

  const [llmLoading, setLlmLoading] = useState(false);
  const [llmError, setLlmError] = useState<string | null>(null);

  // αυτό καλουσα με το endpoint του backend, μετα έφερα τον υπολογισμό στο front για να μην έχω περιττά calls
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

  // 1/2 calculateChart →
  // input: ημερομηνια και συντεταγμένες (+ house system + zodiac)
  // out: καθαρό ChartSummary (normalized astro data για το app, ανεξάρτητο από τη lib)
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
        houseSystem: "placidus",
        zodiac: "tropical",
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }, [date, coords]);

  // 2/2 sync data
  useEffect(() => {
    setData(chart);
  }, [chart]);

  // 🔥 submit (κάνει απλως set τα διάφορα input στο σωστο format και οι αλλαγες επιβάλλονται απο ένα "[]")
  const handleSubmit = (input: { date: Date; lat: number; lng: number }) => {
    setDate(input.date);
    setCoords({ lat: input.lat, lng: input.lng });
  };

  // 🔥 payload
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

  // 🔥 shaken
  const shaken = useMemo(() => {
    if (!payload) return null;
    return natalChartShakeJSONTreeHelper(payload);
  }, [payload]);

  const handleLLMInterpretation = async (): Promise<string | null> => {
    if (!shaken) return null;

    setLlmLoading(true);
    setLlmError(null);

    try {
      const result = await getSingleChartInterpretation(shaken);
      console.log("LLM RESULT:", result);
      return result; // 👈 σημαντικό
    } catch (err) {
      console.log(err);
      setLlmError("LLM request failed");
      return null;
    } finally {
      setLlmLoading(false);
    }
  };

  return {
    data,
    visiblePlanets,
    setVisiblePlanets,
    date,
    setDate,
    coords,
    userOrb,
    setUserOrb,

    // setters
    setCustomPlanetInfo,
    setCustomChartRuler,
    setCustomBalance,
    setCustomHouseRulers,
    setCustomAspects,
    setCustomDignities,
    setCustomDispositors,
    setCustomDynamics,

    // logic
    shaken,

    handleSubmit,

    handleLLMInterpretation,
    llmLoading,
    llmError,
  };
};

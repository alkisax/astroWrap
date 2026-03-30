// frontend\src\hooks\componentHooks\useBiwheelPage.ts
import { useEffect, useState, useMemo } from "react";
// import axios from "axios";
// import { url } from "../../constants/constants";
import type {
  ChartInput,
  ChartSummary,
  CustomHouseRuler,
  CustomPlanetInfo,
} from "../../types/types";
import { mapToChartData } from "../../utils/mapToChart";
import { useChartAnalysis } from "./useChartAnalysis";
import { useChartDataDebug } from "./useChartDataDebug";
import { buildHouseOverlay } from "../../utils/houseOverlayBiwheelHeler";
import { buildBiwheelPayload } from "../../utils/buildBiwheelPayload";
import { synastryShakeJSONtreeHelper } from "../../utils/synastryShakeJSONtreeHelper";
import { computeCompatibility } from "../../utils/synastryCompatibilityHelper";
import { buildEagleLarkGrids } from "../../utils/buildEagleLarkGrids";
import { findTwoChartAspects } from "../../utils/TwoChartsAspectFinder";
import { calculateChart } from "../../services/astroService";
import { getBiwheelInterpretation } from "../../services/llmService";

export const useBiwheelPage = () => {
  // 🔹 raw data
  const [radixData, setRadixData] = useState<ChartSummary | null>(null);
  const [transitData, setTransitData] = useState<ChartSummary | null>(null);

  // 🔹 inputs
  const [radixInput, setRadixInput] = useState<ChartInput | null>(null);
  const [transitInput, setTransitInput] = useState<ChartInput | null>(null);

  // 🔹 planets
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

  // 🔹 custom
  const [radixCustomPlanetInfo, setRadixCustomPlanetInfo] = useState<
    CustomPlanetInfo[]
  >([]);
  const [radixCustomHouseRulers, setRadixCustomHouseRulers] = useState<
    CustomHouseRuler[]
  >([]);

  const [transitCustomPlanetInfo, setTransitCustomPlanetInfo] = useState<
    CustomPlanetInfo[]
  >([]);
  const [transitCustomHouseRulers, setTransitCustomHouseRulers] = useState<
    CustomHouseRuler[]
  >([]);

  const [llmLoading, setLlmLoading] = useState(false);
  const [llmError, setLlmError] = useState<string | null>(null);

  // // 🔥 fetch RADIX
  // useEffect(() => {
  //   if (!radixInput) return;

  //   axios
  //     .post(url, {
  //       year: radixInput.date.getFullYear(),
  //       month: radixInput.date.getMonth() + 1,
  //       day: radixInput.date.getDate(),
  //       hour: radixInput.date.getHours(),
  //       minute: radixInput.date.getMinutes(),
  //       latitude: radixInput.lat,
  //       longitude: radixInput.lng,
  //       houseSystem: "placidus",
  //       zodiac: "tropical",
  //     })
  //     .then((res) => setRadixData(res.data))
  //     .catch((err) => console.error("Radix error:", err));
  // }, [radixInput]);

  const radixChartMemo = useMemo(() => {
    if (!radixInput) return null;

    try {
      return calculateChart({
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
    } catch (err) {
      console.error("Radix error:", err);
      return null;
    }
  }, [radixInput]);

  useEffect(() => {
    setRadixData(radixChartMemo);
  }, [radixChartMemo]);

  // // 🔥 fetch TRANSIT
  // useEffect(() => {
  //   if (!transitInput) return;

  //   axios
  //     .post(url, {
  //       year: transitInput.date.getFullYear(),
  //       month: transitInput.date.getMonth() + 1,
  //       day: transitInput.date.getDate(),
  //       hour: transitInput.date.getHours(),
  //       minute: transitInput.date.getMinutes(),
  //       latitude: transitInput.lat,
  //       longitude: transitInput.lng,
  //       houseSystem: "placidus",
  //       zodiac: "tropical",
  //     })
  //     .then((res) => setTransitData(res.data))
  //     .catch((err) => console.error("Transit error:", err));
  // }, [transitInput]);

  const transitChartMemo = useMemo(() => {
    if (!transitInput) return null;

    try {
      return calculateChart({
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
    } catch (err) {
      console.error("Transit error:", err);
      return null;
    }
  }, [transitInput]);

  useEffect(() => {
    setTransitData(transitChartMemo);
  }, [transitChartMemo]);

  // 🔥 analysis
  const radixAnalysis = useChartAnalysis(radixData);
  const transitAnalysis = useChartAnalysis(transitData);

  // 🔥 payloads
  const radixPayload = useChartDataDebug({
    data: radixData,
    visiblePlanets: selectedPlanets,
    date: radixInput?.date ?? null,
    coords: radixInput ? { lat: radixInput.lat, lng: radixInput.lng } : null,

    customPlanetInfo: radixCustomPlanetInfo,
    customChartRuler: radixAnalysis.chartRuler,
    customBalance: radixAnalysis.balance,
    customHouseRulers: radixCustomHouseRulers,
    customAspects: radixAnalysis.aspects,
    customDignities: radixAnalysis.dignities,
    customDispositors: radixAnalysis.dispositors,
    customDynamics: radixAnalysis.dynamics,
  });

  const transitPayload = useChartDataDebug({
    data: transitData,
    visiblePlanets: selectedPlanets,
    date: transitInput?.date ?? null,
    coords: transitInput
      ? { lat: transitInput.lat, lng: transitInput.lng }
      : null,

    customPlanetInfo: transitCustomPlanetInfo,
    customChartRuler: transitAnalysis.chartRuler,
    customBalance: transitAnalysis.balance,
    customHouseRulers: transitCustomHouseRulers,
    customAspects: transitAnalysis.aspects,
    customDignities: transitAnalysis.dignities,
    customDispositors: transitAnalysis.dispositors,
    customDynamics: transitAnalysis.dynamics,
  });

  // 🔥 charts
  const radixChart = radixData
    ? mapToChartData(radixData, selectedPlanets)
    : null;
  const transitChart = transitData
    ? mapToChartData(transitData, selectedPlanets)
    : null;

  // 🔥 house overlay
  const houseOverlay =
    radixData && transitData ? buildHouseOverlay(radixData, transitData) : [];

  const biwheelPayload = buildBiwheelPayload({
    radixData,
    transitData,
  });

  // console.log("houseOverlay (hook):", houseOverlay);
  // console.log("radix json creator: ", radixPayload);
  // console.log("transit json creator: ", transitPayload);
  // console.log('🔥 BIWHEEL FULL PAYLOAD:', biwheelPayload);

  const synastryShakenTreeJson = synastryShakeJSONtreeHelper(
    radixPayload,
    transitPayload,
    biwheelPayload,
  );

  const compatibility = computeCompatibility(synastryShakenTreeJson);

  const eagleAspects =
    radixData && transitData
      ? findTwoChartAspects(radixData, transitData).filter(
          (a) => (a.orb ?? 999) <= 2,
        )
      : [];

  const eagleGrids =
    radixData && transitData
      ? buildEagleLarkGrids(radixData, transitData, eagleAspects)
      : [];

  const eagleJson = {
    grids: eagleGrids,
    generatedAt: new Date().toISOString(),
  };

  const handleBiwheelLLM = async (): Promise<string | null> => {
    if (!synastryShakenTreeJson || !compatibility) return null;

    setLlmLoading(true);
    setLlmError(null);

    try {
      const result = await getBiwheelInterpretation(
        synastryShakenTreeJson,
        compatibility,
      );

      console.log("LLM BIWHEEL RESULT:", result);
      return result;
    } catch (err) {
      console.log(err);
      setLlmError("LLM request failed");
      return null;
    } finally {
      setLlmLoading(false);
    }
  };

  console.log("synastry: ", synastryShakenTreeJson);
  console.log("compatibility:", compatibility);
  console.log("eagle grids: ", eagleJson);

  return {
    // data
    radixData,
    transitData,

    // charts
    radixChart,
    transitChart,

    houseOverlay,

    // inputs
    setRadixInput,
    setTransitInput,

    // ui
    selectedPlanets,
    setSelectedPlanets,

    // setters
    setRadixCustomPlanetInfo,
    setTransitCustomPlanetInfo,
    setRadixCustomHouseRulers,
    setTransitCustomHouseRulers,

    // eagle
    eagleGrids,

    // payloads
    radixPayload,
    transitPayload,
    biwheelPayload,
    compatibility,

    //llm
    handleBiwheelLLM,
    llmLoading,
    llmError,
  };
};

// astro-native\hooks\componentHooks\useBiwheelPage.ts
import { useEffect, useState } from "react";
import type {
  ChartInput,
  ChartSummary,
  CustomAspect,
  CustomHouseRuler,
  CustomPlanetInfo,
} from "../../types/types";
import axios from "axios";
import { backendUrl } from "../../constants/constants";
import { mapToChartData } from "../../utils/mapToChart";
import { useChartAnalysis } from "./useChartAnalysis";
import { useChartDataDebug } from "./useChartDataDebug";
import { buildHouseOverlay } from "../../utils/houseOverlayBiwheelHelper";
import { buildBiwheelPayload } from "../../utils/buildBiwheelPayload";
import { synastryShakeJSONtreeHelper } from "../../utils/synastryShakeJSONtreeHelper";
import { computeCompatibility } from "../../utils/synastryCompatibilityHelper";
import { buildEagleLarkGrids } from "../../utils/buildEagleLarkGrids";
import { findTwoChartAspects } from "../../utils/TwoChartsAspectFinder";
import { getBiwheelInterpretation } from "../../services/llmService";

export const useBiwheelPage = () => {
  // raw data
  const [radixData, setRadixData] = useState<ChartSummary | null>(null);
  const [transitData, setTransitData] = useState<ChartSummary | null>(null);

  // inputs
  const [radixInput, setRadixInput] = useState<ChartInput | null>(null);
  const [transitInput, setTransitInput] = useState<ChartInput | null>({
    date: new Date(),
    lat: 37.9838,
    lng: 23.7275,
  });

  // planets
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

  // custom
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
  const [radixCustomAspects, setRadixCustomAspects] = useState<CustomAspect[]>(
    [],
  );
  const [transitCustomAspects, setTransitCustomAspects] = useState<
    CustomAspect[]
  >([]);

  const [llmLoading, setLlmLoading] = useState(false);
  const [llmError, setLlmError] = useState<string | null>(null);

  const defaultUserOrb = 1;

  //  analysis
  const radixAnalysis = useChartAnalysis(radixData, defaultUserOrb);
  const transitAnalysis = useChartAnalysis(transitData, defaultUserOrb);

  useEffect(() => {
    if (!radixInput) return;

    const run = async () => {
      try {
        const res = await axios.post(`${backendUrl}/api/astro/calculate`, {
          year: radixInput.date.getUTCFullYear(),
          month: radixInput.date.getUTCMonth() + 1,
          day: radixInput.date.getUTCDate(),
          hour: radixInput.date.getUTCHours(),
          minute: radixInput.date.getUTCMinutes(),
          latitude: radixInput.lat,
          longitude: radixInput.lng,
          houseSystem: "placidus",
          zodiac: "tropical",
        });

        setRadixData(res.data);
      } catch (err) {
        console.log("Radix error:", err);
      }
    };

    run();
  }, [radixInput]);

  useEffect(() => {
    if (!transitInput) return;

    const run = async () => {
      try {
        const res = await axios.post(`${backendUrl}/api/astro/calculate`, {
          year: transitInput.date.getUTCFullYear(),
          month: transitInput.date.getUTCMonth() + 1,
          day: transitInput.date.getUTCDate(),
          hour: transitInput.date.getUTCHours(),
          minute: transitInput.date.getUTCMinutes(),
          latitude: transitInput.lat,
          longitude: transitInput.lng,
          houseSystem: "placidus",
          zodiac: "tropical",
        });

        setTransitData(res.data);
      } catch (err) {
        console.log("Transit error:", err);
      }
    };

    run();
  }, [transitInput]);

  //  payloads
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

  useEffect(() => {
    if (radixAnalysis.aspects) {
      setRadixCustomAspects(radixAnalysis.aspects);
    }

    if (transitAnalysis.aspects) {
      setTransitCustomAspects(transitAnalysis.aspects);
    }
  }, [radixAnalysis.aspects, transitAnalysis.aspects]);

  // charts
  const radixChart = radixData
    ? mapToChartData(radixData, selectedPlanets)
    : null;
  const transitChart = transitData
    ? mapToChartData(transitData, selectedPlanets)
    : null;

  // house overlay
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // console.log("synastry: ", synastryShakenTreeJson);
  // console.log("compatibility:", compatibility);
  // console.log("eagle grids: ", eagleJson);

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
    transitInput,

    radixCustomPlanetInfo,
    transitCustomPlanetInfo,

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

    radixCustomAspects,
    transitCustomAspects,

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

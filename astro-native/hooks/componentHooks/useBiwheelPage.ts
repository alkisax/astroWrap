// astro-native\hooks\componentHooks\useBiwheelPage.ts
import { Alert } from "react-native";
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
// import { useRewardedAd } from "./useRewardedAd"; //TODO toggle for no ads

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

  const [showLLM, setShowLLM] = useState(false);
  const [llmResult, setLlmResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastCallAt, setLastCallAt] = useState<number | null>(null);

  // const { loaded, rewardEarned, setRewardEarned, showAd } = useRewardedAd(); //TODO toggle for no ads

  const COOLDOWN = 30000;

  useEffect(() => {
    setShowLLM(false);
    setLlmResult(null);
  }, [radixData, transitData]);

  const defaultUserOrb = 1;

  //  analysis
  const radixAnalysis = useChartAnalysis(radixData, defaultUserOrb);
  const transitAnalysis = useChartAnalysis(transitData, defaultUserOrb);

  useEffect(() => {
    if (!radixInput) return;

    const run = async () => {
      try {
        const res = await axios.post(`${backendUrl}/api/astro/calculate`, {
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

        // console.log("🧪 BIWHEEL TRANSIT RESULT:", {
        //   asc: res.data?.ascendant,
        //   sun: res.data?.sun,
        //   moon: res.data?.moon,
        //   house1: res.data?.houses?.[0],
        // });

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

  // console.log("🧪 RADIX PAYLOAD PLANETS:", radixPayload?.analysis?.planets);

  // console.log("🧪 TRANSIT PAYLOAD PLANETS:", transitPayload?.analysis?.planets);

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

      // console.log("LLM BIWHEEL RESULT:", result);
      return result;
    } catch (err) {
      console.log(err);
      setLlmError("LLM request failed");
      return null;
    } finally {
      setLlmLoading(false);
    }
  };

  // TODO toggle for no ads
  // const handleBiwheelLLMClick = async () => {
  //   if (isProcessing) return;

  //   if (!loaded) {
  //     Alert.alert("Loading...", "Ad is preparing, try again in a few seconds");
  //     return;
  //   }

  //   if (lastCallAt && Date.now() - lastCallAt < COOLDOWN) {
  //     Alert.alert("Wait", "Please wait a bit before next reading");
  //     return;
  //   }

  //   setIsProcessing(true);

  //   setTimeout(() => {
  //     setIsProcessing(false);
  //   }, 15000);

  //   showAd();
  // };

  // TODO toggle for no ads
  // useEffect(() => {
  //   if (!rewardEarned) return;

  //   const run = async () => {
  //     setShowLLM(true);
  //     setLlmLoading(true);
  //     setLlmError(null);

  //     try {
  //       const result = await handleBiwheelLLM();
  //       setLlmResult(result);
  //     } catch {
  //       setLlmResult(null);
  //       setLlmError("LLM request failed");
  //     } finally {
  //       setLlmLoading(false);
  //       setRewardEarned(false);
  //       setIsProcessing(false);
  //       setLastCallAt(Date.now());
  //     }
  //   };

  //   run();

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [rewardEarned]);

  // TODO toggle → llm without ads
  const handleBiwheelLLMClick = async () => {
    if (isProcessing) return;

    if (lastCallAt && Date.now() - lastCallAt < COOLDOWN) {
      Alert.alert("Wait", "Please wait a bit before next reading");
      return;
    }

    setIsProcessing(true);

    setShowLLM(true);
    setLlmLoading(true);
    setLlmError(null);

    try {
      // 🔍 DEBUG SUMMARY
      console.log("🧪 RELATIONSHIP UI SUMMARY", {
        radix: {
          asc: radixData?.ascendant?.sign,
          sun: {
            sign: radixData?.sun?.sign,
            house: radixData?.sun?.house,
          },
          moon: {
            sign: radixData?.moon?.sign,
            house: radixData?.moon?.house,
          },
        },

        transit: {
          asc: transitData?.ascendant?.sign,
          sun: {
            sign: transitData?.sun?.sign,
            house: transitData?.sun?.house,
          },
          moon: {
            sign: transitData?.moon?.sign,
            house: transitData?.moon?.house,
          },
        },
      });

      // 🔍 SHAKEN SUMMARY
      console.log("🧪 SYNASTRY SHAKEN SUMMARY", {
        radix: {
          asc: radixPayload?.analysis?.planets?.find((p) => p.planet === "asc"),
        },

        transit: {
          asc: transitPayload?.analysis?.planets?.find(
            (p) => p.planet === "asc",
          ),
        },
        compatibility,
      });

      // 🔍 FINAL PAYLOAD
      console.log(
        "🧠 FINAL SYNASTRY SNAPSHOT:",
        JSON.stringify(
          {
            synastry: synastryShakenTreeJson,
            compatibility,
          },
          null,
          2,
        ),
      );
      const result = await handleBiwheelLLM();
      console.log("🧠 RAW RELATIONSHIP LLM RESPONSE:", result);
      setLlmResult(result);
    } catch (err) {
      console.log("❌ RELATIONSHIP LLM ERROR:", err);
      setLlmResult(null);
      setLlmError("LLM request failed");
    } finally {
      setLlmLoading(false);
      setIsProcessing(false);
      setLastCallAt(Date.now());
    }
  };

  // console.log("houseOverlay (hook):", houseOverlay);
  // console.log("radix json creator: ", radixPayload);
  // console.log("transit json creator: ", transitPayload);
  // console.log('🔥 BIWHEEL FULL PAYLOAD:', biwheelPayload);
  // console.log("synastry: ", synastryShakenTreeJson);
  // console.log("compatibility:", compatibility);
  // console.log("eagle grids: ", eagleJson);
  // console.log("🧪 BIWHEEL TRANSIT BACKEND INPUT:", {
  //   raw: transitInput?.date.toString(),
  //   iso: transitInput?.date.toISOString(),
  //   utc: {
  //     year: transitInput?.date.getUTCFullYear(),
  //     month: transitInput?.date.getUTCMonth() + 1,
  //     day: transitInput?.date.getUTCDate(),
  //     hour: transitInput?.date.getUTCHours(),
  //     minute: transitInput?.date.getUTCMinutes(),
  //   },
  //   coords: {
  //     lat: transitInput?.lat,
  //     lng: transitInput?.lng,
  //   },
  // });

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

    //ads
    handleBiwheelLLMClick, // TODO toggle
    showLLM,
    llmResult,
    // loaded, // TODO toggle
    isProcessing,
  };
};

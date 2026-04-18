// astro-native\hooks\componentHooks\useHome.ts
import { useEffect, useMemo, useState, useContext } from "react";
import { getSingleChartInterpretation } from "../../services/llmService";
import { useChartDataDebug } from "./useChartDataDebug";
import { natalChartShakeJSONTreeHelper } from "../../utils/natalChartShakeJSONTreeHelper";
import { UserAuthContext } from "../../authLogin/context/UserAuthContext";
import { useRewardedAd } from "../../hooks/componentHooks/useRewardedAd";

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

import axios from "axios";
import { backendUrl } from "../../constants/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

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

  // για το orb των aspects καταλήγει στο userOrbPicker
  const [userOrb, setUserOrb] = useState<number>(1);

  // ολα αυτά τα state είναι για να συγκεντρώσουμε εδω όλους τους υπολογισμούς για να φτιαχτεί ένα απλοποιημένο json που θα σταλθεί στο gpt
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

  const [showLLM, setShowLLM] = useState(false);
  const [llmResult, setLlmResult] = useState<string | null>(null);
  const [llmLoading, setLlmLoading] = useState(false);
  const [llmError, setLlmError] = useState<string | null>(null);

  const { user } = useContext(UserAuthContext);
  const { loaded, rewardEarned, setRewardEarned, showAd } = useRewardedAd();

  // 🔥 ΕΠΙΣΤΡΟΦΗ στο backend call (RN compatible)
  // input: ημερομηνια και συντεταγμένες
  // out: ChartSummary απο server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post(`${backendUrl}/api/astro/calculate`, {
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

        setData(res.data);
      } catch (err) {
        console.error("❌ chart fetch error", err);
      }
    };

    fetchData();
  }, [date, coords]);

  // submit (κάνει απλως set τα διάφορα input στο σωστο format και οι αλλαγες επιβάλλονται απο ένα "[]")
  const handleSubmit = (input: { date: Date; lat: number; lng: number }) => {
    setDate(input.date);
    setCoords({ lat: input.lat, lng: input.lng });
  };

  // εδώ είναι το κέντρο της δημιουργίας του json payload
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
    return natalChartShakeJSONTreeHelper(payload, customPlanetInfo);
  }, [customPlanetInfo, payload]);

  const handleLLMInterpretation = async (): Promise<string | null> => {
    if (!shaken) return null;

    setLlmLoading(true);
    setLlmError(null);

    try {
      const result = await getSingleChartInterpretation(shaken);
      return result;
    } catch (err) {
      console.log(err);
      setLlmError("LLM request failed");
      return null;
    } finally {
      setLlmLoading(false);
    }
  };

  // το αφήνω εδώ για legacy λογους. Μεταφέραμε την λογική ωστε να δέχεται διαφημίσεις. διάβασε επόμενο
  // const handleLLMClick = async () => {
  //   if (!payload) return;

  //   const snapshot = natalChartShakeJSONTreeHelper(payload, customPlanetInfo);
  //   console.log("snapshot", snapshot);

  //   setShowLLM(true);
  //   setLlmLoading(true);
  //   setLlmError(null);

  //   try {
  //     const result = await getSingleChartInterpretation(snapshot);
  //     console.log("SNAPSHOT", snapshot);
  //     setLlmResult(result);
  //   } catch {
  //     setLlmResult(null);
  //     setLlmError("LLM request failed");
  //   } finally {
  //     setLlmLoading(false);
  //   }
  // };

  // σπάσαμε την λογική του handleLLMClick σε δύο μέρη
  // εδώ το μονο που κοιτάζει είναι αν έχουμε preloaded διαφήμιση και αν ναι την προβάλει και όλη η λογική του κουμπιού γίνετε απο ενα useEffect που γίνετε trigger με την ολοκλήρωση της διαφήμισης (reward earned)
  const handleLLMClick = async () => {
    if (!payload) return;

    if (!loaded) {
      Alert.alert("Loading...", "Ad is preparing, try again in a few seconds");
      return;
    }

    showAd();
  };

  // και εδώ είναι το υπόλοιπο της λογικής που ήταν στο handleLLMClick σε useEffect πια
  useEffect(() => {
    if (!rewardEarned) return;
    if (!payload) return;

    const run = async () => {
      const snapshot = natalChartShakeJSONTreeHelper(payload, customPlanetInfo);

      setShowLLM(true);
      setLlmLoading(true);
      setLlmError(null);

      try {
        const result = await getSingleChartInterpretation(snapshot);
        setLlmResult(result);
      } catch {
        setLlmResult(null);
        setLlmError("LLM request failed");
      } finally {
        setLlmLoading(false);
        setRewardEarned(false);
      }
    };

    run();
  // disable lint on purpose for triggering when ad finished    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rewardEarned, customPlanetInfo]);

  const saveLLMToDb = async () => {
    const userId = user?.id || user?._id;

    if (!llmResult || !payload || !userId) return;

    const snapshot = natalChartShakeJSONTreeHelper(payload, customPlanetInfo);

    try {
      const token = await AsyncStorage.getItem("token");

      await axios.put(
        `${backendUrl}/api/sqlite/users/${userId}`,
        {
          natalChart: JSON.stringify(snapshot),
          natalDelineation: llmResult,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("✅ chart + LLM saved to DB");
      Alert.alert("Saved ✅", "Chart saved successfully");
    } catch (err) {
      console.error("❌ save failed", err);
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
    customAspects,
    setCustomAspects,
    setCustomDignities,
    setCustomDispositors,
    setCustomDynamics,

    // logic
    // shaken,

    handleSubmit,

    handleLLMInterpretation,
    llmLoading,
    llmError,
    handleLLMClick,
    showLLM,
    llmResult,
    saveLLMToDb,
  };
};

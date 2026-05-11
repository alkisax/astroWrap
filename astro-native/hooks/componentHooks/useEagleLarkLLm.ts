// astro-native\hooks\componentHooks\useEagleLarkLLm.ts
import { useEffect, useState } from "react";
import type { CustomPlanetInfo, EagleGrid } from "../../types/types";
import { getEagleLarkInterpretation } from "../../services/llmService";
import { Alert } from "react-native";
// import { useRewardedAd } from "./useRewardedAd"; // TODO toggle for no ads

// ελληνικά σχόλια: mapping topics → astro φίλτρα
const topicMap = {
  career: {
    houses: [10],
    planets: ["Saturn", "Sun", "Midheaven"],
  },
  money: {
    houses: [2, 8],
    planets: ["Venus", "Jupiter"],
  },
  relationships: {
    houses: [7],
    planets: ["Venus", "Mars"],
  },
  home: {
    houses: [4],
    planets: ["Moon", "IC"],
  },
  emotional: {
    houses: [4, 12],
    planets: ["Moon", "Neptune"],
  },
  change: {
    houses: [8],
    planets: ["Pluto", "Uranus"],
  },
};

type TopicKey = keyof typeof topicMap;

// ελληνικά σχόλια: φιλτράρει grids με βάση topics + strongest
const filterGrids = (grids: EagleGrid[], topics: TopicKey[]) => {
  const selected = topics.flatMap((t) => topicMap[t]);

  const houses = new Set(selected.flatMap((s) => s.houses));
  const planets = new Set(selected.flatMap((s) => s.planets));

  const relevant = grids.filter((g) => {
    return (
      houses.has(g.action?.transitHouse ?? -1) ||
      houses.has(g.cause?.natalHouse ?? -1) ||
      planets.has(g.transitPlanet) ||
      planets.has(g.natalPlanet) ||
      houses.has(g.cause?.transitNatalHouse ?? -1) ||
      g.effect?.natalRules?.some((h) => houses.has(h)) ||
      g.effect?.transitRules?.some((h) => houses.has(h))
    );
  });

  const strongest = [...grids]
    .sort((a, b) => (a.orb ?? 999) - (b.orb ?? 999))
    .slice(0, 2);

  return [...new Set([...relevant, ...strongest])];
};

type Props = {
  eagleGrids: EagleGrid[];
  radixCustomPlanetInfo: CustomPlanetInfo[];
  transitCustomPlanetInfo: CustomPlanetInfo[];
};

export const useEagleLarkLLm = ({
  eagleGrids,
  radixCustomPlanetInfo,
  transitCustomPlanetInfo,
}: Props) => {
  const [selectedTopics, setSelectedTopics] = useState<TopicKey[]>([]);
  const [userQuestion, setUserQuestion] = useState("");

  const [llmEagleLarkResult, setLlmEagleLarkResult] = useState<string | null>(
    null,
  );
  const [llmEagleLarkLoading, setLlmEagleLarkLoading] = useState(false);
  const [llmEagleLarkError, setLlmEagleLarkError] = useState<string | null>(
    null,
  );
  const [showLLM, setShowLLM] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastCallAt, setLastCallAt] = useState<number | null>(null);

  // const { loaded, rewardEarned, setRewardEarned, showAd } = useRewardedAd(); // TODO toggle for no ads

  const COOLDOWN = 30000;

  // δημιουργεί compact payload για LLM
  const eagleLarkLlmPayloadJSON = () => {
    const filtered = filterGrids(eagleGrids, selectedTopics);

    return {
      question: userQuestion,
      topics: selectedTopics,

      radix: radixCustomPlanetInfo,
      transit: transitCustomPlanetInfo,

      grids: filtered.map((g) => ({
        transitPlanet: g.transitPlanet,
        natalPlanet: g.natalPlanet,
        aspect: g.aspect,
        orb: g.orb,

        cause: {
          natalHouse: g.cause?.natalHouse,
          transitNatalHouse: g.cause?.transitNatalHouse,
        },

        action: {
          transitHouse: g.action?.transitHouse,
        },

        effect: {
          natalRules: g.effect?.natalRules,
          transitRules: g.effect?.transitRules,
        },
      })),
    };
  };

  // αυτή ήταν η λειτουργία πριν τα ads - μενει για legacy και safety λόγος
  // TODO toggle for no ads
  const runEagleLarkLLM = async () => {
    if (!eagleGrids?.length) return;

    setLlmEagleLarkLoading(true);
    setLlmEagleLarkError(null);

    try {
      const payload = eagleLarkLlmPayloadJSON();

      const res = await getEagleLarkInterpretation(payload);

      setLlmEagleLarkResult(res);
    } catch (err) {
      console.log(err);
      setLlmEagleLarkError("LLM request failed");
    } finally {
      setLlmEagleLarkLoading(false);
    }
  };

  // TODO toggle for no ads
  // const handleQuestionSubmit = () => {
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
  //     setLlmEagleLarkLoading(true);
  //     setLlmEagleLarkError(null);

  //     try {
  //       const payload = eagleLarkLlmPayloadJSON();

  //       const res = await getEagleLarkInterpretation(payload);

  //       setLlmEagleLarkResult(res);
  //     } catch (err) {
  //       console.log(err);
  //       setLlmEagleLarkError("LLM request failed");
  //     } finally {
  //       setLlmEagleLarkLoading(false);
  //       setRewardEarned(false);
  //       setIsProcessing(false);
  //       setLastCallAt(Date.now());
  //     }
  //   };

  //   run();
  //   // disable lint on purpose for rewarded ad trigger flow
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [rewardEarned]);

  return {
    selectedTopics,
    setSelectedTopics,
    userQuestion,
    setUserQuestion,
    // runEagleLarkLLM,
    llmEagleLarkResult,
    setLlmEagleLarkResult,
    llmEagleLarkLoading,
    llmEagleLarkError,

    eagleLarkLlmPayloadJSON,

    // handleQuestionSubmit, // TODO toggle for no ads
    showLLM,
    // loaded, // TODO toggle for no ads
    isProcessing,
  };
};

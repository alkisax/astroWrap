import { useState } from "react";
import type { CustomPlanetInfo, EagleGrid } from "../../types/types";

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
  const [llmLoading, setLlmLoading] = useState(false);
  const [llmError, setLlmError] = useState<string | null>(null);

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

  const handleQuestionSubmit = async () => {
    if (!eagleGrids?.length) return;

    setLlmLoading(true);
    setLlmError(null);

    try {
      // const filtered = filterGrids(eagleGrids, selectedTopics);

      // προσωρινό mock μέχρι να μπει API
      //   const res = `
      //     Question: ${userQuestion}
      //     Selected topics: ${selectedTopics.join(", ")}
      //     Filtered grids: ${filtered.length}
      //     Top example:
      //     ${filtered[0]?.transitPlanet} ${filtered[0]?.aspect} ${filtered[0]?.natalPlanet}
      // `;
      const payload = eagleLarkLlmPayloadJSON();

      const res = JSON.stringify(payload, null, 2);

      setLlmEagleLarkResult(res);
    } catch (err) {
      console.log(err);
      setLlmError("LLM request failed");
    } finally {
      setLlmLoading(false);
    }
  };

  return {
    selectedTopics,
    setSelectedTopics,
    userQuestion,
    setUserQuestion,

    handleQuestionSubmit,

    llmEagleLarkResult,
    llmLoading,
    llmError,

    eagleLarkLlmPayloadJSON,
  };
};

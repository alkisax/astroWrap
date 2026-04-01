import { useState } from "react";
import type { EagleGrid } from "../../types/types";

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
      planets.has(g.natalPlanet)
    );
  });

  const strongest = [...grids].sort((a, b) => (a.orb ?? 999) - (b.orb ?? 999)).slice(0, 2);

  return [...new Set([...relevant, ...strongest])];
};

type Props = {
  eagleGrids: EagleGrid[];
};

export const useEagleLarkLLm = ({ eagleGrids }: Props) => {
  const [selectedTopics, setSelectedTopics] = useState<TopicKey[]>([]);
  const [userQuestion, setUserQuestion] = useState("");

  const [llmEagleLarkResult, setLlmEagleLarkResult] = useState<string | null>(
    null,
  );
  const [llmLoading, setLlmLoading] = useState(false);
  const [llmError, setLlmError] = useState<string | null>(null);

  const handleQuestionSubmit = async () => {
    if (!eagleGrids?.length) return;

    setLlmLoading(true);
    setLlmError(null);

    try {
      const filtered = filterGrids(eagleGrids, selectedTopics);

      // προσωρινό mock μέχρι να μπει API
      const res = `
        Question: ${userQuestion}
        Selected topics: ${selectedTopics.join(", ")}
        Filtered grids: ${filtered.length}
        Top example:
        ${filtered[0]?.transitPlanet} ${filtered[0]?.aspect} ${filtered[0]?.natalPlanet}
    `;

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
  };
};

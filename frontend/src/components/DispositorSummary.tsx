import { Paper, Text } from "@mantine/core";
import { planetIcons } from "../constants/constants";
import { getAllDispositors } from "../utils/dispositorCalculator";
import type { ChartSummary } from "../types/types";

type Props = {
  data: ChartSummary;
};

const DispositorSummary = ({ data }: Props) =>  {
  const results = getAllDispositors(data);

  const finals = results
    .filter(r => r.result.type === "final")
    .map(r => r.planet);

  const loops = results
    .filter(r => r.result.type === "loop" && r.result.loopStart)
    .map(r => r.result.loopStart)
    .filter((p): p is string => p !== undefined);

  const uniqueLoop = Array.from(new Set(loops));

  return (
    <Paper
      withBorder
      p="md"
      radius="md"
      style={{ width: "20vw", margin: "20px auto", textAlign: "center" }}
    >
      <Text fw={600}>🧠 Chart Dynamics</Text>

      {/* Backbone */}
      {finals.length > 0 && (
        <Text mt="sm">
          🔥 Backbone:{" "}
          {finals.map((p, i) => (
            <span key={i}>
              {planetIcons[p]} {p}
              {i < finals.length - 1 && ", "}
            </span>
          ))}
        </Text>
      )}

      {/* Loop */}
      {uniqueLoop.length >= 2 && (
        <Text mt="sm">
          🔁 Dominant Loop:{" "}
          {uniqueLoop.map((p, i) => (
            <span key={i}>
              {planetIcons[p]} {p}
              {i < uniqueLoop.length - 1 && " ⇄ "}
            </span>
          ))}
        </Text>
      )}
    </Paper>
  );
}

export default DispositorSummary
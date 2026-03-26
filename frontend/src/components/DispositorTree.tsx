import { Paper, Text, Stack } from "@mantine/core";
import type { ChartSummary } from "../types/types";
import { getAllDispositors } from "../utils/dispositorCalculator";
import { planetIcons } from "../constants/constants";
import DispositorSummary from "./DispositorSummary";

type Props = {
  data: ChartSummary;
};

const DispositorTree = ({ data }: Props) => {
  const results = getAllDispositors(data);

  return (
    <Paper
      withBorder
      p="md"
      radius="md"
      style={{ width: "50vw", margin: "20px auto" }}
    >
      <DispositorSummary data={data} />
      <Text fw={600} ta="center">
        🌳 Dispositor Tree
      </Text>

      <Stack mt="sm">
        {results.map((r, i) => (
          <Text key={i} ta="center">
            {planetIcons[r.planet]} {r.planet} →

            {" "}

            {r.result.chain.map((p, idx) => {
              const isLast = idx === r.result.chain.length - 1;

              return (
                <span key={idx}>
                  {planetIcons[p]} {p}
                  {!isLast && " → "}
                </span>
              );
            })}

            {/* LOOP VISUAL */}
            {r.result.type === "loop" && r.result.loopStart && (
              <>
                {" "}⇄ {planetIcons[r.result.loopStart]} {r.result.loopStart} 🔁
              </>
            )}

            {/* FINAL */}
            {r.result.type === "final" && " ⭐ final"}
          </Text>
        ))}
      </Stack>
    </Paper>
  );
}

export default DispositorTree
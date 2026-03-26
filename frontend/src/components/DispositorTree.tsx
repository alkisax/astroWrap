import { Paper, Text, Stack } from "@mantine/core";
import type { ChartSummary } from "../types/types";
import { getAllDispositors } from "../utils/dispositorCalculator";
import { planetIcons } from "../constants/constants";

type Props = {
  data: ChartSummary;
};

export default function DispositorTree({ data }: Props) {
  const results = getAllDispositors(data);

  return (
    <Paper
      withBorder
      p="md"
      radius="md"
      style={{ width: "50vw", margin: "20px auto" }}
    >
      <Text fw={600} ta="center">
        🌳 Dispositor Tree
      </Text>

      <Stack mt="sm">
        {results.map((r, i) => (
          <Text key={i} ta="center">
            {/* start planet */}
            {planetIcons[r.planet]} {r.planet} →

            {/* chain */}
            {" "}
            {r.result.chain.map((p, idx) => (
              <span key={idx}>
                {planetIcons[p]} {p}
                {idx < r.result.chain.length - 1 ? " → " : ""}
              </span>
            ))}

            {/* type */}
            {" "}
            {r.result.type === "final" ? "⭐ final" : "🔁 loop"}
          </Text>
        ))}
      </Stack>
    </Paper>
  );
}
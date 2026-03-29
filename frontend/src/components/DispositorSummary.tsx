import { Paper, Text, Stack } from "@mantine/core";
import { planetIcons, colors } from "../constants/constants";
import { getAllDispositors } from "../utils/dispositorCalculator";
import type { ChartSummary } from "../types/types";
import { getMutualReceptions } from "../utils/mutualReception";

type Props = {
  data: ChartSummary;
};

const DispositorSummary = ({ data }: Props) => {
  const results = getAllDispositors(data);

  const finals = Array.from(
    new Set(
      results
        .filter(r => r.result.type === 'final')
        .map(r => {
          const chain = r.result.chain
          return chain[chain.length - 1] // 🔥 τελευταίος πλανήτης
        })
    )
  )

  const loops = results
    .filter((r) => r.result.type === "loop" && r.result.loopStart)
    .map((r) => r.result.loopStart)
    .filter((p): p is string => p !== undefined);

  const uniqueLoop = Array.from(new Set(loops));
  const mutual = getMutualReceptions(data);

  return (
    <Paper
      p="md"
      radius="md"
      style={{
        width: "100%",
        maxWidth: "700px",
        margin: "10px auto",
        background: colors.panel,
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: colors.text,
      }}
    >
      <Text fw={600} size="sm" ta="center" c={colors.dim}>
        🧠 Chart Dynamics
      </Text>

      <Stack mt="sm" gap="xs">
        {/* 🔥 Backbone */}
        {finals.length > 0 && (
          <div style={{ fontSize: "12px" }}>
            <Text size="xs" c={colors.dim}>Backbone</Text>
            <div>
              {finals.map((p, i) => (
                <span key={i}>
                  {planetIcons[p]} {p}
                  {i < finals.length - 1 && ", "}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 🔁 Loop */}
        {uniqueLoop.length >= 2 && (
          <div style={{ fontSize: "12px" }}>
            <Text size="xs" c={colors.dim}>Dominant Loop</Text>
            <div>
              {uniqueLoop.map((p, i) => (
                <span key={i}>
                  {planetIcons[p]} {p}
                  {i < uniqueLoop.length - 1 && " ⇄ "}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 🔗 Mutual */}
        {mutual.length > 0 && (
          <div style={{ fontSize: "12px" }}>
            <Text size="xs" c={colors.dim}>Mutual Reception</Text>
            <div>
              {mutual.map((pair, i) => (
                <span key={i}>
                  {planetIcons[pair[0]]} {pair[0]} ⇄ {planetIcons[pair[1]]} {pair[1]}
                  {i < mutual.length - 1 && ", "}
                </span>
              ))}
            </div>
          </div>
        )}
      </Stack>
    </Paper>
  );
};

export default DispositorSummary;
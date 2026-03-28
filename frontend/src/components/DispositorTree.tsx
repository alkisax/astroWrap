import { Paper, Text, Stack } from "@mantine/core";
import type { ChartSummary } from "../types/types";
import { getAllDispositors } from "../utils/dispositorCalculator";
import { planetIcons, colors } from "../constants/constants";
import DispositorSummary from "./DispositorSummary";

type Props = {
  data: ChartSummary;
};

const DispositorTree = ({ data }: Props) => {
  const results = getAllDispositors(data);

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
      <DispositorSummary data={data} />

      <Text fw={600} size="sm" ta="center" c={colors.dim}>
        🌳 Dispositor Tree
      </Text>

      <Stack mt="sm" gap="xs">
        {results.map((r, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "6px",
              padding: "4px 6px",
              borderRadius: "4px",
              background: "rgba(255,255,255,0.02)",
              fontSize: "12px",
            }}
          >
            {/* START */}
            <span>
              {planetIcons[r.planet]} {r.planet}
            </span>

            <span style={{ color: colors.dim }}>→</span>

            {/* CHAIN */}
            {r.result.chain.map((p, idx) => {
              const isLast = idx === r.result.chain.length - 1;

              return (
                <span key={idx} style={{ display: "flex", gap: 4 }}>
                  {planetIcons[p]} {p}
                  {!isLast && <span style={{ color: colors.dim }}>→</span>}
                </span>
              );
            })}

            {/* LOOP */}
            {r.result.type === "loop" && r.result.loopStart && (
              <span style={{ color: "#ff922b" }}>
                ⇄ {planetIcons[r.result.loopStart]} {r.result.loopStart} 🔁
              </span>
            )}

            {/* FINAL */}
            {r.result.type === "final" && (
              <span style={{ color: "#ffd43b" }}>⭐ final</span>
            )}
          </div>
        ))}
      </Stack>
    </Paper>
  );
};

export default DispositorTree;
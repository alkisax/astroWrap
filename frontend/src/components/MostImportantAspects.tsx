import { Paper, Text, Stack } from "@mantine/core";
import type { ChartSummary } from "../types/types";
import { aspectIcons, planetIcons, colors } from "../constants/constants";
import { getAngleAspects } from "../utils/getAngleAspects";

type Props = {
  data: ChartSummary;
};

const MostImportantAspects = ({ data }: Props) => {
  const aspects = data.aspects ?? [];
  if (!aspects.length) return null;

  const allAspects = [
    ...aspects,
    ...getAngleAspects(data),
  ];

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
        🔗 Aspects
      </Text>

      <Stack mt="sm" gap="xs">
        {allAspects.map((a, i) => {
          const orb = a.orb != null ? a.orb.toFixed(2) : "?";

          const p1 = a.point1Label;
          const p2 = a.point2Label;

          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                padding: "4px 6px",
                borderRadius: "4px",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <span>
                {planetIcons[p1]} {p1}
              </span>

              <span>
                {aspectIcons[a.type]}
              </span>

              <span>
                {planetIcons[p2]} {p2}
              </span>

              <span style={{ color: colors.dim }}>
                {a.type} ({orb}°)
              </span>
            </div>
          );
        })}
      </Stack>
    </Paper>
  );
};

export default MostImportantAspects;
// components/TwoChartsAspectsTable.tsx

import { Paper, Text, Stack } from "@mantine/core";
import type { ChartSummary } from "../../types/types";
import { planetIcons, aspectIcons, colors } from "../../constants/constants";
import { findTwoChartAspects } from "../../utils/TwoChartsAspectFinder";

type Props = {
  radix: ChartSummary;
  transit: ChartSummary;
};

const TwoChartsAspectsTable = ({ radix, transit }: Props) => {
  const aspects = findTwoChartAspects(radix, transit)
    // 1️⃣ κόψε μεγάλο orb
    .filter(a => (a.orb ?? 999) <= 3)

    // 2️⃣ κράτα μόνο βασικούς πλανήτες (optional αλλά recommended)
    .filter(a => {
      const allowed = [
        "Sun", "Moon", "Mercury", "Venus", "Mars",
        "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"
      ];

      const t = a.point1Label.replace("T-", "");
      const n = a.point2Label.replace("N-", "");

      return allowed.includes(t) && allowed.includes(n);
    })

    // 3️⃣ αφαίρεση duplicates (κρατάμε μόνο μία κατεύθυνση)
    .filter((a, i, arr) => {
      return i === arr.findIndex(b =>
        a.type === b.type &&
        a.point1Label === b.point1Label &&
        a.point2Label === b.point2Label
      );
    })

    // 4️⃣ sort by orb
    .sort((a, b) => (a.orb ?? 999) - (b.orb ?? 999));

  if (!aspects.length) return null;

  return (
    <Paper
      p="md"
      radius="md"
      style={{
        width: "100%",
        maxWidth: "700px",
        margin: "20px auto",
        background: colors.panel,
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: colors.text,
      }}
    >
      <Text fw={600} size="sm" ta="center" c={colors.dim}>
        🔮 Transit Aspects (β → α)
      </Text>

      <Stack mt="sm" gap="xs">
        {aspects.map((a, i) => {
          const orb = a.orb != null ? a.orb.toFixed(2) : "?";

          const tName = a.point1Label.replace("T-", "");
          const nName = a.point2Label.replace("N-", "");

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
                {planetIcons[tName]} T-{tName}
              </span>

              <span>{aspectIcons[a.type]}</span>

              <span>
                {planetIcons[nName]} N-{nName}
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

export default TwoChartsAspectsTable;
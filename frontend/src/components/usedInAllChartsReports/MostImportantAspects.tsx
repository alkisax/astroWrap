// frontend\src\components\usedInAllChartsReports\MostImportantAspects.tsx
// in: data απο home (δεν φτιαχνει συγκεντρωτικό json)
// συνεργάζεται με το getAngleAspects

import { Paper, Text, Stack } from "@mantine/core";
import type { ChartSummary } from "../../types/types";
import { aspectIcons, planetIcons, colors, planets } from "../../constants/constants";
import { getAngleAspects } from "../../utils/getAngleAspects";

type Props = {
  data: ChartSummary;
  userOrb: number;
};

const MostImportantAspects = ({ data, userOrb }: Props) => {

  // έρχεται απο constants. κάναμε as string γιατί εκεί είναι type planets
  const allowedPoints = planets as string[]

  // το circular-natal-horoscope-js μου τα επιστρέφει
  const aspects = data.aspects ?? [];
  if (!aspects.length) return null;

  const allAspects = [
    // ...aspects,
    ...getAngleAspects(data, userOrb),
  ].filter(a =>
    allowedPoints.includes(a.point1Label) &&
    allowedPoints.includes(a.point2Label)
  );

  console.log('LIB', data.aspects)
  console.log("getangleaspects",getAngleAspects(data))

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
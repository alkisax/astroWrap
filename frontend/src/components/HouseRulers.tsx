import { Paper, Text, Stack } from "@mantine/core";
import type { ChartSummary } from "../types/types";
import { computeHouseRulers } from "../utils/houseRulers";
import { planetIcons, signIcons, colors } from "../constants/constants";

type Props = {
  data: ChartSummary;
};

const HouseRulers = ({ data }: Props) => {
  const results = computeHouseRulers(data);

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
        🏠 House Rulers
      </Text>

      <Stack mt="sm" gap="xs">
        {results.map((r) => (
          <div
            key={r.house}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "12px",
              padding: "4px 6px",
              borderRadius: "4px",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            {/* LEFT: House */}
            <span>
              🏠 {r.house} ({signIcons[r.sign]} {r.sign})
            </span>

            {/* MIDDLE: ruler */}
            <span>
              → {planetIcons[r.ruler]} {r.ruler}
            </span>

            {/* RIGHT: placement */}
            <span style={{ color: colors.dim }}>
              {r.inSign ? (
                <>
                  {signIcons[r.inSign]} {r.inSign} (H{r.inHouse})
                </>
              ) : (
                "unknown"
              )}
            </span>
          </div>
        ))}
      </Stack>
    </Paper>
  );
};

export default HouseRulers;
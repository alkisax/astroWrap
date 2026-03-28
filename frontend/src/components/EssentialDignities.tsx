import { Paper, Text, Stack } from "@mantine/core";
import type { ChartSummary } from "../types/types";
import { getZodiacSign } from "../utils/astroHelpers";
import { planetIcons, signIcons, colors } from "../constants/constants";

import { domicile, exaltation, detriment, fall } from "../constants/dignities";

function getDignity(planet: string, sign: string) {
  if (domicile[planet]?.includes(sign)) return "domicile";
  if (exaltation[planet] === sign) return "exaltation";
  if (detriment[planet]?.includes(sign)) return "detriment";
  if (fall[planet] === sign) return "fall";

  return "neutral";
}

const dignityMeta = {
  domicile: { emoji: "⭐", color: "#ffd43b" },
  exaltation: { emoji: "🔥", color: "#ff922b" },
  detriment: { emoji: "⚠️", color: "#ff6b6b" },
  fall: { emoji: "❌", color: "#fa5252" },
  neutral: { emoji: "➖", color: "#868e96" },
};

type Props = {
  data: ChartSummary;
};

const planetsList = [
  "Sun",
  "Moon",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
];

const EssentialDignities = ({ data }: Props) => {
  const planetMap = {
    Sun: data.sun,
    Moon: data.moon,
    Mercury: data.mercury,
    Venus: data.venus,
    Mars: data.mars,
    Jupiter: data.jupiter,
    Saturn: data.saturn,
  };

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
        ⚖️ Essential Dignities
      </Text>

      <Stack mt="sm" gap="xs">
        {planetsList.map((p) => {
          const val = planetMap[p as keyof typeof planetMap]?.longitude;
          if (val == null) return null;

          const sign = getZodiacSign(val);
          const dignity = getDignity(p, sign);
          const meta = dignityMeta[dignity];

          return (
            <div
              key={p}
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
              {/* LEFT */}
              <span>
                {planetIcons[p]} {p}
              </span>

              {/* MIDDLE */}
              <span>
                {signIcons[sign]} {sign}
              </span>

              {/* RIGHT */}
              <span style={{ color: meta.color }}>
                {meta.emoji} {dignity}
              </span>
            </div>
          );
        })}
      </Stack>
    </Paper>
  );
};

export default EssentialDignities;
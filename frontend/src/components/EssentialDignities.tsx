import { Paper, Text, Stack } from "@mantine/core";
import type { ChartSummary } from "../types/types";
import { getZodiacSign } from "../utils/astroHelpers";
import { planetIcons, signIcons } from "../constants/constants";

import { domicile, exaltation, detriment, fall } from "../constants/dignities";

function getDignity(planet: string, sign: string) {
  if (domicile[planet]?.includes(sign)) return "domicile";
  if (exaltation[planet] === sign) return "exaltation";
  if (detriment[planet]?.includes(sign)) return "detriment";
  if (fall[planet] === sign) return "fall";

  return "neutral";
}

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
      withBorder
      p="md"
      radius="md"
      style={{ maxWidth: 700, margin: "20px auto" }}
    >
      <Text fw={600} ta="center">
        ⚖️ Essential Dignities
      </Text>

      <Stack mt="sm">
        {planetsList.map((p) => {
          const val = planetMap[p as keyof typeof planetMap]?.longitude;
          if (val == null) return null;

          const sign = getZodiacSign(val);
          const dignity = getDignity(p, sign);

          const emoji =
            dignity === "domicile"
              ? "⭐"
              : dignity === "exaltation"
              ? "🔥"
              : dignity === "detriment"
              ? "⚠️"
              : dignity === "fall"
              ? "❌"
              : "➖";

          return (
            <Text key={p} ta="center">
              {planetIcons[p]} {p} in {signIcons[sign]} {sign} → {emoji} {dignity}
            </Text>
          );
        })}
      </Stack>
    </Paper>
  );
}

export default EssentialDignities
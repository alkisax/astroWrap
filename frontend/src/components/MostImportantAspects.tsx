import { Paper, Text, Stack } from "@mantine/core";
import type { ChartSummary } from "../types/types";
import { aspectIcons, planetIcons } from "../constants/constants";
import { getAngleAspects } from "../utils/getAngleAspects";

type Props = {
  data: ChartSummary;
};

const MostImportantAspects = ({ data }: Props) => {
  const aspects = data.aspects ?? [];

  if (!aspects.length) return null;

  const allAspects = [
    ...(data.aspects ?? []),
    ...getAngleAspects(data),
  ];

  return (
    <Paper
      withBorder
      p="md"
      radius="md"
      style={{ width: "50vw", margin: "20px auto" }}
    >
      <Text fw={600} ta="center">
        🔗 Aspects
      </Text>

      <Stack mt="sm">
        {allAspects.map((a, i) => {
          // console.log("i: ", i, " , a:", a );
          const orb = a.orb != null ? a.orb.toFixed(2) : "?";

          const p1 = a.point1Label;
          const p2 = a.point2Label;

          return (
            <Text key={i} ta="center">
              {planetIcons[p1]} {p1} {aspectIcons[a.type]} {planetIcons[p2]} {p2}{" "}
              ({a.type}, orb {orb}°)
            </Text>
          );
        })}
      </Stack>
    </Paper>
  );
}

export default MostImportantAspects
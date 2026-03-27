import type { MoonPhaseType } from "../types/types";
import { Paper, Text } from "@mantine/core";
import type { ChartSummary } from "../types/types";

const getMoonPhase = (sunLon: number, moonLon: number): MoonPhaseType => {
  const diff = (moonLon - sunLon + 360) % 360;

  if (diff === 0) return "New Moon";
  if (diff > 0 && diff < 90) return "Waxing Crescent";
  if (diff === 90) return "First Quarter";
  if (diff > 90 && diff < 180) return "Waxing Gibbous";
  if (diff === 180) return "Full Moon";
  if (diff > 180 && diff < 270) return "Waning Gibbous";
  if (diff === 270) return "Last Quarter";
  return "Waning Crescent";
}

type Props = {
  data: ChartSummary;
};

const MoonPhase = ({ data }: Props) => {
  const sunLon = data.sun?.longitude;
  const moonLon = data.moon?.longitude;

  if (!sunLon || !moonLon) return null;

  const phase = getMoonPhase(sunLon, moonLon);

  return (
    <Paper
      withBorder
      p="md"
      radius="md"
      style={{ width: "20vw", margin: "20px auto", textAlign: "center" }}
    >
      <Text fw={600}>🌙 Moon Phase</Text>
      <Text mt="sm">{phase}</Text>
    </Paper>
  );
};

export default MoonPhase;
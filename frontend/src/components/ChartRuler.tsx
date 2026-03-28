import { Text, Paper } from "@mantine/core";
import type { ChartSummary } from "../types/types";
import { computeChartRuler } from "../utils/computeChartRuler";
import { colors, planetIcons, signIcons } from "../constants/constants";
import AstroDetailsModal from "./AstroDetailsModal";
import { useState } from "react";

type Props = {
  data: ChartSummary;
};

export default function ChartRuler({ data }: Props) {
  const [opened, setOpened] = useState(false);

  const handleClick = () => {
    setOpened(true);
  };

  const ruler = computeChartRuler(data);

  if (!ruler) return null;

  return (
    <>
      <Paper
        p="md"
        radius="md"
        style={{
          width: "100%",
          maxWidth: "300px",
          margin: "10px auto",
          background: colors.panel,
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: colors.text,
          cursor: "pointer",
        }}
        onClick={handleClick}
      >
        <Text fw={600} size="sm" ta="center" c={colors.dim}>
          🧭 Chart Ruler
        </Text>

        <Text mt="sm">
          {planetIcons[ruler.planet]} {ruler.planet} in{" "}
          {signIcons[ruler.sign]} {ruler.sign} — House {ruler.house}
        </Text>
      </Paper>

      <AstroDetailsModal
        opened={opened}
        onClose={() => setOpened(false)}
        data={ruler}
      />
    </>

  );
}
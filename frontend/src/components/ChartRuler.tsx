import { Text, Paper } from "@mantine/core";
import type { ChartSummary } from "../types/types";
import { computeChartRuler } from "../utils/computeChartRuler";
import { planetIcons, signIcons } from "../constants/constants";
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
        withBorder
        p="md"
        radius="md"
        style={{ width: "50vw", margin: "20px auto", textAlign: "center", cursor: "pointer" }}
        onClick={handleClick}
      >
        <Text fw={600}>
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
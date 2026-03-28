// components/BasicChartInfo.tsx

import type { ChartSummary } from "../types/types";
import { Paper } from "@mantine/core";
import { colors } from "../constants/constants";
import PlanetTable from "./PlanetTable";
import ChartRuler from "./ChartRuler";
import BalanceSummary from "./BalanceSummary";

type Props = {
  data: ChartSummary;
};

const BasicChartInfo = ({ data }: Props) => {
  return (
    <Paper
      p="md"
      radius="md"
      style={{
        width: "100%",
        maxWidth: "500px",
        margin: "20px auto",
        background: colors.panel,
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: colors.text,
      }}
    >
      <PlanetTable data={data} />
      <ChartRuler data={data} />
      <BalanceSummary data={data} />
    </Paper>
  );
};

export default BasicChartInfo;
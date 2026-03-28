// components/EagleGrid.tsx

import { Table, Paper, Text } from "@mantine/core";
import type { ChartSummary } from "../types/types";
import { aspectIcons, colors } from "../constants/constants";
import { findTwoChartAspects } from "../utils/TwoChartsAspectFinder";
import { buildTransitAspectsGrid } from "../utils/buildTransitAspectsGrid";

type Props = {
  radix: ChartSummary;
  transit: ChartSummary;
};

const TransitAspectsGrid = ({ radix, transit }: Props) => {
  const aspects = findTwoChartAspects(radix, transit)
    .filter(a => (a.orb ?? 999) <= 3)
    .sort((a, b) => (a.orb ?? 999) - (b.orb ?? 999));

  const { rows, cols, grid } = buildTransitAspectsGrid(aspects);

  return (
    <Paper
      p="md"
      mt="md"
      style={{
        background: colors.panel,
        border: "1px solid rgba(255,255,255,0.1)",
        color: colors.text,
      }}
    >
      <Text ta="center" size="sm" c={colors.dim} mb="sm">
        Transit Aspects Grid
      </Text>

      <Table
        withTableBorder
        withColumnBorders
        striped
        highlightOnHover
        style={{
          fontSize: "12px",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th></th>
            {cols.map(c => (
              <th
                key={c}
                style={{
                  textAlign: "center",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                N-{c}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((r, i) => (
            <tr key={r}>
              <td style={{ fontWeight: 600 }}>T-{r}</td>

              {grid[i].map((cell, j) => (
                <td
                  key={j}
                  style={{
                    textAlign: "center",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {cell ? aspectIcons[cell.type] : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Paper>
  );
};

export default TransitAspectsGrid;
import { Paper, Text, Stack, Box } from "@mantine/core";
import { useState } from "react";
import type { ChartSummary } from "../../types/types";
import { findTwoChartAspects } from "../../utils/TwoChartsAspectFinder";
import { buildEagleLarkGrids } from "../../utils/buildEagleLarkGrids";
import {
  aspectIcons,
  planetIcons,
  colors,
  houseKeywords,
  planetKeywords,
} from "../../constants/constants";

type Props = {
  radix: ChartSummary;
  transit: ChartSummary;
};

const EagleLarkGridList = ({ radix, transit }: Props) => {
  const [selected, setSelected] = useState<string | null>(null);

  const EXCLUDED_POINTS = ['Ascendant', 'Midheaven', 'IC', 'DC'];

const aspects = findTwoChartAspects(radix, transit)
  .filter((a) => (a.orb ?? 999) <= 3)
  .filter((a) => {
    const tName = a.point1Label.replace('T-', '');
    const nName = a.point2Label.replace('N-', '');

    return (
      !EXCLUDED_POINTS.includes(tName) &&
      !EXCLUDED_POINTS.includes(nName)
    );
  });

  const grids = buildEagleLarkGrids(radix, transit, aspects);
  

  const handleClick = (value: string) => {
    setSelected(value);
  };

  const renderKeywords = () => {
    if (!selected) return null;

    const num = Number(selected);

    if (!isNaN(num)) {
      return houseKeywords[num as keyof typeof houseKeywords]?.join(", ");
    }

    return planetKeywords[selected as keyof typeof planetKeywords]?.join(", ");
  };

  const cellStyle: React.CSSProperties = {
    border: "1px solid rgba(255,255,255,0.2)",
    padding: "6px",
    cursor: "pointer",
  };

  const labelStyle: React.CSSProperties = {
    border: "1px solid rgba(255,255,255,0.2)",
    padding: "6px",
    fontWeight: 600,
    textAlign: "left",
    background: "rgba(255,255,255,0.05)",
  };

  return (
    <Stack mt="md">
      {grids.map((g, i) => (
        <Paper
          key={i}
          p="md"
          style={{
            background: colors.panel,
            border: "1px solid rgba(255,255,255,0.1)",
            fontSize: "12px",
          }}
        >
          {/* 🔹 HEADER */}
          <Text ta="center" c={colors.dim} mb="sm">
            Transit: {planetIcons[g.transitPlanet]} {g.transitPlanet}{" "}
            {aspectIcons[g.aspect]} Natal:{" "}
            {planetIcons[g.natalPlanet]} {g.natalPlanet} (
            {g.orb?.toFixed(2)}°)
          </Text>

          {/* 🔹 GRID CENTERED */}
          <Box style={{ display: "flex", justifyContent: "center" }}>
            <table
              style={{
                width: "260px",
                borderCollapse: "collapse",
                textAlign: "center",
                color: colors.text,
              }}
            >
              <tbody>
                {/* HEADER */}
                <tr>
                  <td style={labelStyle}></td>
                  <td style={cellStyle}>Transit</td>
                  <td style={cellStyle}>Natal</td>
                </tr>

                {/* PLANETS */}
                <tr>
                  <td style={labelStyle}>Planet</td>
                  <td style={cellStyle}>
                    {planetIcons[g.transitPlanet]} {g.transitPlanet}
                  </td>
                  <td style={cellStyle}>
                    {planetIcons[g.natalPlanet]} {g.natalPlanet}
                  </td>
                </tr>

                {/* CAUSE */}
                <tr>
                  <td style={labelStyle}>Natal House</td>
                  <td
                    style={cellStyle}
                    onClick={() =>
                      handleClick(String(g.cause.transitNatalHouse))
                    }
                  >
                    {g.cause.transitNatalHouse ?? "-"}
                  </td>
                  <td
                    style={cellStyle}
                    onClick={() =>
                      handleClick(String(g.cause.natalHouse))
                    }
                  >
                    {g.cause.natalHouse ?? "-"}
                  </td>
                </tr>

                {/* ACTION */}
                <tr>
                  <td style={labelStyle}>Transit House</td>
                  <td
                    style={cellStyle}
                    onClick={() =>
                      handleClick(String(g.action.transitHouse))
                    }
                  >
                    {g.action.transitHouse ?? "-"}
                  </td>
                  <td style={cellStyle}></td>
                </tr>

                {/* EFFECT */}
                <tr>
                  <td style={labelStyle}>Ruled Houses</td>
                  <td
                    style={cellStyle}
                    onClick={() =>
                      handleClick(g.effect.transitRules[0]?.toString())
                    }
                  >
                    {g.effect.transitRules.join(", ") || "-"}
                  </td>
                  <td
                    style={cellStyle}
                    onClick={() =>
                      handleClick(g.effect.natalRules[0]?.toString())
                    }
                  >
                    {g.effect.natalRules.join(", ") || "-"}
                  </td>
                </tr>
              </tbody>
            </table>
          </Box>

          {/* 🔹 KEYWORDS PANEL */}
          {selected && (
            <Box
              mt="sm"
              p="xs"
              style={{
                background: "rgba(255,255,255,0.05)",
                borderRadius: "6px",
              }}
            >
              <Text size="xs" c={colors.dim}>
                🔍 {selected} → {renderKeywords()}
              </Text>
            </Box>
          )}
        </Paper>
      ))}
    </Stack>
  );
};

export default EagleLarkGridList;
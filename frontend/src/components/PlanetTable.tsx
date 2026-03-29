import { Table, Paper } from "@mantine/core";
import type { ChartSummary, CustomPlanetInfo } from "../types/types";
import { colors, planetIcons, signIcons } from "../constants/constants";
import { getZodiacSign, getHouse } from "../utils/astroHelpers";
import { Modal, Text, Stack } from "@mantine/core";
import { useEffect, useState, useMemo } from "react";
import { planetKeywords, signKeywords, houseKeywords } from "../constants/constants";

type Props = {
  data: ChartSummary;
  setCustomPlanetInfo: (info: CustomPlanetInfo[]) => void
};

const PlanetTable = ({ data, setCustomPlanetInfo }: Props) => {
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState<{
    planet: string;
    sign: string;
    house: number | null;
  } | null>(null);

  const cusps = data.houses.map((h) => h.longitude ?? 0);

  const planets = useMemo(() => [
    { name: "Sun", value: data.sun?.longitude },
    { name: "ASC", value: data.ascendant?.longitude },
    { name: "Moon", value: data.moon?.longitude },
    { name: "Mercury", value: data.mercury?.longitude },
    { name: "Venus", value: data.venus?.longitude },
    { name: "Mars", value: data.mars?.longitude },
    { name: "Jupiter", value: data.jupiter?.longitude },
    { name: "Saturn", value: data.saturn?.longitude },
    { name: "Uranus", value: data.uranus?.longitude },
    { name: "Neptune", value: data.neptune?.longitude },
    { name: "Pluto", value: data.pluto?.longitude },
  ], [data]);

  useEffect(() => {
    const info: CustomPlanetInfo[] = planets
      .filter(p => p.value != null)
      .map(p => ({
        planet: p.name,
        sign: getZodiacSign(p.value as number),
        house: getHouse(p.value as number, cusps),
      }));

    setCustomPlanetInfo(info);
  }, [cusps, data, planets, setCustomPlanetInfo]);

  const handleClick = (planet: string, sign: string, house: number | null) => {
    setSelected({ planet, sign, house });
    setOpened(true);
  };

  const rows = planets.map((p) => {
    if (p.value == null) return null;

    const sign = getZodiacSign(p.value);

    return (
      <tr
        key={p.name}
        onClick={() =>
          handleClick(p.name, sign, getHouse(p.value as number, cusps))
        }
        style={{
          cursor: "pointer",
          transition: "background 0.2s",
          backgroundColor: "rgba(255,255,255,0.02)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)";
        }}
      >
        <td style={{ textAlign: "left", padding: "4px 12px" }}>
          {planetIcons[p.name]} {p.name}
        </td>

        <td style={{ textAlign: "left", padding: "4px 12px" }}>
          {signIcons[sign]} {sign}
        </td>

        <td style={{ textAlign: "left", padding: "4px 12px" }}>
          {getHouse(p.value, cusps)}
        </td>
      </tr>
    );
  });

  return (
    <>
      <Paper
        p="md"
        radius="md"
        style={{
          width: "100%",
          maxWidth: "300px",
          margin: "20px auto",
          background: colors.panel,
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: colors.text,
        }}
      >
        <Table
          striped
          highlightOnHover
          mt="sm"
          styles={{
            table: {
              color: colors.text,
            },
            th: {
              color: colors.dim,
              borderColor: "rgba(255,255,255,0.1)",
            },
            td: {
              borderColor: "rgba(255,255,255,0.05)",
            },
          }}
        >
          <thead>
            <tr>
              <th style={{
                textAlign: "left"
              }}>Planet</th>
              <th style={{
                textAlign: "left"
              }}>Sign</th>
              <th style={{
                textAlign: "left"
              }}>House</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Paper>


      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Details"
        centered
        styles={{
          content: {
            background: colors.panel,
            color: colors.text,
            backdropFilter: "blur(10px)",
          },
          header: {
            background: "transparent",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      >
        {selected && (
          <Stack gap="xs">
            <div
              style={{
                width: "220px",
                margin: "0 auto", // 🔥 αυτό κάνει το centering
                textAlign: "left",
              }}
            >
              <Text fw={600}>🪐 {selected.planet}</Text>
              <Text size="sm">
                {planetKeywords[selected.planet as keyof typeof planetKeywords]?.join(", ")}
              </Text>

              <Text fw={600} mt="xs">♈ {selected.sign}</Text>
              <Text size="sm">
                {signKeywords[selected.sign as keyof typeof signKeywords]?.join(", ")}
              </Text>

              <Text fw={600} mt="xs">🏠 House {selected.house}</Text>
              <Text size="sm">
                {houseKeywords[selected.house as keyof typeof houseKeywords]?.join(", ")}
              </Text>
            </div>
          </Stack>
        )}
      </Modal>
    </>
  );
}

export default PlanetTable
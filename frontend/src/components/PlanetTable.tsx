import { Table } from "@mantine/core";
import type { ChartSummary } from "../types/types";
import { planetIcons, signIcons } from "../constants/constants";
import { getZodiacSign, getHouse } from "../utils/astroHelpers";
import { Modal, Text, Stack } from "@mantine/core";
import { useState } from "react";
import { planetKeywords, signKeywords, houseKeywords } from "../constants/constants";

type Props = {
  data: ChartSummary;
};

export default function PlanetTable({ data }: Props) {
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState<{
    planet: string;
    sign: string;
    house: number | null;
  } | null>(null);

  const cusps = data.houses.map((h) => h.longitude ?? 0);

  const planets: { name: string; value: number | null | undefined }[] = [
    { name: "Sun", value: data.sun?.longitude },
    { name: "Moon", value: data.moon?.longitude },
    { name: "Mercury", value: data.mercury?.longitude },
    { name: "Venus", value: data.venus?.longitude },
    { name: "Mars", value: data.mars?.longitude },
    { name: "Jupiter", value: data.jupiter?.longitude },
    { name: "Saturn", value: data.saturn?.longitude },
    { name: "Uranus", value: data.uranus?.longitude },
    { name: "Neptune", value: data.neptune?.longitude },
    { name: "Pluto", value: data.pluto?.longitude },
  ];

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
        onClick={() => handleClick(p.name, sign, getHouse(p.value as number, cusps))}
        style={{ cursor: "pointer" }}
      >
        <td style={{ textAlign: "center" }}>
          {planetIcons[p.name]} {p.name}
        </td>

        <td style={{ textAlign: "center" }}>
          {signIcons[sign]} {sign}
        </td>

        <td style={{ textAlign: "center" }}>
          {getHouse(p.value, cusps)}
        </td>
      </tr>
    );
  });

  return (
    <>
      <Table striped highlightOnHover withTableBorder mt="lg">
        <thead>
          <tr>
            <th>Planet</th>
            <th>Sign</th>
            <th>House</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>

      <Modal opened={opened} onClose={() => setOpened(false)} title="Details" centered>
        {selected && (
          <Stack gap="xs">
            <Text fw={600}>🪐 {selected.planet}</Text>
            <Text size="sm">
  {planetKeywords[selected.planet as keyof typeof planetKeywords]?.join(", ")}
            </Text>

            <Text fw={600}>♈ {selected.sign}</Text>
            <Text size="sm">
  {signKeywords[selected.sign as keyof typeof signKeywords]?.join(", ")}
            </Text>

            <Text fw={600}>🏠 House {selected.house}</Text>
            <Text size="sm">
  {houseKeywords[selected.house as keyof typeof houseKeywords]?.join(", ")}
            </Text>
          </Stack>
        )}
      </Modal>
    </>

  );
}
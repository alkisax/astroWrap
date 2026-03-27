import { Checkbox, Group, Paper, Text } from "@mantine/core";
import { planets, colors } from "../constants/constants";
import type { Dispatch, SetStateAction } from "react";

type Props = {
  selected: string[];
  setSelected: Dispatch<SetStateAction<string[]>>;
};

export default function PlanetSelector({ selected, setSelected }: Props) {
  const togglePlanet = (planet: string) => {
    setSelected((prev) =>
      prev.includes(planet)
        ? prev.filter((p) => p !== planet)
        : [...prev, planet]
    );
  };

  return (
    <Paper
      p="sm"
      radius="md"
      style={{
        width: 235,
        margin: "5px auto",
        background: colors.panel,
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: colors.text,
      }}
    >
      <Text fw={600} ta="center" mb="xs">
        🪐 Visible Planets
      </Text>

      <Group
        mt="sm"
        justify="center"
        gap="xs"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        {planets.map((p) => (
          <Checkbox
            key={p}
            label={p}
            color={colors.primary}
            checked={selected.includes(p)}
            onChange={() => togglePlanet(p)}
            styles={{
              label: { color: colors.text, fontSize: "12px" },
            }}
          />
        ))}
      </Group>
    </Paper>
  );
}
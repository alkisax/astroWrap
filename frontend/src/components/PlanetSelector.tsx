// components/PlanetSelector.tsx

import { Checkbox, Group, Paper, Text } from "@mantine/core";

const ALL_PLANETS = [
  "Sun",
  "Moon",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Uranus",
  "Neptune",
  "Pluto",
];

type Props = {
  selected: string[];
  setSelected: (p: string[]) => void;
};

export default function PlanetSelector({ selected, setSelected }: Props) {
  const togglePlanet = (planet: string) => {
    if (selected.includes(planet)) {
      setSelected(selected.filter((p) => p !== planet));
    } else {
      setSelected([...selected, planet]);
    }
  };

  return (
    <Paper withBorder p="sm" radius="md" style={{ maxWidth: 500, margin: "20px auto" }}>
      <Text fw={600} ta="center">🪐 Visible Planets</Text>

      <Group mt="sm" justify="center">
        {ALL_PLANETS.map((p) => (
          <Checkbox
            key={p}
            label={p}
            checked={selected.includes(p)}
            onChange={() => togglePlanet(p)}
          />
        ))}
      </Group>
    </Paper>
  );
}
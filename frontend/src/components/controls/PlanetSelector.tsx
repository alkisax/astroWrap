// frontend\src\components\PlanetSelector.tsx

// in: λίστα διαλεγμένων πλανητών (στην αρχή όλοι) και setter
// κάνει toggle τους διαλεγμένους πλανήτες και render το ui 

import { Checkbox, Group, Paper, Text } from "@mantine/core";
import type { Dispatch, SetStateAction } from "react";
import { planets, colors } from "../../constants/constants";

type Props = {
  selected: string[];
  setSelected: Dispatch<SetStateAction<string[]>>;
};

export default function PlanetSelector({ selected, setSelected }: Props) {
  // toggle planet στο selected array. Aν υπάρχει → αφαιρείται. Aν δεν υπάρχει → προστίθεται
  // βασικο toggle - immutable update (React state)
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
        color: colors.text, // χρησιμοποιούμε custom χρώματα απο constants
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
        {/* δείχνει όλους τους πλανήτες με Map και τους έχει checkbox που τους κάνει toggle απο το arr των selected(ερχεται ως Input. Στην αρχή όλοι) */}
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
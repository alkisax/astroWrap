import { Paper, Text, Group, Stack } from "@mantine/core";
import type { ChartSummary } from "../types/types";
import {
  calculateElementBalance,
  calculateModalityBalance,
} from "../utils/balanceCalculator";

type Props = {
  data: ChartSummary;
};

const BalanceSummary = ({ data }: Props) => {
  const elements = calculateElementBalance(data);
  const modalities = calculateModalityBalance(data);

  return (
    <Paper
      withBorder
      p="md"
      radius="md"
      style={{ width: "30vw", margin: "20px auto" }}
    >
      <Text fw={600} ta="center">⚖️ Chart Balance</Text>

      <Stack mt="sm">
        {/* ELEMENTS */}
        <div>
          <Text fw={500}>🔥 Elements</Text>
          <Group gap="sm">
            <Text>🔥 Fire: {elements.Fire}</Text>
            <Text>🌱 Earth: {elements.Earth}</Text>
            <Text>💨 Air: {elements.Air}</Text>
            <Text>💧 Water: {elements.Water}</Text>
          </Group>
        </div>

        {/* MODALITIES */}
        <div>
          <Text fw={500}>⚙️ Modalities</Text>
          <Group gap="sm">
            <Text>🚀 Cardinal: {modalities.Cardinal}</Text>
            <Text>🧱 Fixed: {modalities.Fixed}</Text>
            <Text>🔄 Mutable: {modalities.Mutable}</Text>
          </Group>
        </div>
      </Stack>
    </Paper>
  );
};

export default BalanceSummary;
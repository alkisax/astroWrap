import { Paper, Text, Group, Stack } from "@mantine/core";
import type { ChartSummary } from "../types/types";
import {
  calculateElementBalance,
  calculateModalityBalance,
} from "../utils/balanceCalculator";
import { colors } from "../constants/constants";

type Props = {
  data: ChartSummary;
};

const BalanceSummary = ({ data }: Props) => {
  const elements = calculateElementBalance(data);
  const modalities = calculateModalityBalance(data);

  return (
    <Paper
      p="md"
      radius="md"
      style={{
        width: "100%",
        maxWidth: "300px",
        margin: "10px auto",
        background: colors.panel,
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: colors.text,
      }}
    >
      <Text fw={600} size="sm" ta="center" c={colors.dim}>
        ⚖️ Chart Balance
      </Text>

      <Stack mt="xs" gap="xs">
        {/* 🔥 ELEMENTS */}
        <div>
          <Text fw={500} size="sm">
            🔥 Elements
          </Text>

          <Group gap="xs" mt={4}>
            <Text size="xs">🔥 {elements.Fire}</Text>
            <Text size="xs">🌱 {elements.Earth}</Text>
            <Text size="xs">💨 {elements.Air}</Text>
            <Text size="xs">💧 {elements.Water}</Text>
          </Group>
        </div>

        {/* ⚙️ MODALITIES */}
        <div>
          <Text fw={500} size="sm">
            ⚙️ Modalities
          </Text>

          <Group gap="xs" mt={4}>
            <Text size="xs">🚀 {modalities.Cardinal}</Text>
            <Text size="xs">🧱 {modalities.Fixed}</Text>
            <Text size="xs">🔄 {modalities.Mutable}</Text>
          </Group>
        </div>
      </Stack>
    </Paper>
  );
};

export default BalanceSummary;
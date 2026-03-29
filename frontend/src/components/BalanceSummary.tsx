import { Paper, Text, Group, Stack } from "@mantine/core";
import type { ChartSummary, CustomBalance } from "../types/types";
import {
  calculateElementBalance,
  calculateModalityBalance,
} from "../utils/balanceCalculator";
import { colors } from "../constants/constants";
import { useEffect, useMemo } from "react";

type Props = {
  data: ChartSummary;
  setCustomBalance: (balance: CustomBalance) => void;
};

const BalanceSummary = ({ data, setCustomBalance }: Props) => {
  const elements = useMemo(
    () => calculateElementBalance(data),
    [data]
  )

  const modalities = useMemo(
    () => calculateModalityBalance(data),
    [data]
  )

  useEffect(() => {
    setCustomBalance({
      elements,
      modalities,
    });
  }, [elements, modalities, setCustomBalance]);

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
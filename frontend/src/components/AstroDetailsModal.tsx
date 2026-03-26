import { Modal, Text, Stack } from "@mantine/core";
import { planetKeywords, signKeywords, houseKeywords } from "../constants/constants";

type Props = {
  opened: boolean;
  onClose: () => void;
  data: {
    planet: string;
    sign: string;
    house: number | null;
  } | null;
};

export default function AstroDetailsModal({ opened, onClose, data }: Props) {
  if (!data) return null;

  return (
    <Modal opened={opened} onClose={onClose} title="Details" centered>
      <Stack gap="xs">
        <Text fw={600}>🪐 {data.planet}</Text>
        <Text size="sm">
          {planetKeywords[data.planet as keyof typeof planetKeywords]?.join(", ")}
        </Text>

        <Text fw={600}>♈ {data.sign}</Text>
        <Text size="sm">
          {signKeywords[data.sign as keyof typeof signKeywords]?.join(", ")}
        </Text>

        <Text fw={600}>🏠 House {data.house}</Text>
        <Text size="sm">
          {houseKeywords[data.house as keyof typeof houseKeywords]?.join(", ")}
        </Text>
      </Stack>
    </Modal>
  );
}
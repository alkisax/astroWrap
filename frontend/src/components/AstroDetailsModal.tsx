import { Modal, Text, Stack } from "@mantine/core";
import { colors, planetKeywords, signKeywords, houseKeywords } from "../constants/constants";

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
    <Modal
      opened={opened}
      onClose={onClose}
      title="Details"
      centered
      styles={{
        content: {
          background: colors.panel,
          color: colors.text,
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)",
        },
        header: {
          background: "transparent",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        },
        title: {
          color: colors.dim,
        },
      }}
    >
      <Stack gap="xs">
        <div
          style={{
            width: "220px",
            margin: "0 auto",
            textAlign: "left",
          }}
        >
          {/* 🪐 Planet */}
          <Text fw={600} c={colors.text}>
            🪐 {data.planet}
          </Text>
          <Text size="sm" c={colors.dim}>
            {planetKeywords[data.planet as keyof typeof planetKeywords]?.join(", ")}
          </Text>

          {/* ♈ Sign */}
          <Text fw={600} mt="xs" c={colors.text}>
            ♈ {data.sign}
          </Text>
          <Text size="sm" c={colors.dim}>
            {signKeywords[data.sign as keyof typeof signKeywords]?.join(", ")}
          </Text>

          {/* 🏠 House */}
          <Text fw={600} mt="xs" c={colors.text}>
            🏠 House {data.house}
          </Text>
          <Text size="sm" c={colors.dim}>
            {houseKeywords[data.house as keyof typeof houseKeywords]?.join(", ")}
          </Text>
        </div>
      </Stack>
    </Modal>
  );
}
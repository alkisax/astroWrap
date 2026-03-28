import { useState } from "react";
import {
  Button,
  NumberInput,
  Text,
  Paper,
  Stack,
  Title,
  Group,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { colors } from "../../constants/constants";

type Props = {
  onSubmit: (data: {
    radix: {
      date: Date;
      lat: number;
      lng: number;
    };
    transit: {
      date: Date;
      lat: number;
      lng: number;
    };
  }) => void;
};

export default function ChartFormBiwheel({ onSubmit }: Props) {
  const [radixDate, setRadixDate] = useState<Date | null>(new Date());
  const [transitDate, setTransitDate] = useState<Date | null>(new Date());

  const [lat, setLat] = useState<number>(37.9838);
  const [lng, setLng] = useState<number>(23.7275);

  function toDate(value: unknown): Date | null {
    if (!value) return null;
    if (value instanceof Date) return value;

    const d = new Date(value as string);
    return isNaN(d.getTime()) ? null : d;
  }

  const handleSubmit = () => {
    if (!radixDate || !transitDate || lat == null || lng == null) return;

    onSubmit({
      radix: {
        date: radixDate,
        lat: Number(lat),
        lng: Number(lng),
      },
      transit: {
        date: transitDate,
        lat: Number(lat),
        lng: Number(lng),
      },
    });
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", paddingTop: 5 }}>
      <Paper
        shadow="md"
        p="lg"
        radius="md"
        withBorder
        style={{
          width: 260,
          background: colors.panel,
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: colors.text,
        }}
      >
        <Stack gap="sm">
          <Title order={4} ta="center">
            Biwheel Chart
          </Title>

          {/* 🔹 RADIX */}
          <DateTimePicker
            label="Radix Date"
            value={radixDate}
            onChange={(value) => {
              const d = toDate(value);
              if (d) setRadixDate(d);
            }}
          />

          {/* 🔹 TRANSITS */}
          <DateTimePicker
            label="Transit Date"
            value={transitDate}
            onChange={(value) => {
              const d = toDate(value);
              if (d) setTransitDate(d);
            }}
          />

          {/* 🔹 LOCATION */}
          <Group grow>
            <NumberInput
              label="Lat"
              value={lat}
              decimalScale={4}
              onChange={(val) => setLat(Number(val))}
            />

            <NumberInput
              label="Lng"
              value={lng}
              decimalScale={4}
              onChange={(val) => setLng(Number(val))}
            />
          </Group>

          <Text size="xs" c={colors.dim} ta="center">
            Coordinates: latlong.net
          </Text>

          <Button
            fullWidth
            mt="sm"
            onClick={handleSubmit}
            style={{
              backgroundColor: colors.primary,
              color: "#000",
            }}
          >
            Calculate Biwheel
          </Button>
        </Stack>
      </Paper>
    </div>
  );
}
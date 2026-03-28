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
import { colors } from "../constants/constants";
import { DateTimePicker } from "@mantine/dates";

type Props = {
  onSubmit: (data: {
    date: Date;
    lat: number;
    lng: number;
  }) => void;
};

export default function ChartForm({ onSubmit }: Props) {
  const [date, setDate] = useState<Date | null>(new Date());
  const [lat, setLat] = useState<number>(37.9838);
  const [lng, setLng] = useState<number>(23.7275);

  const handleSubmit = () => {
    if (!date || lat == null || lng == null) return;

    onSubmit({
      date, // ήδη Date
      lat: Number(lat),
      lng: Number(lng),
    });
  };

  function toDate(value: unknown): Date | null {
    if (!value) return null;
    if (value instanceof Date) return value;

    // fallback αν είναι string
    const d = new Date(value as string);
    return isNaN(d.getTime()) ? null : d;
  }

  console.log("chatform", date, lat, lng);

  return (
    <div style={{ display: "flex", justifyContent: "center", paddingTop: 5 }}>
      <Paper
        shadow="md"
        p="lg"
        radius="md"
        withBorder
        style={{
          width: 235,
          background: colors.panel,
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: colors.text,
        }}
      >
        <Stack gap="sm">
          <Title order={4} ta="center">
            Generate Chart
          </Title>

          <DateTimePicker
            label="Date & Time"
            value={date}
            onChange={(value) => {
              const d = toDate(value);
              if (d) setDate(d);
            }}
          />

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
            Calculate
          </Button>
        </Stack>
      </Paper>
    </div>
  );
}
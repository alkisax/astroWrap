import { useState } from "react";
import {
  Button,
  NumberInput,
  Text,
  Paper,
  Stack,
  Title,
} from "@mantine/core";
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

  console.log("chatform", date, lat, lng);

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
      <Paper
        shadow="md"
        p="lg"
        radius="md"
        withBorder
        style={{ width: 320 }}
      >
        <Stack gap="sm">
          <Title order={4} ta="center">
            Generate Chart
          </Title>

          <DateTimePicker
            label="Date & Time"
            value={date}
            onChange={(value) => setDate(value as Date | null)}
          />

          <NumberInput
            label="Latitude"
            value={lat}
            onChange={(val) => setLat(Number(val))}
          />

          <NumberInput
            label="Longitude"
            value={lng}
            onChange={(val) => setLng(Number(val))}
          />

          <Text size="xs" c="dimmed" ta="center">
            Coordinates: latlong.net
          </Text>

          <Button fullWidth mt="sm" onClick={handleSubmit}>
            Calculate
          </Button>
        </Stack>
      </Paper>
    </div>
  );
}
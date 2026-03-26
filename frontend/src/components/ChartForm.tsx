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
  const [date, setDate] = useState<string | null>(new Date().toISOString());
  const [lat, setLat] = useState<number | string>("");
  const [lng, setLng] = useState<number | string>("");

  const handleSubmit = () => {
    if (!date || lat === "" || lng === "") return;

    const d = new Date(date);

    onSubmit({
      date: d,
      lat: Number(lat),
      lng: Number(lng),
    });
  };

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
            onChange={setDate}
          />

          <NumberInput
            label="Latitude"
            placeholder="37.9838"
            value={lat}
            onChange={setLat}
          />

          <NumberInput
            label="Longitude"
            placeholder="23.7275"
            value={lng}
            onChange={setLng}
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
import { Paper, Text, Group, Button } from "@mantine/core";
import type { DateType } from "../types/types";

type Props = {
  date: DateType;
  setDate: React.Dispatch<React.SetStateAction<DateType>>;
  coords: { lat: number; lng: number };
};

function addDays(dateObj: DateType, days: number): DateType {
  const d = new Date(
    dateObj.year,
    dateObj.month - 1,
    dateObj.day,
    dateObj.hour,
    dateObj.minute
  );

  d.setDate(d.getDate() + days);

  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
    hour: d.getHours(),
    minute: d.getMinutes(),
  };
}

function addHours(dateObj: DateType, hours: number): DateType {
  const d = new Date(
    dateObj.year,
    dateObj.month - 1,
    dateObj.day,
    dateObj.hour,
    dateObj.minute
  );

  d.setHours(d.getHours() + hours);

  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
    hour: d.getHours(),
    minute: d.getMinutes(),
  };
}

export default function TimeControls({ date, setDate, coords }: Props) {
  return (
    <Paper
      withBorder
      p="sm"
      radius="md"
      style={{ maxWidth: 400, margin: "20px auto" }}
    >
      <Text ta="center" size="sm" mb="xs">
        {`${date.day}/${date.month}/${date.year} ${date.hour}:${String(date.minute).padStart(2, "0")} — (${coords.lat.toFixed(2)}, ${coords.lng.toFixed(2)})`}
      </Text>

      <Group justify="center" gap="xs">
        <Button size="xs" variant="light" onClick={() => setDate((d) => addDays(d, -1))}>
          -1d
        </Button>

        <Button size="xs" variant="light" onClick={() => setDate((d) => addDays(d, 1))}>
          +1d
        </Button>

        <Button size="xs" variant="outline" onClick={() => setDate((d) => addHours(d, -1))}>
          -1h
        </Button>

        <Button size="xs" variant="outline" onClick={() => setDate((d) => addHours(d, 1))}>
          +1h
        </Button>
      </Group>
    </Paper>
  );
}
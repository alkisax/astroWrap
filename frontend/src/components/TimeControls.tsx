import { Paper, Text, Group, Button } from "@mantine/core";

type Props = {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  coords: { lat: number; lng: number };
};

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function addHours(date: Date, hours: number): Date {
  const d = new Date(date);
  d.setHours(d.getHours() + hours);
  return d;
}

const TimeControls = ({ date, setDate, coords }: Props) => {
  return (
    <Paper
      withBorder
      p="sm"
      radius="md"
      style={{ maxWidth: 400, margin: "20px auto" }}
    >
      <Text ta="center" size="sm" mb="xs">
        {`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} 
        ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")} 
        — (${coords.lat.toFixed(2)}, ${coords.lng.toFixed(2)})`}
      </Text>

      <Group justify="center" gap="xs">
        <Button onClick={() => setDate(d => addDays(d, -1))}>-1d</Button>
        <Button onClick={() => setDate(d => addDays(d, 1))}>+1d</Button>
        <Button onClick={() => setDate(d => addHours(d, -1))}>-1h</Button>
        <Button onClick={() => setDate(d => addHours(d, 1))}>+1h</Button>
      </Group>
    </Paper>
  );
}

export default TimeControls
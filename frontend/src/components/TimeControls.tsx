import { Paper, Text, Group, Button } from "@mantine/core";
import { colors } from "../constants/constants";

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

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function addYears(date: Date, years: number): Date {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

const TimeControls = ({ date, setDate, coords }: Props) => {

  const formattedDate = date.toLocaleString("el-GR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("el-GR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const btnStyle = {
    backgroundColor: colors.primary,
    color: "#000",
    width: 70,
    padding: "6px 0",
  };

  return (
    <Paper
      p="sm"
      radius="md"
      style={{
        width: 235,
        margin: "5px auto",
        background: colors.panel,
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: colors.text,
      }}
    >
      <Text ta="center" size="xs" c={colors.text}>
        {formattedDate} {formattedTime}
      </Text>

      <Text ta="center" size="xs" c={colors.dim}>
        ({coords.lat.toFixed(2)}, {coords.lng.toFixed(2)})
      </Text>

      <Group justify="center" gap="xs" grow mt="xs">
        <Group justify="center" gap="xs">
          <Button size="xs" style={btnStyle} onClick={() => setDate(d => addHours(d, -1))}>
            -1h
          </Button>
          <Button size="xs" style={btnStyle} onClick={() => setDate(d => addHours(d, 1))}>
            +1h
          </Button>
        </Group>

        <Group justify="center" gap="xs">
          <Button size="xs" style={btnStyle} onClick={() => setDate(d => addDays(d, -1))}>
            -1d
          </Button>
          <Button size="xs" style={btnStyle} onClick={() => setDate(d => addDays(d, 1))}>
            +1d
          </Button>
        </Group>

        <Group justify="center" gap="xs">
          <Button size="xs" style={btnStyle} onClick={() => setDate(d => addDays(d, -7))}>
            -1w
          </Button>
          <Button size="xs" style={btnStyle} onClick={() => setDate(d => addDays(d, 7))}>
            +1w
          </Button>
        </Group>

        <Group justify="center" gap="xs">
          <Button size="xs" style={btnStyle} onClick={() => setDate(d => addMonths(d, -1))}>
            -1m
          </Button>
          <Button size="xs" style={btnStyle} onClick={() => setDate(d => addMonths(d, 1))}>
            +1m
          </Button>
        </Group>

        <Group justify="center" gap="xs">
          <Button size="xs" style={btnStyle} onClick={() => setDate(d => addYears(d, -1))}>
            -1y
          </Button>
          <Button size="xs" style={btnStyle} onClick={() => setDate(d => addYears(d, 1))}>
            +1y
          </Button>
        </Group>
      </Group>
    </Paper>
  );
}

export default TimeControls
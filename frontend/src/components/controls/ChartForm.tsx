// frontend\src\components\controls\ChartForm.tsx

// in: παίρνει μια onSubmit με date/lat/lang τα οποία οταν αλλαχθούν εδώ προκαλούν trigger να δείξει το chart

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
import { colors } from "../../constants/constants"; // custom χρώμα

type Props = {
  onSubmit: (data: {
    date: Date;
    lat: number;
    lng: number;
  }) => void;
};

export default function ChartForm({ onSubmit }: Props) {
  // το form κρατάει δικό του local state (date/lat/lng) σκόπιμα
  // ΔΕΝ είναι λάθος → αποφεύγουμε recalculation του chart σε κάθε input change. Sync με parent γίνεται μόνο στο submit (controlled flow)
  const [date, setDate] = useState<Date | null>(new Date());
  const [lat, setLat] = useState<number>(37.9838);
  const [lng, setLng] = useState<number>(23.7275);

  const handleSubmit = () => {
    if (!date || lat == null || lng == null) return;

    // εδω γίνετε και ο τελικός υπολογισμός του chart
    onSubmit({
      date, // ήδη Date
      lat: Number(lat),
      lng: Number(lng),
    });
  };

  // έχουμε Mantine DateTimePicker το οποιο δεν εγγυάται type. Μπορεί να δώσει date/string/null εδώ έχουμε ένα type guard που επιστρέφει στο σωστό format (date/null)
  // το unknown σε αναγκάζει στα type checks
  function toDate(value: unknown): Date | null {
    if (!value) return null;
    if (value instanceof Date) return value;

    // fallback αν είναι string
    const d = new Date(value as string);
    return isNaN(d.getTime()) ? null : d;
  }

  // handler του dateTimePicker
  const handleDateChange = (value: unknown) => {
    // κάνει το input απο το mantine σε σωστό type και set state
    const date = toDate(value)
    if (date) setDate(date)
  }

  // console.log("chatform", date, lat, lng);

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
            onChange={handleDateChange}
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
            Coordinates:{' '} 
            <a
              href="https://www.latlong.net"
              style={{ color: '#fff', textDecoration: 'none' }}
            >
              latlong.net
            </a>
          </Text>

          {/* εδω γίνετε και ο τελικός υπολογισμός του chart. Αυτό το κάνει απλώς κάνοντας set το lan, long, date state και το πιάνει το "[]" */}
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
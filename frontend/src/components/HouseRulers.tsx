import { Paper, Text, Stack } from "@mantine/core";
import type { ChartSummary } from "../types/types";
import { computeHouseRulers } from "../utils/houseRulers";
import { planetIcons, signIcons } from "../constants/constants";

type Props = {
  data: ChartSummary;
};

const HouseRulers = ({ data }: Props) => {
  const results = computeHouseRulers(data);

  return (
    <Paper
      withBorder
      p="md"
      radius="md"
      style={{ maxWidth: 700, margin: "20px auto" }}
    >
      <Text fw={600} ta="center">
        🏠 House Rulers
      </Text>

      <Stack mt="sm">
        {results.map((r) => (
          <Text key={r.house} ta="center">
            House {r.house} ({signIcons[r.sign]} {r.sign}) →{" "}
            {planetIcons[r.ruler]} {r.ruler} →{" "}
            {r.inSign ? (
              <>
                {signIcons[r.inSign]} {r.inSign} (House {r.inHouse})
              </>
            ) : (
              "unknown"
            )}
          </Text>
        ))}
      </Stack>
    </Paper>
  );
};

export default HouseRulers;

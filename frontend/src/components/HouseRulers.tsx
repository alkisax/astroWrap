// frontend\src\components\HouseRulers.tsx
/*
Οι κυβερνήτες οίκων (house rulers) δείχνουν ΠΟΥ εκφράζεται το περιεχόμενο ενός οίκου.

Βήματα:

Κάθε οίκος έχει ένα ζώδιο στην ακμή του.
Το ζώδιο έχει κυβερνήτη πλανήτη (π.χ. Κριός → Άρης).
Βρίσκουμε που βρίσκεται αυτός ο πλανήτης στο χάρτη (σε ποιο ζώδιο και οίκο).

Ερμηνεία:

Ο οίκος δείχνει το "θέμα"
Ο κυβερνήτης δείχνει "ποιος το διαχειρίζεται"
Η θέση του κυβερνήτη δείχνει "που εκδηλώνεται"

Παράδειγμα:
7ος οίκος (σχέσεις) στον Αιγόκερω → κυβερνήτης Κρόνος
Αν ο Κρόνος είναι στον 10ο:
→ οι σχέσεις συνδέονται με καριέρα, ευθύνη, δημόσια εικόνα

Άρα:
House → θέμα
Ruler → μηχανισμός
Ruler position → πεδίο εκδήλωσης
*/
import { Paper, Text, Stack } from "@mantine/core";
import type { ChartSummary, CustomHouseRuler } from "../types/types";
import { computeHouseRulers } from "../utils/houseRulers";
import { planetIcons, signIcons, colors } from "../constants/constants";
import { useEffect, useMemo } from "react";

type Props = {
  data: ChartSummary;
  setCustomHouseRulers: (rulers: CustomHouseRuler[]) => void;
};

const HouseRulers = ({ data, setCustomHouseRulers }: Props) => {
  const results = useMemo(() => computeHouseRulers(data), [data])

  useEffect(() => {
    setCustomHouseRulers(results);
  }, [results, setCustomHouseRulers]);

  return (
    <Paper
      p="md"
      radius="md"
      style={{
        width: "100%",
        maxWidth: "700px",
        margin: "10px auto",
        background: colors.panel,
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: colors.text,
      }}
    >
      <Text fw={600} size="sm" ta="center" c={colors.dim}>
        🏠 House Rulers
      </Text>

      <Stack mt="sm" gap="xs">
        {results.map((r) => (
          <div
            key={r.house}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "12px",
              padding: "4px 6px",
              borderRadius: "4px",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            {/* LEFT: House */}
            <span>
              🏠 {r.house} ({signIcons[r.sign]} {r.sign})
            </span>

            {/* MIDDLE: ruler */}
            <span>
              → {planetIcons[r.ruler]} {r.ruler}
            </span>

            {/* RIGHT: placement */}
            <span style={{ color: colors.dim }}>
              {r.inSign ? (
                <>
                  {signIcons[r.inSign]} {r.inSign} (H{r.inHouse})
                </>
              ) : (
                "unknown"
              )}
            </span>
          </div>
        ))}
      </Stack>
    </Paper>
  );
};

export default HouseRulers;
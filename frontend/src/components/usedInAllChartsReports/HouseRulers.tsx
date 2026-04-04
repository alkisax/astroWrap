// frontend\src\components\usedInAllChartsReports\HouseRulers.tsx
// in: data και setter για custom json creator (στο useHome)

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
import { useEffect, useMemo, useState } from "react";
import { Paper, Text, Stack, Modal } from "@mantine/core";
import type { ChartSummary, CustomHouseRuler } from "../../types/types";
import { planetIcons, signIcons, colors, signKeywords, houseKeywords, planetKeywords } from "../../constants/constants";
import { computeHouseRulers } from "../../utils/houseRulers";

type Props = {
  data: ChartSummary;
  setCustomHouseRulers: (rulers: CustomHouseRuler[]) => void;
};

// όλη η λογική του component στο computeHouseRulers util
const HouseRulers = ({ data, setCustomHouseRulers }: Props) => {
  // info modal state
  const [selected, setSelected] = useState<CustomHouseRuler | null>(null)

  const results = useMemo(() => computeHouseRulers(data), [data])

  useEffect(() => {
    setCustomHouseRulers(results);
  }, [results, setCustomHouseRulers]);

  return (
    <>
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
              onClick={() => setSelected(r)}
              style={{
                cursor: 'pointer',
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

      <Modal
        opened={!!selected}
        onClose={() => setSelected(null)}
        title='House Ruler Details'
        centered
        styles={{
          content: {
            background: colors.panel,
            color: colors.text,
            backdropFilter: 'blur(10px)',
          },
          header: {
            background: 'transparent',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      >
        <Text size='sm' c='dimmed' mb={10}>
          Each house starts at a zodiac sign (cusp). Every sign has a ruling planet (e.g. Aries → Mars). We find where that ruler is placed in the chart (its sign and house). Interpretation: the house shows the life topic, the ruler shows how this theme operates, and the ruler’s position shows where it manifests.<br /> In short: House = what, Ruler = how, Position = where.
        </Text>
        {selected && (
          <Stack gap='xs'>
            <Text fw={600}>
              🏠 House {selected.house} ({selected.sign})
            </Text>

            <Text size='sm'>
              {houseKeywords[selected.house as keyof typeof houseKeywords]?.join(', ')}
            </Text>

            <Text fw={600} mt='xs'>
              → {selected.ruler}
            </Text>

            <Text size='sm'>
              {planetKeywords[selected.ruler as keyof typeof planetKeywords]?.join(', ')}
            </Text>

            <Text fw={600} mt='xs'>
              {selected.inSign
                ? `${selected.inSign} (H${selected.inHouse})`
                : 'unknown'}
            </Text>

            {selected.inSign && (
              <Text size='sm'>
                {signKeywords[selected.inSign as keyof typeof signKeywords]?.join(', ')}
              </Text>
            )}
          </Stack>
        )}
      </Modal>
    </>

  );
};

export default HouseRulers;
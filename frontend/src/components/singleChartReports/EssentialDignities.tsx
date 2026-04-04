// frontend\src\components\singleChartReports\EssentialDignities.tsx
// εδω δεν έχει δικό του Util και είναι όλα εδώ 
// in: data απο circular-natal-horoscope-js → Home

// Essential dignities describe how strong or comfortable a planet is in a sign. Each planet has signs where it works best (domicile, exaltation) and signs where it struggles (detriment, fall). We calculate dignity by checking the planet’s zodiac sign and comparing it to predefined rulership tables. Interpretation: strong dignity (domicile/exaltation) means the planet expresses itself naturally and effectively, while weak dignity (detriment/fall) shows tension, difficulty, or indirect expression. Example: Mars in Aries (domicile) acts directly and confidently, while Mars in Libra (detriment) may struggle with assertiveness and act more indirectly.

import { useMemo, useState } from 'react'
import { Modal, Paper, Text, Stack } from "@mantine/core";
import type { ChartSummary } from "../../types/types";
import { planetIcons, signIcons, colors } from "../../constants/constants";
import { getZodiacSign } from "../../utils/angleToAstro";

import { domicile, exaltation, detriment, fall } from "../../constants/dignities";

// helper που βρίσκει το dignity ενός πλανήτη με βάση το ζώδιο
// συγκρίνει με πίνακες rulership (domicile, exaltation κλπ)
const getDignity = (planet: string, sign: string) => {
  if (domicile[planet]?.includes(sign)) return "domicile";
  if (exaltation[planet] === sign) return "exaltation";
  if (detriment[planet]?.includes(sign)) return "detriment";
  if (fall[planet] === sign) return "fall";

  return "neutral";
}

const dignityMeta = {
  domicile: { emoji: "⭐", color: "#ffd43b" },
  exaltation: { emoji: "🔥", color: "#ff922b" },
  detriment: { emoji: "⚠️", color: "#ff6b6b" },
  fall: { emoji: "❌", color: "#fa5252" },
  neutral: { emoji: "➖", color: "#868e96" },
};

type Props = {
  data: ChartSummary;
};

// θα μπορούσα να το πάρω απο constants αλλα επειδή εκεί μεγαλύτερο καλυτερα να το φτιάξω απο την αρχη
// περιορίζουμε σε 7 κλασικούς πλανήτες (παραδοσιακή αστρολογία)
const planetsList = [
  "Sun",
  "Moon",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
];

const EssentialDignities = ({ data }: Props) => {
  // Modal info ui
  const [opened, setOpened] = useState(false)

  const planetMap = useMemo(() => ({
    Sun: data.sun,
    Moon: data.moon,
    Mercury: data.mercury,
    Venus: data.venus,
    Mars: data.mars,
    Jupiter: data.jupiter,
    Saturn: data.saturn,
  }), [data]);

  //    για κάθε πλανήτη:
  //  1. βρίσκουμε μοίρες
  //  2. βρίσκουμε ζώδιο
  //  3. υπολογίζουμε dignity
  //  4. εμφανίζουμε UI
  const dignityRows = useMemo(() => {
    return planetsList
      .map((p) => {
        const val = planetMap[p as keyof typeof planetMap]?.longitude;
        if (val == null) return null;

        const sign = getZodiacSign(val);
        const dignity = getDignity(p, sign);
        const meta = dignityMeta[dignity];

        return {
          planet: p,
          sign,
          dignity,
          meta,
        };
      })
      .filter(Boolean);
  }, [planetMap]);

  // info text για modal
  const dignityInfo =
    'Essential dignities describe how strong or comfortable a planet is in a sign. Each planet has signs where it works best (domicile, exaltation) and signs where it struggles (detriment, fall). We calculate dignity by checking the planet’s zodiac sign and comparing it to predefined rulership tables. Interpretation: strong dignity (domicile/exaltation) means the planet expresses itself naturally and effectively, while weak dignity (detriment/fall) shows tension, difficulty, or indirect expression. Example: Mars in Aries (domicile) acts directly and confidently, while Mars in Libra (detriment) may struggle with assertiveness and act more indirectly.';

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
        <Text
          fw={600}
          size='sm'
          ta='center'
          c={colors.dim}
          style={{ cursor: 'pointer' }}
          onClick={() => setOpened(true)}
        >
          ⚖️ Essential Dignities
        </Text>

        <Stack mt="sm" gap="xs">
          {dignityRows.map((row, i) => {
            if (!row) return null;

            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '12px',
                  padding: '4px 6px',
                  borderRadius: '4px',
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                <span>
                  {planetIcons[row.planet]} {row.planet}
                </span>

                <span>
                  {signIcons[row.sign]} {row.sign}
                </span>

                <span style={{ color: row.meta.color }}>
                  {row.meta.emoji} {row.dignity}
                </span>
              </div>
            );
          })}
        </Stack>
      </Paper>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title='Essential Dignities'
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
        <Text size='sm' c='dimmed' style={{ lineHeight: 1.4 }}>
          {dignityInfo}
        </Text>
      </Modal>
    </>

  );
};

export default EssentialDignities;
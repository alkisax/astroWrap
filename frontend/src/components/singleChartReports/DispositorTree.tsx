// frontend\src\components\singleChartReports\DispositorTree.tsx
// in: data και setter για custom json creator (στο useHome)

/*
Dispositor Tree δείχνει τη "ροή ελέγχου" μεταξύ πλανητών με βάση τα rulerships.

Πώς υπολογίζεται:
Κάθε πλανήτης βρίσκεται σε ένα ζώδιο → κάθε ζώδιο έχει κυβερνήτη.
Παίρνουμε έναν πλανήτη και βρίσκουμε τον κυβερνήτη του ζωδίου του.
Μετά κοιτάμε σε ποιο ζώδιο βρίσκεται αυτός ο κυβερνήτης και συνεχίζουμε τη διαδικασία.
Έτσι δημιουργείται μια αλυσίδα (chain) πλανητών.

Σταματάμε όταν:
1. Ένας πλανήτης κυβερνά τον εαυτό του → final dispositor (τελικό σημείο ελέγχου)
2. Δημιουργηθεί κύκλος → loop (αμοιβαία εξάρτηση πλανητών)

Ερμηνεία:
- Final dispositor → συγκεντρώνει ενέργεια, λειτουργεί σαν "κέντρο ελέγχου" του χάρτη
- Loop → δείχνει κλειστό σύστημα ενέργειας, αλληλεξάρτηση (πχ Venus ↔ Mars)
- Μακριές αλυσίδες → δείχνουν έμμεση έκφραση (η ενέργεια περνά από πολλά στάδια)
- Πλανήτες που εμφανίζονται συχνά στο τέλος → πιο ισχυροί θεματικά

Παράδειγμα:
Mercury in Aries → ruler Mars → Mars in Capricorn → ruler Saturn → Saturn in Capricorn
→ τελικό αποτέλεσμα: Saturn είναι final dispositor
→ άρα η σκέψη (Mercury) τελικά εκφράζεται μέσα από Saturn themes (structure, discipline)
*/

import { useState } from 'react'
import { Modal, Paper, Text, Stack } from "@mantine/core";
import type { ChartSummary } from "../../types/types";
import { planetIcons, colors } from "../../constants/constants";
import { getAllDispositors } from "../../utils/dispositorCalculator";
import DispositorSummary from "./DispositorSummary";

type Props = {
  data: ChartSummary;
};

const DispositorTree = ({ data }: Props) => {
  // modal info ui
  const [selected, setSelected] = useState<typeof results[number] | null>(null)

  // όλη η λογική στο util getAllDispositors
  const results = getAllDispositors(data);

  const finalPlanet =
    selected?.result.type === 'final'
      ? selected.result.chain[selected.result.chain.length - 1]
      : null

  const loopStart = selected?.result.loopStart

  const dispositorInfo =
    'A dispositor tree shows how planetary energy flows through rulerships. Each planet is in a sign, and each sign has a ruler. We follow this chain until it ends in a final dispositor or forms a loop. Interpretation: final dispositors act as control centers, loops show closed systems, and long chains show indirect expression of energy.';

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
        <DispositorSummary data={data} />

        <Text fw={600} size="sm" ta="center" c={colors.dim}>
          🌳 Dispositor Tree
        </Text>

        <Stack mt="sm" gap="xs">
          {results.map((r, i) => {

            // 👉 fix: αν είναι loop κόβουμε το τελευταίο (duplicate)
            const displayChain =
              r.result.type === 'loop'
                ? r.result.chain.slice(0, -1)
                : r.result.chain

            return (
              <div
                key={i}
                onClick={() => setSelected(r)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '6px',
                  padding: '4px 6px',
                  borderRadius: '4px',
                  background: 'rgba(255,255,255,0.02)',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                {/* START */}
                <span>
                  {planetIcons[r.planet]} {r.planet}
                </span>

                <span style={{ color: colors.dim }}>→</span>

                {/* CHAIN */}
                {displayChain.map((p, idx) => {
                  const isLast = idx === displayChain.length - 1;

                  return (
                    <span key={idx} style={{ display: 'flex', gap: 4 }}>
                      {planetIcons[p]} {p}
                      {!isLast && <span style={{ color: colors.dim }}>→</span>}
                    </span>
                  );
                })}

                {/* LOOP */}
                {r.result.type === 'loop' && r.result.loopStart && (
                  <span style={{ color: '#ff922b' }}>
                    ⇄ {planetIcons[r.result.loopStart]} {r.result.loopStart}
                  </span>
                )}

                {/* FINAL */}
                {r.result.type === 'final' && (
                  <span style={{ color: '#ffd43b' }}>⭐ final</span>
                )}
              </div>
            )
          })}
        </Stack>
      </Paper>

      <Modal
        opened={!!selected}
        onClose={() => setSelected(null)}
        title='Dispositor Chain'
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
          {dispositorInfo}
        </Text>

        {selected && (
          <Stack gap='xs'>
            <Text fw={600}>
              {planetIcons[selected.planet]} {selected.planet}
            </Text>

            <Text size='sm' c='dimmed'>
              {selected.result.chain.join(' → ')}
            </Text>

            {selected.result.type === 'final' && finalPlanet && (
              <Text size='sm' style={{ color: '#ffd43b' }}>
                ⭐ Final dispositor: {planetIcons[finalPlanet]} {finalPlanet}
              </Text>
            )}

            {selected.result.type === 'loop' && loopStart && (
              <Text size='sm' style={{ color: '#ff922b' }}>
                🔁 Loop at: {planetIcons[loopStart]} {loopStart}
              </Text>
            )}
          </Stack>
        )}
      </Modal>
    </>

  );
};

export default DispositorTree;
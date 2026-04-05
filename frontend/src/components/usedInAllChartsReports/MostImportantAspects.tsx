// frontend\src\components\usedInAllChartsReports\MostImportantAspects.tsx
// in: data απο home (δεν φτιαχνει συγκεντρωτικό json)
// συνεργάζεται με το getAngleAspects

import { useState } from "react";
import { Paper, Text, Stack, Modal } from "@mantine/core";
import type { ChartSummary, CustomAspect } from "../../types/types";
import { aspectIcons, planetIcons, colors, aspectKeywords, planetKeywords } from "../../constants/constants";

type Props = {
  data: ChartSummary;
  // userOrb: number;
  aspects: CustomAspect[]
};

const MostImportantAspects = ({ aspects }: Props) => {
  // state για info modal
  const [selected, setSelected] = useState<{
    p1: string
    p2: string
    type: string
  } | null>(null)

  if (!aspects.length) return null


  // // έρχεται απο constants. κάναμε as string γιατί εκεί είναι type planets
  // const allowedPoints = planets as string[]

  // // το circular-natal-horoscope-js μου τα επιστρέφει
  // const aspects = data.aspects ?? [];
  // if (!aspects.length) return null;

  // const allAspects = [
  //   // ...aspects,
  //   ...getAngleAspects(data, userOrb),
  // ].filter(a =>
  //   allowedPoints.includes(a.point1Label) &&
  //   allowedPoints.includes(a.point2Label)
  // );

  // console.log('LIB', data.aspects)
  // console.log("getangleaspects", getAngleAspects(data))

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
          🔗 Aspects
        </Text>

        <Stack mt="sm" gap="xs">
          {aspects.map((a, i) => {
            const orb = a.orb != null ? a.orb.toFixed(2) : "?";

            const p1 = a.point1;
            const p2 = a.point2;

            return (
              <div
                key={i}
                // onclick για info modal
                onClick={() => setSelected({
                  p1,
                  p2,
                  type: a.type
                })}
                style={{
                  cursor: 'pointer',
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  padding: "4px 6px",
                  borderRadius: "4px",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <span>
                  {planetIcons[p1]} {p1}
                </span>

                <span>
                  {aspectIcons[a.type]}
                </span>

                <span>
                  {planetIcons[p2]} {p2}
                </span>

                <span style={{ color: colors.dim }}>
                  {a.type} ({orb}°)
                </span>
              </div>
            );
          })}
        </Stack>
      </Paper>

      <Modal
        opened={!!selected}
        onClose={() => setSelected(null)}
        title="Aspect Details"
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
        {selected && (
          <Stack gap="xs">
            <Text size="sm" c="dimmed">
              Aspects show how planets interact — harmony, tension, or flow.
            </Text>

            <div style={{ width: 220, margin: '0 auto' }}>
              <Text fw={600}>🪐 {selected.p1}</Text>
              <Text size="sm">
                {planetKeywords[selected.p1 as keyof typeof planetKeywords]?.join(', ')}
              </Text>

              <Text fw={600} mt="xs">
                {aspectIcons[selected.type]} {selected.type}
              </Text>
              <Text size="sm">
                {aspectKeywords[selected.type as keyof typeof aspectKeywords]?.join(', ')}
              </Text>

              <Text fw={600} mt="xs">🪐 {selected.p2}</Text>
              <Text size="sm">
                {planetKeywords[selected.p2 as keyof typeof planetKeywords]?.join(', ')}
              </Text>
            </div>
          </Stack>
        )}
      </Modal>
    </>

  );
};

export default MostImportantAspects;
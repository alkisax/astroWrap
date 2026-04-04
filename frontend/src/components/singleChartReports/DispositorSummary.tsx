// frontend\src\components\singleChartReports\DispositorSummary.tsx

import { useState } from 'react'
import { Modal, Paper, Text, Stack } from "@mantine/core";
import type { ChartSummary } from "../../types/types";
import { planetIcons, colors } from "../../constants/constants";
import { getAllDispositors } from "../../utils/dispositorCalculator";
import { getMutualReceptions } from "../../utils/mutualReception";

type Props = {
  data: ChartSummary;
};

const DispositorSummary = ({ data }: Props) => {
  const [opened, setOpened] = useState(false)

  const results = getAllDispositors(data);

  const finals = Array.from(
    new Set(
      results
        .filter(r => r.result.type === 'final')
        .map(r => {
          const chain = r.result.chain
          return chain[chain.length - 1] // 🔥 τελευταίος πλανήτης
        })
    )
  )

  const loops = results
    .filter((r) => r.result.type === "loop" && r.result.loopStart)
    .map((r) => r.result.loopStart)
    .filter((p): p is string => p !== undefined);

  const uniqueLoop = Array.from(new Set(loops));
  const mutual = getMutualReceptions(data);

  const summaryInfo = 'Chart dynamics summarize how planetary control is structured. Final dispositors (Backbone) act as central points where energy accumulates. Loops show closed systems of mutual influence. Mutual receptions occur when two planets are in each other’s signs, creating a strong connection and cooperation between them.';

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
          size="sm"
          ta="center"
          c={colors.dim}
          style={{ cursor: 'pointer' }}
          onClick={() => setOpened(true)}
        >
          🧠 Chart Dynamics
        </Text>

        <Stack mt="sm" gap="xs">
          {/* 🔥 Backbone */}
          {finals.length > 0 && (
            <div style={{ fontSize: "12px" }}>
              <Text size="xs" c={colors.dim}>Backbone</Text>
              <div>
                {finals.map((p, i) => (
                  <span key={i}>
                    {planetIcons[p]} {p}
                    {i < finals.length - 1 && ", "}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 🔁 Loop */}
          {uniqueLoop.length >= 2 && (
            <div style={{ fontSize: "12px" }}>
              <Text size="xs" c={colors.dim}>Dominant Loop</Text>
              <div>
                {uniqueLoop.map((p, i) => (
                  <span key={i}>
                    {planetIcons[p]} {p}
                    {i < uniqueLoop.length - 1 && " ⇄ "}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 🔗 Mutual */}
          {mutual.length > 0 && (
            <div style={{ fontSize: "12px" }}>
              <Text size="xs" c={colors.dim}>Mutual Reception</Text>
              <div>
                {mutual.map((pair, i) => (
                  <span key={i}>
                    {planetIcons[pair[0]]} {pair[0]} ⇄ {planetIcons[pair[1]]} {pair[1]}
                    {i < mutual.length - 1 && ", "}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Stack>
      </Paper>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Chart Dynamics"
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
        <Text size="sm" c="dimmed" style={{ lineHeight: 1.4 }}>
          {summaryInfo}
        </Text>

        <Stack mt="sm" gap="xs">
          <Text size="sm">
            <b>Backbone:</b> final dispositors → central control points
          </Text>

          <Text size="sm">
            <b>Loop:</b> closed energy system (planets depend on each other)
          </Text>

          <Text size="sm">
            <b>Mutual Reception:</b> two planets in each other’s signs → strong cooperation
          </Text>
        </Stack>
      </Modal>
    </>

  );
};

export default DispositorSummary;
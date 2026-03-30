import { Paper, Text, Stack } from '@mantine/core';
import { colors } from '../../constants/constants';

type AspectItem = {
  type: string;
  text: string;
  score: number;
};

type Compatibility = {
  scores: Record<string, number>;
  explanations: Record<string, AspectItem[]>;
};

type Props = {
  compatibility: Compatibility;
};

const sectionTitles: Record<string, string> = {
  emotional: '💓 Emotional',
  attraction: '🔥 Attraction',
  communication: '🗣 Communication',
  stability: '🧱 Stability',
  overall: '🌍 Overall',
};

const CompatibilityViewer = ({ compatibility }: Props) => {
  if (!compatibility) return null;

  const { scores, explanations } = compatibility;

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
      <Stack gap="md">

        {/* 🔢 SCORES */}
        <div>
          <Text fw={600} mb={5}>📊 Scores</Text>
          {Object.entries(scores).map(([key, value]) => (
            <Text key={key} size="sm">
              {sectionTitles[key] || key}: {value.toFixed(2)}
            </Text>
          ))}
        </div>

        {/* 📖 EXPLANATIONS */}
        {Object.entries(explanations).map(([key, items]) => (
          <div key={key}>
            <Text fw={600} mb={5}>
              {sectionTitles[key] || key}
            </Text>

            {items.length === 0 ? (
              <Text size="sm" c="dimmed">
                No significant interactions
              </Text>
            ) : (
              items.map((item, i) => (
                <Text key={i} size="sm" style={{ marginBottom: '5px' }}>
                  • {item.text} ({item.score.toFixed(2)})
                </Text>
              ))
            )}
          </div>
        ))}

      </Stack>
    </Paper>
  );
};

export default CompatibilityViewer;
// frontend\src\components\biwheel\HouseOverlayBiwheel.tsx
import { Paper, Stack, Text } from '@mantine/core';
import { colors, planetIcons } from '../../constants/constants';

type Overlay = {
  planet: string;
  fromChart: 'A' | 'B';
  inHouseOf: 'A' | 'B';
  house: number | null;
};

type Props = {
  overlays: Overlay[];
};

const HouseOverlayBiwheel = ({ overlays }: Props) => {
  // 1️⃣ basic guard
  if (!overlays || overlays.length === 0) return null;

  // 2️⃣ optional sort (by chart + house)
  const sorted = [...overlays].sort((a, b) => {
    if (a.inHouseOf !== b.inHouseOf) {
      return a.inHouseOf.localeCompare(b.inHouseOf);
    }
    return (a.house ?? 99) - (b.house ?? 99);
  });

  return (
    <Paper
      p="md"
      radius="md"
      style={{
        width: '100%',
        maxWidth: '700px',
        margin: '20px auto',
        background: colors.panel,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: colors.text,
      }}
    >
      <Text fw={600} size="sm" ta="center" c={colors.dim}>
        🏠 House Overlay (A ↔ B)
      </Text>

      <Stack mt="sm" gap="xs">
        {sorted.map((o, i) => {
          const icon = planetIcons[o.planet] ?? '•';

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                padding: '4px 6px',
                borderRadius: '4px',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              {/* LEFT */}
              <span>
                {icon} {o.fromChart}-{o.planet}
              </span>

              {/* MIDDLE */}
              <span>
                → {o.inHouseOf} H{o.house ?? '?'}
              </span>

              {/* RIGHT */}
              <span style={{ color: colors.dim }}>
                overlay
              </span>
            </div>
          );
        })}
      </Stack>
    </Paper>
  );
};

export default HouseOverlayBiwheel;
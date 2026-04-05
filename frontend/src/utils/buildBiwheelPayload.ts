import type { ChartSummary } from '../types/types';
import { findTwoChartAspects } from './TwoChartsAspectFinder';
import { buildHouseOverlay } from './houseOverlayBiwheelHelper';
import { buildTransitAspectsGrid } from './buildTransitAspectsGrid';
import { buildEagleLarkGrids } from './buildEagleLarkGrids';

type BuildPayloadArgs = {
  radixData: ChartSummary | null;
  transitData: ChartSummary | null;
};

export const buildBiwheelPayload = ({
  radixData,
  transitData,
}: BuildPayloadArgs) => {
  if (!radixData || !transitData) return null;

  // 🔹 cross aspects (single source of truth)
  const aspects = findTwoChartAspects(radixData, transitData);

  // 🔹 overlay
  const overlay = buildHouseOverlay(radixData, transitData);

  // 🔹 grid
  const grid =
    typeof buildTransitAspectsGrid === 'function'
      ? buildTransitAspectsGrid(aspects)
      : [];

  // 🔹 eagle
  const eagle =
    typeof buildEagleLarkGrids === 'function'
      ? buildEagleLarkGrids(radixData, transitData, aspects)
      : [];

  return {
    radix: radixData,
    transit: transitData,

    cross: {
      aspects,
      grid,
      overlay,
      eagle,
    },
  };
};
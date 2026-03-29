// components/BasicChartInfo.tsx

import type { ChartSummary, CustomBalance, CustomChartRuler, CustomHouseRuler, CustomPlanetInfo } from "../types/types";
import { Paper } from "@mantine/core";
import { colors, planets } from "../constants/constants";
import PlanetTable from "./PlanetTable";
import ChartRuler from "./ChartRuler";
import BalanceSummary from "./BalanceSummary";

import { useEffect, useState } from "react";
import { Button, Group } from "@mantine/core";

import MostImportantAspects from "./MostImportantAspects";
import HouseRulers from "./HouseRulers";
import EssentialDignities from "./EssentialDignities";
import DispositorTree from "./DispositorTree";
import { useMediaQuery } from "@mantine/hooks";
import { computeHouseRulers } from "../utils/houseRulers";
import { getAngleAspects } from "../utils/getAngleAspects";
import { calculateElementBalance, calculateModalityBalance } from "../utils/balanceCalculator";
import { getZodiacSign } from "../utils/astroHelpers";
import { getAllDispositors } from "../utils/dispositorCalculator";

type Props = {
  data: ChartSummary;
  setCustomPlanetInfo: (info: CustomPlanetInfo[]) => void;
  setCustomChartRuler: (ruler: CustomChartRuler | null) => void;
  setCustomBalance: (balance: CustomBalance) => void;
  setCustomHouseRulers: (rulers: CustomHouseRuler[]) => void;
};

const BasicChartInfo = ({
  data,
  setCustomPlanetInfo,
  setCustomChartRuler,
  setCustomBalance,
  setCustomHouseRulers
}: Props) => {
  const [showAspects, setShowAspects] = useState(false);
  const [showHouses, setShowHouses] = useState(false);
  const [showDignities, setShowDignities] = useState(false);
  const [showTree, setShowTree] = useState(false);

  const isMobile = useMediaQuery("(max-width:768px)");

  // μεταφέραμε εδώ ολον τον υπολογισμό και τα components είναι πλέον μόνο UI για να έχουμε σε ένα σημείο όλα τα state για την δημιουργία του json
  // 🔥 1. HOUSE RULERS
  const houseRulers = computeHouseRulers(data);

  // 🔥 2. ASPECTS
  // const allowedPoints = [
  //   "Sun", "Moon", "Mercury", "Venus", "Mars",
  //   "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"
  // ];

  // const aspects = [
  //   ...(data.aspects ?? []),
  //   ...getAngleAspects(data)
  // ].filter(a =>
  //   allowedPoints.includes(a.point1Label) &&
  //   allowedPoints.includes(a.point2Label)
  // );

  // 🔥 3. BALANCE
  const elements = calculateElementBalance(data);
  const modalities = calculateModalityBalance(data);

  // 🔥 4. DIGNITIES
  const dignities = planets.map(p => {
    const val = data[p.toLowerCase() as keyof ChartSummary]?.longitude;
    if (val == null) return null;

    const sign = getZodiacSign(val);

    let dignity = "neutral";
    if (domicile[p]?.includes(sign)) dignity = "domicile";
    else if (exaltation[p] === sign) dignity = "exaltation";
    else if (detriment[p]?.includes(sign)) dignity = "detriment";
    else if (fall[p] === sign) dignity = "fall";

    return { planet: p, sign, dignity };
  }).filter(Boolean);

  // 🔥 5. DISPOSITOR TREE
  // const dispositors = getAllDispositors(data);

  useEffect(() => {
    setCustomHouseRulers(houseRulers);
    setCustomBalance({ elements, modalities });
    // setCustomAspects(aspects);
    // setCustomDignities(dignities);
    // setCustomDispositors(dispositors);
  }, [houseRulers, elements, modalities, setCustomHouseRulers, setCustomBalance]);

  return (
    <>
      <Paper
        p="md"
        radius="md"
        style={{
          width: "100%",
          maxWidth: "1700px",
          margin: "20px auto",
          background: colors.panel,
          backdropFilter: "blur(1px)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: colors.text,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "10px",
            alignItems: "stretch",
          }}
        >
          {/* LEFT */}
          <div>
            <PlanetTable
              data={data}
              setCustomPlanetInfo={setCustomPlanetInfo}
            />
          </div>

          {/* RIGHT */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              height: "100%",
            }}
          >
            {/* 🔝 ChartRuler */}
            <div style={{ flex: 1 }}>
              <ChartRuler
                data={data}
                setCustomChartRuler={setCustomChartRuler}
              />
            </div>

            {/* ⚖️ Balance */}
            <div style={{ flex: 1 }}>
              <BalanceSummary
                data={data}
                setCustomBalance={setCustomBalance}
              />
            </div>

            {/* 🔘 Buttons area */}
            <div style={{ flex: 1 }}>
              <Group grow>
                <Button
                  size="xs"
                  style={{
                    backgroundColor: showAspects ? colors.primary : "rgba(255,255,255,0.1)",
                    color: showAspects ? "#000" : colors.text,
                  }}
                  onClick={() => setShowAspects(v => !v)}
                >
                  ⭐
                </Button>

                <Button
                  size="xs"
                  style={{
                    backgroundColor: showHouses ? colors.primary : "rgba(255,255,255,0.1)",
                    color: showHouses ? "#000" : colors.text,
                  }}
                  onClick={() => setShowHouses(v => !v)}
                >
                  🏠
                </Button>

                <Button
                  size="xs"
                  style={{
                    backgroundColor: showDignities ? colors.primary : "rgba(255,255,255,0.1)",
                    color: showDignities ? "#000" : colors.text,
                  }}
                  onClick={() => setShowDignities(v => !v)}
                >
                  👑
                </Button>

                <Button
                  size="xs"
                  style={{
                    backgroundColor: showTree ? colors.primary : "rgba(255,255,255,0.1)",
                    color: showTree ? "#000" : colors.text,
                  }}
                  onClick={() => setShowTree(v => !v)}
                >
                  🌳
                </Button>
              </Group>
            </div>
          </div>
        </div>
      </Paper>

      <div style={{ width: "100%", maxWidth: "700px", margin: "10px auto" }}>
        {showAspects && <MostImportantAspects data={data} />}
        {showHouses && <HouseRulers data={data} setCustomHouseRulers={setCustomHouseRulers} />}
        {showDignities && <EssentialDignities data={data} />}
        {showTree && <DispositorTree data={data} />}
      </div>
    </>
  );
};

export default BasicChartInfo;
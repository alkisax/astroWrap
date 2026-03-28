// components/BasicChartInfo.tsx

import type { ChartSummary } from "../types/types";
import { Paper } from "@mantine/core";
import { colors } from "../constants/constants";
import PlanetTable from "./PlanetTable";
import ChartRuler from "./ChartRuler";
import BalanceSummary from "./BalanceSummary";

import { useState } from "react";
import { Button, Group } from "@mantine/core";

import MostImportantAspects from "./MostImportantAspects";
import HouseRulers from "./HouseRulers";
import EssentialDignities from "./EssentialDignities";
import DispositorTree from "./DispositorTree";

type Props = {
  data: ChartSummary;
};

const BasicChartInfo = ({ data }: Props) => {
  const [showAspects, setShowAspects] = useState(false);
  const [showHouses, setShowHouses] = useState(false);
  const [showDignities, setShowDignities] = useState(false);
  const [showTree, setShowTree] = useState(false);

  return (


<>
    <Paper
      p="md"
      radius="md"
      style={{
        width: "100%",
        maxWidth: "700px",
        margin: "20px auto",
        background: colors.panel,
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: colors.text,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          alignItems: "stretch",
        }}
      >
        {/* LEFT */}
        <div>
          <PlanetTable data={data} />
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
            <ChartRuler data={data} />
          </div>

          {/* ⚖️ Balance */}
          <div style={{ flex: 1 }}>
            <BalanceSummary data={data} />
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
  {showHouses && <HouseRulers data={data} />}
  {showDignities && <EssentialDignities data={data} />}
  {showTree && <DispositorTree data={data} />}
</div>
</>
  );
};

export default BasicChartInfo;
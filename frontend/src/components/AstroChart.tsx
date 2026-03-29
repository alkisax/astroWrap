// src/components/AstroChart.tsx
import { useAstroChart } from "../hooks/componentHooks/useAstroChart";

type Props = {
  planets: Record<string, number[]>;
  cusps: number[];
};

const AstroChart = ({ planets, cusps }: Props) => {

  useAstroChart({
    containerId: 'paper',
    planets,
    cusps
  })

  const size = 600
  const containerWidth =
    typeof window !== 'undefined'
      ? Math.min(window.innerWidth - 40, 600)
      : 600

  const scale = containerWidth / size
  return (
  <div
    style={{
      width: "100%",
      display: "flex",
      justifyContent: "center", // 🔥 center horizontally
    }}
  >
    <div
      style={{
        width: `${600 * scale}px`,   // 🔥 πραγματικό scaled width
        height: `${600 * scale}px`,  // 🔥 πραγματικό scaled height
        position: "relative",
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left", // 🔥 IMPORTANT CHANGE
          width: "600px",
          height: "600px",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <div
          id="paper"
          style={{
            width: "600px",
            height: "600px",
          }}
        />
      </div>
    </div>
  </div>
  );
};

export default AstroChart;




// src/components/AstroChart.tsx
// import { useEffect } from "react";
// import { Chart } from "@astrodraw/astrochart";

// type Props = {
//   planets: Record<string, number[]>;
//   cusps: number[];
// };

// const AstroChart = ({ planets, cusps }: Props) => {
//   useEffect(() => {
//     const chart = new Chart("paper", 600, 600);

//     chart.radix({
//       planets,
//       cusps,
//     });
//   }, [planets, cusps]);

//   return <div id="paper" />;
// };

// export default AstroChart;


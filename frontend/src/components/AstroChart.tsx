// src/components/AstroChart.tsx
import { useEffect, useRef, useState } from "react";
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

  const containerRef = useRef<HTMLDivElement | null>(null)
  const [containerWidth, setContainerWidth] = useState(600)

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }

    update()

    const observer = new ResizeObserver(update)
    if (containerRef.current) observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [])

  const size = 600
  const scale = containerWidth / size

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
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


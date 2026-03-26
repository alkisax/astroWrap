// src/components/AstroChart.tsx
import { useEffect } from "react";
import { Chart } from "@astrodraw/astrochart";

type Props = {
  planets: Record<string, number[]>;
  cusps: number[];
};

const AstroChart = ({ planets, cusps }: Props) => {
  useEffect(() => {
    const containerId = "paper";
    const el = document.getElementById(containerId);

    if (!el) return;

    // 🔥 IMPORTANT: καθαρίζουμε προηγούμενο render (React strict mode fix)
    el.innerHTML = "";

    // 🎨 optional settings (μπορείς να τα πειράξεις μετά)
    const chart = new Chart(containerId, 600, 600, {
      // COLORS_SIGNS: [
      //   "#FF5733", "#8B4513", "#87CEEB", "#27AE60",
      //   "#FF5733", "#8B4513", "#87CEEB", "#27AE60",
      //   "#FF5733", "#8B4513", "#87CEEB", "#27AE60",
      // ],
    });

    // 🪐 δημιουργία radix chart
    const radix = chart.radix({
      planets,
      cusps,
    });

    // σχεδιάζουμε aspects
    radix.aspects();

    // cleanup (σε περίπτωση re-render / unmount)
    return () => {
      el.innerHTML = "";
    };
  }, [planets, cusps]);

  return (
    <div
      id="paper"
      style={{
        width: "600px",
        height: "600px",
        margin: "0 auto",
      }}
    />
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


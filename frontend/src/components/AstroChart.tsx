// frontend\src\components\AstroChart.tsx

// αυτο είναι το component που σε συνεργασία με το useAstroChart (που είναι ένα hook που έχει όλη την λογική του αρχείου) μου κάνει render το chart με την βιβλιοθήκη @astrodraw/astrochart
// in: planets[], house cusps[]
import { useEffect, useRef, useState } from "react";
import { useAstroChart } from "../hooks/componentHooks/useAstroChart";

type Props = {
  planets: Record<string, number[]>;
  cusps: number[];
};

const AstroChart = ({ planets, cusps }: Props) => {

  // εδώ μεταφέρθηκε ολη η λογική του αρχείου 
  // ⚠️ Αυτό είναι το render trigger, κάθε φορά που αλλάζουν planets, cusps το hook: βρίσκει <div id="paper"> / καθαρίζει / ξαναζωγραφίζει SVG
  useAstroChart({
    containerId: 'paper', // η lib δεν δουλεύει με React → θέλει id string
    planets,
    cusps
  })

  // containerRef → δείχνει στο outer div
  // containerWidth → κρατάει πόσο πλάτος έχει αυτό το div σε px
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [containerWidth, setContainerWidth] = useState(600)

  // διαβάζει το μέγεθος του κουτιού που είμαστε και προσαρμόζει το chart σε mobile/desktop
  // TODO: εδώ πιθανή πηγή του bug mobile freeze
  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        // κάθε φορά που κάνει refresh η σελίδα διαβάζει το πραγματικό πλάτος του div του outer dιv και το αποθηκεύει
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }

    update()

    // είναι στανταρ js βιβλιοθήκη παρακολουθεί αλλαγές μεγέθους ενός element
    // "όταν αυτό το div αλλάξει μέγεθος → κάνε update()"
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
          width: `${600 * scale}px`,   // πραγματικό scaled width
          height: `${600 * scale}px`,  // πραγματικό scaled height
          position: "relative",
        }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left", // IMPORTANT CHANGE
            width: "600px",
            height: "600px",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          // αυτο είναι το div που αλλαζει και φιλοξενεί το svg. Το id="paper" είναι το σημαντικό
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


// ετσι ήταν πριν την προσθήκη του δικού μας bg κυκλου και τον χωρισμό της λογικής σε hook. κρατιέται ως syntax example
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


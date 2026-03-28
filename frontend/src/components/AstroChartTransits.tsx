// frontend\src\components\AstroChartTransits.tsx
import { useEffect } from "react";
import { Chart } from "@astrodraw/astrochart";
import { planetIcons } from "../constants/constants";

type Props = {
  radixPlanets: Record<string, number[]>;
  radixCusps: number[];
  transitPlanets: Record<string, number[]>;
  transitCusps: number[];
};

const AstroChartTransits = ({
  radixPlanets,
  radixCusps,
  transitPlanets,
  transitCusps,
}: Props) => {
  useEffect(() => {
    const containerId = "paper-transit";
    const el = document.getElementById(containerId);
    if (!el) return;

    // 🔥 clear previous render (important for React strict mode)
    el.innerHTML = "";

    const chart = new Chart(containerId, 600, 600);

    // 🪐 INNER (natal / radix)
    const radix = chart.radix({
      planets: radixPlanets,
      cusps: radixCusps,
    });

    // ❌ για τώρα ΔΕΝ θέλουμε aspects
    // radix.aspects();

    // 🌐 OUTER (transits)
    radix.transit({
      planets: transitPlanets,
      cusps: transitCusps,
    });

    const svg = el.querySelector("svg");

    if (svg) {
      const size = 600;
      const center = size / 2;
      const outerRadius = 265; // 🔥 outer ring

      Object.entries(transitPlanets).forEach(([planet, [deg]]) => {
        const angle = ((deg - 90) * Math.PI) / 180; // rotate to match chart

        const x = center + outerRadius * Math.cos(angle);
        const y = center + outerRadius * Math.sin(angle);

        const text = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );

        text.setAttribute("x", x.toString());
        text.setAttribute("y", y.toString());
        text.setAttribute("font-size", "20");
        text.setAttribute("fill", "#3c0288");
        text.setAttribute("font-weight", "900");
        text.setAttribute("stroke", "#3c0288");
        text.setAttribute("stroke-width", "0.3");
        text.setAttribute("font-family", "Arial, sans-serif");
        text.setAttribute("dominant-baseline", "middle");

        // προσωρινά γράφουμε όνομα
        text.textContent = planetIcons[planet] || planet;

        svg.appendChild(text);
      });
    }

    return () => {
      el.innerHTML = "";
    };
  }, [radixPlanets, radixCusps, transitPlanets, transitCusps]);

  // 📱 responsive scaling (ίδιο pattern με πριν)
  const size = 600;
  const containerWidth =
    typeof window !== "undefined"
      ? Math.min(window.innerWidth - 40, 600)
      : 600;

  const scale = containerWidth / size;

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: `${600 * scale}px`,
          height: `${600 * scale}px`,
          position: "relative",
        }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: "600px",
            height: "600px",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          <div
            id="paper-transit"
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

export default AstroChartTransits;
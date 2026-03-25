// src/components/AstroChart.tsx
import { useEffect } from "react";
import { Chart } from "@astrodraw/astrochart";

type Props = {
  planets: Record<string, number[]>;
  cusps: number[];
};

const AstroChart = ({ planets, cusps }: Props) => {
  useEffect(() => {
    const chart = new Chart("paper", 600, 600);

    chart.radix({
      planets,
      cusps,
    });
  }, [planets, cusps]);

  return <div id="paper" />;
};

export default AstroChart;


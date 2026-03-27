import type { Dispatch, SetStateAction } from "react";
import ChartForm from "./ChartForm";
import PlanetSelector from "./PlanetSelector";
import TimeControls from "./TimeControls";
import { useMediaQuery } from "@mui/material";

type Props = {
  onSubmit: (input: {
    date: Date;
    lat: number;
    lng: number;
  }) => void;

  visiblePlanets: string[];
  setVisiblePlanets: Dispatch<SetStateAction<string[]>>;

  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;

  coords: {
    lat: number;
    lng: number;
  };
};

const BasicControls = ({
  onSubmit,
  visiblePlanets,
  setVisiblePlanets,
  date,
  setDate,
  coords,
}: Props) => {

  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <div
      style={{
        width: isMobile ? "100%" : "280px",
        margin: "0px auto",
        padding: "5px",
        borderRadius: "12px",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(10px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "5px",
      }}
    >
      <PlanetSelector
        selected={visiblePlanets}
        setSelected={setVisiblePlanets}
      />

      <ChartForm onSubmit={onSubmit} />

      <TimeControls date={date} setDate={setDate} coords={coords} />
    </div>
  );
};

export default BasicControls;
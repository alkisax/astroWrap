import { useMediaQuery } from '@mui/material'

import ChartForm from './ChartForm'
import PlanetSelector from './PlanetSelector'
import TimeControls from './TimeControls'

import type { Dispatch, SetStateAction } from 'react'

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
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(10px)",
        display: "flex",
        flexDirection: "column",
        alignItems: isMobile ? "center" : "stretch",
        gap: "5px",
      }}
    >
      {/* 
      in: ημερομηνια/συντεταγμένες (default "τώρα"/αθήνα)
      out: ημερομηνία/συντεταγμένες με +- ωρες/μερες/μηνες/χρονια 
      και render των αντίστοιχων btns 
      */}
      <TimeControls date={date} setDate={setDate} coords={coords} />

      {/* 
      in: λίστα διαλεγμένων πλανητών (στην αρχή όλοι) και setter
      κάνει toggle τους διαλεγμένους πλανήτες και render το ui  
      */}
      <PlanetSelector
        selected={visiblePlanets}
        setSelected={setVisiblePlanets}
      />

      {/* 
      in: παίρνει μια onSubmit με date/lat/lang τα οποία οταν αλλαχθούν εδώ προκαλούν trigger να δείξει το chart
      */}
      <ChartForm onSubmit={onSubmit} />
    </div>
  );
};

export default BasicControls;
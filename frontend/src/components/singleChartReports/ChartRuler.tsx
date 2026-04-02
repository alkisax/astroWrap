// frontend\src\components\singleChartReports\ChartRuler.tsx

// μου υπολογίζει και render τον chartRuler σημαντικό κομματι της λογικής είναι στην helperFunction computeChartRuler
// in: data απο home και setter για συγκεντρωτικο json απο useHome

// Ο chart ruler είναι ο πλανήτης που κυβερνά το ζώδιο του Ascendant (ωροσκόπου), άρα θεωρείται ο βασικός “κυβερνήτης” όλου του χάρτη. Υπολογίζεται απλά: βρίσκεις το ζώδιο του ASC και μετά τον πλανήτη που το κυβερνά (π.χ. Aries → Mars, Libra → Venus). Η ερμηνεία του γίνεται από τη θέση του στον χάρτη: το ζώδιο δείχνει το στυλ έκφρασης, ο οίκος το πεδίο ζωής όπου διοχετεύεται η ενέργεια, και τα aspects πώς αλληλεπιδρά με τα υπόλοιπα στοιχεία. Είναι σαν “κεντρικός άξονας προσωπικότητας” που χρωματίζει όλη τη λειτουργία του χάρτη.

// The chart ruler is the planet that rules the Ascendant’s sign, representing the core driver of the chart, and is interpreted by its sign, house, and aspects to understand how a person expresses themselves and directs their life energy.

import { useEffect, useMemo, useState } from 'react'
import { Text, Paper } from '@mantine/core'
import AstroDetailsModal from './AstroDetailsModal'
import { computeChartRuler } from '../../utils/computeChartRuler'
import { colors, planetIcons, signIcons } from '../../constants/constants'
import type { ChartSummary, CustomChartRuler } from '../../types/types'

type Props = {
  data: ChartSummary;
  setCustomChartRuler: (ruler: CustomChartRuler | null) => void;
};

const ChartRuler = ({ data, setCustomChartRuler }: Props) => {
  // για ui modal με info
  const [opened, setOpened] = useState(false);

  const handleClick = () => {
    setOpened(true);
  };

  // ⚠️ σημαντικό util με την λογική μου επιστρέφει chart ruler planet/sign/house
  const ruler = useMemo(() => computeChartRuler(data), [data])

  useEffect(() => {
    if (!ruler) {
      setCustomChartRuler(null)
      return
    }

    setCustomChartRuler({
      planet: ruler.planet,
      sign: ruler.sign,
      house: ruler.house,
    })
  }, [ruler, setCustomChartRuler])

  if (!ruler) return null;

  return (
    <>
      <Paper
        p="md"
        radius="md"
        style={{
          width: "100%",
          maxWidth: "300px",
          margin: "10px auto",
          background: colors.panel,
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: colors.text,
          cursor: "pointer",
        }}
        onClick={handleClick}
      >
        <Text fw={600} size="sm" ta="center" c={colors.dim}>
          🧭 Chart Ruler
        </Text>

        <Text mt="sm">
          {planetIcons[ruler.planet]} {ruler.planet} in{" "}
          {signIcons[ruler.sign]} {ruler.sign} - House {ruler.house}
        </Text>
      </Paper>

      {/* modal με keywords για πλανήτη/ζωδιο/οικο το description το στέλνει ως string ο parent */}
      <AstroDetailsModal
        opened={opened}
        onClose={() => setOpened(false)}
        data={ruler}
        description="The chart ruler is the planet that rules the Ascendant’s sign, representing the core driver of the chart, interpreted through its sign, house, and aspects."
      />
    </>
  );
}

export default ChartRuler
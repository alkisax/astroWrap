// frontend\src\components\singleChartReports\PlanetTable.tsx

// υπολογίζει και κάνει render τον βασικό πίνακα με sign/house/planet
// σημαντικό κομμάτι της λογικής του βρίσκετε μέσα στα util helpers getZodiacSign, getHouse μεσα στην AngleToAstro (βρίσκει γωνίες ζωδίων και υπολογίζει οίκους με βάση τα cusps)
// in: data και setter για συγκεντρωτικό json στο useHome

// In astrology, a planet–sign–house combination is interpreted by blending three layers: the planet shows what energy or function is expressed, the sign describes how that energy behaves (its style, tone, and motivation), and the house indicates where in life this expression unfolds. Together, they form a unified meaning: a specific drive (planet), expressed in a particular way (sign), within a defined life area (house).

import { useEffect, useState, useMemo } from 'react'
import { Table, Paper, Modal, Text, Stack } from '@mantine/core'
import { getZodiacSign, getHouse } from '../../utils/angleToAstro'
import { colors, planetIcons, signIcons, planetKeywords, signKeywords, houseKeywords } from '../../constants/constants'
import type { ChartSummary, CustomPlanetInfo } from '../../types/types'

type Props = {
  data: ChartSummary;
  setCustomPlanetInfo: (info: CustomPlanetInfo[]) => void
};

const PlanetTable = ({ data, setCustomPlanetInfo }: Props) => {
  const [opened, setOpened] = useState(false); // δεν το χρησιμοποιούμε στα αλήθεια αλλα ας μείνει γιατί είναι reusable component
  const [selected, setSelected] = useState<{
    planet: string;
    sign: string;
    house: number | null;
  } | null>(null); // ui info modal

  // αποθηκεύει ένα [] με τις γωνίες των οίκων απο data
  const cusps = useMemo(
    () => data.houses.map(h => h.longitude ?? 0),
    [data.houses]
  )

  // αποθηκεύει ένα [] με τα lng των πλανητών απο τα data. Το lng είναι οι γωνίες που χρησιμοποιουμε στην αστρολογία για το chart και εδώ για το svg και για να βρούμε σε ποιον οίκο και ζώδιο ανήκει ο κάθε πλανήτης
  const planets = useMemo(() => [
    { name: "Sun", value: data.sun?.longitude },
    { name: "ASC", value: data.ascendant?.longitude },
    { name: "Moon", value: data.moon?.longitude },
    { name: "Mercury", value: data.mercury?.longitude },
    { name: "Venus", value: data.venus?.longitude },
    { name: "Mars", value: data.mars?.longitude },
    { name: "Jupiter", value: data.jupiter?.longitude },
    { name: "Saturn", value: data.saturn?.longitude },
    { name: "Uranus", value: data.uranus?.longitude },
    { name: "Neptune", value: data.neptune?.longitude },
    { name: "Pluto", value: data.pluto?.longitude },
  ], [data]);

  // για το συγκεντρωτικό json
  const planetInfo = useMemo<CustomPlanetInfo[]>(() =>
    planets
      .filter(p => p.value != null)
      .map(p => ({
        planet: p.name,
        sign: getZodiacSign(p.value as number),
        house: getHouse(p.value as number, cusps),
      })),
    [planets, cusps])

  useEffect(() => {
    setCustomPlanetInfo(planetInfo)
  }, [planetInfo, setCustomPlanetInfo])

  // για ui info modal
  const handleClick = (planet: string, sign: string, house: number | null) => {
    setSelected({ planet, sign, house });
    setOpened(true);
  };

  const rows = planets.map((planet) => {
    if (planet.value == null) return null;

    const sign = getZodiacSign(planet.value);

    return (
      <tr
        key={planet.name}
        onClick={() =>
          handleClick(planet.name, sign, getHouse(planet.value as number, cusps))
        }
        style={{
          cursor: "pointer",
          transition: "background 0.2s",
          backgroundColor: "rgba(255,255,255,0.02)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)";
        }}
      >
        <td style={{ textAlign: "left", padding: "4px 12px" }}>
          {planetIcons[planet.name]} {planet.name}
        </td>

        <td style={{ textAlign: "left", padding: "4px 12px" }}>
          {signIcons[sign]} {sign}
        </td>

        <td style={{ textAlign: "left", padding: "4px 12px" }}>
          {getHouse(planet.value, cusps)}
        </td>
      </tr>
    );
  });

  return (
    <>
      <Paper
        p="md"
        radius="md"
        style={{
          width: "100%",
          maxWidth: "300px",
          margin: "20px auto",
          background: colors.panel,
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: colors.text,
        }}
      >
        <Table
          striped
          highlightOnHover
          mt="sm"
          styles={{
            table: {
              color: colors.text,
            },
            th: {
              color: colors.dim,
              borderColor: "rgba(255,255,255,0.1)",
            },
            td: {
              borderColor: "rgba(255,255,255,0.05)",
            },
          }}
        >
          <thead>
            <tr>
              <th style={{
                textAlign: "left"
              }}>Planet</th>
              <th style={{
                textAlign: "left"
              }}>Sign</th>
              <th style={{
                textAlign: "left"
              }}>House</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Paper>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Details"
        centered
        styles={{
          content: {
            background: colors.panel,
            color: colors.text,
            backdropFilter: "blur(10px)",
          },
          header: {
            background: "transparent",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      >
        {/* c= color */}
        <Text size="sm" c="dimmed" mb={10} style={{ lineHeight: 1.4 }}>
          A planet shows what energy is expressed, the sign how it behaves, and the house where it manifests in life.
        </Text>
        {selected && (
          <Stack gap="xs">
            <div
              style={{
                width: "220px",
                margin: "0 auto",
                textAlign: "left",
              }}
            >
              {/* fw font weight */}
              <Text fw={600}>🪐 {selected.planet}</Text>
              <Text size="sm">
                {planetKeywords[selected.planet as keyof typeof planetKeywords]?.join(", ")}
              </Text>

              <Text fw={600} mt="xs">♈ {selected.sign}</Text>
              <Text size="sm">
                {signKeywords[selected.sign as keyof typeof signKeywords]?.join(", ")}
              </Text>

              <Text fw={600} mt="xs">🏠 House {selected.house}</Text>
              <Text size="sm">
                {houseKeywords[selected.house as keyof typeof houseKeywords]?.join(", ")}
              </Text>
            </div>
          </Stack>
        )}
      </Modal>
    </>
  );
}

export default PlanetTable
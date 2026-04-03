
// in: data απο home και setter για συγκεντρωτικο json απο useHome
// σημαντικά είναι τα utils calculateElementBalance, calculateModalityBalance (και τα δύο in: data)

/*
Τα elements (Fire, Earth, Air, Water) δείχνουν το είδος της ενέργειας ενός χάρτη και υπολογίζονται μετρώντας πόσοι πλανήτες βρίσκονται σε κάθε στοιχείο (βάσει ζωδίου). Τα modalities (Cardinal, Fixed, Mutable) δείχνουν τον τρόπο λειτουργίας/δράσης και επίσης υπολογίζονται από την κατανομή των πλανητών στα αντίστοιχα ζώδια. Ερμηνευτικά: περισσότερα στοιχεία/τροπικότητες = έντονη έμφαση σε αυτό το στυλ.
Elements keywords:
Fire → δράση, πάθος, ενέργεια, έμπνευση
Earth → πρακτικότητα, σταθερότητα, υλικότητα, ρεαλισμός
Air → σκέψη, επικοινωνία, ιδέες, λογική
Water → συναίσθημα, διαίσθηση, βάθος, ευαισθησία
Modalities keywords:
Cardinal → έναρξη, πρωτοβουλία, κίνηση
Fixed → σταθερότητα, επιμονή, διατήρηση
Mutable → προσαρμογή, ευελιξία, αλλαγή
*/
import { useEffect, useMemo, useState } from 'react'
import { Paper, Text, Group, Stack, Modal } from '@mantine/core'
import {
  calculateElementBalance,
  calculateModalityBalance,
} from '../../utils/balanceCalculator'
import { colors } from '../../constants/constants'
import type { ChartSummary, CustomBalance } from '../../types/types'

type Props = {
  data: ChartSummary;
  setCustomBalance: (balance: CustomBalance) => void;
};

const BalanceSummary = ({ data, setCustomBalance }: Props) => {
  const [modalOpened, setModalOpened] = useState(false)

  const handleModalClick = () => setModalOpened(true)

  const elements = useMemo(
    () => calculateElementBalance(data),
    [data]
  )

  const modalities = useMemo(
    () => calculateModalityBalance(data),
    [data]
  )

  useEffect(() => {
    setCustomBalance({
      elements,
      modalities,
    });
  }, [elements, modalities, setCustomBalance]);

  return (

    <>
      <Paper
        p="md"
        radius="md"
        onClick={handleModalClick}
        style={{
          width: "100%",
          maxWidth: "300px",
          margin: "10px auto",
          background: colors.panel,
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: colors.text,
        }}
      >
        <Text fw={600} size="sm" ta="center" c={colors.dim}>
          ⚖️ Chart Balance
        </Text>

        <Stack mt="xs" gap="xs">
          {/* 🔥 ELEMENTS */}
          <div>
            <Text fw={500} size="sm">
              🔥 Elements
            </Text>

            <Group gap="xs" mt={4}>
              <Text size="xs">🔥 {elements.Fire}</Text>
              <Text size="xs">🌱 {elements.Earth}</Text>
              <Text size="xs">💨 {elements.Air}</Text>
              <Text size="xs">💧 {elements.Water}</Text>
            </Group>
          </div>

          {/* ⚙️ MODALITIES */}
          <div>
            <Text fw={500} size="sm">
              ⚙️ Modalities
            </Text>

            <Group gap="xs" mt={4}>
              <Text size="xs">🚀 {modalities.Cardinal}</Text>
              <Text size="xs">🧱 {modalities.Fixed}</Text>
              <Text size="xs">🔄 {modalities.Mutable}</Text>
            </Group>
          </div>
        </Stack>
      </Paper>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Elements & Modalities"
        centered
        styles={{
          content: {
            background: colors.panel,
            color: colors.text,
            backdropFilter: 'blur(10px)',
          },
          header: {
            background: 'transparent',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      >
        <Stack gap="sm">
          <Text size="sm" c="dimmed" style={{ lineHeight: 1.4 }}>
            Elements (Fire, Earth, Air, Water) describe the type of energy in a chart,
            while modalities (Cardinal, Fixed, Mutable) describe how that energy acts.
            They are calculated by counting how many planets fall into each category.
          </Text>

          <Text fw={600}>🔥 Fire</Text>
          <Text size="sm">action, passion, energy, inspiration</Text>

          <Text fw={600}>🌱 Earth</Text>
          <Text size="sm">practicality, stability, realism</Text>

          <Text fw={600}>🌬 Air</Text>
          <Text size="sm">thinking, communication, ideas</Text>

          <Text fw={600}>💧 Water</Text>
          <Text size="sm">emotion, intuition, sensitivity</Text>

          <Text fw={600} mt="sm">♻ Modalities</Text>

          <Text fw={600}>Cardinal</Text>
          <Text size="sm">initiation, action, leadership</Text>

          <Text fw={600}>Fixed</Text>
          <Text size="sm">stability, persistence, resistance</Text>

          <Text fw={600}>Mutable</Text>
          <Text size="sm">adaptability, flexibility, change</Text>
        </Stack>
      </Modal>
    </>
  );
};

export default BalanceSummary;
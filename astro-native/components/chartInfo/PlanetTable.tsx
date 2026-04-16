// astro-native/components/chartInfo/PlanetTable.tsx

import { View, Text, Pressable, StyleSheet, Modal } from 'react-native'
import { useMemo, useState } from 'react'
import { getZodiacSign, getHouse } from '../../utils/angleToAstro'
import {
  colors,
  planetIcons,
  signIcons,
  planetKeywords,
  signKeywords,
  houseKeywords,
} from '../../constants/constants'

// ✅ σωστά keys από constants (όχι manual types)
type PlanetKey = keyof typeof planetKeywords
type SignKey = keyof typeof signKeywords

const PlanetTable = ({ data }: any) => {

  // ✅ strict typing → δεν χρειάζονται casts μετά
  const [selected, setSelected] = useState<{
    planet: PlanetKey
    sign: SignKey
    house: number | null
  } | null>(null)

  const [open, setOpen] = useState(false)

  // ✅ cusps memo
  const cusps = useMemo(
    () => data.houses.map((h: any) => h.longitude ?? 0),
    [data.houses]
  )

  // ✅ εδώ κρατάμε μόνο valid planet keys
  const planets = useMemo(() => [
    { name: 'Sun' as PlanetKey, value: data.sun?.longitude },
    { name: 'ASC' as PlanetKey, value: data.ascendant?.longitude },
    { name: 'Moon' as PlanetKey, value: data.moon?.longitude },
    { name: 'Mercury' as PlanetKey, value: data.mercury?.longitude },
    { name: 'Venus' as PlanetKey, value: data.venus?.longitude },
    { name: 'Mars' as PlanetKey, value: data.mars?.longitude },
  ], [data])

  // ❗ εδώ ήταν το βασικό λάθος (string → typed)
  const handlePress = (
    planet: PlanetKey,
    sign: SignKey,
    house: number | null
  ) => {
    setSelected({ planet, sign, house })
    setOpen(true)
  }

  return (
    <>
      <View style={styles.card}>
        <Text style={styles.title}>🪐 Planets</Text>

        {/* header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>Planet</Text>
          <Text style={styles.headerText}>Sign</Text>
          <Text style={styles.headerText}>H</Text>
        </View>

        {planets.map((p) => {
          if (p.value == null) return null

          // ❗ helpers επιστρέφουν string → κάνουμε safe cast
          const sign = getZodiacSign(p.value) as SignKey
          const house = getHouse(p.value, cusps)

          return (
            <Pressable
              key={p.name}
              onPress={() => handlePress(p.name, sign, house)}
              style={({ pressed }) => [
                styles.row,
                pressed && styles.rowPressed,
              ]}
            >
              <Text style={styles.cell}>
                {planetIcons[p.name]} {p.name}
              </Text>

              <Text style={styles.cell}>
                {signIcons[sign]} {sign}
              </Text>

              <Text style={styles.cell}>
                {house}
              </Text>
            </Pressable>
          )
        })}
      </View>

      {/* 🔥 MODAL */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            {/* explanation */}
            <Text style={styles.modalIntro}>
              A planet shows what energy is expressed, the sign how it behaves, and the house where it manifests.
            </Text>

            {selected && (
              <View style={styles.modalBlock}>

                {/* 🪐 planet */}
                <Text style={styles.modalTitle}>
                  {planetIcons[selected.planet]} {selected.planet}
                </Text>
                <Text style={styles.modalText}>
                  {planetKeywords[selected.planet].join(', ')}
                </Text>

                {/* ♈ sign */}
                <Text style={styles.modalTitle}>
                  {signIcons[selected.sign]} {selected.sign}
                </Text>
                <Text style={styles.modalText}>
                  {signKeywords[selected.sign].join(', ')}
                </Text>

                {/* 🏠 house */}
                <Text style={styles.modalTitle}>
                  🏠 House {selected.house}
                </Text>
                <Text style={styles.modalText}>
                  {houseKeywords[selected.house as keyof typeof houseKeywords]?.join(', ')}
                </Text>

              </View>
            )}

            <Pressable style={styles.closeBtn} onPress={() => setOpen(false)}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>

          </View>
        </View>
      </Modal>
    </>
  )
}

export default PlanetTable

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 14,

    // glass
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },

  title: {
    color: colors.text,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingHorizontal: 4,
  },

  headerText: {
    color: colors.dim,
    fontSize: 11,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 8,
  },

  rowPressed: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  cell: {
    color: colors.text,
    fontSize: 13,
  },

  // 🔥 modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    width: '85%',
    borderRadius: 16,
    padding: 16,

    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },

  modalIntro: {
    color: colors.dim,
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
  },

  modalBlock: {
    gap: 6,
    marginBottom: 14,
  },

  modalTitle: {
    color: colors.primary,
    fontWeight: '700',
  },

  modalText: {
    color: colors.text,
    fontSize: 12,
  },

  closeBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  closeText: {
    color: '#1a1a1a',
    fontWeight: '700',
  },
})
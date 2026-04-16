// astro-native/components/chartInfo/ChartRuler.tsx

import { View, Text, Pressable, StyleSheet, Modal } from 'react-native'
import { useMemo, useState } from 'react'
import { computeChartRuler } from '../../utils/computeChartRuler'
import {
  colors,
  planetIcons,
  signIcons,
  planetKeywords,
  signKeywords,
  houseKeywords,
} from '../../constants/constants'

// ✅ types από constants (όπως πριν)
type PlanetKey = keyof typeof planetKeywords
type SignKey = keyof typeof signKeywords

const ChartRuler = ({ data }: any) => {

  // 🔥 modal state
  const [open, setOpen] = useState(false)

  // 🔥 compute once
  const ruler = useMemo(() => computeChartRuler(data), [data])

  if (!ruler) return null

  // ❗ safe cast γιατί util επιστρέφει string
  const planet = ruler.planet as PlanetKey
  const sign = ruler.sign as SignKey
  const house = ruler.house

  return (
    <>
      {/* 🔥 GLASS CARD (clickable όπως web) */}
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.card,
          pressed && styles.cardPressed,
        ]}
      >
        <Text style={styles.title}>
          🧭 Chart Ruler
        </Text>

        <Text style={styles.text}>
          {planetIcons[planet]} {planet} in{' '}
          {signIcons[sign]} {sign} - House {house}
        </Text>
      </Pressable>

      {/* 🔥 MODAL */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>

            {/* description */}
            <Text style={styles.description}>
              The chart ruler is the planet that rules the Ascendant’s sign,
              representing the core driver of the chart, interpreted through its
              sign, house, and aspects.
            </Text>

            {/* content */}
            <View style={styles.block}>

              {/* 🪐 planet */}
              <Text style={styles.label}>
                {planetIcons[planet]} {planet}
              </Text>
              <Text style={styles.value}>
                {planetKeywords[planet].join(', ')}
              </Text>

              {/* ♈ sign */}
              <Text style={styles.label}>
                {signIcons[sign]} {sign}
              </Text>
              <Text style={styles.value}>
                {signKeywords[sign].join(', ')}
              </Text>

              {/* 🏠 house */}
              <Text style={styles.label}>
                🏠 House {house}
              </Text>
              <Text style={styles.value}>
                {houseKeywords[house as keyof typeof houseKeywords]?.join(', ')}
              </Text>

            </View>

            {/* close */}
            <Pressable style={styles.closeBtn} onPress={() => setOpen(false)}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>

          </View>
        </View>
      </Modal>
    </>
  )
}

export default ChartRuler

const styles = StyleSheet.create({

  // 🔥 glass card
  card: {
    padding: 14,
    borderRadius: 16,

    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },

  cardPressed: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  title: {
    color: colors.dim,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },

  text: {
    color: colors.text,
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
  },

  // 🔥 modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modal: {
    width: '85%',
    borderRadius: 16,
    padding: 16,

    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },

  description: {
    color: colors.dim,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 16,
  },

  block: {
    gap: 6,
    marginBottom: 14,
  },

  label: {
    color: colors.primary,
    fontWeight: '700',
  },

  value: {
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
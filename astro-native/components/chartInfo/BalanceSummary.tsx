// astro-native/components/chartInfo/BalanceSummary.tsx

import { View, Text, StyleSheet, Pressable, Modal } from 'react-native'
import { useMemo, useState } from 'react'
import {
  calculateElementBalance,
  calculateModalityBalance,
} from '../../utils/balanceCalculator'
import { colors } from '../../constants/constants'

const BalanceSummary = ({ data }: any) => {

  const [open, setOpen] = useState(false)

  // 🔥 memo όπως web
  const elements = useMemo(() => calculateElementBalance(data), [data])
  const modalities = useMemo(() => calculateModalityBalance(data), [data])

  return (
    <>
      {/* 🔥 CARD */}
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.card,
          pressed && styles.cardPressed,
        ]}
      >
        <Text style={styles.title}>
          ⚖️ Chart Balance
        </Text>

        {/* 🔥 ELEMENTS */}
        <View style={styles.sectionBlock}>
          <Text style={styles.section}>🔥 Elements</Text>
          <Text style={styles.text}>
            🔥 {elements.Fire}   🌱 {elements.Earth}   💨 {elements.Air}   💧 {elements.Water}
          </Text>
        </View>

        {/* ⚙️ MODALITIES */}
        <View style={styles.sectionBlock}>
          <Text style={styles.section}>⚙️ Modalities</Text>
          <Text style={styles.text}>
            🚀 {modalities.Cardinal}   🧱 {modalities.Fixed}   🔄 {modalities.Mutable}
          </Text>
        </View>
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

            {/* intro */}
            <Text style={styles.description}>
              Elements describe the type of energy in a chart,
              while modalities describe how that energy acts.
              They are calculated by counting planets.
            </Text>

            {/* 🔥 ELEMENTS */}
            <View style={styles.block}>
              <Text style={styles.label}>🔥 Fire</Text>
              <Text style={styles.value}>
                action, passion, energy, inspiration
              </Text>

              <Text style={styles.label}>🌱 Earth</Text>
              <Text style={styles.value}>
                practicality, stability, realism
              </Text>

              <Text style={styles.label}>💨 Air</Text>
              <Text style={styles.value}>
                thinking, communication, ideas
              </Text>

              <Text style={styles.label}>💧 Water</Text>
              <Text style={styles.value}>
                emotion, intuition, sensitivity
              </Text>
            </View>

            {/* ⚙️ MODALITIES */}
            <View style={styles.block}>
              <Text style={styles.label}>⚙️ Modalities</Text>

              <Text style={styles.label}>Cardinal</Text>
              <Text style={styles.value}>
                initiation, action, leadership
              </Text>

              <Text style={styles.label}>Fixed</Text>
              <Text style={styles.value}>
                stability, persistence, resistance
              </Text>

              <Text style={styles.label}>Mutable</Text>
              <Text style={styles.value}>
                adaptability, flexibility, change
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

export default BalanceSummary

const styles = StyleSheet.create({

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

  sectionBlock: {
    marginTop: 8,
  },

  section: {
    color: colors.primary,
    fontSize: 12,
    marginBottom: 2,
  },

  text: {
    color: colors.text,
    fontSize: 13,
  },

  // modal
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
    marginBottom: 10,
    gap: 4,
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
    marginTop: 8,
  },

  closeText: {
    color: '#1a1a1a',
    fontWeight: '700',
  },
})
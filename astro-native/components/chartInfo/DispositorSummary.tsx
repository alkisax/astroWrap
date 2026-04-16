// astro-native/components/chartInfo/DispositorSummary.tsx

import { useMemo, useState } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import type { ChartSummary } from '@/types/types'
import { planetIcons, colors } from '@/constants/constants'
import { getAllDispositors } from '@/utils/dispositorCalculator'
import { getMutualReceptions } from '@/utils/mutualReception'

type Props = {
  data: ChartSummary
}

const DispositorSummary = ({ data }: Props) => {
  const [opened, setOpened] = useState(false)

  const results = useMemo(() => getAllDispositors(data), [data])
  const mutual = useMemo(() => getMutualReceptions(data), [data])

  const finals = useMemo(
    () =>
      Array.from(
        new Set(
          results
            .filter((r) => r.result.type === 'final')
            .map((r) => {
              const chain = r.result.chain
              return chain[chain.length - 1]
            })
        )
      ),
    [results]
  )

  const uniqueLoop = useMemo(() => {
    const loops = results
      .filter((r) => r.result.type === 'loop' && r.result.loopStart)
      .map((r) => r.result.loopStart)
      .filter((p): p is string => p !== undefined)

    return Array.from(new Set(loops))
  }, [results])

  const summaryInfo =
    'Chart dynamics summarize how planetary control is structured. Final dispositors (Backbone) act as central points where energy accumulates. Loops show closed systems of mutual influence. Mutual receptions occur when two planets are in each other’s signs, creating a strong connection and cooperation between them.'

  return (
    <>
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() => setOpened(true)}
      >
        <Text style={styles.title}>
          🧠 Chart Dynamics
        </Text>

        <View style={styles.list}>
          {/* 🔥 Backbone */}
          {finals.length > 0 && (
            <View style={styles.block}>
              <Text style={styles.label}>Backbone</Text>
              <Text style={styles.value}>
                {finals.map((p, i) => (
                  `${planetIcons[p]} ${p}${i < finals.length - 1 ? ', ' : ''}`
                )).join('')}
              </Text>
            </View>
          )}

          {/* 🔁 Loop */}
          {uniqueLoop.length >= 2 && (
            <View style={styles.block}>
              <Text style={styles.label}>Dominant Loop</Text>
              <Text style={styles.value}>
                {uniqueLoop.map((p, i) => (
                  `${planetIcons[p]} ${p}${i < uniqueLoop.length - 1 ? ' ⇄ ' : ''}`
                )).join('')}
              </Text>
            </View>
          )}

          {/* 🔗 Mutual */}
          {mutual.length > 0 && (
            <View style={styles.block}>
              <Text style={styles.label}>Mutual Reception</Text>
              <Text style={styles.value}>
                {mutual.map((pair, i) => (
                  `${planetIcons[pair[0]]} ${pair[0]} ⇄ ${planetIcons[pair[1]]} ${pair[1]}${i < mutual.length - 1 ? ', ' : ''}`
                )).join('')}
              </Text>
            </View>
          )}
        </View>
      </Pressable>

      <Modal
        visible={opened}
        transparent
        animationType='fade'
        onRequestClose={() => setOpened(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Chart Dynamics</Text>

              <Text style={styles.modalInfo}>
                {summaryInfo}
              </Text>

              <View style={styles.modalBlock}>
                <Text style={styles.modalSection}>
                  Backbone
                </Text>
                <Text style={styles.modalText}>
                  final dispositors → central control points
                </Text>

                <Text style={styles.modalSection}>
                  Loop
                </Text>
                <Text style={styles.modalText}>
                  closed energy system (planets depend on each other)
                </Text>

                <Text style={styles.modalSection}>
                  Mutual Reception
                </Text>
                <Text style={styles.modalText}>
                  two planets in each other’s signs → strong cooperation
                </Text>
              </View>

              <Pressable style={styles.closeBtn} onPress={() => setOpened(false)}>
                <Text style={styles.closeBtnText}>Close</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  )
}

export default DispositorSummary

const styles = StyleSheet.create({
  card: {
    gap: 6,
  },
  cardPressed: {
    opacity: 0.95,
  },
  title: {
    textAlign: 'center',
    color: colors.dim,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  list: {
    gap: 8,
  },
  block: {
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  label: {
    color: colors.dim,
    fontSize: 11,
    marginBottom: 2,
  },
  value: {
    color: colors.text,
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.panel,
    borderRadius: 12,
    padding: 16,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modalTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  modalInfo: {
    color: colors.dim,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  modalBlock: {
    gap: 8,
  },
  modalSection: {
    color: colors.text,
    fontWeight: '600',
    marginTop: 4,
  },
  modalText: {
    color: colors.dim,
    fontSize: 12,
  },
  closeBtn: {
    marginTop: 20,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  closeBtnText: {
    color: '#1a1a1a',
    fontWeight: '700',
  },
})
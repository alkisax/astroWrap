// astro-native/components/chartInfo/DispositorTree.tsx

import { useMemo, useState } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import type { ChartSummary } from '@/types/types'
import { planetIcons, colors } from '@/constants/constants'
import { getAllDispositors } from '@/utils/dispositorCalculator'
import DispositorSummary from './DispositorSummary'

type Props = {
  data: ChartSummary
}

const DispositorTree = ({ data }: Props) => {
  // modal info ui
  const [selected, setSelected] = useState<ReturnType<typeof getAllDispositors>[number] | null>(null)

  // όλη η λογική στο util getAllDispositors
  const results = useMemo(() => getAllDispositors(data), [data])

  const finalPlanet =
    selected?.result.type === 'final'
      ? selected.result.chain[selected.result.chain.length - 1]
      : null

  const loopStart = selected?.result.loopStart

  const dispositorInfo =
    'A dispositor tree shows how planetary energy flows through rulerships. Each planet is in a sign, and each sign has a ruler. We follow this chain until it ends in a final dispositor or forms a loop. Interpretation: final dispositors act as control centers, loops show closed systems, and long chains show indirect expression of energy.'

  return (
    <>
      <View style={styles.card}>
        <DispositorSummary data={data} />

        <Text style={styles.title}>
          🌳 Dispositor Tree
        </Text>

        <View style={styles.list}>
          {results.map((r, i) => {
            // 👉 fix: αν είναι loop κόβουμε το τελευταίο (duplicate)
            const displayChain =
              r.result.type === 'loop'
                ? r.result.chain.slice(0, -1)
                : r.result.chain

            return (
              <Pressable
                key={i}
                onPress={() => setSelected(r)}
                style={({ pressed }) => [
                  styles.row,
                  pressed && styles.rowPressed,
                ]}
              >
                <Text style={styles.rowText}>
                  {planetIcons[r.planet]} {r.planet}
                </Text>

                <Text style={styles.arrow}>→</Text>

                <View style={styles.chainWrap}>
                  {displayChain.map((p, idx) => {
                    const isLast = idx === displayChain.length - 1

                    return (
                      <Text key={`${p}-${idx}`} style={styles.rowText}>
                        {planetIcons[p]} {p}{!isLast ? ' → ' : ''}
                      </Text>
                    )
                  })}

                  {r.result.type === 'loop' && r.result.loopStart && (
                    <Text style={styles.loopText}>
                      {' '}⇄ {planetIcons[r.result.loopStart]} {r.result.loopStart}
                    </Text>
                  )}

                  {r.result.type === 'final' && (
                    <Text style={styles.finalText}>
                      {' '}⭐ final
                    </Text>
                  )}
                </View>
              </Pressable>
            )
          })}
        </View>
      </View>

      <Modal
        visible={!!selected}
        transparent
        animationType='fade'
        onRequestClose={() => setSelected(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Dispositor Chain</Text>

              <Text style={styles.modalInfo}>
                {dispositorInfo}
              </Text>

              {selected && (
                <View style={styles.modalBlock}>
                  <Text style={styles.modalSection}>
                    {planetIcons[selected.planet]} {selected.planet}
                  </Text>

                  <Text style={styles.modalText}>
                    {selected.result.chain.join(' → ')}
                  </Text>

                  {selected.result.type === 'final' && finalPlanet && (
                    <Text style={styles.finalText}>
                      ⭐ Final dispositor: {planetIcons[finalPlanet]} {finalPlanet}
                    </Text>
                  )}

                  {selected.result.type === 'loop' && loopStart && (
                    <Text style={styles.loopText}>
                      🔁 Loop at: {planetIcons[loopStart]} {loopStart}
                    </Text>
                  )}
                </View>
              )}

              <Pressable style={styles.closeBtn} onPress={() => setSelected(null)}>
                <Text style={styles.closeBtnText}>Close</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  )
}

export default DispositorTree

const styles = StyleSheet.create({
  card: {
    gap: 8,
  },
  title: {
    textAlign: 'center',
    color: colors.dim,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 6,
  },
  list: {
    gap: 6,
  },
  row: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  rowPressed: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  rowText: {
    color: colors.text,
    fontSize: 12,
  },
  arrow: {
    color: colors.dim,
    fontSize: 12,
    marginVertical: 2,
  },
  chainWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 2,
  },
  finalText: {
    color: '#ffd43b',
    fontSize: 12,
  },
  loopText: {
    color: '#ff922b',
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
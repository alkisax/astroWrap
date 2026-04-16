import { View, Text, StyleSheet, Pressable, Modal, ScrollView } from 'react-native'
import { useEffect, useMemo, useState } from 'react'
import type { ChartSummary, CustomHouseRuler } from '@/types/types'
import { computeHouseRulers } from '@/utils/houseRulers'
import { planetIcons, signIcons, colors, signKeywords, houseKeywords, planetKeywords } from '@/constants/constants'

type Props = {
  data: ChartSummary
  setCustomHouseRulers: (rulers: CustomHouseRuler[]) => void
}

const HouseRulers = ({ data, setCustomHouseRulers }: Props) => {
  const [selected, setSelected] = useState<CustomHouseRuler | null>(null)

  const results = useMemo(() => computeHouseRulers(data), [data])

  useEffect(() => {
    setCustomHouseRulers(results)
  }, [results, setCustomHouseRulers])

  return (
    <>
      {/* LIST */}
      <View style={styles.container}>
        {results.map((r) => (
          <Pressable
            key={r.house}
            onPress={() => setSelected(r)}
            style={styles.row}
          >
            {/* LEFT */}
            <Text style={styles.text}>
              🏠 {r.house} ({signIcons[r.sign]} {r.sign})
            </Text>

            {/* MIDDLE */}
            <Text style={styles.text}>
              → {planetIcons[r.ruler]} {r.ruler}
            </Text>

            {/* RIGHT */}
            <Text style={[styles.text, styles.dim]}>
              {r.inSign
                ? `${signIcons[r.inSign]} ${r.inSign} (H${r.inHouse})`
                : 'unknown'}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* MODAL */}
      <Modal
        visible={!!selected}
        transparent
        animationType='fade'
        onRequestClose={() => setSelected(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>House Ruler Details</Text>

              <Text style={styles.modalIntro}>
                House = what • Ruler = how • Position = where
              </Text>

              {selected && (
                <>
                  <Text style={styles.modalSection}>
                    🏠 House {selected.house} ({selected.sign})
                  </Text>

                  <Text style={styles.modalText}>
                    {houseKeywords[selected.house as keyof typeof houseKeywords]?.join(', ')}
                  </Text>

                  <Text style={styles.modalSection}>
                    → {selected.ruler}
                  </Text>

                  <Text style={styles.modalText}>
                    {planetKeywords[selected.ruler as keyof typeof planetKeywords]?.join(', ')}
                  </Text>

                  <Text style={styles.modalSection}>
                    {selected.inSign
                      ? `${selected.inSign} (H${selected.inHouse})`
                      : 'unknown'}
                  </Text>

                  {selected.inSign && (
                    <Text style={styles.modalText}>
                      {signKeywords[selected.inSign as keyof typeof signKeywords]?.join(', ')}
                    </Text>
                  )}
                </>
              )}

              <Pressable
                onPress={() => setSelected(null)}
                style={styles.closeBtn}
              >
                <Text style={styles.closeText}>Close</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  )
}

export default HouseRulers

const styles = StyleSheet.create({
  container: {
    gap: 6,
    marginTop: 6,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },

  text: {
    color: colors.text,
    fontSize: 12,
  },

  dim: {
    color: colors.dim,
  },

  // modal
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
  },

  modalTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },

  modalIntro: {
    color: colors.dim,
    fontSize: 12,
    marginBottom: 10,
  },

  modalSection: {
    color: colors.text,
    fontWeight: '600',
    marginTop: 10,
  },

  modalText: {
    color: colors.dim,
    fontSize: 12,
    marginTop: 2,
  },

  closeBtn: {
    marginTop: 20,
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  closeText: {
    color: colors.text,
  },
})
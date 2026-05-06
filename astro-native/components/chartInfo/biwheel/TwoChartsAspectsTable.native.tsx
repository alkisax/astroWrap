import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
} from 'react-native'

import { useMemo, useState } from 'react'

import type { ChartSummary, Aspect } from '@/types/types'

import {
  colors,
  planetIcons,
  aspectIcons,
  aspectKeywords,
  planetKeywords,
} from '@/constants/constants'

import { findTwoChartAspects } from '@/utils/TwoChartsAspectFinder'

type Props = {
  radix: ChartSummary
  transit: ChartSummary
}

const allowed = [
  'Sun',
  'Moon',
  'Mercury',
  'Venus',
  'Mars',
  'Jupiter',
  'Saturn',
  'Uranus',
  'Neptune',
  'Pluto',
  'Ascendant',
  'Midheaven',
]

const TwoChartsAspectsTable = ({
  radix,
  transit,
}: Props) => {
  const [selected, setSelected] = useState<Aspect | null>(null)

  const aspects = useMemo(() => {
    return findTwoChartAspects(radix, transit)

      // orb
      .filter(a => (a.orb ?? 999) <= 3)

      // allowed
      .filter(a => {
        const t = a.point1Label.replace('T-', '')
        const n = a.point2Label.replace('N-', '')

        return allowed.includes(t) && allowed.includes(n)
      })

      // duplicates
      .filter((a, i, arr) => {
        return i === arr.findIndex(b =>
          a.type === b.type &&
          a.point1Label === b.point1Label &&
          a.point2Label === b.point2Label
        )
      })

      // orb sort
      .sort((a, b) => (a.orb ?? 999) - (b.orb ?? 999))
  }, [radix, transit])

  if (!aspects.length) return null

  return (
    <>
      <View style={styles.card}>
        <Text style={styles.title}>
          🔮 Transit Aspects
        </Text>

        {aspects.map((a, i) => {
          const orb =
            a.orb != null
              ? a.orb.toFixed(2)
              : '?'

          const tName = a.point1Label.replace('T-', '')
          const nName = a.point2Label.replace('N-', '')

          return (
            <Pressable
              key={i}
              style={styles.row}
              onPress={() => setSelected(a)}
            >
              <Text style={styles.cell}>
                {planetIcons[tName]} T-{tName}
              </Text>

              <Text style={styles.cell}>
                {aspectIcons[a.type]}
              </Text>

              <Text style={styles.cell}>
                {planetIcons[nName]} N-{nName}
              </Text>

              <Text style={styles.orb}>
                {a.type} ({orb}°)
              </Text>
            </Pressable>
          )
        })}
      </View>

      {/* modal */}
      <Modal
        visible={!!selected}
        transparent
        animationType='fade'
        onRequestClose={() => setSelected(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>

              {selected && (
                <>
                  <Text style={styles.modalTitle}>
                    {aspectIcons[selected.type]} {selected.type}
                  </Text>

                  <Text style={styles.modalIntro}>
                    Transit-to-natal interaction
                  </Text>

                  <Text style={styles.modalPlanet}>
                    {selected.point1Label}
                  </Text>

                  <Text style={styles.modalKeywords}>
                    {
                      planetKeywords[
                        selected.point1Label
                          .replace('T-', '')
                          .toLowerCase() as keyof typeof planetKeywords
                      ]?.join(', ')
                    }
                  </Text>

                  <Text style={styles.modalAspect}>
                    {selected.type}
                  </Text>

                  <Text style={styles.modalKeywords}>
                    {
                      aspectKeywords[
                        selected.type as keyof typeof aspectKeywords
                      ]?.join(', ')
                    }
                  </Text>

                  <Text style={styles.modalPlanet}>
                    {selected.point2Label}
                  </Text>

                  <Text style={styles.modalKeywords}>
                    {
                      planetKeywords[
                        selected.point2Label
                          .replace('N-', '')
                          .toLowerCase() as keyof typeof planetKeywords
                      ]?.join(', ')
                    }
                  </Text>

                  <Pressable
                    onPress={() => setSelected(null)}
                    style={styles.closeBtn}
                  >
                    <Text style={styles.closeText}>
                      Close
                    </Text>
                  </Pressable>
                </>
              )}

            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  )
}

export default TwoChartsAspectsTable

const styles = StyleSheet.create({
  card: {
    gap: 6,
  },

  title: {
    textAlign: 'center',
    color: colors.dim,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingVertical: 6,
    paddingHorizontal: 6,

    borderRadius: 6,

    backgroundColor: 'rgba(255,255,255,0.02)',
  },

  cell: {
    color: colors.text,
    fontSize: 11,
  },

  orb: {
    color: colors.dim,
    fontSize: 10,
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
  },

  modalTitle: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },

  modalIntro: {
    color: colors.dim,
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 12,
  },

  modalPlanet: {
    color: colors.text,
    fontWeight: '600',
    marginTop: 12,
  },

  modalAspect: {
    color: colors.primary,
    fontWeight: '600',
    marginTop: 12,
  },

  modalKeywords: {
    color: colors.dim,
    fontSize: 12,
    marginTop: 4,
  },

  closeBtn: {
    marginTop: 20,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  closeText: {
    color: colors.text,
  },
})
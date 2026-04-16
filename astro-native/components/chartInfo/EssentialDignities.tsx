// astro-native/components/chartInfo/EssentialDignities.tsx

// εδω δεν έχει δικό του Util και είναι όλα εδώ
// in: data απο chart summary

import { useMemo, useState } from 'react'
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native'
import type { ChartSummary } from '@/types/types'
import { planetIcons, signIcons, colors } from '@/constants/constants'
import { getZodiacSign } from '@/utils/angleToAstro'
import { domicile, exaltation, detriment, fall } from '@/constants/dignities'

// helper που βρίσκει το dignity ενός πλανήτη με βάση το ζώδιο
// συγκρίνει με πίνακες rulership (domicile, exaltation κλπ)
const getDignity = (planet: string, sign: string) => {
  if (domicile[planet]?.includes(sign)) return 'domicile'
  if (exaltation[planet] === sign) return 'exaltation'
  if (detriment[planet]?.includes(sign)) return 'detriment'
  if (fall[planet] === sign) return 'fall'

  return 'neutral'
}

const dignityMeta = {
  domicile: { emoji: '⭐', color: '#ffd43b' },
  exaltation: { emoji: '🔥', color: '#ff922b' },
  detriment: { emoji: '⚠️', color: '#ff6b6b' },
  fall: { emoji: '❌', color: '#fa5252' },
  neutral: { emoji: '➖', color: '#868e96' },
} as const

type DignityKey = keyof typeof dignityMeta

type Props = {
  data: ChartSummary
}

// θα μπορούσα να το πάρω απο constants αλλα επειδή εκεί μεγαλύτερο καλυτερα να το φτιάξω απο την αρχη
// περιορίζουμε σε 7 κλασικούς πλανήτες (παραδοσιακή αστρολογία)
const planetsList = [
  'Sun',
  'Moon',
  'Mercury',
  'Venus',
  'Mars',
  'Jupiter',
  'Saturn',
] as const

const EssentialDignities = ({ data }: Props) => {
  // Modal info ui
  const [opened, setOpened] = useState(false)

  const planetMap = useMemo(() => ({
    Sun: data.sun,
    Moon: data.moon,
    Mercury: data.mercury,
    Venus: data.venus,
    Mars: data.mars,
    Jupiter: data.jupiter,
    Saturn: data.saturn,
  }), [data])

  // για κάθε πλανήτη:
  // 1. βρίσκουμε μοίρες
  // 2. βρίσκουμε ζώδιο
  // 3. υπολογίζουμε dignity
  // 4. εμφανίζουμε UI
  const dignityRows = useMemo(() => {
    return planetsList
      .map((p) => {
        const val = planetMap[p]?.longitude
        if (val == null) return null

        const sign = getZodiacSign(val)
        const dignity = getDignity(p, sign) as DignityKey
        const meta = dignityMeta[dignity]

        return {
          planet: p,
          sign,
          dignity,
          meta,
        }
      })
      .filter((row): row is NonNullable<typeof row> => row !== null)
  }, [planetMap])

  // info text για modal
  const dignityInfo =
    'Essential dignities describe how strong or comfortable a planet is in a sign. Each planet has signs where it works best (domicile, exaltation) and signs where it struggles (detriment, fall). We calculate dignity by checking the planet’s zodiac sign and comparing it to predefined rulership tables. Interpretation: strong dignity (domicile/exaltation) means the planet expresses itself naturally and effectively, while weak dignity (detriment/fall) shows tension, difficulty, or indirect expression. Example: Mars in Aries (domicile) acts directly and confidently, while Mars in Libra (detriment) may struggle with assertiveness and act more indirectly.'

  return (
    <>
      <Pressable
        style={({ pressed }) => [
          styles.card,
          pressed && styles.cardPressed,
        ]}
        onPress={() => setOpened(true)}
      >
        <Text style={styles.title}>
          ⚖️ Essential Dignities
        </Text>

        <View style={styles.list}>
          {dignityRows.map((row) => (
            <View
              key={row.planet}
              style={styles.row}
            >
              <Text style={styles.rowText}>
                {planetIcons[row.planet]} {row.planet}
              </Text>

              <Text style={styles.rowText}>
                {signIcons[row.sign]} {row.sign}
              </Text>

              <Text style={[styles.rowText, { color: row.meta.color }]}>
                {row.meta.emoji} {row.dignity}
              </Text>
            </View>
          ))}
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
              <Text style={styles.modalTitle}>
                Essential Dignities
              </Text>

              <Text style={styles.modalText}>
                {dignityInfo}
              </Text>

              <Pressable
                onPress={() => setOpened(false)}
                style={styles.closeBtn}
              >
                <Text style={styles.closeBtnText}>
                  Close
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  )
}

export default EssentialDignities

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
    gap: 6,
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

  rowText: {
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

  modalText: {
    color: colors.dim,
    fontSize: 12,
    lineHeight: 18,
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
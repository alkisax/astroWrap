// astro-native/components/devInfoComponents/BalanceSummaryDevInfo.tsx

import {
  Pressable,
  Text,
  View,
  StyleSheet,
} from 'react-native'

import { useState } from 'react'
import { globalStyles } from '@/layout/global'
import { colors } from '@/constants/constants'

const BalanceSummaryDevInfo = () => {
  const [open, setOpen] = useState(false)

  return (
    <View style={globalStyles.card}>

      <Pressable onPress={() => setOpen(!open)}>
        <Text style={globalStyles.sectionTitle}>
          ⚖️ Elements & Modalities Balance
          {' '}
          {open ? '▲' : '▼'}
        </Text>
      </Pressable>

      {open && (
        <>
          <Text style={globalStyles.paragraph}>
            The Balance system measures the energetic distribution
            of a natal chart.
          </Text>

          <Text style={globalStyles.paragraph}>
            In astrology, zodiac signs belong to:
          </Text>

          <Text style={globalStyles.bullet}>
            • one element
          </Text>

          <Text style={globalStyles.bullet}>
            • one modality
          </Text>

          <Text style={globalStyles.paragraph}>
            The application calculates how many planets
            belong to each category.
          </Text>

          <Text style={globalStyles.subTitle}>
            Elements
          </Text>

          <Text style={globalStyles.bullet}>
            🔥 Fire → action, inspiration, energy
          </Text>

          <Text style={globalStyles.bullet}>
            🌱 Earth → practicality, stability, realism
          </Text>

          <Text style={globalStyles.bullet}>
            💨 Air → thinking, communication, abstraction
          </Text>

          <Text style={globalStyles.bullet}>
            💧 Water → emotions, intuition, sensitivity
          </Text>

          <Text style={globalStyles.subTitle}>
            Modalities
          </Text>

          <Text style={globalStyles.bullet}>
            🚀 Cardinal → initiation, movement
          </Text>

          <Text style={globalStyles.bullet}>
            🧱 Fixed → persistence, stabilization
          </Text>

          <Text style={globalStyles.bullet}>
            🔄 Mutable → adaptation, flexibility
          </Text>

          <Text style={globalStyles.subTitle}>
            Example Interpretation
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`Fire: 5
Earth: 1
Air: 2
Water: 2

→ highly active / expressive chart`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Or:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`Fixed: 6

→ persistence, resistance to change`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Implementation Logic
          </Text>

          <Text style={globalStyles.paragraph}>
            The system first extracts the planetary signs
            from the chart object.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`const getPlanetSigns = (data) => [
  data.sun?.sign,
  data.moon?.sign,
  data.mercury?.sign,
  data.venus?.sign,
  data.mars?.sign,
  data.jupiter?.sign,
  data.saturn?.sign,
  data.uranus?.sign,
  data.neptune?.sign,
  data.pluto?.sign,
]`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Example returned values:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`[
  'Taurus',
  'Capricorn',
  'Gemini',
  'Aries'
]`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Element Calculation
          </Text>

          <Text style={globalStyles.paragraph}>
            Each zodiac sign is mapped
            to an element.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`signToElement = {
  Aries: 'Fire',
  Taurus: 'Earth',
  Gemini: 'Air'
}`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            The application loops through
            every planetary sign:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`for (const sign of signs) {
  const el = signToElement[sign]

  if (el) {
    counts[el]++
  }
}`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Final output:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`{
  Fire: 3,
  Earth: 2,
  Air: 4,
  Water: 1
}`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Modality Calculation
          </Text>

          <Text style={globalStyles.paragraph}>
            The same logic is reused
            for modalities.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`signToModality = {
  Aries: 'Cardinal',
  Taurus: 'Fixed',
  Gemini: 'Mutable'
}`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Final modality output:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`{
  Cardinal: 4,
  Fixed: 3,
  Mutable: 3
}`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            UI Layer
          </Text>

          <Text style={globalStyles.paragraph}>
            The results are displayed
            inside a glass-style card.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`🔥 3   🌱 2   💨 4   💧 1

🚀 4   🧱 3   🔄 3`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Clicking the card opens
            a modal explaining the meaning
            of each balance category.
          </Text>

          <Text style={globalStyles.subTitle}>
            Performance Notes
          </Text>

          <Text style={globalStyles.paragraph}>
            useMemo() is used so calculations
            only rerun when chart data changes.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`const elements = useMemo(
  () => calculateElementBalance(data),
  [data]
)`}
            </Text>
          </View>
        </>
      )}

    </View>
  )
}

export default BalanceSummaryDevInfo

const styles = StyleSheet.create({
  codeBlock: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  code: {
    color: colors.text,
    fontSize: 13,
    lineHeight: 20,
    fontFamily: 'monospace',
  },
})
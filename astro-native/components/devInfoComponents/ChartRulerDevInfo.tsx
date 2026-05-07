// astro-native/components/devInfoComponents/ChartRulerDevInfo.tsx

import {
  Pressable,
  Text,
  View,
  StyleSheet,
} from 'react-native'

import { useState } from 'react'
import { globalStyles } from '@/layout/global'
import { colors } from '@/constants/constants'

const ChartRulerDevInfo = () => {
  const [open, setOpen] = useState(false)

  return (
    <View style={globalStyles.card}>

      <Pressable onPress={() => setOpen(!open)}>
        <Text style={globalStyles.sectionTitle}>
          🧭 Chart Ruler
          {' '}
          {open ? '▲' : '▼'}
        </Text>
      </Pressable>

      {open && (
        <>
          <Text style={globalStyles.paragraph}>
            The Chart Ruler is one of the central concepts
            in natal astrology.
          </Text>

          <Text style={globalStyles.paragraph}>
            It represents the planetary ruler of the Ascendant sign,
            often interpreted as the “main operating planet”
            of the chart.
          </Text>

          <Text style={globalStyles.paragraph}>
            Astrologically:
          </Text>

          <Text style={globalStyles.bullet}>
            • Ascendant = identity projection / interface
          </Text>

          <Text style={globalStyles.bullet}>
            • Chart ruler = core directional energy
          </Text>

          <Text style={globalStyles.paragraph}>
            Example:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`Ascendant = Leo

Leo ruler = Sun

→ Chart ruler = Sun`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            The application then additionally calculates:
          </Text>

          <Text style={globalStyles.bullet}>
            • the rulers sign
          </Text>

          <Text style={globalStyles.bullet}>
            • the rulers house
          </Text>

          <Text style={globalStyles.bullet}>
            • later: aspects and condition
          </Text>

          <Text style={globalStyles.subTitle}>
            Final Interpretation Structure
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`Sun in Taurus - House 10

Planet:
Sun → identity, vitality

Sign:
Taurus → stability, material focus

House:
10th → career, visibility`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Calculation Flow
          </Text>

          <Text style={globalStyles.paragraph}>
            Step 1:
            Find the Ascendant longitude.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`const asc = data.ascendant`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Step 2:
            Convert longitude into zodiac sign.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`const ascSign = getZodiacSign(
  asc.longitude
)`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Example:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`140° / 30 = 4

signs[4] = Leo`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Traditional Ruler Lookup
          </Text>

          <Text style={globalStyles.paragraph}>
            The application uses a rulership table:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`const rulerSymbol =
  rulers[ascSign]?.traditional`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Example:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`rulers['Leo']

→ ☉`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Because the rulership table stores symbols,
            an additional conversion step exists:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`const rulerPlanet =
  planetSymbolToName[rulerSymbol]`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Example:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`☉ → Sun`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Planet Extraction
          </Text>

          <Text style={globalStyles.paragraph}>
            The system then searches the chart data
            for the matching planet object.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`const planetData = planetMap[
  rulerPlanet
]`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Example returned data:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`sun: {
  longitude: 43.67,
  retrograde: false
}`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Sign & House Calculation
          </Text>

          <Text style={globalStyles.paragraph}>
            The ruler longitude is then reused
            for sign and house calculations.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`const sign =
  getZodiacSign(
    planetData.longitude
  )

const house =
  getHouse(
    planetData.longitude,
    cusps
  )`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Final output:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`{
  planet: 'Sun',
  sign: 'Taurus',
  house: 10
}`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            UI Layer
          </Text>

          <Text style={globalStyles.paragraph}>
            The final result is rendered
            as a glass-style clickable card.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`<Pressable
  onPress={() => setOpen(true)}
>
`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Clicking opens a modal with:
          </Text>

          <Text style={globalStyles.bullet}>
            • planet keywords
          </Text>

          <Text style={globalStyles.bullet}>
            • sign keywords
          </Text>

          <Text style={globalStyles.bullet}>
            • house keywords
          </Text>

          <Text style={globalStyles.paragraph}>
            The interpretation system reuses
            the same keyword architecture
            used by the Planet Table component.
          </Text>
        </>
      )}

    </View>
  )
}

export default ChartRulerDevInfo

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

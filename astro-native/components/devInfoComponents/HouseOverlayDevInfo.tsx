// astro-native/components/devInfoComponents/HouseOverlayDevInfo.tsx

import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native'

import { useState } from 'react'

import { globalStyles } from '@/layout/global'
import { colors } from '@/constants/constants'

const HouseOverlayDevInfo = () => {
  const [open, setOpen] = useState(false)

  return (
    <View style={globalStyles.card}>

      <Pressable
        onPress={() => setOpen(!open)}
      >
        <Text style={globalStyles.sectionTitle}>
          🏠 House Overlay Engine
          {' '}
          {open ? '▲' : '▼'}
        </Text>
      </Pressable>

      {open && (
        <>

          <Text style={globalStyles.paragraph}>
            House overlays show
            where one person’s planets
            fall inside the other person’s houses.
          </Text>

          <Text style={globalStyles.paragraph}>
            This is one of the main techniques
            used in synastry astrology.
          </Text>

          <Text style={globalStyles.subTitle}>
            Core Idea
          </Text>

          <Text style={globalStyles.paragraph}>
            Every planet has:
          </Text>

          <Text style={globalStyles.bullet}>
            • a longitude
          </Text>

          <Text style={globalStyles.paragraph}>
            Every house also has:
          </Text>

          <Text style={globalStyles.bullet}>
            • a start longitude (cusp)
          </Text>

          <Text style={globalStyles.paragraph}>
            The engine checks
            between which house cusps
            the planet longitude exists.
          </Text>

          <Text style={globalStyles.subTitle}>
            Example
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`B chart cusps:

H1 = 20°
H2 = 50°
H3 = 80°

A Venus = 63°

Result:
A Venus falls in B House 2`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Interpretation:
          </Text>

          <Text style={globalStyles.paragraph}>
            the Venus themes of person A
            activate the life area
            represented by person B House 2.
          </Text>

          <Text style={globalStyles.subTitle}>
            Overlay Structure
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`{
  planet: 'Venus',

  fromChart: 'A',

  inHouseOf: 'B',

  house: 7
}`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            This means:
          </Text>

          <Text style={globalStyles.bullet}>
            • Venus belongs to chart A
          </Text>

          <Text style={globalStyles.bullet}>
            • it falls inside House 7 of chart B
          </Text>

          <Text style={globalStyles.subTitle}>
            Overlay Logic
          </Text>

          <Text style={globalStyles.paragraph}>
            The engine loops through:
          </Text>

          <Text style={globalStyles.bullet}>
            • planets from chart A
          </Text>

          <Text style={globalStyles.bullet}>
            • house cusps from chart B
          </Text>

          <Text style={globalStyles.paragraph}>
            and calculates:
          </Text>

          <Text style={globalStyles.bullet}>
            • which house contains the longitude
          </Text>

          <Text style={globalStyles.paragraph}>
            Then the process is repeated:
          </Text>

          <Text style={globalStyles.bullet}>
            • B planets into A houses
          </Text>

          <Text style={globalStyles.subTitle}>
            House Detection Logic
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`if (deg >= current && deg < next) {
  return i + 1
}`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Special handling exists
            for zodiac wrap-around:
          </Text>

          <Text style={globalStyles.bullet}>
            • 360° → 0°
          </Text>

          <Text style={globalStyles.paragraph}>
            because houses may cross Aries 0°.
          </Text>

          <Text style={globalStyles.subTitle}>
            UI Rendering
          </Text>

          <Text style={globalStyles.paragraph}>
            The overlay table displays:
          </Text>

          <Text style={globalStyles.bullet}>
            • source chart
          </Text>

          <Text style={globalStyles.bullet}>
            • planet
          </Text>

          <Text style={globalStyles.bullet}>
            • destination chart
          </Text>

          <Text style={globalStyles.bullet}>
            • target house
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`♀ A-Venus → B H7`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Usage
          </Text>

          <Text style={globalStyles.paragraph}>
            The overlay system is used for:
          </Text>

          <Text style={globalStyles.bullet}>
            • relationship attraction patterns
          </Text>

          <Text style={globalStyles.bullet}>
            • emotional activation
          </Text>

          <Text style={globalStyles.bullet}>
            • house emphasis
          </Text>

          <Text style={globalStyles.bullet}>
            • compatibility analysis
          </Text>

          <Text style={globalStyles.bullet}>
            • LLM synastry interpretation
          </Text>

        </>
      )}

    </View>
  )
}

export default HouseOverlayDevInfo

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
// astro-native/components/devInfoComponents/PlanetTableDevInfo.tsx

import {
  Pressable,
  Text,
  View,
  StyleSheet,
} from 'react-native'

import { useState } from 'react'
import { globalStyles } from '@/layout/global'
import { colors } from '@/constants/constants'

const PlanetTableDevInfo = () => {
  const [open, setOpen] = useState(false)

  return (
    <View style={globalStyles.card}>

      <Pressable onPress={() => setOpen(!open)}>
        <Text style={globalStyles.sectionTitle}>
          🪐 Planet / Sign / House Table
          {' '}
          {open ? '▲' : '▼'}
        </Text>
      </Pressable>

      {open && (
        <>
          <Text style={globalStyles.paragraph}>
            One of the most fundamental ideas in astrology
            is the interpretation of the:
          </Text>

          <Text style={globalStyles.bullet}>
            • planet
          </Text>

          <Text style={globalStyles.bullet}>
            • zodiac sign
          </Text>

          <Text style={globalStyles.bullet}>
            • astrological house
          </Text>

          <Text style={globalStyles.paragraph}>
            The interpretation logic can be simplified as:
          </Text>

          <Text style={globalStyles.bullet}>
            • Planet = what energy exists
          </Text>

          <Text style={globalStyles.bullet}>
            • Sign = how the energy behaves
          </Text>

          <Text style={globalStyles.bullet}>
            • House = where the energy manifests
          </Text>

          <Text style={globalStyles.paragraph}>
            Example:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`Venus in Gemini in House 10

Planet:
Venus → relationships, aesthetics, attraction

Sign:
Gemini → communication, curiosity, flexibility

House:
10th house → career, visibility, public image`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            This interpretation system is implemented
            through longitude calculations.
          </Text>

          <Text style={globalStyles.subTitle}>
            Longitude-Based Calculations
          </Text>

          <Text style={globalStyles.paragraph}>
            The astrology engine returns planetary longitudes
            between 0° and 360°.
          </Text>

          <Text style={globalStyles.paragraph}>
            Example:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`sun: {
  longitude: 43.67
}`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            The zodiac system divides the circle into
            12 equal sections of 30° each.
          </Text>

          <Text style={globalStyles.paragraph}>
            The application calculates the sign using:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`export const getZodiacSign = (deg: number) => {
  const index = Math.floor(deg / 30)
  return signs[index]
}`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Example:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`43.67° / 30 = 1.45

index = 1

signs[1] = Taurus`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            House Calculations
          </Text>

          <Text style={globalStyles.paragraph}>
            Houses are not fixed 30° segments.
          </Text>

          <Text style={globalStyles.paragraph}>
            Their size depends on:
          </Text>

          <Text style={globalStyles.bullet}>
            • latitude
          </Text>

          <Text style={globalStyles.bullet}>
            • time
          </Text>

          <Text style={globalStyles.bullet}>
            • selected house system
          </Text>

          <Text style={globalStyles.paragraph}>
            The astrology engine returns house cusps:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`houses: [
  { house: 1, longitude: 140.20 },
  { house: 2, longitude: 162.91 },
  { house: 3, longitude: 190.51 }
]`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            The application then dynamically checks
            between which cusps the planet longitude exists.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`if (deg >= current && deg < next) {
  return i + 1
}`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Special handling also exists for houses crossing
            the 360° → 0° Aries boundary.
          </Text>

          <Text style={globalStyles.subTitle}>
            UI Interaction
          </Text>

          <Text style={globalStyles.paragraph}>
            Each planet row is clickable.
          </Text>

          <Text style={globalStyles.paragraph}>
            Clicking opens a modal containing:
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
            Example implementation:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`<Pressable
  onPress={() => handlePress(
    p.name,
    sign,
    house
  )}
>
`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Keyword System
          </Text>

          <Text style={globalStyles.paragraph}>
            Interpretive keywords are stored
            in reusable constants objects:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`planetKeywords
signKeywords
houseKeywords`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            This allows reusable interpretations
            across charts, synastry and prediction systems.
          </Text>
        </>
      )}

    </View>
  )
}

export default PlanetTableDevInfo

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
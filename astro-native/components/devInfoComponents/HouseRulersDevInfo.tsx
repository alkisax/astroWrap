// astro-native/components/devInfoComponents/HouseRulersDevInfo.tsx

import {
  Pressable,
  Text,
  View,
  StyleSheet,
} from 'react-native'

import { useState } from 'react'
import { globalStyles } from '@/layout/global'
import { colors } from '@/constants/constants'

const HouseRulersDevInfo = () => {
  const [open, setOpen] = useState(false)

  return (
    <View style={globalStyles.card}>

      <Pressable onPress={() => setOpen(!open)}>
        <Text style={globalStyles.sectionTitle}>
          🏠 House Rulers System
          {' '}
          {open ? '▲' : '▼'}
        </Text>
      </Pressable>

      {open && (
        <>
          <Text style={globalStyles.paragraph}>
            House rulers connect houses,
            zodiac signs and planetary placements
            into a single interpretive chain.
          </Text>

          <Text style={globalStyles.subTitle}>
            Astrological Logic
          </Text>

          <Text style={globalStyles.paragraph}>
            Each house begins at a specific zodiac sign.
          </Text>

          <Text style={globalStyles.paragraph}>
            The ruler of that sign becomes
            the ruler of the house.
          </Text>

          <Text style={globalStyles.paragraph}>
            The interpretation then examines:
          </Text>

          <Text style={globalStyles.bullet}>
            • what house is being ruled
          </Text>

          <Text style={globalStyles.bullet}>
            • which planet rules it
          </Text>

          <Text style={globalStyles.bullet}>
            • where that ruler is located
          </Text>

          <Text style={globalStyles.subTitle}>
            Interpretation Formula
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`House
= life area

Ruler
= planetary expression

Ruler Position
= where the topic manifests`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Example:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`7th House = relationships

7th cusp in Taurus
→ ruler = Venus

Venus in Gemini H10

Interpretation:
relationships expressed through
communication and career`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Calculation Flow
          </Text>

          <Text style={globalStyles.paragraph}>
            The system starts from house cusp longitudes.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`houses = [
  {
    house: 1,
    longitude: 140.20
  },

  {
    house: 2,
    longitude: 162.91
  }
]`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Every cusp longitude
            is converted into a zodiac sign.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`const sign =
  getZodiacSign(cuspDeg)
`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Example:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`140.20°

→ Leo`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Sign → Planet Mapping
          </Text>

          <Text style={globalStyles.paragraph}>
            The application uses
            a centralized sign-to-ruler map.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`const signToPlanet = {
  Aries: 'Mars',
  Taurus: 'Venus',
  Gemini: 'Mercury',
  Cancer: 'Moon'
}`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Example:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`Leo

→ Sun`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Planet Lookup
          </Text>

          <Text style={globalStyles.paragraph}>
            The system then locates
            the actual planet object.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`const rulerData =
  planetMap[ruler]
`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Example:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`Sun: {
  longitude: 43.67
}`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Final Placement Calculation
          </Text>

          <Text style={globalStyles.paragraph}>
            The longitude of the ruler
            is converted into:
          </Text>

          <Text style={globalStyles.bullet}>
            • zodiac sign
          </Text>

          <Text style={globalStyles.bullet}>
            • astrological house
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`const inSign =
  getZodiacSign(
    rulerData.longitude
  )

const inHouse =
  getHouse(
    rulerData.longitude,
    cusps
  )
`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Example:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`Sun longitude:
43.67°

→ Taurus
→ House 10`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Final Result Object
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`{
  house: 1,
  sign: 'Leo',
  ruler: 'Sun',

  inSign: 'Taurus',
  inHouse: 10
}`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            UI Rendering
          </Text>

          <Text style={globalStyles.paragraph}>
            Each row displays:
          </Text>

          <Text style={globalStyles.bullet}>
            • house number
          </Text>

          <Text style={globalStyles.bullet}>
            • cusp sign
          </Text>

          <Text style={globalStyles.bullet}>
            • ruling planet
          </Text>

          <Text style={globalStyles.bullet}>
            • ruler placement
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`🏠 1 (♌ Leo)
→ ☉ Sun
♉ Taurus (H10)`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Modal Interpretation System
          </Text>

          <Text style={globalStyles.paragraph}>
            Clicking a row opens
            a detailed modal explanation.
          </Text>

          <Text style={globalStyles.paragraph}>
            The modal combines:
          </Text>

          <Text style={globalStyles.bullet}>
            • house meanings
          </Text>

          <Text style={globalStyles.bullet}>
            • planet meanings
          </Text>

          <Text style={globalStyles.bullet}>
            • sign meanings
          </Text>

          <Text style={globalStyles.paragraph}>
            These are loaded from centralized
            keyword systems:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`houseKeywords
planetKeywords
signKeywords`}
            </Text>
          </View>
        </>
      )}

    </View>
  )
}

export default HouseRulersDevInfo

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
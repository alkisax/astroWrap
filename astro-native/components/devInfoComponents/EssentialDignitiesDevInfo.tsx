// astro-native/components/devInfoComponents/EssentialDignitiesDevInfo.tsx

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { useState } from 'react'
import { globalStyles } from '@/layout/global'
import { colors } from '@/constants/constants'

const EssentialDignitiesDevInfo = () => {
  const [open, setOpen] = useState(false)

  return (
    <View style={globalStyles.card}>

      <Pressable onPress={() => setOpen(!open)}>
        <Text style={globalStyles.sectionTitle}>
          ⚖️ Essential Dignities System
          {' '}
          {open ? '▲' : '▼'}
        </Text>
      </Pressable>

      {open && (
        <>
          <Text style={globalStyles.paragraph}>
            Essential dignities evaluate
            how naturally or strongly
            a planet expresses itself
            inside a zodiac sign.
          </Text>

          <Text style={globalStyles.subTitle}>
            Astrological Logic
          </Text>

          <Text style={globalStyles.paragraph}>
            Traditional astrology considers
            some signs favorable or unfavorable
            for specific planets.
          </Text>

          <Text style={globalStyles.paragraph}>
            Four main dignity states are used:
          </Text>

          <Text style={globalStyles.bullet}>
            • domicile
          </Text>

          <Text style={globalStyles.bullet}>
            • exaltation
          </Text>

          <Text style={globalStyles.bullet}>
            • detriment
          </Text>

          <Text style={globalStyles.bullet}>
            • fall
          </Text>

          <Text style={globalStyles.subTitle}>
            Interpretation
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`domicile
= strongest natural expression

exaltation
= elevated / idealized expression

detriment
= weakened or conflicted expression

fall
= unstable or uncomfortable expression`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Example:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`Mars in Aries
→ domicile

Mars in Libra
→ detriment`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Planet Restriction
          </Text>

          <Text style={globalStyles.paragraph}>
            The component intentionally limits
            calculations to the 7 traditional planets.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`const planetsList = [
  'Sun',
  'Moon',
  'Mercury',
  'Venus',
  'Mars',
  'Jupiter',
  'Saturn',
]
`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Outer planets are excluded because
            essential dignity systems were originally
            designed before their discovery.
          </Text>

          <Text style={globalStyles.subTitle}>
            Longitude → Sign Conversion
          </Text>

          <Text style={globalStyles.paragraph}>
            Planetary longitude values
            are converted into zodiac signs.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`const sign =
  getZodiacSign(longitude)
`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Example:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`43.67°

→ Taurus`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Rule Tables
          </Text>

          <Text style={globalStyles.paragraph}>
            The application uses
            predefined rulership tables.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`domicile
exaltation
detriment
fall`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Example structure:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`const domicile = {
  Mars: ['Aries', 'Scorpio'],
  Venus: ['Taurus', 'Libra']
}
`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Dignity Calculation
          </Text>

          <Text style={globalStyles.paragraph}>
            The component checks the sign
            against every dignity table.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`if (
  domicile[planet]?.includes(sign)
) {
  return 'domicile'
}

if (
  exaltation[planet] === sign
) {
  return 'exaltation'
}

if (
  detriment[planet]?.includes(sign)
) {
  return 'detriment'
}

if (
  fall[planet] === sign
) {
  return 'fall'
}

return 'neutral'
`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Visual Metadata System
          </Text>

          <Text style={globalStyles.paragraph}>
            Every dignity type
            has associated UI metadata.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`const dignityMeta = {
  domicile: {
    emoji: '⭐',
    color: '#ffd43b'
  },

  detriment: {
    emoji: '⚠️',
    color: '#ff6b6b'
  }
}
`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            This metadata controls:
          </Text>

          <Text style={globalStyles.bullet}>
            • colors
          </Text>

          <Text style={globalStyles.bullet}>
            • emoji icons
          </Text>

          <Text style={globalStyles.bullet}>
            • rendered labels
          </Text>

          <Text style={globalStyles.subTitle}>
            Final Result Object
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`{
  planet: 'Mars',

  sign: 'Aries',

  dignity: 'domicile',

  meta: {
    emoji: '⭐',
    color: '#ffd43b'
  }
}`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Rendered UI Example
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`♂ Mars
♈ Aries
⭐ domicile`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Modal Explanation System
          </Text>

          <Text style={globalStyles.paragraph}>
            Clicking the card opens
            a detailed modal explanation.
          </Text>

          <Text style={globalStyles.paragraph}>
            The modal explains:
          </Text>

          <Text style={globalStyles.bullet}>
            • what dignities are
          </Text>

          <Text style={globalStyles.bullet}>
            • how they are calculated
          </Text>

          <Text style={globalStyles.bullet}>
            • interpretive meaning
          </Text>

          <Text style={globalStyles.bullet}>
            • practical examples
          </Text>

          <Text style={globalStyles.subTitle}>
            Performance Optimization
          </Text>

          <Text style={globalStyles.paragraph}>
            Calculations are memoized
            using useMemo().
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`const dignityRows =
  useMemo(() => {
    ...
  }, [planetMap])
`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            This prevents unnecessary
            recalculation during re-renders.
          </Text>
        </>
      )}

    </View>
  )
}

export default EssentialDignitiesDevInfo

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
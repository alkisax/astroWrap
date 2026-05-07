// astro-native/components/devInfoComponents/MostImportantAspectsDevInfo.tsx

import {
  Pressable,
  Text,
  View,
  StyleSheet,
} from 'react-native'

import { useState } from 'react'
import { globalStyles } from '@/layout/global'
import { colors } from '@/constants/constants'

const MostImportantAspectsDevInfo = () => {
  const [open, setOpen] = useState(false)

  return (
    <View style={globalStyles.card}>

      <Pressable onPress={() => setOpen(!open)}>
        <Text style={globalStyles.sectionTitle}>
          🔗 Aspect System
          {' '}
          {open ? '▲' : '▼'}
        </Text>
      </Pressable>

      {open && (
        <>
          <Text style={globalStyles.paragraph}>
            Aspects are angular relationships
            between planets.
          </Text>

          <Text style={globalStyles.paragraph}>
            They are one of the most important
            calculation systems in astrology.
          </Text>

          <Text style={globalStyles.paragraph}>
            The application calculates:
          </Text>

          <Text style={globalStyles.bullet}>
            • planetary angular distance
          </Text>

          <Text style={globalStyles.bullet}>
            • matching aspect type
          </Text>

          <Text style={globalStyles.bullet}>
            • orb distance from exactness
          </Text>

          <Text style={globalStyles.subTitle}>
            Astrological Interpretation
          </Text>

          <Text style={globalStyles.paragraph}>
            Aspects describe how planetary energies interact.
          </Text>

          <Text style={globalStyles.bullet}>
            ☌ conjunction → merging / amplification
          </Text>

          <Text style={globalStyles.bullet}>
            △ trine → harmony / natural flow
          </Text>

          <Text style={globalStyles.bullet}>
            □ square → tension / friction
          </Text>

          <Text style={globalStyles.bullet}>
            ☍ opposition → polarity / projection
          </Text>

          <Text style={globalStyles.bullet}>
            ✶ sextile → opportunity / cooperation
          </Text>

          <Text style={globalStyles.subTitle}>
            Example Interpretation
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`Moon square Mars

Moon:
emotion, sensitivity

Mars:
action, aggression

Square:
friction / tension

→ emotional impulsiveness`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Longitude-Based Calculation
          </Text>

          <Text style={globalStyles.paragraph}>
            Every planet has a longitude value
            between 0° and 360°.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`sun.longitude = 43.67
moon.longitude = 163.12`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            The system calculates
            the angular distance:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`distance =
  abs(
    planet1 - planet2
  )`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Example:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`abs(43.67 - 163.12)

= 119.45°`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            The system then compares
            this angle against aspect targets.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`0°   = conjunction
60°  = sextile
90°  = square
120° = trine
180° = opposition`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            In the previous example:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`119.45°

≈ 120°

→ trine`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Orb Calculation
          </Text>

          <Text style={globalStyles.paragraph}>
            Orb measures how close
            the aspect is to exactness.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`orb =
  abs(
    actualAngle - exactAspect
  )`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Example:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`120° - 119.45°

= 0.55° orb`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Smaller orb values are generally interpreted
            as stronger aspects.
          </Text>

          <Text style={globalStyles.subTitle}>
            Final Aspect Object
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`{
  point1: 'Moon',
  point2: 'Mars',
  type: 'square',
  orb: 1.02
}`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            UI Rendering
          </Text>

          <Text style={globalStyles.paragraph}>
            The component renders aspects
            as interactive rows.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`<Pressable
  onPress={() =>
    setSelected({
      p1: a.point1,
      p2: a.point2,
      type: a.type,
    })
  }
>
`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Clicking an aspect opens
            a modal containing:
          </Text>

          <Text style={globalStyles.bullet}>
            • planet keywords
          </Text>

          <Text style={globalStyles.bullet}>
            • aspect meaning
          </Text>

          <Text style={globalStyles.bullet}>
            • interpretive descriptions
          </Text>

          <Text style={globalStyles.subTitle}>
            Interpretation Architecture
          </Text>

          <Text style={globalStyles.paragraph}>
            The modal reuses centralized keyword systems:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`planetKeywords
aspectKeywords
aspectIcons`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            This allows reusable interpretation logic
            across natal, synastry and transit systems.
          </Text>
        </>
      )}

    </View>
  )
}

export default MostImportantAspectsDevInfo

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
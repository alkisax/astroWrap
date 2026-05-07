// astro-native/components/devInfoComponents/BiwheelDevInfo.tsx

import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native'

import { useState } from 'react'

import { globalStyles } from '@/layout/global'
import { colors } from '@/constants/constants'

const BiwheelDevInfo = () => {
  const [open, setOpen] = useState(false)

  return (
    <View style={globalStyles.card}>

      <Pressable
        onPress={() => setOpen(!open)}
      >
        <Text style={globalStyles.sectionTitle}>
          💞 Biwheel / Transit Aspect Engine
          {' '}
          {open ? '▲' : '▼'}
        </Text>
      </Pressable>

      {open && (
        <>

          <Text style={globalStyles.paragraph}>
            Astro Lark compares two charts
            using longitude-to-longitude angular calculations.
          </Text>

          <Text style={globalStyles.paragraph}>
            The same engine is used for:
          </Text>

          <Text style={globalStyles.bullet}>
            • synastry
          </Text>

          <Text style={globalStyles.bullet}>
            • transits
          </Text>

          <Text style={globalStyles.bullet}>
            • prediction grids
          </Text>

          <Text style={globalStyles.bullet}>
            • Eagle / Lark style aspect scanning
          </Text>

          <Text style={globalStyles.subTitle}>
            Core Idea
          </Text>

          <Text style={globalStyles.paragraph}>
            Every planet is converted into a longitude value
            between 0° and 360°.
          </Text>

          <Text style={globalStyles.paragraph}>
            The engine compares:
          </Text>

          <Text style={globalStyles.bullet}>
            • transit planets
          </Text>

          <Text style={globalStyles.bullet}>
            • natal planets
          </Text>

          <Text style={globalStyles.paragraph}>
            and checks if the angular distance
            matches an aspect definition.
          </Text>

          <Text style={globalStyles.subTitle}>
            Aspect Formula
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`const angleDiff = (a: number, b: number) => {
  let diff = Math.abs(a - b)

  if (diff > 180) {
    diff = 360 - diff
  }

  return diff
}`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Example:
          </Text>

          <Text style={globalStyles.bullet}>
            • Sun = 10°
          </Text>

          <Text style={globalStyles.bullet}>
            • Moon = 130°
          </Text>

          <Text style={globalStyles.bullet}>
            • difference = 120°
          </Text>

          <Text style={globalStyles.paragraph}>
            120° matches a trine aspect.
          </Text>

          <Text style={globalStyles.subTitle}>
            Aspect Definitions
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`[
  {
    type: 'conjunction',
    angle: 0,
    orb: 8
  },

  {
    type: 'square',
    angle: 90,
    orb: 6
  },

  {
    type: 'trine',
    angle: 120,
    orb: 6
  }
]`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            The engine calculates:
          </Text>

          <Text style={globalStyles.bullet}>
            • exact angular distance
          </Text>

          <Text style={globalStyles.bullet}>
            • closest aspect
          </Text>

          <Text style={globalStyles.bullet}>
            • orb difference
          </Text>

          <Text style={globalStyles.paragraph}>
            and stores the result as:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`{
  point1Label: 'T-Saturn',
  point2Label: 'N-Moon',

  type: 'square',
  orb: 1.22
}`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Transit Grid
          </Text>

          <Text style={globalStyles.paragraph}>
            The transit grid converts
            all aspect results into a matrix.
          </Text>

          <Text style={globalStyles.paragraph}>
            Rows:
          </Text>

          <Text style={globalStyles.bullet}>
            • transit planets
          </Text>

          <Text style={globalStyles.paragraph}>
            Columns:
          </Text>

          <Text style={globalStyles.bullet}>
            • natal planets
          </Text>

          <Text style={globalStyles.paragraph}>
            Each cell contains:
          </Text>

          <Text style={globalStyles.bullet}>
            • conjunction
          </Text>

          <Text style={globalStyles.bullet}>
            • square
          </Text>

          <Text style={globalStyles.bullet}>
            • trine
          </Text>

          <Text style={globalStyles.bullet}>
            • opposition
          </Text>

          <Text style={globalStyles.paragraph}>
            or remains empty if no aspect exists.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`{
  rows: ['Sun', 'Moon', 'Mars'],

  cols: ['Sun', 'Moon', 'Mars'],

  grid: [
    ['☌', '', '△'],
    ['', '□', ''],
    ['☍', '', '']
  ]
}`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Filtering
          </Text>

          <Text style={globalStyles.paragraph}>
            Before rendering,
            aspects are filtered by:
          </Text>

          <Text style={globalStyles.bullet}>
            • maximum orb
          </Text>

          <Text style={globalStyles.bullet}>
            • duplicate removal
          </Text>

          <Text style={globalStyles.bullet}>
            • allowed planets
          </Text>

          <Text style={globalStyles.bullet}>
            • sorting by orb strength
          </Text>

          <Text style={globalStyles.subTitle}>
            Transit Interpretation Logic
          </Text>

          <Text style={globalStyles.paragraph}>
            The prediction system later groups
            these aspects by thematic categories:
          </Text>

          <Text style={globalStyles.bullet}>
            • career
          </Text>

          <Text style={globalStyles.bullet}>
            • relationships
          </Text>

          <Text style={globalStyles.bullet}>
            • emotional state
          </Text>

          <Text style={globalStyles.bullet}>
            • change
          </Text>

          <Text style={globalStyles.paragraph}>
            before sending them into the LLM layer.
          </Text>

        </>
      )}

    </View>
  )
}

export default BiwheelDevInfo

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
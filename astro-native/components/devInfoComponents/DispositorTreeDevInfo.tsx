// astro-native/components/devInfoComponents/DispositorTreeDevInfo.tsx

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { useState } from 'react'
import { globalStyles } from '@/layout/global'
import { colors } from '@/constants/constants'

const DispositorTreeDevInfo = () => {
  const [open, setOpen] = useState(false)

  return (
    <View style={globalStyles.card}>

      <Pressable onPress={() => setOpen(!open)}>
        <Text style={globalStyles.sectionTitle}>
          🌳 Dispositor Tree & Chart Dynamics
          {' '}
          {open ? '▲' : '▼'}
        </Text>
      </Pressable>

      {open && (
        <>
          <Text style={globalStyles.paragraph}>
            The dispositor system tracks
            how planetary energy flows
            through rulership chains.
          </Text>

          <Text style={globalStyles.paragraph}>
            Every planet is placed in a sign.
            Every sign has a ruler.
          </Text>

          <Text style={globalStyles.paragraph}>
            By repeatedly following sign rulers,
            the application builds
            a dispositor chain.
          </Text>

          <Text style={globalStyles.subTitle}>
            Astrological Logic
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`planet
→ sign
→ ruler
→ ruler sign
→ next ruler
→ ...`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            This creates:
          </Text>

          <Text style={globalStyles.bullet}>
            • final dispositors
          </Text>

          <Text style={globalStyles.bullet}>
            • loops
          </Text>

          <Text style={globalStyles.bullet}>
            • mutual receptions
          </Text>

          <Text style={globalStyles.subTitle}>
            Example Chain
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`Mars in Gemini
→ ruler Mercury

Mercury in Taurus
→ ruler Venus

Venus in Libra
→ ruler Venus

Result:
Mars → Mercury → Venus ⭐`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Venus becomes the final dispositor
            because it rules itself.
          </Text>

          <Text style={globalStyles.subTitle}>
            Planet Mapping
          </Text>

          <Text style={globalStyles.paragraph}>
            The application first creates
            a centralized planet map.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`const planets = {
  Sun: data.sun,
  Moon: data.moon,
  Mercury: data.mercury,
  Venus: data.venus
}
`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            This provides quick access
            to every planetary placement.
          </Text>

          <Text style={globalStyles.subTitle}>
            Core Chain Algorithm
          </Text>

          <Text style={globalStyles.paragraph}>
            The chain calculation starts
            from a selected planet.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`let current = startPlanet
`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            The system repeatedly:
          </Text>

          <Text style={globalStyles.bullet}>
            • reads the planet sign
          </Text>

          <Text style={globalStyles.bullet}>
            • finds the sign ruler
          </Text>

          <Text style={globalStyles.bullet}>
            • moves to the next ruler
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`const placement =
  planets[current]

const ruler =
  signToPlanet[placement.sign]

chain.push(ruler)

current = ruler
`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Loop Detection
          </Text>

          <Text style={globalStyles.paragraph}>
            A visited[] array
            prevents infinite recursion.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`if (
  visited.includes(current)
) {
  return {
    type: 'loop'
  }
}
`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Example loop:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`Mars
→ Venus
→ Mars

🔁 loop`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Final Dispositor Detection
          </Text>

          <Text style={globalStyles.paragraph}>
            A final dispositor occurs
            when a planet rules itself.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`if (ruler === current) {
  return {
    type: 'final'
  }
}
`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Example:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`Venus in Libra

Libra ruler
→ Venus

⭐ final dispositor`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Mutual Reception Detection
          </Text>

          <Text style={globalStyles.paragraph}>
            Mutual receptions happen
            when two planets occupy
            each other’s signs.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`Venus in Aries
→ Mars rules Aries

Mars in Taurus
→ Venus rules Taurus

Result:
Venus ⇄ Mars`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            The algorithm checks:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`ruler(sign1)
→ planet2

ruler(sign2)
→ planet1
`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Duplicate Cleanup
          </Text>

          <Text style={globalStyles.paragraph}>
            Mutual receptions can appear twice:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`Venus ⇄ Mars
Mars ⇄ Venus`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            A Set() removes duplicates.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`new Set(
  receptions.map(...)
)
`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Chart Dynamics Summary
          </Text>

          <Text style={globalStyles.paragraph}>
            The application extracts:
          </Text>

          <Text style={globalStyles.bullet}>
            • backbone planets
          </Text>

          <Text style={globalStyles.bullet}>
            • dominant loops
          </Text>

          <Text style={globalStyles.bullet}>
            • mutual receptions
          </Text>

          <Text style={globalStyles.paragraph}>
            These summarize overall
            chart control structure.
          </Text>

          <Text style={globalStyles.subTitle}>
            Example Output
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`{
  planet: 'Mars',

  result: {
    chain: [
      'Mercury',
      'Venus'
    ],

    type: 'final'
  }
}`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            UI Rendering
          </Text>

          <Text style={globalStyles.paragraph}>
            Chains are rendered visually
            using arrows and icons.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`♂ Mars
→ ☿ Mercury
→ ♀ Venus ⭐`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Loops display a loop marker:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`♂ Mars
⇄ ♀ Venus`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Modal Explanation System
          </Text>

          <Text style={globalStyles.paragraph}>
            Clicking a chain row
            opens a detailed modal.
          </Text>

          <Text style={globalStyles.paragraph}>
            The modal explains:
          </Text>

          <Text style={globalStyles.bullet}>
            • full dispositor chain
          </Text>

          <Text style={globalStyles.bullet}>
            • final dispositors
          </Text>

          <Text style={globalStyles.bullet}>
            • loops
          </Text>

          <Text style={globalStyles.bullet}>
            • chart dynamics interpretation
          </Text>

          <Text style={globalStyles.subTitle}>
            Performance Optimization
          </Text>

          <Text style={globalStyles.paragraph}>
            Heavy calculations are memoized
            using useMemo().
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`const results =
  useMemo(
    () => getAllDispositors(data),
    [data]
  )
`}
            </Text>
          </View>
        </>
      )}

    </View>
  )
}

export default DispositorTreeDevInfo

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
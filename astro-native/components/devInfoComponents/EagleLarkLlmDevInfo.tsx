// astro-native/components/devInfoComponents/EagleLarkLlmDevInfo.tsx

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { useState } from 'react'

import { colors } from '@/constants/constants'
import { globalStyles } from '@/layout/global'

const EagleLarkLlmDevInfo = () => {
  const [open, setOpen] = useState(false)

  return (
    <View style={globalStyles.card}>

      <Pressable onPress={() => setOpen(!open)}>
        <Text style={globalStyles.sectionTitle}>
          🦅 Eagle / Lark Prediction Engine {open ? '▲' : '▼'}
        </Text>
      </Pressable>

      {open && (
        <ScrollView showsVerticalScrollIndicator={false}>

          <Text style={globalStyles.paragraph}>
            Astro Lark includes an experimental predictive astrology system
            inspired by Bernadette Brady’s
            “The Eagle and the Lark”.
          </Text>

          <Text style={globalStyles.paragraph}>
            Instead of interpreting transits
            as isolated “good” or “bad” aspects,
            the system tries to model:
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`cause → event → effect`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            The idea is:
            a transit starts from one area of life,
            manifests somewhere else,
            and then creates secondary consequences.
          </Text>

          <Text style={globalStyles.subTitle}>
            Eagle / Lark Grid Logic
          </Text>

          <Text style={globalStyles.paragraph}>
            Every transit aspect is transformed
            into a structured prediction grid.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`{
  transitPlanet: 'Saturn',
  natalPlanet: 'Sun',
  aspect: 'square',

  cause: {
    transitNatalHouse: 10,
    natalHouse: 4,
  },

  action: {
    transitHouse: 7,
  },

  effect: {
    transitRules: [5, 6],
    natalRules: [12],
  },
}`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Cause → Event → Effect
          </Text>

          <Text style={globalStyles.bullet}>
            • Cause:
            where the issue begins psychologically or structurally
          </Text>

          <Text style={globalStyles.bullet}>
            • Event:
            where the transit manifests externally
          </Text>

          <Text style={globalStyles.bullet}>
            • Effect:
            secondary life areas influenced afterward
          </Text>

          <Text style={globalStyles.paragraph}>
            This creates a more narrative interpretation model,
            closer to real-life event chains.
          </Text>

          <Text style={globalStyles.subTitle}>
            How Charts Are Generated
          </Text>

          <Text style={globalStyles.paragraph}>
            Natal and transit charts are first calculated
            using astronomy / astrology libraries
            before any LLM interpretation happens.
          </Text>

          <Text style={globalStyles.paragraph}>
            The system computes:
          </Text>

          <Text style={globalStyles.bullet}>
            • planetary longitudes
          </Text>

          <Text style={globalStyles.bullet}>
            • zodiac signs
          </Text>

          <Text style={globalStyles.bullet}>
            • houses
          </Text>

          <Text style={globalStyles.bullet}>
            • aspects
          </Text>

          <Text style={globalStyles.bullet}>
            • house rulers
          </Text>

          <Text style={globalStyles.bullet}>
            • dispositors
          </Text>

          <Text style={globalStyles.bullet}>
            • dignities
          </Text>

          <Text style={globalStyles.bullet}>
            • balance statistics
          </Text>

          <Text style={globalStyles.paragraph}>
            The LLM does NOT calculate astrology itself.
          </Text>

          <Text style={globalStyles.paragraph}>
            The backend calculates astrology first,
            then sends structured symbolic data to the model.
          </Text>

          <Text style={globalStyles.subTitle}>
            Two-Chart Transit Engine
          </Text>

          <Text style={globalStyles.paragraph}>
            Transit aspects are calculated
            by comparing angular distances
            between the natal chart
            and another moment in time.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`const diff =
  angleDiff(
    transit.longitude,
    radix.longitude,
  )

const orb =
  Math.abs(
    diff - aspect.angle,
  )

if (orb <= maxOrb) {
  results.push({
    type: aspect.type,
    orb,
  })
}`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Tight aspects receive higher priority,
            while loose aspects are filtered out.
          </Text>

          <Text style={globalStyles.subTitle}>
            Grid Construction
          </Text>

          <Text style={globalStyles.paragraph}>
            Each detected aspect is transformed
            into an Eagle/Lark interpretation grid.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`return {
  transitPlanet: tName,
  natalPlanet: nName,

  cause: {
    transitNatalHouse:
      tNatal?.house,

    natalHouse:
      nNatal?.house,
  },

  action: {
    transitHouse:
      tTransit?.house,
  },

  effect: {
    transitRules:
      getRuledHouses(
        radix,
        tName,
      ),

    natalRules:
      getRuledHouses(
        radix,
        nName,
      ),
  },
}`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Question-Based Prediction System
          </Text>

          <Text style={globalStyles.paragraph}>
            The user can optionally guide the prediction engine
            by selecting topics
            and asking a custom question.
          </Text>

          <Text style={globalStyles.paragraph}>
            Example topics:
          </Text>

          <Text style={globalStyles.bullet}>
            • career
          </Text>

          <Text style={globalStyles.bullet}>
            • money
          </Text>

          <Text style={globalStyles.bullet}>
            • relationships
          </Text>

          <Text style={globalStyles.bullet}>
            • emotional state
          </Text>

          <Text style={globalStyles.bullet}>
            • life changes
          </Text>

          <Text style={globalStyles.paragraph}>
            This helps narrow the interpretation focus
            instead of generating generic transit readings.
          </Text>

          <Text style={globalStyles.subTitle}>
            LLM Prompt Design
          </Text>

          <Text style={globalStyles.paragraph}>
            The backend sends:
          </Text>

          <Text style={globalStyles.bullet}>
            • user question
          </Text>

          <Text style={globalStyles.bullet}>
            • natal baseline
          </Text>

          <Text style={globalStyles.bullet}>
            • transit chart
          </Text>

          <Text style={globalStyles.bullet}>
            • Eagle/Lark grids
          </Text>

          <Text style={globalStyles.paragraph}>
            Instead of sending raw chart dumps,
            the backend preprocesses and compresses the data
            into symbolic predictive structures.
          </Text>

          <Text style={globalStyles.subTitle}>
            Prediction Prompt
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`You are an expert astrologer
specializing in predictive astrology.

TASK:

1. VERY BRIEF NATAL CONTEXT

2. IDENTIFY MAIN THEMES
- repeated houses
- repeated planets
- low orb aspects

3. INTERPRET USING:
cause → event → result

4. ANSWER THE QUESTION DIRECTLY

5. REAL-LIFE EXPRESSION

6. FINAL ANSWER`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Why This Architecture
          </Text>

          <Text style={globalStyles.bullet}>
            • astrology calculations stay deterministic
          </Text>

          <Text style={globalStyles.bullet}>
            • LLM focuses on interpretation only
          </Text>

          <Text style={globalStyles.bullet}>
            • smaller token usage
          </Text>

          <Text style={globalStyles.bullet}>
            • structured predictive reasoning
          </Text>

          <Text style={globalStyles.bullet}>
            • reusable symbolic transit grids
          </Text>

          <Text style={globalStyles.bullet}>
            • easier future migration between LLM providers
          </Text>

          <Text style={globalStyles.bullet}>
            • combines traditional astrology logic
            with modern NLP summarization
          </Text>

          <Text style={globalStyles.subTitle}>
            Current LLM Backend
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`const OPENAI_URL =
  'https://api.deepseek.com/chat/completions'

const MODEL =
  'deepseek-chat'`}
            </Text>
          </View>

        </ScrollView>
      )}

    </View>
  )
}

export default EagleLarkLlmDevInfo

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
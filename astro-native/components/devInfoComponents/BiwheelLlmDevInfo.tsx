// astro-native/components/devInfoComponents/BiwheelLlmDevInfo.tsx

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { useState } from 'react'

import { globalStyles } from '@/layout/global'
import { colors } from '@/constants/constants'

const BiwheelLlmDevInfo = () => {
  const [open, setOpen] = useState(false)

  return (
    <View style={globalStyles.card}>

      <Pressable onPress={() => setOpen(!open)}>
        <Text style={globalStyles.sectionTitle}>
          💞 Relationship / Biwheel LLM Pipeline {open ? '▲' : '▼'}
        </Text>
      </Pressable>

      {open && (
        <>
          <Text style={globalStyles.paragraph}>
            The relationship analysis system uses a compact synastry payload
            instead of sending two full raw charts directly to the LLM.
          </Text>

          <Text style={globalStyles.paragraph}>
            Astro Lark preprocesses the relationship dynamics first,
            calculates compatibility scores,
            filters important interactions,
            and only then sends structured data to the model.
          </Text>

          <Text style={globalStyles.subTitle}>
            Synastry Payload
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`{
  chartA: {
    planets: [
      { planet: 'Sun', sign: 'Taurus', house: 9 },
      { planet: 'Moon', sign: 'Capricorn', house: 5 }
    ],

    chartRuler: {
      planet: 'Sun',
      sign: 'Taurus',
      house: 9
    }
  },

  chartB: {
    planets: [
      { planet: 'Sun', sign: 'Cancer', house: 7 },
      { planet: 'Moon', sign: 'Pisces', house: 3 }
    ]
  },

  cross: {
    aspects: [
      {
        point1Label: 'T-Sun',
        point2Label: 'N-Moon',
        type: 'trine',
        orb: 2.77
      },

      {
        point1Label: 'T-Moon',
        point2Label: 'N-Mars',
        type: 'square',
        orb: 1.64
      }
    ],

    overlay: {
      A: [
        {
          planet: 'Venus',
          house: 7
        }
      ],

      B: [
        {
          planet: 'Moon',
          house: 4
        }
      ]
    }
  }
}`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Compatibility Payload
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`{
  scores: {
    attraction: 0.07,
    emotional: 1.12,
    communication: 5,
    stability: 5,
    overall: 0
  },

  explanations: {
    attraction: [
      {
        type: 'aspect',
        text:
          'Moon-Venus/Mars (romantic/emotional attraction): moon square mars',
        score: -2.49
      }
    ],

    emotional: [
      {
        type: 'aspect',
        text:
          'Moon-Sun (core emotional bond): sun trine moon',
        score: 1.16
      }
    ]
  }
}`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Relationship Prompt
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`You are an expert astrologer specializing in relationship analysis.

IMPORTANT:
- Write in clear, modern English
- Keep the explanation understandable for a non-expert
- Use common astrology terms in English:
  (signs, planets, houses)

INPUT:

SYNASRY:
\${JSON.stringify(synastry)}

COMPATIBILITY:
\${JSON.stringify(compatibility)}

-----------------------------------

TASK:

1. BASIC PERSONALITY MATCH
- Compare Suns, Moons, Ascendants

2. EMOTIONAL NATURE
- Start from Moon signs

3. ATTRACTION STYLE
- Venus & Mars dynamics

4. HOW THEY INTERACT
- Use overlays (houses)

5. KEY ASPECTS
- Focus on strongest

6. CORE PATTERN

7. CHALLENGES

8. FINAL SUMMARY`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Compatibility Engine
          </Text>

          <Text style={globalStyles.paragraph}>
            Before the LLM call,
            the backend calculates compatibility scores
            using weighted astrology rules.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`const aspectWeights = {
  conjunction: 3,
  trine: 2,
  sextile: 1.5,
  square: -2,
  opposition: -2.5,
}`}

            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Tight aspects receive stronger influence,
            while loose aspects are ignored after a cutoff.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`const scoreAspect = (
  type?: string,
  orb?: number,
) => {

  const base =
    aspectWeights[type ?? ''] ?? 0

  if ((orb ?? 10) > 3) {
    return 0
  }

  const orbPenalty =
    (orb ?? 5) * 0.3

  return base - orbPenalty
}`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Overlay Rules
          </Text>

          <Text style={globalStyles.paragraph}>
            House overlays also contribute to compatibility scoring.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`if (
  (p === 'venus' || p === 'mars')
  && h === 7
) {
  return {
    type: 'attraction',
    score: 2,
  }
}

if (
  p === 'moon'
  && (h === 4 || h === 7)
) {
  return {
    type: 'emotional',
    score: 2,
  }
}`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Two-Chart Aspect Engine
          </Text>

          <Text style={globalStyles.paragraph}>
            Synastry aspects are calculated by comparing
            angular distances between chart A and chart B points.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`const diff =
  angleDiff(
    transit.longitude,
    radix.longitude
  )

const orb =
  Math.abs(diff - asp.angle)

if (orb <= maxOrb) {
  results.push({
    type: asp.type,
    orb,
  })
}`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            DeepSeek Integration
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`const OPENAI_URL =
  'https://api.deepseek.com/chat/completions'

const MODEL =
  'deepseek-chat'`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Why This Design
          </Text>

          <Text style={globalStyles.bullet}>
            • preprocesses compatibility before LLM usage
          </Text>

          <Text style={globalStyles.bullet}>
            • reduces token usage
          </Text>

          <Text style={globalStyles.bullet}>
            • keeps astrology calculations deterministic
          </Text>

          <Text style={globalStyles.bullet}>
            • separates calculation from interpretation
          </Text>

          <Text style={globalStyles.bullet}>
            • allows reusable structured compatibility scoring
          </Text>

          <Text style={globalStyles.bullet}>
            • improves consistency between different LLM providers
          </Text>
        </>
      )}

    </View>
  )
}

export default BiwheelLlmDevInfo

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
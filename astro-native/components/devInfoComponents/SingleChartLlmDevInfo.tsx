// astro-native/components/devInfoComponents/SingleChartLlmDevInfo.tsx

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { useState } from 'react'
import { globalStyles } from '@/layout/global'
import { colors } from '@/constants/constants'

const SingleChartLlmDevInfo = () => {
  const [open, setOpen] = useState(false)

  return (
    <View style={globalStyles.card}>
      <Pressable onPress={() => setOpen(!open)}>
        <Text style={globalStyles.sectionTitle}>
          🤖 Single Chart LLM Pipeline {open ? '▲' : '▼'}
        </Text>
      </Pressable>

      {open && (
        <>
          <Text style={globalStyles.paragraph}>
            The Single Chart LLM does not receive the full raw chart object.
            Instead, Astro Lark creates a compact payload with only the most
            useful astrological information.
          </Text>

          <Text style={globalStyles.paragraph}>
            This keeps the request smaller, easier to control, and less noisy
            for the model.
          </Text>

          <Text style={globalStyles.subTitle}>
            Compact Payload Example
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`{
  meta: {
    date: '2026-05-07T10:46:17.756Z',
    location: {
      lat: 37.9838,
      lng: 23.7275
    },
    zodiac: 'tropical',
    houseSystem: 'placidus'
  },

  planets: [
    { planet: 'Sun', sign: 'Taurus', house: 9 },
    { planet: 'ASC', sign: 'Leo', house: 1 },
    { planet: 'Moon', sign: 'Capricorn', house: 5 },
    { planet: 'Mercury', sign: 'Taurus', house: 9 },
    { planet: 'Venus', sign: 'Gemini', house: 10 },
    { planet: 'Mars', sign: 'Aries', house: 9 },
    { planet: 'Jupiter', sign: 'Cancer', house: 11 },
    { planet: 'Saturn', sign: 'Aries', house: 8 }
  ],

  balance: {
    elements: {
      Fire: 3,
      Earth: 3,
      Air: 3,
      Water: 1
    },
    modalities: {
      Cardinal: 5,
      Fixed: 3,
      Mutable: 2
    }
  },

  chartRuler: {
    planet: 'Sun',
    sign: 'Taurus',
    house: 9
  },

  aspects: [
    {
      point1: 'moon',
      point2: 'jupiter',
      type: 'opposition',
      orb: 0.21
    },
    {
      point1: 'mars',
      point2: 'jupiter',
      type: 'square',
      orb: 1.44
    }
  ],

  dignities: [
    { planet: 'mars', dignity: 'domicile' },
    { planet: 'jupiter', dignity: 'exaltation' },
    { planet: 'saturn', dignity: 'fall' }
  ],

  dispositors: {
    backbone: ['mars'],
    loops: ['venus', 'mercury']
  }
}`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Backend LLM Service
          </Text>

          <Text style={globalStyles.paragraph}>
            The backend receives this compact chart data and injects it into a
            structured astrology prompt.
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`const OPENAI_URL =
  'https://api.openai.com/v1/chat/completions'

const MODEL = 'gpt-4o-mini'

// DeepSeek can also be used by changing:
// OPENAI_URL = 'https://api.deepseek.com/chat/completions'
// MODEL = 'deepseek-chat'`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Full Prompt
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`You are an expert astrologer. Analyze the following natal chart data and provide a structured, clear interpretation.

IMPORTANT:
- Write in clear, modern English
- Keep the explanation understandable for a non-expert
- Use standard astrology terms in English:
  (signs, planets, houses)
- For technical astrology terms (especially aspects),
  use standard English terminology:
  (e.g. conjunction, square, trine, opposition, sextile, aspects, chart)
- When introducing a technical term, briefly explain it in simple terms the first time it appears
- Write in a way understandable to a general audience (not overly technical at first)
- Build interpretation step-by-step (from simple → advanced)
- Refer to the person as "the chart native"
- Use natural language, not bullet-point dumping
- Base everything strictly on the provided data

- Focus on psychological and behavioral interpretation
- Describe how the person thinks, feels, and acts in real life
- Prefer "how this shows up in daily behavior" over abstract meanings
- Avoid textbook-style definitions of planets/signs
- Instead of describing what something "means",
  explain how it is experienced and expressed
- When possible, describe:
  → reactions
  → habits
  → relationship patterns
  → inner conflicts
  → decision-making style
- Make the interpretation feel like a real person, not a concept

STEP 1 — CORE PERSONALITY

1. Ascendant (ASC)
2. Sun sign
3. Moon sign

Explain how these combine.

---

STEP 2 — PLANETARY EXPRESSIONS

For each planet:
Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn

Explain:
- planet meaning
- sign expression
- house manifestation

---

STEP 3 — STRUCTURE & BALANCE

- Elements
- Modalities
- House emphasis

---

STEP 4 — KEY ASPECTS

- Interpret strongest aspects
- Focus on meaning, not listing

---

STEP 5 — REFINEMENT

- Chart ruler
- Dignities
- Dispositors

---

FINAL:
Write as a coherent interpretation.

---

CHART DATA:
\${JSON.stringify(chartData)}`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Request Shape
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`const response = await axios.post(
  OPENAI_URL,
  {
    model: MODEL,
    messages: [
      {
        role: 'user',
        content: buildPrompt(chartData),
      },
    ],
    temperature: 0.7,
  },
  {
    headers: {
      Authorization:
        \`Bearer \${consts.env.OPENAI_API_KEY}\`,
      'Content-Type': 'application/json',
    },
  }
)`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Why This Design
          </Text>

          <Text style={globalStyles.bullet}>
            • avoids sending unnecessary raw chart data
          </Text>

          <Text style={globalStyles.bullet}>
            • makes LLM output more predictable
          </Text>

          <Text style={globalStyles.bullet}>
            • keeps astrology calculations deterministic
          </Text>

          <Text style={globalStyles.bullet}>
            • lets the model focus on interpretation, not calculation
          </Text>

          <Text style={globalStyles.bullet}>
            • keeps the same payload reusable for saving reports
          </Text>
        </>
      )}
    </View>
  )
}

export default SingleChartLlmDevInfo

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
import axios from 'axios'
import { consts } from '../config/constants'
import { ValidationError } from '../utils/error/errors.types'

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'
const MODEL = 'gpt-4o-mini'

const buildPrompt = (data: unknown) => `
You are an expert astrologer specializing in predictive astrology (transits).

IMPORTANT:
- Answer the user's question directly
- Write in clear, modern English
- Keep the explanation understandable for a non-expert
- Use natural language (not bullet dumping)
- Base everything strictly on the provided data
- Do NOT invent missing information

CONTEXT:

- The "radix" chart is the natal chart (baseline personality)
- The "transit" chart is another moment in time (past or future)
- The "grids" describe the active transits using:
  cause (natal houses),
  action (transit house),
  effect (houses ruled)

USER QUESTION:
${JSON.stringify((data as any).question)}

DATA:
${JSON.stringify(data)}

-----------------------------------

TASK:

1. VERY BRIEF NATAL CONTEXT
- Give a short baseline (2–3 sentences max)

2. IDENTIFY MAIN THEMES
- Group grids into 2–3 main life themes
- Prioritize:
  - repeated houses
  - repeated planets
  - low orb aspects

3. INTERPRET USING CAUSE → EVENT → RESULT
For each theme:
- Cause (natal houses)
- Event (transit house)
- Result (ruled houses)

4. ANSWER THE QUESTION DIRECTLY
- Focus on the question
- Explain WHY this is happening

5. REAL-LIFE EXPRESSION
- behavior
- decisions
- external events

6. FINAL ANSWER
- 2–3 clear sentences

-----------------------------------

STYLE:

- Start simple → go deeper
- No textbook definitions
- No generic horoscope tone
- Focus on real-life experience
`

export const getEagleAndLarkInterpretation = async (
  payload: unknown,
): Promise<string> => {
  if (!payload) {
    throw new ValidationError('Missing data')
  }

  const response = await axios.post(
    OPENAI_URL,
    {
      model: MODEL,
      messages: [
        {
          role: 'user',
          content: buildPrompt(payload),
        },
      ],
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${consts.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    },
  )

  return response.data.choices[0].message.content
}
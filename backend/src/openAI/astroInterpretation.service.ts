import axios from 'axios';
import { consts } from '../config/constants';
import { ValidationError } from '../utils/error/errors.types';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o-mini';

const buildPrompt = (chartData: unknown) => `
You are an expert astrologer. Analyze the following natal chart data and provide a structured, clear interpretation.

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
${JSON.stringify(chartData)}
`;

export const getAstroInterpretation = async (chartData: unknown): Promise<string> => {
  if (!chartData) {
    throw new ValidationError('Missing chart data');
  }

  const response = await axios.post(
    OPENAI_URL,
    {
      model: MODEL,
      messages: [
        {
          role: 'user',
          content: buildPrompt(chartData),
        },
      ],
      temperature: 0.7, // λίγο πιο creative εδώ
    },
    {
      headers: {
        Authorization: `Bearer ${consts.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.choices[0].message.content;
};
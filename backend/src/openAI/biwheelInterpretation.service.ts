import axios from 'axios';
import { consts } from '../config/constants';
import { ValidationError } from '../utils/error/errors.types';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o-mini';

const buildPrompt = (synastry: unknown, compatibility: unknown) => `
You are an expert astrologer specializing in relationship analysis.
IMPORTANT:
- Write in modern Greek
- Keep the explanation clear and understandable for a non-expert
- Use Greek for common concepts:
  (ζώδια, πλανήτες, οίκοι)
- For more technical astrology terms (especially aspects),
  prefer English terminology:
  (e.g. conjunction, square, trine, opposition, sextile, aspects(όψεις), chart)
- When using an English term, briefly explain it in simple Greek
  the first time it appears
- Write in a way understandable to a general audience (not overly technical at first).
- Build interpretation step-by-step (from simple → advanced).
- call the describing person "chart native" ("το άτομο")
- Use natural language, not bullet-point dumping.
- Base everything strictly on the provided data.

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

INPUT:

SYNASRY:
${JSON.stringify(synastry)}

COMPATIBILITY:
${JSON.stringify(compatibility)}

-----------------------------------

TASK:

1. BASIC PERSONALITY MATCH
- Compare Suns, Moons, Ascendants
- Highlight shared placements
- Explain similarities/differences

2. EMOTIONAL NATURE
- Start from Moon signs
- Explain emotional needs
- Support with aspects

3. ATTRACTION STYLE
- Venus & Mars dynamics

4. HOW THEY INTERACT
- Use overlays (houses)

5. KEY ASPECTS
- Focus on strongest
- Explain real impact

6. CORE PATTERN
- 1–2 main relationship dynamics

7. CHALLENGES
- Real-life friction

8. FINAL SUMMARY
- 2–3 sentences

-----------------------------------

STYLE:

- Start simple → go deeper
- No jargon without explanation
- No generic horoscope tone
`;

export const getBiwheelInterpretation = async (
  synastry: unknown,
  compatibility: unknown
): Promise<string> => {
  if (!synastry || !compatibility) {
    throw new ValidationError('Missing data');
  }

  const response = await axios.post(
    OPENAI_URL,
    {
      model: MODEL,
      messages: [
        {
          role: 'user',
          content: buildPrompt(synastry, compatibility),
        },
      ],
      temperature: 0.7,
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
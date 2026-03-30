λύση: gh-pages + build από subfolder
1. install
2. npm install gh-pages --save-dev
frontend/package.json
  "predeploy": "npm run build",
  "deploy:gh": "gh-pages -d dist"
3. vite.config.ts
για gh-pages:
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_DEPLOY_TARGET === 'gh'
    ? '/astroWrap/'
    : '/',
})
4. npm run build
5. npm run deploy:gh
6. GitHub settings
Repo → Settings
Pages
Source: Deploy from branch
Branch: gh-pages

VITE_DEPLOY_TARGET=gh npm run deploy:gh


https://www.freeastroapi.com/dashboard
 "homepage": "https://USERNAME.github.io/REPO_NAME"

pong
Administrator@WINDOWS-4ABEJ0B MINGW64 /d/coding/astro (main)
$ curl -X POST "https://api.freeastroapi.com/api/v1/natal/calculate" \
  -H "Content-Type: application/json" \
  -H "x-api-key: cf6f898cbf8291143bc714a4b82183a1e3073408bf58538a937a88fc2783cb55" \
  -d '{
    "year": 1981,
    "month": 1,
    "day": 1,
    "time_known": true,
    "hour": 23,
    "minute": 30,
    "city": "Athens",
    "orb_settings": {
      "Conjunction": 6.0,
      "Opposition": 6.0,
      "Trine": 5.0,
      "Square": 5.0,
      "Sextile": 4.0
    }
  }'
{"subject":{"name":"User","datetime":"1981-01-01T23:30:00+02:00","location":{"city":"Athens","lat":37.98376,"lng":23.72784,"timezone":"Europe/Athens"},"settings":{"house_system":"placidus","julian_day":2444606.3958333335,"julian_day_tt":2444606.3964280607,"delta_t_days":0.0005947270795223205,"delta_t_seconds":51.384419670728484,"zodiac_type":"Tropical","time_known":true}},"planets":[{"id":"sun","name":"Sun","sign":"Cap","sign_id":"capricorn","pos":11.401,"abs_pos":281.401,"retrograde":false,"house":4},{"id":"moon","name":"Moon","sign":"Sco","sign_id":"scorpio","pos":20.831,"abs_pos":230.831,"retrograde":false,"house":2},{"id":"mercury","name":"Mercury","sign":"Cap","sign_id":"capricorn","pos":12.274,"abs_pos":282.274,"retrograde":false,"house":4},{"id":"venus","name":"Venus","sign":"Sag","sign_id":"sagittarius","pos":18.259,"abs_pos":258.259,"retrograde":false,"house":3},{"id":"mars","name":"Mars","sign":"Aqu","sign_id":"aquarius","pos":1.536,"abs_pos":301.536,"retrograde":false,"house":5},{"id":"jupiter","name":"Jupiter","sign":"Lib","sign_id":"libra","pos":9.571,"abs_pos":189.571,"retrograde":false,"house":1},{"id":"saturn","name":"Saturn","sign":"Lib","sign_id":"libra","pos":9.53,"abs_pos":189.53,"retrograde":false,"house":1},{"id":"uranus","name":"Uranus","sign":"Sco","sign_id":"scorpio","pos":28.456,"abs_pos":238.456,"retrograde":false,"house":3},{"id":"neptune","name":"Neptune","sign":"Sag","sign_id":"sagittarius","pos":23.085,"abs_pos":263.085,"retrograde":false,"house":3},{"id":"pluto","name":"Pluto","sign":"Lib","sign_id":"libra","pos":24.163,"abs_pos":204.163,"retrograde":false,"house":1},{"id":"north_node","name":"North Node","sign":"Leo","sign_id":"leo","pos":12.466,"abs_pos":132.466,"retrograde":true,"house":11,"variant":"mean"},{"id":"lilith","name":"Lilith","sign":"Sco","sign_id":"scorpio","pos":0.317,"abs_pos":210.317,"retrograde":false,"house":2},{"id":"chiron","name":"Chiron","sign":"Tau","sign_id":"taurus","pos":13.621,"abs_pos":43.621,"retrograde":true,"house":8}],"aspects":[{"p1":"mercury","p2":"sun","type":"conjunction","orb":0.87,"deg":0,"is_major":true},{"p1":"jupiter","p2":"sun","type":"square","orb":1.83,"deg":90,"is_major":true},{"p1":"saturn","p2":"sun","type":"square","orb":1.87,"deg":90,"is_major":true},{"p1":"chiron","p2":"sun","type":"trine","orb":2.22,"deg":120,"is_major":true},{"p1":"jupiter","p2":"mercury","type":"square","orb":2.7,"deg":90,"is_major":true},{"p1":"mercury","p2":"saturn","type":"square","orb":2.74,"deg":90,"is_major":true},{"p1":"chiron","p2":"mercury","type":"trine","orb":1.35,"deg":120,"is_major":true},{"p1":"neptune","p2":"venus","type":"conjunction","orb":4.83,"deg":0,"is_major":true},{"p1":"mars","p2":"uranus","type":"sextile","orb":3.08,"deg":60,"is_major":true},{"p1":"lilith","p2":"mars","type":"square","orb":1.22,"deg":90,"is_major":true},{"p1":"jupiter","p2":"saturn","type":"conjunction","orb":0.04,"deg":0,"is_major":true},{"p1":"jupiter","p2":"north_node","type":"sextile","orb":2.9,"deg":60,"is_major":true},{"p1":"north_node","p2":"saturn","type":"sextile","orb":2.94,"deg":60,"is_major":true},{"p1":"neptune","p2":"pluto","type":"sextile","orb":1.08,"deg":60,"is_major":true},{"p1":"chiron","p2":"north_node","type":"square","orb":1.16,"deg":90,"is_major":true}],"confidence":{"houses":"high","angles":"high","overall":"high"},"houses":[{"house":1,"name":"1","sign":"Vir","sign_id":"virgo","pos":28.101,"abs_pos":178.101},{"house":2,"name":"2","sign":"Lib","sign_id":"libra","pos":24.478,"abs_pos":204.478},{"house":3,"name":"3","sign":"Sco","sign_id":"scorpio","pos":24.832,"abs_pos":234.832},{"house":4,"name":"4","sign":"Sag","sign_id":"sagittarius","pos":27.861,"abs_pos":267.861},{"house":5,"name":"5","sign":"Aqu","sign_id":"aquarius","pos":0.938,"abs_pos":300.938},{"house":6,"name":"6","sign":"Pis","sign_id":"pisces","pos":1.445,"abs_pos":331.445},{"house":7,"name":"7","sign":"Pis","sign_id":"pisces","pos":28.101,"abs_pos":358.101},{"house":8,"name":"8","sign":"Ari","sign_id":"aries","pos":24.478,"abs_pos":24.478},{"house":9,"name":"9","sign":"Tau","sign_id":"taurus","pos":24.832,"abs_pos":54.832},{"house":10,"name":"10","sign":"Gem","sign_id":"gemini","pos":27.861,"abs_pos":87.861},{"house":11,"name":"11","sign":"Leo","sign_id":"leo","pos":0.938,"abs_pos":120.938},{"house":12,"name":"12","sign":"Vir","sign_id":"virgo","pos":1.445,"abs_pos":151.445}],"angles":{"asc":178.101,"mc":87.861,"ic":267.861,"dc":358.101,"vertex":354.296},"angles_details":{"asc":{"sign":"Vir","sign_id":"virgo","pos":28.101,"abs_pos":178.101,"house":1},"mc":{"sign":"Gem","sign_id":"gemini","pos":27.861,"abs_pos":87.861,"house":10},"ic":{"sign":"Sag","sign_id":"sagittarius","pos":27.861,"abs_pos":267.861,"house":4},"dc":{"sign":"Pis","sign_id":"pisces","pos":28.101,"abs_pos":358.101,"house":7},"vertex":{"sign":"Pis","sign_id":"pisces","pos":24.296,"abs_pos":354.296,"house":6}},"aspects_summary":{"total":15,"major":15,"minor":0,"by_type":{"conjunction":3,"square":6,"trine":2,"sextile":4}}}



{
  "synastry": {
    "chartA": {
      "chartRuler": {
        "planet": "Mercury",
        "sign": "Capricorn",
        "house": 4
      },
      "meta": {
        "date": "1981-01-01T21:30:00.000Z",
        "houseSystem": "placidus",
        "location": {
          "lat": 37.9838,
          "lng": 23.7275
        },
        "zodiac": "tropical"
      },
      "planets": [
        { "planet": "Sun", "sign": "Capricorn", "house": 4 },
        { "planet": "ASC", "sign": "Virgo", "house": 1 },
        { "planet": "Moon", "sign": "Scorpio", "house": 2 },
        { "planet": "Mercury", "sign": "Capricorn", "house": 4 },
        { "planet": "Venus", "sign": "Sagittarius", "house": 3 },
        { "planet": "Mars", "sign": "Aquarius", "house": 5 },
        { "planet": "Jupiter", "sign": "Libra", "house": 1 },
        { "planet": "Saturn", "sign": "Libra", "house": 1 }
      ]
    },
    "chartB": {
      "chartRuler": {
        "planet": "Moon",
        "sign": "Scorpio",
        "house": 5
      },
      "meta": {
        "date": "1979-04-15T08:30:00.000Z",
        "houseSystem": "placidus",
        "location": {
          "lat": 37.9838,
          "lng": 23.7275
        },
        "zodiac": "tropical"
      },
      "planets": [
        { "planet": "Sun", "sign": "Aries", "house": 10 },
        { "planet": "ASC", "sign": "Cancer", "house": 1 },
        { "planet": "Moon", "sign": "Scorpio", "house": 5 },
        { "planet": "Mercury", "sign": "Pisces", "house": 10 },
        { "planet": "Venus", "sign": "Pisces", "house": 9 },
        { "planet": "Mars", "sign": "Aries", "house": 10 },
        { "planet": "Jupiter", "sign": "Cancer", "house": 1 },
        { "planet": "Saturn", "sign": "Virgo", "house": 3 }
      ]
    },
    "cross": {
      "aspects": [
        {
          "type": "trine",
          "text": "venus trine moon",
          "orb": 0.22
        },
        {
          "type": "sextile",
          "text": "moon sextile ascendant",
          "orb": 0.33
        },
        {
          "type": "opposition",
          "text": "ascendant opposition sun",
          "orb": 0.90
        },
        {
          "type": "sextile",
          "text": "moon sextile mars",
          "orb": 3.10
        },
        {
          "type": "trine",
          "text": "midheaven trine moon",
          "orb": 2.79
        }
      ],
      "overlay": {
        "A": [
          { "planet": "Mars", "house": 7 },
          { "planet": "Mercury", "house": 7 }
        ],
        "B": []
      }
    }
  },
  "compatibility": {
    "scores": {
      "attraction": 8.93358,
      "communication": 6.5,
      "emotional": 9.8834,
      "overall": 6.72788,
      "stability": 5
    },
    "explanations": {
      "attraction": [
        {
          "type": "aspect",
          "text": "Moon-Venus/Mars (romantic/emotional attraction): venus trine moon (orb 0.22)",
          "score": 1.93358
        },
        {
          "type": "aspect",
          "text": "Moon-Venus/Mars (romantic/emotional attraction): moon sextile mars (orb 3.10)",
          "score": 0
        },
        {
          "type": "overlay",
          "text": "Mars in house 7",
          "score": 2
        }
      ],
      "communication": [
        {
          "type": "overlay",
          "text": "Mercury in house 7",
          "score": 1.5
        }
      ],
      "emotional": [
        {
          "type": "aspect",
          "text": "Moon-Venus (emotional harmony): venus trine moon (orb 0.22)",
          "score": 2.320296
        },
        {
          "type": "aspect",
          "text": "Moon aspect: moon sextile ascendant (orb 0.33)",
          "score": 1.4001
        },
        {
          "type": "aspect",
          "text": "Moon-Mars (emotional tension/passion): moon sextile mars (orb 3.10)",
          "score": 0
        },
        {
          "type": "aspect",
          "text": "Moon aspect: midheaven trine moon (orb 2.79)",
          "score": 1.163
        }
      ],
      "overall": [
        {
          "type": "aspect",
          "text": "venus trine moon (orb 0.22)",
          "score": 1.93358
        },
        {
          "type": "aspect",
          "text": "moon sextile ascendant (orb 0.33)",
          "score": 1.4001
        },
        {
          "type": "aspect",
          "text": "ascendant opposition sun (orb 0.90)",
          "score": -2.7688
        },
        {
          "type": "aspect",
          "text": "moon sextile mars (orb 3.10)",
          "score": 0
        },
        {
          "type": "aspect",
          "text": "midheaven trine moon (orb 2.79)",
          "score": 1.163
        }
      ],
      "stability": []
    }
  }
}

## Synastry prompt

You are an expert astrologer.

You are given synastry data between two individuals.

Your task is to explain the relationship in a way that starts from basic, understandable elements (signs, planets, houses), and THEN moves into deeper synastry analysis.

-----------------------------------

IMPORTANT RULES:

- Start from SIMPLE astrology (signs, planets, houses)
- THEN move to aspects and interaction
- Prioritize patterns that appear in BOTH charts (very important)
- If both people share the same placement (e.g. Moon in Scorpio), highlight it clearly
- Do NOT start with aspects
- Do NOT ignore shared placements

- Think:
  → “What would a normal person understand first?”

-----------------------------------

INPUT:

SYNASRY:
{{synastry_json_here}}

COMPATIBILITY:
{{compatibility_json_here}}

-----------------------------------

TASK:

1. BASIC PERSONALITY MATCH (VERY IMPORTANT)
- Compare Suns, Moons, Ascendants
- Highlight shared placements (CRITICAL)
- Explain in simple terms how similar/different they are

2. EMOTIONAL NATURE (START FROM MOON SIGNS)
- Describe each person’s emotional needs
- If same Moon sign → explain what that means deeply
- THEN support with aspects

3. ATTRACTION STYLE (VENUS & MARS)
- How each loves and desires
- Are they naturally aligned or different?

4. HOW THEY INTERACT (HOUSES / OVERLAYS)
- Use overlays (e.g. planets in 7th house)
- Explain what role each person plays in the other’s life

5. KEY ASPECTS (NOW GO DEEPER)
- Use strongest aspects
- Explain what they DO (not just name them)

6. CORE PATTERN
- Combine everything into 1–2 main dynamics

7. CHALLENGES
- Focus on real-life friction
- Especially identity clashes, communication differences

8. FINAL SUMMARY
- 2–3 sentences
- Clear and grounded

-----------------------------------

STYLE:

- Start simple → go deeper
- No astrology jargon without explanation
- No generic horoscope tone
- Explain like you're talking to an intelligent non-astrologer


---
## natal chart
{
  "meta": {
    "date": "1981-01-01T21:30:00.000Z",
    "location": {
      "lat": 37.9838,
      "lng": 23.7275
    },
    "zodiac": "tropical",
    "houseSystem": "placidus"
  },
  "planets": [
    { "planet": "Sun", "sign": "Capricorn", "house": 4 },
    { "planet": "ASC", "sign": "Virgo", "house": 1 },
    { "planet": "Moon", "sign": "Scorpio", "house": 2 },
    { "planet": "Mercury", "sign": "Capricorn", "house": 4 },
    { "planet": "Venus", "sign": "Sagittarius", "house": 3 },
    { "planet": "Mars", "sign": "Aquarius", "house": 5 },
    { "planet": "Jupiter", "sign": "Libra", "house": 1 },
    { "planet": "Saturn", "sign": "Libra", "house": 1 }
  ],
  "houses": [
    { "house": 1, "sign": "Virgo", "longitude": 178.1037 },
    { "house": 2, "sign": "Libra", "longitude": 204.4877 },
    { "house": 3, "sign": "Scorpio", "longitude": 234.886 },
    { "house": 4, "sign": "Sagittarius", "longitude": 267.8631 },
    { "house": 5, "sign": "Aquarius", "longitude": 300.8795 },
    { "house": 6, "sign": "Pisces", "longitude": 331.4361 },
    { "house": 7, "sign": "Pisces", "longitude": 358.1037 },
    { "house": 8, "sign": "Aries", "longitude": 24.4877 },
    { "house": 9, "sign": "Taurus", "longitude": 54.886 },
    { "house": 10, "sign": "Gemini", "longitude": 87.8631 },
    { "house": 11, "sign": "Leo", "longitude": 120.8795 },
    { "house": 12, "sign": "Virgo", "longitude": 151.4361 }
  ],
  "chartRuler": {
    "planet": "Mercury",
    "sign": "Capricorn",
    "house": 4
  },
  "balance": {
    "elements": {
      "Fire": 2,
      "Earth": 2,
      "Air": 4,
      "Water": 2
    },
    "modalities": {
      "Cardinal": 5,
      "Fixed": 3,
      "Mutable": 2
    }
  },
  "aspects": [
    {
      "point1": "saturn",
      "point2": "pluto",
      "type": "sextile",
      "orb": 0.1597
    }
  ],
  "dignities": [
    { "planet": "sun", "dignity": "exaltation" },
    { "planet": "moon", "dignity": "neutral" },
    { "planet": "mercury", "dignity": "detriment" },
    { "planet": "venus", "dignity": "detriment" },
    { "planet": "mars", "dignity": "neutral" },
    { "planet": "jupiter", "dignity": "exaltation" },
    { "planet": "saturn", "dignity": "fall" },
    { "planet": "uranus", "dignity": "neutral" },
    { "planet": "neptune", "dignity": "neutral" },
    { "planet": "pluto", "dignity": "neutral" }
  ],
  "dispositors": {
    "loops": ["jupiter", "moon", "mercury"],
    "backbone": []
  }
}

You are an expert astrologer. Analyze the following natal chart data and provide a structured, clear interpretation.

IMPORTANT:
- Write in a way understandable to a general audience (not overly technical at first).
- Build interpretation step-by-step (from simple → advanced).
- Use natural language, not bullet-point dumping.
- Base everything strictly on the provided data.

---

STEP 1 — CORE PERSONALITY (most important, easy to understand)

Start with the fundamental identity of the person:

1. Ascendant (ASC):
- What impression they give
- How they approach life

2. Sun sign:
- Core identity, ego, purpose

3. Moon sign:
- Emotional nature, needs, inner world

Explain how these three combine into a coherent personality.

---

STEP 2 — PLANETARY EXPRESSIONS (planet + sign + house)

For each planet (Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn):

- Explain:
  → what the planet represents
  → how the sign modifies it
  → how the house expresses it in real life

Focus especially on:
- Sun
- Moon
- Venus
- Mars

Connect placements where relevant (e.g. Sun + Mercury same sign/house).

---

STEP 3 — STRUCTURE & BALANCE

Analyze the overall chart structure:

1. Element balance (Fire / Earth / Air / Water)
→ what dominates or is lacking

2. Modalities (Cardinal / Fixed / Mutable)
→ behavioral style

3. House emphasis / hemispheres / quadrants:
→ where life focus is (e.g. inner vs outer world, personal vs social)

---

STEP 4 — KEY ASPECTS

Interpret the most important aspects:

- Explain what each aspect means psychologically and practically
- Focus on strong/tight aspects (low orb)
- Describe how they create harmony or tension

Avoid listing — interpret them meaningfully.

---

STEP 5 — REFINEMENT (advanced layer)

Now deepen the analysis using:

- Chart ruler → overall life direction
- Dignities → strengths / weaknesses of planets
- Dispositor patterns → underlying energy flow
- Any notable patterns (loops, dominance, etc.)

---

FINAL OUTPUT STYLE:

- Write as a coherent interpretation, not raw data explanation
- Smooth transitions between sections
- Avoid repeating the same meaning
- Prioritize clarity over jargon
- Give a sense of personality, behavior, and life tendencies

---

Here is the chart data:

{{INSERT_JSON_HERE}}
import type { ChartSummary } from '../types/types'
import { planets, signToPlanet } from '../constants/constants'

//  αποτέλεσμα για κάθε chain
// chain = η αλυσίδα των rulers
// type = αν καταλήγει σε final ή loop
type Result = {
  chain: string[]
  type: 'final' | 'loop'
  loopStart?: string
}

//  helper: φτιάχνει ένα map planet → data (για εύκολη πρόσβαση)
const planetMap = (data: ChartSummary) => ({
  Sun: data.sun,
  Moon: data.moon,
  Mercury: data.mercury,
  Venus: data.venus,
  Mars: data.mars,
  Jupiter: data.jupiter,
  Saturn: data.saturn,
  Uranus: data.uranus,
  Neptune: data.neptune,
  Pluto: data.pluto,
})

//  βρίσκει την αλυσίδα dispositor για έναν πλανήτη
export function getDispositorChain(
  startPlanet: string,
  data: ChartSummary
): Result {
  const visited: string[] = [] // για loop detection
  const chain: string[] = []   // η τελική αλυσίδα

  const planets = planetMap(data)

  let current = startPlanet

  while (true) {
    //  αν έχουμε ξαναδεί τον πλανήτη → loop
    if (visited.includes(current)) {
      return {
        chain,
        type: 'loop',
        loopStart: current,
      }
    }

    visited.push(current)

    //  βρίσκουμε που βρίσκεται ο current πλανήτης
    const placement = planets[current as keyof typeof planets]

    //  αν δεν έχουμε sign → σταματάμε (invalid data)
    if (!placement?.sign) {
      return {
        chain,
        type: 'loop',
      }
    }

    //  βρίσκουμε τον ruler του ζωδίου
    const ruler = signToPlanet[placement.sign]

    //  safety fallback
    if (!ruler) {
      return {
        chain,
        type: 'loop',
      }
    }

    //  προσθέτουμε τον επόμενο κρίκο στην αλυσίδα
    chain.push(ruler)

    //  αν ο πλανήτης κυβερνά τον εαυτό του → final dispositor
    if (ruler === current) {
      return {
        chain,
        type: 'final',
      }
    }

    //  συνεχίζουμε την αλυσίδα
    current = ruler
  }
}

//  υπολογίζει dispositor chains για ΟΛΟΥΣ τους πλανήτες
export function getAllDispositors(data: ChartSummary) {
  return planets.map((p) => ({
    planet: p,
    result: getDispositorChain(p, data),
  }))
}
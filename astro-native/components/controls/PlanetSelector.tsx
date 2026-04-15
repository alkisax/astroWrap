// astro-native/components/controls/PlanetSelector.tsx

// in: λίστα διαλεγμένων πλανητών (στην αρχή όλοι) και setter
// κάνει toggle τους διαλεγμένους πλανήτες και render το ui

import { View, Text, Pressable, StyleSheet } from 'react-native'
import type { Dispatch, SetStateAction } from 'react'
import { planets } from '../../constants/constants'

type Props = {
  selected: string[]
  setSelected: Dispatch<SetStateAction<string[]>>
}

export default function PlanetSelector({ selected, setSelected }: Props) {
  // toggle planet στο selected array. Aν υπάρχει → αφαιρείται. Aν δεν υπάρχει → προστίθεται
  // βασικο toggle - immutable update (React state)
  const togglePlanet = (planet: string) => {
    setSelected((prev) =>
      prev.includes(planet)
        ? prev.filter((p) => p !== planet)
        : [...prev, planet]
    )
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>🪐 Visible Planets</Text>

      <View style={styles.grid}>
        {/* δείχνει όλους τους πλανήτες με map και τους έχει toggle buttons
            που τους κάνει toggle απο το arr των selected (έρχεται ως input. Στην αρχή όλοι) */}
        {planets.map((p) => {
          const isSelected = selected.includes(p)

          return (
            <Pressable
              key={p}
              onPress={() => togglePlanet(p)}
              style={[
                styles.planetButton,
                isSelected && styles.planetButtonSelected,
              ]}
            >
              <Text
                style={[
                  styles.planetText,
                  isSelected && styles.planetTextSelected,
                ]}
              >
                {isSelected ? '☑ ' : '☐ '}
                {p}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginTop: 8,
  },
  title: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  planetButton: {
    width: '48%',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  planetButtonSelected: {
    backgroundColor: '#6c5ce7',
    borderColor: '#6c5ce7',
  },
  planetText: {
    color: 'white',
    fontSize: 12,
  },
  planetTextSelected: {
    color: '#000',
    fontWeight: '600',
  },
})
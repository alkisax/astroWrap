// astro-native/components/controls/PlanetSelector.tsx

// in: λίστα διαλεγμένων πλανητών (στην αρχή όλοι) και setter
// κάνει toggle τους διαλεγμένους πλανήτες και render το ui

import { View, Text, Pressable, StyleSheet } from 'react-native'
import type { Dispatch, SetStateAction } from 'react'
import { planets, colors, planetIcons } from '../../constants/constants'

type Props = {
  selected: string[]
  setSelected: Dispatch<SetStateAction<string[]>>
}

export default function PlanetSelector({ selected, setSelected }: Props) {

  const togglePlanet = (planet: string) => {
    setSelected((prev) =>
      prev.includes(planet)
        ? prev.filter((p) => p !== planet)
        : [...prev, planet]
    )
  }

  console.log('RENDER selected', selected)
  
  return (
    <View style={styles.card}>
      <Text style={styles.title}>🪐 Visible Planets</Text>

      <View style={styles.grid}>
        {planets.map((p) => {
          const isSelected = selected.includes(p)

          return (
            <Pressable
              key={`${p}-${isSelected}`}
              onPress={() => togglePlanet(p)}
              style={[
                styles.planetButton,
                isSelected && styles.selected,
              ]}
            >
              <Text
                style={[
                  styles.text,
                  isSelected && styles.textSelected,
                ]}
              >
                {planetIcons[p]} {p}
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
    padding: 14,
    borderRadius: 16,

    // 🔥 glass
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    marginTop: 8,
  },

  title: {
    color: colors.text,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  planetButton: {
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,

    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  selected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  text: {
    color: colors.text,
    fontSize: 13,
    textAlign: 'center',
  },

  textSelected: {
    color: '#1a1a1a', // rich dark (όχι pure black)
    fontWeight: '700',
  },
})
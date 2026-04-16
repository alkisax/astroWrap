// astro-native/components/controls/UserOrbPicker.tsx

// απο εδω ξεκινάει το userOrb που καταλήγει στο getAngleAspects.ts.
// Το state του είναι στο useHome

import { colors } from '@/constants/constants'
import { View, Text, Pressable, StyleSheet } from 'react-native'

type Props = {
  userOrb: number
  setUserOrb: (v: number) => void
}

const UserOrbPicker = ({ userOrb, setUserOrb }: Props) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>orb</Text>

      <View style={styles.grid}>
        {[0.1, 0.2, 0.8, 1, 1.5, 2].map((v) => {
          const isSelected = userOrb === v

          return (
            <Pressable
              key={v}
              onPress={() => setUserOrb(v)}
              style={[
                styles.button,
                isSelected && styles.buttonSelected,
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  isSelected && styles.buttonTextSelected,
                ]}
              >
                {v * 100}%
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

export default UserOrbPicker

const styles = StyleSheet.create({
  card: {
    width: '100%',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginTop: 8,
  },
  title: {
    marginBottom: 6,
    fontSize: 12,
    textAlign: 'center',
    color: '#bbb',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 6,
  },
  button: {
    width: '31%',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  buttonSelected: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
  },
  buttonTextSelected: {
    color: '#000',
    fontWeight: '600',
  },
})
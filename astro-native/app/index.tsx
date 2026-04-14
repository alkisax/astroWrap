import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'

const poemText = `
Once upon a time there was a lark who was renowned for her beautiful singing...
...Together, as a team, they had brought music to the gods.
`

export default function Index() {
  const router = useRouter()

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* 🔝 buttons */}
      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.button, styles.primary]}
          onPress={() => router.push('/single')}
        >
          <Text style={styles.buttonText}>Single Chart</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.outline]}
          onPress={() => router.push('/biwheel')}
        >
          <Text style={styles.buttonText}>Relationship Analysis</Text>
        </Pressable>
      </View>

      {/* 🔽 content */}
      <View style={styles.card}>
        <Text style={styles.title}>
          THE FABLE OF THE EAGLE AND THE LARK
        </Text>

        <Text style={styles.text}>
          {poemText}
        </Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    minHeight: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
    backgroundColor: 'black',
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },

  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    minWidth: 160,
    alignItems: 'center',
  },

  primary: {
    backgroundColor: '#6c5ce7',
  },

  outline: {
    borderWidth: 1,
    borderColor: 'white',
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
  },

  card: {
    width: '100%',
    maxWidth: 800,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 20,
  },

  title: {
    color: 'white',
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 20,
  },

  text: {
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
    fontSize: 14,
  },
})
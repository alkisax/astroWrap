// astro-native\components\chartInfo\AspectsList.tsx

import { View, Text, StyleSheet } from 'react-native'

const AspectsList = ({ aspects }: any) => {
  if (!aspects?.length) return null

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Aspects</Text>

      {aspects.map((a: any, i: number) => (
        <Text key={i} style={styles.row}>
          {a.point1} — {a.type} — {a.point2} ({a.orb?.toFixed(2)}°)
        </Text>
      ))}
    </View>
  )
}

export default AspectsList

const styles = StyleSheet.create({
  card: {
    padding: 10,
    backgroundColor: '#111',
    borderRadius: 10,
  },
  title: {
    color: '#aaa',
    fontSize: 12,
  },
  row: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
})
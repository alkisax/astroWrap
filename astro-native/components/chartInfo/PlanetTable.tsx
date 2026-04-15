import { View, Text, StyleSheet } from 'react-native'
import { getZodiacSign, getHouse } from '../../utils/angleToAstro'

const PlanetTable = ({ data }: any) => {
  const cusps = data.houses.map((h: any) => h.longitude ?? 0)

  const planets = [
    { name: 'Sun', value: data.sun?.longitude },
    { name: 'ASC', value: data.ascendant?.longitude },
    { name: 'Moon', value: data.moon?.longitude },
    { name: 'Mercury', value: data.mercury?.longitude },
    { name: 'Venus', value: data.venus?.longitude },
    { name: 'Mars', value: data.mars?.longitude },
  ]

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Planets</Text>

      {planets.map(p => {
        if (!p.value) return null

        const sign = getZodiacSign(p.value)
        const house = getHouse(p.value, cusps)

        return (
          <View key={p.name} style={styles.row}>
            <Text style={styles.cell}>{p.name}</Text>
            <Text style={styles.cell}>{sign}</Text>
            <Text style={styles.cell}>H{house}</Text>
          </View>
        )
      })}
    </View>
  )
}

export default PlanetTable

const styles = StyleSheet.create({
  card: {
    padding: 10,
    backgroundColor: '#111',
    borderRadius: 10,
  },
  title: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  cell: {
    color: 'white',
    fontSize: 13,
  },
})
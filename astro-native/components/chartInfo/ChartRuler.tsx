import { View, Text, StyleSheet } from 'react-native'
import { computeChartRuler } from '../../utils/computeChartRuler'

const ChartRuler = ({ data }: any) => {
  const ruler = computeChartRuler(data)
  if (!ruler) return null

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Chart Ruler</Text>
      <Text style={styles.text}>
        {ruler.planet} in {ruler.sign} (H{ruler.house})
      </Text>
    </View>
  )
}

export default ChartRuler

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
  text: {
    color: 'white',
    marginTop: 4,
  },
})
// astro-native\components\chartInfo\BalanceSummary.tsx

import { View, Text, StyleSheet } from 'react-native'
import {
  calculateElementBalance,
  calculateModalityBalance,
} from '../../utils/balanceCalculator'

const BalanceSummary = ({ data }: any) => {
  const elements = calculateElementBalance(data)
  const modalities = calculateModalityBalance(data)

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Balance</Text>

      <Text style={styles.section}>Elements</Text>
      <Text style={styles.text}>
        Fire {elements.Fire} • Earth {elements.Earth} • Air {elements.Air} • Water {elements.Water}
      </Text>

      <Text style={styles.section}>Modalities</Text>
      <Text style={styles.text}>
        Cardinal {modalities.Cardinal} • Fixed {modalities.Fixed} • Mutable {modalities.Mutable}
      </Text>
    </View>
  )
}

export default BalanceSummary

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
  section: {
    color: '#888',
    marginTop: 6,
    fontSize: 11,
  },
  text: {
    color: 'white',
    fontSize: 13,
  },
})
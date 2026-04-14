// app/single.tsx

import { View, Text, Button, ScrollView, StyleSheet } from 'react-native'
import { useHome } from '../hooks/componentHooks/useHome'

const Single = () => {
  const {
    data,
    handleSubmit,
    date,
    coords,
  } = useHome()

  const handleRun = () => {
    handleSubmit({
      date,
      lat: coords.lat,
      lng: coords.lng,
    })
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Single Chart</Text>

      <Text style={styles.meta}>
        Date: {date.toLocaleString()}
      </Text>

      <Text style={styles.meta}>
        Coords: {coords.lat}, {coords.lng}
      </Text>

      <View style={styles.buttonWrap}>
        <Button title='Run Chart' onPress={handleRun} />
      </View>

      {!data && (
        <Text style={styles.loading}>
          Loading chart...
        </Text>
      )}

      {data && (
        <View style={styles.card}>
          <Text style={styles.row}>ASC: {data.ascendant?.sign ?? '-'}</Text>
          <Text style={styles.row}>Sun: {data.sun?.sign ?? '-'}</Text>
          <Text style={styles.row}>Moon: {data.moon?.sign ?? '-'}</Text>
          <Text style={styles.row}>Mercury: {data.mercury?.sign ?? '-'}</Text>
          <Text style={styles.row}>Venus: {data.venus?.sign ?? '-'}</Text>
          <Text style={styles.row}>Mars: {data.mars?.sign ?? '-'}</Text>
        </View>
      )}
    </ScrollView>
  )
}

export default Single

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 12,
    fontWeight: '600',
  },
  meta: {
    fontSize: 14,
    marginBottom: 6,
  },
  buttonWrap: {
    marginTop: 12,
    marginBottom: 20,
  },
  loading: {
    marginTop: 20,
    fontSize: 16,
  },
  card: {
    marginTop: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  row: {
    fontSize: 16,
    marginBottom: 8,
  },
})
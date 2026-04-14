// app/single.tsx

import { View, Text, Button, ScrollView } from 'react-native'
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
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        Single Chart
      </Text>

      <Button title='Run Chart' onPress={handleRun} />

      {!data && (
        <Text style={{ marginTop: 20 }}>
          No data yet...
        </Text>
      )}

      {data && (
        <View style={{ marginTop: 20 }}>
          <Text>ASC: {data.ascendant?.sign}</Text>
          <Text>Sun: {data.sun?.sign}</Text>
          <Text>Moon: {data.moon?.sign}</Text>
        </View>
      )}

    </ScrollView>
  )
}

export default Single
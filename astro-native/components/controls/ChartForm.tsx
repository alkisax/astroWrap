// astro-native/components/controls/ChartForm.tsx

// in: παίρνει μια onSubmit με date/lat/lang τα οποία οταν αλλαχθούν εδώ προκαλούν trigger να δείξει το chart

import { useState } from 'react'
import { View, Text, TextInput, Pressable, Linking, StyleSheet } from 'react-native'

type Props = {
  onSubmit: (data: {
    date: Date
    lat: number
    lng: number
  }) => void
}

export default function ChartForm({ onSubmit }: Props) {
  // το form κρατάει δικό του local state (date/lat/lng) σκόπιμα
  // ΔΕΝ είναι λάθος → αποφεύγουμε recalculation του chart σε κάθε input change.
  // Sync με parent γίνεται μόνο στο submit (controlled flow)
  const [dateInput, setDateInput] = useState('1981-01-01 23:30')
  const [lat, setLat] = useState('37.9838')
  const [lng, setLng] = useState('23.7275')

  const handleSubmit = () => {
    const parsedLat = Number(lat)
    const parsedLng = Number(lng)

    if (Number.isNaN(parsedLat) || Number.isNaN(parsedLng)) return

    // προσπαθούμε να κάνουμε parse ένα απλό local date string
    // πχ 1981-01-01 23:30
    const normalized = dateInput.trim().replace(' ', 'T')
    const parsedDate = new Date(normalized)

    if (Number.isNaN(parsedDate.getTime())) return

    // εδω γίνετε και ο τελικός υπολογισμός του chart
    onSubmit({
      date: parsedDate, // ήδη Date
      lat: parsedLat,
      lng: parsedLng,
    })
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Generate Chart</Text>

      <Text style={styles.label}>Date & Time</Text>
      <TextInput
        value={dateInput}
        onChangeText={setDateInput}
        placeholder='YYYY-MM-DD HH:mm'
        placeholderTextColor='#999'
        style={styles.input}
      />

      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>Lat</Text>
          <TextInput
            value={lat}
            onChangeText={setLat}
            keyboardType='numeric'
            placeholder='37.9838'
            placeholderTextColor='#999'
            style={styles.input}
          />
        </View>

        <View style={styles.half}>
          <Text style={styles.label}>Lng</Text>
          <TextInput
            value={lng}
            onChangeText={setLng}
            keyboardType='numeric'
            placeholder='23.7275'
            placeholderTextColor='#999'
            style={styles.input}
          />
        </View>
      </View>

      <Text style={styles.helpText}>
        Coordinates:{' '}
        <Text
          style={styles.link}
          onPress={() => Linking.openURL('https://www.latlong.net')}
        >
          latlong.net
        </Text>
      </Text>

      {/* εδω γίνετε και ο τελικός υπολογισμός του chart.
          Αυτό το κάνει απλώς κάνοντας set το lat, long, date state και το πιάνει το "[]" */}
      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Calculate</Text>
      </Pressable>
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
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  label: {
    color: '#ddd',
    fontSize: 12,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    color: 'white',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  half: {
    flex: 1,
  },
  helpText: {
    color: '#bbb',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  link: {
    color: '#fff',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#6c5ce7',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: '600',
  },
})
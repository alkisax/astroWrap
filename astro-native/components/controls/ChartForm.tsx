// astro-native/components/controls/ChartForm.tsx

// in: παίρνει μια onSubmit με date/lat/lang τα οποία οταν αλλαχθούν εδώ προκαλούν trigger να δείξει το chart

import { colors } from '@/constants/constants'
import { useState } from 'react'
import { View, Text, TextInput, Pressable, Linking, StyleSheet, Alert } from 'react-native'
import tzLookup from 'tz-lookup'

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
  // const [dateInput, setDateInput] = useState('1981-01-01 23:30')
  const formatNow = () => {
    const now = new Date()
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
  }

  const [dateInput, setDateInput] = useState(formatNow())
  const [lat, setLat] = useState('37.9838')
  const [lng, setLng] = useState('23.7275')

  const handleSubmit = () => {
    // κανουμε τα Input numbers απο string
    const parsedLat = Number(lat)
    const parsedLng = Number(lng)

    // validation
    if (Number.isNaN(parsedLat) || Number.isNaN(parsedLng)) {
      Alert.alert(
        'Invalid coordinates',
        'Please enter valid latitude and longitude values.'
      )
      return
    }

    // σπάμε το input στα διαφορα στοιχεία του
    const normalized = dateInput.trim().replace(' ', 'T')

    const [datePart, timePart] = normalized.split('T')

    if (!datePart || !timePart) {
      Alert.alert(
        'Invalid date format',
        'Use format:\nYYYY-MM-DD HH:mm\nExample: 1981-01-01 23:30'
      )
      return
    }

    const [year, month, day] = datePart.split('-').map(Number)
    const [hour, minute] = timePart.split(':').map(Number)

    // validation
    if (
      [year, month, day, hour, minute].some(v => Number.isNaN(v))
    ) {
      Alert.alert(
        'Invalid date format',
        'Use format:\nYYYY-MM-DD HH:mm\nExample: 1981-01-01 23:30'
      )
      return
    }

    if (
      month < 1 || month > 12 ||
      day < 1 || day > 31 ||
      hour < 0 || hour > 23 ||
      minute < 0 || minute > 59
    ) {
      Alert.alert(
        'Invalid date values',
        'Please check the date and time values.'
      )
      return
    }

    /*
      ⚠️ IMPORTANT ARCHITECTURE CHANGE
  
      ΠΑΛΙΑ:
      - κάναμε manual μετατροπή local time -> UTC
      - χρησιμοποιώντας tzLookup + Intl.DateTimeFormat
      - και μετά στέλναμε UTC στο backend
  
      Το πρόβλημα:
      Η βιβλιοθήκη circular-natal-horoscope-js
      κάνει ΜΟΝΗ ΤΗΣ:
      - timezone detection
      - DST handling
      - ιστορικά timezone offsets
      - UTC conversion
  
      Άρα είχαμε:
      frontend UTC conversion + backend/library UTC conversion => double timezone correction bug
  
      Αυτό δημιουργούσε:
      - λάθος ASC - λάθος houses - διαφορετικό chart απο το WebView - μεγάλα historical date bugs (πχ 1870)
  
      ΝΕΑ ΛΟΓΙΚΗ:
      - κρατάμε την LOCAL ώρα που έδωσε ο user
      - η astrology library κάνει μόνη της το timezone math
    */

    // 👇 ΠΑΛΙΟ LOGIC (COMMENTED OUT FOR DEBUG / REFERENCE)

    /*
    // βιβλιοθήκη που μας βρίσκει σε ποιο timezone/περιοχή είναι οι συντεταγμένες που έδωσε πχ Europe/Athens
    const timezone = tzLookup(parsedLat, parsedLng)
  
    // create base UTC (no assumptions)
    // “ας υποθέσω προσωρινά ότι το input ήταν ήδη UTC”: 21:42 -> 21:42 UTC
    const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute))
  
    // SAFE offset calc (RN compatible)
    // Helper func: Πόσο offset έχει εκείνο το timezone εκείνη τη μέρα → π.χ. Europe/Athens = UTC+2
    // λαμβάνουμε υπ όψιν χειμερινή ώρα και άλλα τέτοια; Ναι αλλα προσοχη ⚠️ πηγή bugs
    const getOffset = (date: Date, timeZone: string) => {
      try {
        //“αν αυτή η UTC στιγμή προβληθεί σαν Europe/Athens, τι ώρα θα δείξει;”
        const dtf = new Intl.DateTimeFormat('en-US', {
          timeZone,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
  
        const parts = dtf.formatToParts(date)
  
        const map: Record<string, string> = {}
  
        parts.forEach(p => {
          if (p.type !== 'literal') map[p.type] = p.value
        })
  
        //"αν αυτά τα Athens clock values ήταν UTC values, τι timestamp θα είχα;"
        const asUTC = Date.UTC(
          Number(map.year),
          Number(map.month) - 1,
          Number(map.day),
          Number(map.hour),
          Number(map.minute),
          Number(map.second)
        )
  
        // πχ (23:17:08 UTC) - (21:42:00 UTC) = +1h 35m 08s
        return asUTC - date.getTime()
      } catch (e) {
        console.log('❌ offset error', e)
        return 0
      }
    }
  
    // βρισκουμε με την helper την διαφορά ωρας απο αυτήν που έδωσε με την UTC
    const offset = getOffset(utcGuess, timezone)
  
    // α. υποθέτει οτι η ωρα είναι UTC β. βρίσκει την πραγματική διαφορα με utc και την αφαιρεί. δήλ:
    // μετατρέπει την ώρα σε utc
    const finalUtc = new Date(utcGuess.getTime() - offset)
    */

    /*
      ΝΕΟ LOGIC
      Δεν μετατρέπουμε πια σε UTC.
      Δημιουργούμε απλώς ένα Date object που κρατά:
      - το local clock time που έδωσε ο user
      Η astrology library θα χρησιμοποιήσει:
      - local hour/minute
      - latitude/longitude
      και θα κάνει μόνη της:
      - timezone lookup
      - DST correction
      - UTC astronomical conversion
    */
    const localDate = new Date(
      year,
      month - 1,
      day,
      hour,
      minute
    )

    if (Number.isNaN(localDate.getTime())) {
      Alert.alert(
        'Invalid date',
        'Could not calculate chart date.\nUse format:\nYYYY-MM-DD HH:mm'
      )

      console.log('❌ INVALID localDate')
      return
    }

    // debug logs → comment out later
    // console.log('🧪 LOCAL INPUT:', {
    //   year,
    //   month,
    //   day,
    //   hour,
    //   minute,
    //   lat: parsedLat,
    //   lng: parsedLng,
    // })

    // console.log('🧪 CHART FORM DATE DEBUG:', {
    //   rawInput: dateInput,

    //   localDate_toString: localDate.toString(),
    //   localDate_iso: localDate.toISOString(),

    //   localFields: {
    //     year: localDate.getFullYear(),
    //     month: localDate.getMonth() + 1,
    //     day: localDate.getDate(),
    //     hour: localDate.getHours(),
    //     minute: localDate.getMinutes(),
    //   },

    //   utcFields: {
    //     year: localDate.getUTCFullYear(),
    //     month: localDate.getUTCMonth() + 1,
    //     day: localDate.getUTCDate(),
    //     hour: localDate.getUTCHours(),
    //     minute: localDate.getUTCMinutes(),
    //   },

    //   timezoneOffset: localDate.getTimezoneOffset(),

    //   timezoneGuess: tzLookup(parsedLat, parsedLng),

    //   coords: {
    //     lat: parsedLat,
    //     lng: parsedLng,
    //   },
    // })
    // console.log('🧪 CHART FORM SUBMIT PAYLOAD:', {
    //   date: localDate,
    //   dateString: localDate.toString(),
    //   iso: localDate.toISOString(),
    //   lat: parsedLat,
    //   lng: parsedLng,
    // })

    // σωζει στην useHome
    onSubmit({
      date: localDate,
      lat: parsedLat,
      lng: parsedLng,
    })
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Generate Chart</Text>

      <Text style={styles.label}>Date & Time</Text>
      <Text style={styles.helpText}>
        Format: YYYY-MM-DD HH:mm (e.g. 1981-01-01 23:30)
      </Text>
      <TextInput
        value={dateInput}
        onChangeText={setDateInput}
        placeholder='YYYY-MM-DD HH:mm'
        placeholderTextColor='#999'
        style={styles.input}
      />

      <Text style={styles.helpText}>
        Default: Athens, Greece
      </Text>
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
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: '600',
  },
})
// astro-native/components/controls/TimeControls.tsx

// in: ημερομηνια/συντεταγμένες (default "τώρα"/αθήνα)
// out: ημερομηνία/συντεταγμένες με +- ωρες/μερες/μηνες/χρονια
// και render των αντίστοιχων btns

import { View, Text, Pressable, StyleSheet } from 'react-native'

type Props = {
  date: Date
  setDate: React.Dispatch<React.SetStateAction<Date>>
  coords: { lat: number; lng: number }
}

const TimeControls = ({ date, setDate, coords }: Props) => {
  // Helper funcs που προσθέτουν/αφαιρούν ωρες/μερες/μηνες/χρονια στο date που χρησιμοποιεί το chart
  const addDays = (date: Date, days: number): Date => {
    const d = new Date(date)
    d.setDate(d.getDate() + days)
    return d
  }

  const addHours = (date: Date, hours: number): Date => {
    const d = new Date(date)
    d.setHours(d.getHours() + hours)
    return d
  }

  const addMonths = (date: Date, months: number): Date => {
    const d = new Date(date)
    d.setMonth(d.getMonth() + months)
    return d
  }

  const addYears = (date: Date, years: number): Date => {
    const d = new Date(date)
    d.setFullYear(d.getFullYear() + years)
    return d
  }

  // style consts
  const formattedDate = date.toLocaleString('el-GR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const formattedTime = date.toLocaleTimeString('el-GR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <View style={styles.card}>
      <Text style={styles.dateText}>
        {formattedDate} {formattedTime}
      </Text>

      <Text style={styles.coordsText}>
        ({coords.lat.toFixed(2)}, {coords.lng.toFixed(2)})
      </Text>

      <View style={styles.rowsWrap}>
        <View style={styles.row}>
          <Pressable
            style={styles.button}
            onPress={() => setDate((d) => addHours(d, -1))}
          >
            <Text style={styles.buttonText}>-1h</Text>
          </Pressable>

          <Pressable
            style={styles.button}
            onPress={() => setDate((d) => addHours(d, 1))}
          >
            <Text style={styles.buttonText}>+1h</Text>
          </Pressable>
        </View>

        <View style={styles.row}>
          <Pressable
            style={styles.button}
            onPress={() => setDate((d) => addDays(d, -1))}
          >
            <Text style={styles.buttonText}>-1d</Text>
          </Pressable>

          <Pressable
            style={styles.button}
            onPress={() => setDate((d) => addDays(d, 1))}
          >
            <Text style={styles.buttonText}>+1d</Text>
          </Pressable>
        </View>

        <View style={styles.row}>
          <Pressable
            style={styles.button}
            onPress={() => setDate((d) => addDays(d, -7))}
          >
            <Text style={styles.buttonText}>-1w</Text>
          </Pressable>

          <Pressable
            style={styles.button}
            onPress={() => setDate((d) => addDays(d, 7))}
          >
            <Text style={styles.buttonText}>+1w</Text>
          </Pressable>
        </View>

        <View style={styles.row}>
          <Pressable
            style={styles.button}
            onPress={() => setDate((d) => addMonths(d, -1))}
          >
            <Text style={styles.buttonText}>-1m</Text>
          </Pressable>

          <Pressable
            style={styles.button}
            onPress={() => setDate((d) => addMonths(d, 1))}
          >
            <Text style={styles.buttonText}>+1m</Text>
          </Pressable>
        </View>

        <View style={styles.row}>
          <Pressable
            style={styles.button}
            onPress={() => setDate((d) => addYears(d, -1))}
          >
            <Text style={styles.buttonText}>-1y</Text>
          </Pressable>

          <Pressable
            style={styles.button}
            onPress={() => setDate((d) => addYears(d, 1))}
          >
            <Text style={styles.buttonText}>+1y</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export default TimeControls

const styles = StyleSheet.create({
  card: {
    width: '100%',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 12,
  },
  dateText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  coordsText: {
    color: '#bbb',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  rowsWrap: {
    marginTop: 10,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  button: {
    backgroundColor: '#6c5ce7',
    minWidth: 70,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 12,
  },
})
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { colors } from '../../constants/constants' // assume έχεις yellow

type Props = {
  date: Date
  setDate: React.Dispatch<React.SetStateAction<Date>>
  coords: { lat: number; lng: number }
}

const TimeControls = ({ date, setDate, coords }: Props) => {

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

      {/* 🔥 HIGHLIGHT BLOCK */}
      {/* <View style={styles.header}>
        <Text style={styles.dateText}>
          {formattedDate} {formattedTime}
        </Text>

        <Text style={styles.coordsText}>
          ({coords.lat.toFixed(2)}, {coords.lng.toFixed(2)})
        </Text>
      </View> */}

      {/* 🔥 FULL VERTICAL BUTTONS */}
      <View style={styles.buttonsWrap}>

        <View style={styles.row}>
          <Btn label="-1h" onPress={() => setDate((d) => addHours(d, -1))} />
          <Btn label="+1h" onPress={() => setDate((d) => addHours(d, 1))} />
        </View>

        <View style={styles.row}>
          <Btn label="-1d" onPress={() => setDate((d) => addDays(d, -1))} />
          <Btn label="+1d" onPress={() => setDate((d) => addDays(d, 1))} />
        </View>

        <View style={styles.row}>
          <Btn label="-1w" onPress={() => setDate((d) => addDays(d, -7))} />
          <Btn label="+1w" onPress={() => setDate((d) => addDays(d, 7))} />
        </View>

        <View style={styles.row}>
          <Btn label="-1m" onPress={() => setDate((d) => addMonths(d, -1))} />
          <Btn label="+1m" onPress={() => setDate((d) => addMonths(d, 1))} />
        </View>

        <View style={styles.row}>
          <Btn label="-1y" onPress={() => setDate((d) => addYears(d, -1))} />
          <Btn label="+1y" onPress={() => setDate((d) => addYears(d, 1))} />
        </View>

      </View>
    </View>
  )
}

const Btn = ({ label, onPress }: { label: string; onPress: () => void }) => (
  <Pressable style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{label}</Text>
  </Pressable>
)

export default TimeControls

const styles = StyleSheet.create({
  card: {
    width: '100%',
    padding: 14,
    borderRadius: 16,

    // 🔥 glass
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },

  header: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  dateText: {
    color: '#1a1a1a', // rich dark
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },

  coordsText: {
    color: '#333',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },

  buttonsWrap: {
    gap: 10,
  },

  row: {
    flexDirection: 'row',
    gap: 10,
  },

  button: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#1a1a1a',
    fontWeight: '700',
    fontSize: 13,
  },
})
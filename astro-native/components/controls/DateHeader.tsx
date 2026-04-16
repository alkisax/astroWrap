// astro-native/components/controls/DateHeader.tsx

import { View, Text, StyleSheet } from 'react-native'
import { colors } from '../../constants/constants'

type Props = {
  date: Date
  coords: { lat: number; lng: number }
}

const DateHeader = ({ date, coords }: Props) => {

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
    <View style={styles.header}>
      <Text style={styles.dateText}>
        {formattedDate} {formattedTime}
      </Text>

      <Text style={styles.coordsText}>
        ({coords.lat.toFixed(2)}, {coords.lng.toFixed(2)})
      </Text>
    </View>
  )
}

export default DateHeader

const styles = StyleSheet.create({
  header: {
    width: '100%',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,

    backgroundColor: colors.primary,

    marginBottom: 8,
  },

  dateText: {
    color: '#1a1a1a',
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
})
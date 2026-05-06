// astro-native/components/chartInfo/biwheel/HouseOverlayBiwheel.native.tsx

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native'

import {
  colors,
  planetIcons,
} from '@/constants/constants'

type Overlay = {
  planet: string
  fromChart: 'A' | 'B'
  inHouseOf: 'A' | 'B'
  house: number | null
}

type Props = {
  overlays: Overlay[]
}

/*
  🏠 HOUSE OVERLAY

  Δείχνει σε ποιο house του άλλου chart
  πέφτουν οι πλανήτες.

  Παράδειγμα:
  A-Venus → B H7

  σημαίνει:
  η Venus του Α ατόμου
  ενεργοποιεί τον 7ο οίκο
  του Β ατόμου.

  Χρησιμοποιείται για:
  - relationship dynamics
  - attraction patterns
  - emotional focus
  - life-area activation
*/

const HouseOverlayBiwheel = ({
  overlays,
}: Props) => {

  if (!overlays?.length) return null

  const sorted = [...overlays].sort((a, b) => {
    if (a.inHouseOf !== b.inHouseOf) {
      return a.inHouseOf.localeCompare(b.inHouseOf)
    }

    return (a.house ?? 99) - (b.house ?? 99)
  })

  return (
    <ScrollView>

      <View style={styles.wrapper}>

        <Text style={styles.title}>
          🏠 House Overlay
        </Text>

        {sorted.map((o, i) => {

          const icon =
            planetIcons[o.planet] ?? '•'

          return (
            <View
              key={i}
              style={styles.row}
            >

              {/* left */}
              <Text style={styles.text}>
                {icon} {o.fromChart}-{o.planet}
              </Text>

              {/* middle */}
              <Text style={styles.text}>
                → {o.inHouseOf} H{o.house ?? '?'}
              </Text>

              {/* right */}
              <Text style={styles.dim}>
                overlay
              </Text>

            </View>
          )
        })}

      </View>

    </ScrollView>
  )
}

export default HouseOverlayBiwheel

const styles = StyleSheet.create({
  wrapper: {
    padding: 10,
    borderRadius: 12,

    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  title: {
    color: colors.dim,
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 12,
    fontWeight: '600',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingVertical: 6,
    paddingHorizontal: 6,

    borderRadius: 6,
    marginBottom: 4,

    backgroundColor: 'rgba(255,255,255,0.03)',
  },

  text: {
    color: colors.text,
    fontSize: 12,
  },

  dim: {
    color: colors.dim,
    fontSize: 11,
  },
})
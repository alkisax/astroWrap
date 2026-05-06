// astro-native\components\chartInfo\biwheel\TransitGrid.native.tsx
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native'

import type { ChartSummary } from '@/types/types'

import {
  colors,
  aspectIcons,
} from '@/constants/constants'

import { findTwoChartAspects } from '@/utils/TwoChartsAspectFinder'
import { buildTransitAspectsGrid } from '@/utils/buildTransitAspectsGrid'

type Props = {
  radix: ChartSummary
  transit: ChartSummary
}

/*
  🔮 TRANSIT / SYNastry GRID

  Ο πίνακας δείχνει συνοπτικά
  ποιες όψεις υπάρχουν μεταξύ
  δύο charts.
  Rows:
  transit / δεύτερο chart
  Columns:
  natal / πρώτο chart
  Το κάθε κελί δείχνει:
  conjunction / square / trine κλπ.
  Χρησιμοποιείται για:
  - γρήγορο pattern recognition
  - synastry overview
  - transit scanning
  - aspect clustering
*/

const TransitGrid = ({
  radix,
  transit,
}: Props) => {

  const aspects = findTwoChartAspects(radix, transit)
    .filter(a => (a.orb ?? 999) <= 3)
    .sort((a, b) => (a.orb ?? 999) - (b.orb ?? 999))

  const {
    rows,
    cols,
    grid,
  } = buildTransitAspectsGrid(aspects)

  return (
    <ScrollView horizontal>

      <View style={styles.wrapper}>

        <Text style={styles.title}>
          Transit Aspects Grid
        </Text>

        {/* header */}
        <View style={styles.row}>

          <View style={styles.cornerCell}>
            <Text style={styles.headerText}></Text>
          </View>

          {cols.map(c => (
            <View
              key={c}
              style={styles.headerCell}
            >
              <Text style={styles.headerText}>
                N-{c}
              </Text>
            </View>
          ))}

        </View>

        {/* body */}
        {rows.map((r, i) => (
          <View
            key={r}
            style={styles.row}
          >

            {/* left label */}
            <View style={styles.sideCell}>
              <Text style={styles.sideText}>
                T-{r}
              </Text>
            </View>

            {/* cells */}
            {grid[i].map((cell, j) => (
              <View
                key={j}
                style={styles.cell}
              >
                <Text style={styles.cellText}>
                  {cell
                    ? aspectIcons[cell.type]
                    : ''}
                </Text>
              </View>
            ))}

          </View>
        ))}

      </View>

    </ScrollView>
  )
}

export default TransitGrid

const CELL = 34

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
  },

  cornerCell: {
    width: CELL,
    height: CELL,
    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  headerCell: {
    width: CELL,
    height: CELL,

    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  sideCell: {
    width: CELL,
    height: CELL,

    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  cell: {
    width: CELL,
    height: CELL,

    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  headerText: {
    color: colors.text,
    fontSize: 9,
    textAlign: 'center',
  },

  sideText: {
    color: colors.text,
    fontSize: 9,
    fontWeight: '600',
  },

  cellText: {
    color: colors.text,
    fontSize: 14,
  },
})
// astro-native/components/chartInfo/biwheel/EagleLarkGridList.native.tsx

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native'

import { useState } from 'react'

import type {
  ChartSummary,
} from '@/types/types'

import {
  aspectIcons,
  planetIcons,
  colors,
  houseKeywords,
  planetKeywords,
} from '@/constants/constants'

import { findTwoChartAspects } from '@/utils/TwoChartsAspectFinder'
import { buildEagleLarkGrids } from '@/utils/buildEagleLarkGrids'

type Props = {
  radix: ChartSummary
  transit: ChartSummary
}

/*
  🦅 EAGLE / LARK GRID

  Μέθοδος predictive astrology
  βασισμένη στο:
  cause → event → effect

  Cause:
  από ποιον τομέα ζωής
  ξεκινά η κατάσταση

  Event:
  πού εκδηλώνεται τώρα
  το transit

  Effect:
  ποιοι άλλοι τομείς
  επηρεάζονται μετά

  Χρησιμοποιείται για:
  - transit interpretation
  - synastry dynamics
  - event chains
  - life themes
*/

const EagleLarkGridList = ({
  radix,
  transit,
}: Props) => {

  const [selected, setSelected] =
    useState<string | null>(null)

  const EXCLUDED_POINTS = [
    'Ascendant',
    'Midheaven',
    'IC',
    'DC',
  ]

  const aspects = findTwoChartAspects(radix, transit)
    .filter(a => (a.orb ?? 999) <= 3)
    .filter((a) => {

      const tName =
        a.point1Label.replace('T-', '')

      const nName =
        a.point2Label.replace('N-', '')

      return (
        !EXCLUDED_POINTS.includes(tName) &&
        !EXCLUDED_POINTS.includes(nName)
      )
    })

  const grids = buildEagleLarkGrids(
    radix,
    transit,
    aspects,
  )

  const handleClick = (
    value: string,
  ) => {
    setSelected(value)
  }

  const renderKeywords = () => {
    if (!selected) return null

    const num = Number(selected)

    if (!isNaN(num)) {
      return houseKeywords[
        num as keyof typeof houseKeywords
      ]?.join(', ')
    }

    return planetKeywords[
      selected as keyof typeof planetKeywords
    ]?.join(', ')
  }

  if (!grids.length) return null

  return (
    <View style={styles.container}>

      {grids.map((g, i) => (

        <View
          key={i}
          style={styles.card}
        >

          {/* header */}
          <Text style={styles.header}>

            Transit:
            {' '}

            {planetIcons[g.transitPlanet]}
            {' '}
            {g.transitPlanet}

            {' '}

            {aspectIcons[g.aspect]}

            {' '}

            Natal:
            {' '}

            {planetIcons[g.natalPlanet]}
            {' '}
            {g.natalPlanet}

            {' '}
            (
            {g.orb?.toFixed(2)}°
            )

          </Text>

          {/* grid */}
          <ScrollView horizontal>

            <View style={styles.table}>

              {/* top row */}
              <View style={styles.row}>

                <View style={styles.labelCell}>
                  <Text style={styles.labelText}></Text>
                </View>

                <View style={styles.cell}>
                  <Text style={styles.cellText}>
                    Transit
                  </Text>
                </View>

                <View style={styles.cell}>
                  <Text style={styles.cellText}>
                    Natal
                  </Text>
                </View>

              </View>

              {/* planets */}
              <View style={styles.row}>

                <View style={styles.labelCell}>
                  <Text style={styles.labelText}>
                    Planet
                  </Text>
                </View>

                <View style={styles.cell}>
                  <Text style={styles.cellText}>
                    {planetIcons[g.transitPlanet]}
                    {' '}
                    {g.transitPlanet}
                  </Text>
                </View>

                <View style={styles.cell}>
                  <Text style={styles.cellText}>
                    {planetIcons[g.natalPlanet]}
                    {' '}
                    {g.natalPlanet}
                  </Text>
                </View>

              </View>

              {/* cause */}
              <View style={styles.row}>

                <View style={styles.labelCell}>
                  <Text style={styles.labelText}>
                    Natal House
                  </Text>
                </View>

                <Pressable
                  style={styles.cell}
                  onPress={() =>
                    handleClick(
                      String(
                        g.cause.transitNatalHouse,
                      ),
                    )
                  }
                >
                  <Text style={styles.cellText}>
                    {g.cause.transitNatalHouse ?? '-'}
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.cell}
                  onPress={() =>
                    handleClick(
                      String(
                        g.cause.natalHouse,
                      ),
                    )
                  }
                >
                  <Text style={styles.cellText}>
                    {g.cause.natalHouse ?? '-'}
                  </Text>
                </Pressable>

              </View>

              {/* action */}
              <View style={styles.row}>

                <View style={styles.labelCell}>
                  <Text style={styles.labelText}>
                    Transit House
                  </Text>
                </View>

                <Pressable
                  style={styles.cell}
                  onPress={() =>
                    handleClick(
                      String(
                        g.action.transitHouse,
                      ),
                    )
                  }
                >
                  <Text style={styles.cellText}>
                    {g.action.transitHouse ?? '-'}
                  </Text>
                </Pressable>

                <View style={styles.cell}>
                  <Text style={styles.cellText}></Text>
                </View>

              </View>

              {/* effect */}
              <View style={styles.row}>

                <View style={styles.labelCell}>
                  <Text style={styles.labelText}>
                    Ruled Houses
                  </Text>
                </View>

                <Pressable
                  style={styles.cell}
                  onPress={() =>
                    handleClick(
                      g.effect.transitRules[0]?.toString(),
                    )
                  }
                >
                  <Text style={styles.cellText}>
                    {g.effect.transitRules.join(', ') || '-'}
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.cell}
                  onPress={() =>
                    handleClick(
                      g.effect.natalRules[0]?.toString(),
                    )
                  }
                >
                  <Text style={styles.cellText}>
                    {g.effect.natalRules.join(', ') || '-'}
                  </Text>
                </Pressable>

              </View>

            </View>

          </ScrollView>

          {/* keywords */}
          {selected && (

            <View style={styles.keywordBox}>

              <Text style={styles.keywordText}>
                🔍
                {' '}
                {selected}
                {' '}
                →
                {' '}
                {renderKeywords()}
              </Text>

            </View>

          )}

        </View>

      ))}

    </View>
  )
}

export default EagleLarkGridList

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },

  card: {
    padding: 12,
    borderRadius: 12,

    backgroundColor: colors.panel,

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  header: {
    color: colors.dim,
    textAlign: 'center',

    marginBottom: 10,

    fontSize: 12,
  },

  table: {},

  row: {
    flexDirection: 'row',
  },

  labelCell: {
    width: 110,
    minHeight: 40,

    justifyContent: 'center',

    padding: 6,

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',

    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  labelText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 11,
  },

  cell: {
    width: 110,
    minHeight: 40,

    justifyContent: 'center',
    alignItems: 'center',

    padding: 6,

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },

  cellText: {
    color: colors.text,
    textAlign: 'center',
    fontSize: 11,
  },

  keywordBox: {
    marginTop: 10,

    padding: 8,
    borderRadius: 8,

    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  keywordText: {
    color: colors.dim,
    fontSize: 11,
  },
})
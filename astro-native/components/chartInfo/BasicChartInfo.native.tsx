// astro-native\components\chartInfo\BasicChartInfo.native.tsx
import { StyleSheet, ScrollView } from 'react-native'
import { useChartAnalysis } from '../../hooks/componentHooks/useChartAnalysis'

import PlanetTable from './PlanetTable'
import ChartRuler from './ChartRuler'
import BalanceSummary from './BalanceSummary'
import AspectsList from './AspectsList'

type Props = {
  data: any
  userOrb: number
}

const BasicChartInfo = ({ data, userOrb }: Props) => {
  const {
    aspects,
    balance,
  } = useChartAnalysis(data, userOrb)

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PlanetTable data={data} />

      <ChartRuler data={data} />

      <BalanceSummary data={data} balance={balance} />

      <AspectsList aspects={aspects} />
    </ScrollView>
  )
}

export default BasicChartInfo

const styles = StyleSheet.create({
  container: {
    padding: 8,
    gap: 8,
    backgroundColor: '#000',
  },
})
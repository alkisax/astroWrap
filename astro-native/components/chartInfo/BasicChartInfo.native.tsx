// astro-native/components/chartInfo/BasicChartInfo.native.tsx

import { StyleSheet, ScrollView, View } from 'react-native'
import { useChartAnalysis } from '../../hooks/componentHooks/useChartAnalysis'
import { colors } from '../../constants/constants'

import PlanetTable from './PlanetTable'
import ChartRuler from './ChartRuler'
import BalanceSummary from './BalanceSummary'
import AspectsList from './AspectsList'
import GlassPanel from '../ui/GlassPanel'

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
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <GlassPanel>
        <PlanetTable data={data} />
      </GlassPanel>

      <GlassPanel>
        <ChartRuler data={data} />
      </GlassPanel>

      <GlassPanel>
        <BalanceSummary data={data} balance={balance} />
      </GlassPanel>

      <GlassPanel>
        <AspectsList aspects={aspects} />
      </GlassPanel>
    </ScrollView>
  )
}

export default BasicChartInfo

const styles = StyleSheet.create({
  container: {
    padding: 10,
    gap: 10,
  },

  glassCard: {
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',

    // λίγο depth
    shadowColor: colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },

    elevation: 3,
  },
})
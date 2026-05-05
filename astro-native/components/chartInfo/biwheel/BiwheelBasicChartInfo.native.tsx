import { ScrollView, StyleSheet, Text } from 'react-native'
import { useChartAnalysis } from '../../../hooks/componentHooks/useChartAnalysis'
import PlanetTable from '../PlanetTable'
import GlassPanel from '../../ui/GlassPanel'
import { useEffect } from 'react'
import type { CustomAspect, ChartSummary } from '@/types/types'
import { globalStyles } from '../../../layout/global'
// import type { ChartSummary } from '@/types/astro.types'


type Props = {
  data1: ChartSummary
  data2: ChartSummary
  userOrb: number
  setCustomAspects?: (a: CustomAspect[]) => void
}

const BiwheelBasicChartInfo = ({
  data1,
  data2,
  userOrb,
  setCustomAspects,
}: Props) => {

  const { aspects } = useChartAnalysis(data1, userOrb)

  useEffect(() => {
    if (setCustomAspects) {
      setCustomAspects(aspects)
    }
  }, [aspects, setCustomAspects])

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* YOU */}
    <GlassPanel>
      <Text style={globalStyles.sectionLabel}>You</Text>
      <PlanetTable data={data1} />
    </GlassPanel>

    {/* OTHER */}
    <GlassPanel>
      <Text style={globalStyles.sectionLabel}>Other</Text>
      <PlanetTable data={data2} />
    </GlassPanel>

    </ScrollView>
  )
}

export default BiwheelBasicChartInfo

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
})
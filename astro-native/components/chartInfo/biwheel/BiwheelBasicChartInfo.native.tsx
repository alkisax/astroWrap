// astro-native\components\chartInfo\biwheel\BiwheelBasicChartInfo.native.tsx
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native'
import { useChartAnalysis } from '../../../hooks/componentHooks/useChartAnalysis'
import PlanetTable from '../PlanetTable'
import GlassPanel from '../../ui/GlassPanel'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import type { CustomAspect, ChartSummary } from '@/types/types'
import { globalStyles } from '../../../layout/global'
import PlanetSelector from '../../controls/PlanetSelector'

type Props = {
  data1: ChartSummary
  data2: ChartSummary
  userOrb: number
  setCustomAspects?: (a: CustomAspect[]) => void
  selectedPlanets: string[]
  setSelectedPlanets: Dispatch<SetStateAction<string[]>>
}

const BiwheelBasicChartInfo = ({
  data1,
  data2,
  userOrb,
  setCustomAspects,
  selectedPlanets,
  setSelectedPlanets,
}: Props) => {
  const [showPlanets, setShowPlanets] = useState(false)
  const [showTables, setShowTables] = useState(false)

  const { aspects } = useChartAnalysis(data1, userOrb)

  useEffect(() => {
    if (setCustomAspects) {
      setCustomAspects(aspects)
    }
  }, [aspects, setCustomAspects])

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <GlassPanel>
        <Pressable onPress={() => setShowPlanets(!showPlanets)}>
          <Text style={globalStyles.sectionLabel}>
            🪐 Visible Planets {showPlanets ? '▲' : '▼'}
          </Text>
        </Pressable>

        {showPlanets && (
          <PlanetSelector
            selected={selectedPlanets}
            setSelected={setSelectedPlanets}
          />
        )}
      </GlassPanel>

      <GlassPanel>
        <Pressable onPress={() => setShowTables(!showTables)}>
          <Text style={globalStyles.sectionLabel}>
            🌛 Planet Tables {showTables ? '▲' : '▼'}
          </Text>
        </Pressable>

        {showTables && (
          <>
            {/* YOU */}
            <Text style={globalStyles.subLabel}>You</Text>
            <PlanetTable data={data1} />

            {/* OTHER */}
            <Text style={[globalStyles.subLabel, { marginTop: 10 }]}>
              Other
            </Text>
            <PlanetTable data={data2} />
          </>
        )}
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
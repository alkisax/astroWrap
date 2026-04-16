// astro-native/components/chartInfo/BasicChartInfo.native.tsx

import { StyleSheet, ScrollView, Pressable, Text } from 'react-native'
import { useChartAnalysis } from '../../hooks/componentHooks/useChartAnalysis'
import { colors } from '../../constants/constants'

import PlanetTable from './PlanetTable'
import ChartRuler from './ChartRuler'
import BalanceSummary from './BalanceSummary'
import MostImportantAspects from './MostImportantAspects'
import GlassPanel from '../ui/GlassPanel'
import { ChartSummary, CustomAspect } from '@/types/types'
import { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Props = {
  data: ChartSummary
  userOrb: number
  setCustomAspects: (a: CustomAspect[]) => void
  customAspects: CustomAspect[]
}

const BasicChartInfo = ({
  data,
  userOrb,
  setCustomAspects,
  customAspects,
}: Props) => {
  const {
    aspects,
    balance,
  } = useChartAnalysis(data, userOrb)

  const insets = useSafeAreaInsets()

  const [openSections, setOpenSections] = useState({
    aspects: false,
  })

  const toggleSection = (key: 'aspects') => {
    setOpenSections(prev => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // 🔥 EXACT SAME LOGIC AS WEB
  useEffect(() => {
    setCustomAspects(aspects)
  }, [aspects, setCustomAspects])

  // console.log('NATIVE aspects', aspects)
  // console.log('NATIVE customAspects', customAspects)

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { paddingBottom: insets.bottom + 20 }, // 👈 KEY FIX
      ]}
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
        <Pressable
          style={styles.sectionHeader}
          onPress={() => toggleSection('aspects')}
        >
          <Text style={styles.sectionTitle}>
            ✨ Aspects {openSections.aspects ? '▲' : '▼'}
          </Text>
        </Pressable>

        {openSections.aspects && (
          <MostImportantAspects aspects={aspects} />
        )}
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

  sectionHeader: {
    paddingVertical: 6,
  },

  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
})
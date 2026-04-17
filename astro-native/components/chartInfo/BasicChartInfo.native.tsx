// astro-native/components/chartInfo/BasicChartInfo.native.tsx

import { StyleSheet, ScrollView, Pressable, Text } from 'react-native'
import { useChartAnalysis } from '../../hooks/componentHooks/useChartAnalysis'
import { colors } from '../../constants/constants'

import PlanetTable from './PlanetTable'
import ChartRuler from './ChartRuler'
import BalanceSummary from './BalanceSummary'
import MostImportantAspects from './MostImportantAspects'
import GlassPanel from '../ui/GlassPanel'
import { ChartSummary, CustomAspect, CustomHouseRuler } from '@/types/types'
import { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import HouseRulers from './HouseRulers.native'
import EssentialDignities from './EssentialDignities'
import DispositorTree from './DispositorTree'
import Markdown from 'react-native-markdown-display'

type Props = {
  data: ChartSummary
  userOrb: number
  setCustomAspects: (a: CustomAspect[]) => void
  customAspects: CustomAspect[]
  setCustomHouseRulers: (rulers: CustomHouseRuler[]) => void

  handleLLMClick: () => void
  showLLM: boolean
  llmResult: string | null
  llmLoading: boolean
  llmError: string | null
  saveLLMToDb: () => void
  setCustomPlanetInfo: (v: any) => void
  setCustomChartRuler: (v: any) => void
  setCustomBalance: (v: any) => void
  setCustomDignities: (v: any) => void
  setCustomDispositors: (v: any) => void
  setCustomDynamics: (v: any) => void
}

const BasicChartInfo = ({
  data,
  userOrb,
  setCustomAspects,
  customAspects,
  setCustomHouseRulers,
  handleLLMClick,
  showLLM,
  llmResult,
  llmLoading,
  llmError,
  saveLLMToDb,
  setCustomPlanetInfo,
  setCustomChartRuler,
  setCustomBalance,
  setCustomDignities,
  setCustomDispositors,
  setCustomDynamics,
}: Props) => {

  const insets = useSafeAreaInsets()

  const [openSections, setOpenSections] = useState({
    aspects: false,
    houses: false,
    dignities: false,
    dispositors: false,
  })

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const {
    aspects,
    balance,
    dignities,
    dispositors,
    dynamics,
    chartRuler,
    houseRulers,
    planetInfo
  } = useChartAnalysis(data, userOrb)

  useEffect(() => {
    setCustomPlanetInfo(planetInfo)
    setCustomAspects(aspects)
    setCustomChartRuler(chartRuler)
    setCustomHouseRulers(houseRulers)

    if (balance) {
      setCustomBalance(balance)
    }

    setCustomDignities(dignities)
    setCustomDispositors(dispositors)
    setCustomDynamics(dynamics)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    aspects,
    houseRulers,
    balance,
    dignities,
    dispositors,
    dynamics,
    chartRuler,
    planetInfo,
  ])


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

      <GlassPanel>
        <Pressable
          style={styles.sectionHeader}
          onPress={() => toggleSection('houses')}
        >
          <Text style={styles.sectionTitle}>
            🏠 House Rulers {openSections.houses ? '▲' : '▼'}
          </Text>
        </Pressable>

        {openSections.houses && (
          <HouseRulers
            data={data}
            setCustomHouseRulers={setCustomHouseRulers}
          />
        )}
      </GlassPanel>

      <GlassPanel>
        <Pressable
          style={styles.sectionHeader}
          onPress={() => toggleSection('dignities')}
        >
          <Text style={styles.sectionTitle}>
            ⚖️ Essential Dignities {openSections.dignities ? '▲' : '▼'}
          </Text>
        </Pressable>

        {openSections.dignities && (
          <EssentialDignities data={data} />
        )}
      </GlassPanel>

      <GlassPanel>
        <Pressable
          style={styles.sectionHeader}
          onPress={() => toggleSection('dispositors')}
        >
          <Text style={styles.sectionTitle}>
            🌳 Dispositor Tree {openSections.dispositors ? '▲' : '▼'}
          </Text>
        </Pressable>

        {openSections.dispositors && (
          <DispositorTree data={data} />
        )}
      </GlassPanel>

      <GlassPanel>
        <Pressable onPress={handleLLMClick}>
          <Text style={styles.sectionTitle}>
            {llmLoading
              ? '⏳ Loading...'
              : llmError
                ? 'Error ❌'
                : 'call Lark 🦜'}
          </Text>
        </Pressable>

        {showLLM && (
          <>
            {llmLoading && (
              <Text style={{ color: colors.dim }}>
                Generating interpretation...
              </Text>
            )}

            {llmError && (
              <Text style={{ color: 'red' }}>
                Failed to load interpretation
              </Text>
            )}

            {llmResult && (
              <Markdown style={{ body: { color: colors.text } }}>
                {llmResult}
              </Markdown>
            )}

            {llmResult && (
              <Pressable
                onPress={saveLLMToDb}
                style={{
                  marginTop: 10,
                  padding: 10,
                  backgroundColor: colors.secondary,
                  borderRadius: 8,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: colors.text, fontWeight: '600' }}>
                  Save interpretation
                </Text>
              </Pressable>
            )}
          </>
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
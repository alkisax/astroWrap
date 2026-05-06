// astro-native\components\chartInfo\biwheel\BiwheelBasicChartInfo.native.tsx
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native'
import { useChartAnalysis } from '../../../hooks/componentHooks/useChartAnalysis'
import PlanetTable from '../PlanetTable'
import GlassPanel from '../../ui/GlassPanel'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import type { CustomAspect, ChartSummary, Overlay, Compatibility } from '@/types/types'
import { globalStyles } from '../../../layout/global'
import PlanetSelector from '../../controls/PlanetSelector'
import HouseRulers from '../HouseRulers.native'
import MostImportantAspects from '../MostImportantAspects'
import TwoChartsAspectsTable from '../biwheel/TwoChartsAspectsTable.native'
import TransitGrid from './TransitGrid.native'
import HouseOverlayBiwheel from './HouseOverlayBiwheel.native'
import EagleLarkGridList from './EagleLarkGridList.native'

import LlmRelationship from './LlmRelationship'


type Props = {
  data1: ChartSummary
  data2: ChartSummary
  userOrb: number
  setCustomAspects?: (a: CustomAspect[]) => void
  selectedPlanets: string[]
  setSelectedPlanets: Dispatch<SetStateAction<string[]>>
  radixCustomAspects: CustomAspect[]
  transitCustomAspects: CustomAspect[]
  houseOverlay: Overlay[]

  compatibility: Compatibility
  handleBiwheelLLM: () => Promise<string | null>
  llmLoading: boolean
  llmError: string | null
}

const BiwheelBasicChartInfo = ({
  data1,
  data2,
  userOrb,
  setCustomAspects,
  selectedPlanets,
  setSelectedPlanets,
  radixCustomAspects,
  transitCustomAspects,
  houseOverlay,
  compatibility,
  handleBiwheelLLM,
  llmLoading,
  llmError,
}: Props) => {
  const [showPlanets, setShowPlanets] = useState(false)
  const [showTables, setShowTables] = useState(false)
  const [showRulers, setShowRulers] = useState(false)
  const [showAspects, setShowAspects] = useState(false)
  const [showCrossAspects, setShowCrossAspects] = useState(false)
  const [showGrid, setShowGrid] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  const [showEagle, setShowEagle] = useState(false)
  const [showAstroInfo, setShowAstroInfo] = useState(false)

  const { aspects } = useChartAnalysis(data1, userOrb)

  useEffect(() => {
    if (setCustomAspects) {
      setCustomAspects(aspects)
    }
  }, [aspects, setCustomAspects])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <GlassPanel>
        <Text style={globalStyles.sectionLabel}>
          Relationship Analysis
        </Text>
        <Text style={[globalStyles.subLabel, { textAlign: 'center' }]}>
          using Llm
        </Text>
        <LlmRelationship
          compatibility={compatibility}
          handleBiwheelLLM={handleBiwheelLLM}
          llmLoading={llmLoading}
          llmError={llmError}
        />
      </GlassPanel>

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

      <GlassPanel>

        <Pressable onPress={() => setShowAstroInfo(!showAstroInfo)}>
          <Text style={globalStyles.sectionLabel}>
            🦅 Eagle Info (Astrological Calculations)
            {' '}
            {showAstroInfo ? '▲' : '▼'}
          </Text>
        </Pressable>

        {showAstroInfo && (
          <>

            <GlassPanel>
              <Pressable onPress={() => setShowRulers(!showRulers)}>
                <Text style={globalStyles.sectionLabel}>
                  🏠 House Rulers {showRulers ? '▲' : '▼'}
                </Text>
              </Pressable>

              {showRulers && (
                <>
                  {/* YOU */}
                  <Text style={globalStyles.sectionLabel}>You</Text>

                  <HouseRulers
                    data={data1}
                    setCustomHouseRulers={() => { }}
                  />

                  {/* OTHER */}
                  <Text
                    style={[
                      globalStyles.sectionLabel,
                      { marginTop: 10 },
                    ]}
                  >
                    Other
                  </Text>

                  <HouseRulers
                    data={data2}
                    setCustomHouseRulers={() => { }}
                  />
                </>
              )}
            </GlassPanel>

            <GlassPanel>
              <Pressable onPress={() => setShowAspects(!showAspects)}>
                <Text style={globalStyles.sectionLabel}>
                  🔗 Aspects {showAspects ? '▲' : '▼'}
                </Text>
              </Pressable>

              {showAspects && (
                <>
                  {/* YOU */}
                  <Text style={globalStyles.sectionLabel}>You</Text>

                  <MostImportantAspects
                    aspects={radixCustomAspects}
                  />

                  {/* OTHER */}
                  <Text
                    style={[
                      globalStyles.sectionLabel,
                      { marginTop: 10 },
                    ]}
                  >
                    Other
                  </Text>

                  <MostImportantAspects
                    aspects={transitCustomAspects}
                  />
                </>
              )}
            </GlassPanel>

            <GlassPanel>
              <Pressable onPress={() => setShowCrossAspects(!showCrossAspects)}>
                <Text style={globalStyles.sectionLabel}>
                  🔮 Cross Aspects {showCrossAspects ? '▲' : '▼'}
                </Text>
              </Pressable>

              {showCrossAspects && (
                <TwoChartsAspectsTable
                  radix={data1}
                  transit={data2}
                />
              )}
            </GlassPanel>

            <GlassPanel>
              <Pressable onPress={() => setShowGrid(!showGrid)}>
                <Text style={globalStyles.sectionLabel}>
                  💫 Aspect Grid {showGrid ? '▲' : '▼'}
                </Text>
              </Pressable>

              {showGrid && (
                <TransitGrid
                  radix={data1}
                  transit={data2}
                />
              )}
            </GlassPanel>

            <GlassPanel>
              <Pressable onPress={() => setShowOverlay(!showOverlay)}>
                <Text style={globalStyles.sectionLabel}>
                  🏠 House Overlay {showOverlay ? '▲' : '▼'}
                </Text>
              </Pressable>

              {showOverlay && (
                <HouseOverlayBiwheel
                  overlays={houseOverlay}
                />
              )}
            </GlassPanel>

            <GlassPanel>
              <Pressable onPress={() => setShowEagle(!showEagle)}>
                <Text style={globalStyles.sectionLabel}>
                  🦅 Eagle {showEagle ? '▲' : '▼'}
                </Text>
              </Pressable>

              {showEagle && (
                <EagleLarkGridList
                  radix={data1}
                  transit={data2}
                />
              )}
            </GlassPanel>

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
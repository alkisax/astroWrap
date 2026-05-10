// astro-native\components\chartInfo\biwheel\PredictionBasicChartInfo.native.tsx

import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useChartAnalysis } from '../../../hooks/componentHooks/useChartAnalysis'
import PlanetTable from '../PlanetTable'
import GlassPanel from '../../ui/GlassPanel'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import type { CustomAspect, ChartSummary, Overlay, Compatibility, CustomPlanetInfo, EagleGrid } from '@/types/types'
import { globalStyles } from '../../../layout/global'
import PlanetSelector from '../../controls/PlanetSelector'
import HouseRulers from '../HouseRulers.native'
import MostImportantAspects from '../MostImportantAspects'
import TwoChartsAspectsTable from '../biwheel/TwoChartsAspectsTable.native'
import TransitGrid from './TransitGrid.native'
import HouseOverlayBiwheel from './HouseOverlayBiwheel.native'
import EagleLarkGridList from './EagleLarkGridList.native'

import QuestionModal from './QuestionModal.native'
import { useEagleLarkLLm } from '@/hooks/componentHooks/useEagleLarkLLm'
import Markdown from 'react-native-markdown-display'
import { markdownStyles } from '@/layout/markdownStyles'
import { colors } from '@/constants/constants'


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
  radixCustomPlanetInfo: CustomPlanetInfo[]
  transitCustomPlanetInfo: CustomPlanetInfo[]
  eagleGrids: EagleGrid[]
}

const PredictionBasicChartInfo = ({
  data1,
  data2,
  userOrb,
  setCustomAspects,
  selectedPlanets,
  setSelectedPlanets,
  radixCustomAspects,
  transitCustomAspects,
  houseOverlay,
  radixCustomPlanetInfo,
  transitCustomPlanetInfo,
  eagleGrids,
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
  const [showQuestionModal, setShowQuestionModal] = useState(false)

  const { aspects } = useChartAnalysis(data1, userOrb)

  const {
    selectedTopics,
    setSelectedTopics,
    userQuestion,
    setUserQuestion,
    handleQuestionSubmit,
    showLLM,
    loaded,
    isProcessing,
    llmEagleLarkResult,
    llmEagleLarkLoading,
    llmEagleLarkError,
    setLlmEagleLarkResult,
  } = useEagleLarkLLm({
    eagleGrids,
    radixCustomPlanetInfo,
    transitCustomPlanetInfo,
  })

  useEffect(() => {
    if (setCustomAspects) {
      setCustomAspects(aspects)
    }
  }, [aspects, setCustomAspects])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <GlassPanel>
        <Text style={globalStyles.sectionLabel}>
          Prediction with Aspects
        </Text>

        <Text
          style={[
            globalStyles.subLabel,
            { textAlign: 'center' }
          ]}
        >
          B. Brady method - using llm
        </Text>

        <Pressable
          onPress={() => {
            setShowQuestionModal(true)
            setLlmEagleLarkResult(null)
          }}
          style={globalStyles.llmButton}
        >
          <Text style={globalStyles.llmButtonText}>
            ask specific question
          </Text>
        </Pressable>
      </GlassPanel>

      <QuestionModal
        visible={showQuestionModal}
        onClose={() => setShowQuestionModal(false)}
        selectedTopics={selectedTopics}
        setSelectedTopics={setSelectedTopics}
        userQuestion={userQuestion}
        setUserQuestion={setUserQuestion}
        onSubmit={() => {
          handleQuestionSubmit()
          setShowQuestionModal(false)
        }}
        llmEagleLarkLoading={llmEagleLarkLoading}
        llmEagleLarkError={llmEagleLarkError}
        loaded={loaded}
        isProcessing={isProcessing}
      />

      {showLLM && llmEagleLarkResult && (
        <View style={globalStyles.llmResultBox}>

          <Text
            style={[
              globalStyles.sectionLabel,
              { marginBottom: 10 }
            ]}
          >
            🔮 Prediction Result
          </Text>

          <Markdown
            style={markdownStyles}
          >
            {llmEagleLarkResult}
          </Markdown>

        </View>
      )}

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
          <Text
            style={{
              color: colors.dim,
              fontSize: 12,
              marginTop: 4,
            }}
          >
            Beta testing — calculations and interpretations may need further tuning.
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

export default PredictionBasicChartInfo

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
})
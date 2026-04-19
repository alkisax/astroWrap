// app/single.tsx

import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native'
import { useMemo } from 'react'
import { WebView } from 'react-native-webview'
import { useHome } from '../hooks/componentHooks/useHome'
import BasicControls from '../components/controls/BasicControls'
import BasicChartInfo from '@/components/chartInfo/BasicChartInfo.native'
import ScreenWrapper from '../components/layout/ScreenWrapper'

export default function Single() {
  // ολη η λογική του component έχει μεταφερθεί σε hook
  const {
    data,
    visiblePlanets,
    setVisiblePlanets,
    date,
    setDate,
    coords,
    userOrb,
    setUserOrb,
    handleSubmit,
    // shaken,
    // handleLLMInterpretation,
    handleLLMClick,
    showLLM,
    llmResult,
    llmLoading,
    llmError,
    loaded,
    isProcessing,
    saveLLMToDb,

    // ολα αυτά τα custom είναι συμπτύξεις των διάφορων reports για να φτιαχτεί ένα απλοποιημένο json,
    // γινονται expose απο το hook για να περαστουν στα διαφορα αρχεία οι setters και να μπορώ
    // να έχω ένα ενιαίο state useHome όπου και κατασκευάζεται το json
    setCustomPlanetInfo,
    setCustomChartRuler,
    setCustomBalance,
    setCustomHouseRulers,
    customAspects,
    setCustomAspects,
    setCustomDignities,
    setCustomDispositors,
    setCustomDynamics,
  } = useHome()

  // το κρατάμε εδώ μόνο για debug / sanity check
  // shaken → ενα απλοποιημένο json για να στέλνετε σε gpt για αναλυση
  // console.log('shaken', shaken)
  // console.log(data)

  // φτιάχνουμε το webview url μόνο με τα primitive inputs
  // το web page θα κάνει μόνο του fetch το chart και render το AstroChart
  const chartUrl = useMemo(() => {
    const params = new URLSearchParams({
      date: date.toISOString(),
      lat: String(coords.lat),
      lng: String(coords.lng),
      userOrb: String(userOrb),
      planets: visiblePlanets.join(','),
    })

    return `https://astro.portfolio-projects.space/chart-mobile?${params.toString()}`
  }, [date, coords.lat, coords.lng, userOrb, visiblePlanets])

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Single Chart</Text>

        {/* προσωρινό debug info μέχρι να μπουν τα κανονικά reports */}
        {!data && (
          <Text style={styles.loading}>
            Loading chart...
          </Text>
        )}

        {data && (
          <>
            {/* εδώ δείχνουμε μόνο το chart μέσω webview
              στο native θα παίξει κανονικά
              στο web δεν υποστηρίζεται απο react-native-webview, οπότε δείχνουμε fallback */}
            <View style={styles.webviewWrap}>
              {Platform.OS === 'web' ? (
                <View style={styles.webFallback}>
                  <Text style={styles.webFallbackText}>
                    WebView works only on Android/iOS. Open this screen in Expo Go or emulator.
                  </Text>

                  <Text style={styles.webFallbackUrl}>
                    {chartUrl}
                  </Text>
                </View>
              ) : (
                <WebView
                  key={chartUrl}
                  source={{ uri: chartUrl }}
                  injectedJavaScript={`
                    document.body.style.background = 'transparent';
                    document.documentElement.style.background = 'transparent';
                    true;
                  `}
                  style={{ flex: 1, backgroundColor: 'transparent' }}
                  containerStyle={{ backgroundColor: 'transparent' }}
                  androidLayerType="software"
                  javaScriptEnabled
                  domStorageEnabled
                  originWhitelist={['*']}
                  startInLoadingState
                />
              )}
            </View>
          </>
        )}

        {/* basic panel οπως το θέλουμε σιγά σιγά να οργανωθεί
          εδώ μέσα θα μπει TimeControls, WebView chart, PlanetSelector κλπ */}
        <BasicControls
          onSubmit={handleSubmit}
          visiblePlanets={visiblePlanets}
          setVisiblePlanets={setVisiblePlanets}
          date={date}
          setDate={setDate}
          coords={coords}
          userOrb={userOrb}
          setUserOrb={setUserOrb}
        />

        {/* analysis */}
        {data && (
          <BasicChartInfo
            data={data}
            userOrb={userOrb}
            setCustomAspects={setCustomAspects}
            customAspects={customAspects}
            setCustomHouseRulers={setCustomHouseRulers}

            handleLLMClick={handleLLMClick}
            showLLM={showLLM}
            llmResult={llmResult}
            llmLoading={llmLoading}
            llmError={llmError}
            loaded={loaded}
            isProcessing={isProcessing}
            saveLLMToDb={saveLLMToDb}
            setCustomPlanetInfo={setCustomPlanetInfo}
            setCustomChartRuler={setCustomChartRuler}
            setCustomBalance={setCustomBalance}
            setCustomDignities={setCustomDignities}
            setCustomDispositors={setCustomDispositors}
            setCustomDynamics={setCustomDynamics}
          />
        )}
      </ScrollView>
    </ScreenWrapper>

  )
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  title: {
    fontSize: 22,
    marginBottom: 12,
    fontWeight: '600',
  },
  loading: {
    marginTop: 20,
    fontSize: 16,
  },
  card: {
    marginTop: 0,
    padding: 0,
    borderWidth: 1,
    // borderColor: '#ccc',
    borderRadius: 10,
    // backgroundColor: '#fff',
  },
  row: {
    fontSize: 16,
    marginBottom: 8,
  },
  webviewWrap: {
    marginTop: 0,
    height: 420,
    borderRadius: 12,
    overflow: 'hidden',
    // borderWidth: 1,
    // borderColor: '#ccc',
    backgroundColor: 'transparent',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  webFallback: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  webFallbackText: {
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  webFallbackUrl: {
    color: '#9ecbff',
    fontSize: 12,
  },
})
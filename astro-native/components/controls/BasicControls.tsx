// astro-native/components/controls/BasicControls.tsx

import { useState } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
// import { WebView } from 'react-native-webview'

import TimeControls from './TimeControls'
import PlanetSelector from './PlanetSelector'
import UserOrbPicker from './UserOrbPicker'
import ChartForm from './ChartForm'
import GlassPanel from '../ui/GlassPanel'

type Props = {
  onSubmit: (input: {
    date: Date
    lat: number
    lng: number
  }) => void
  visiblePlanets: string[]
  setVisiblePlanets: React.Dispatch<React.SetStateAction<string[]>>
  date: Date
  setDate: React.Dispatch<React.SetStateAction<Date>>
  coords: {
    lat: number
    lng: number
  }
  userOrb: number
  setUserOrb: React.Dispatch<React.SetStateAction<number>>
}

const BasicControls = ({
  onSubmit,
  visiblePlanets,
  setVisiblePlanets,
  date,
  setDate,
  coords,
  userOrb,
  setUserOrb,
}: Props) => {
  const [showControls, setShowControls] = useState(false)

  // το webview route παίρνει primitive params
  // και το web page κάνει μόνο του fetch το chart + render το AstroChart
  // const chartUrl = useMemo(() => {
  //   const params = new URLSearchParams({
  //     date: date.toISOString(),
  //     lat: String(coords.lat),
  //     lng: String(coords.lng),
  //     userOrb: String(userOrb),
  //     planets: visiblePlanets.join(','),
  //   })

  //   return `https://astro.portfolio-projects.space/chart-mobile?${params.toString()}`
  // }, [date, coords.lat, coords.lng, userOrb, visiblePlanets])

  return (
    <View style={styles.container}>
      <GlassPanel>
        {/* 
      εδώ δείχνουμε το chart μέσω webview
      το chart έρχεται απο το υπάρχον web AstroChart route
      θέλουμε να είναι πρώτο και να πιάνει το βασικό χώρο
      */}
        {/* το chart θα είναι εκτός του controls */}
        {/* <View style={styles.webviewWrap}>
        {Platform.OS === 'web' ? (
          <View style={styles.webFallback}>
            <Text style={styles.webFallbackText}>
              WebView works only on Android/iOS.
            </Text>

            <Text style={styles.webFallbackUrl}>
              {chartUrl}
            </Text>
          </View>
        ) : (
          <WebView
            source={{ uri: chartUrl }}
            style={styles.webview}
            javaScriptEnabled
            domStorageEnabled
            originWhitelist={['*']}
            startInLoadingState
          />
        )}
      </View> */}

        {/* 
      όλα τα controls εκτός απο το chart γίνονται collapsable
      για να αξιοποιούμε καλύτερα το ύψος της οθόνης στο κινητό
      */}
        <Pressable
          style={styles.collapseButton}
          onPress={() => setShowControls((prev) => !prev)}
        >
          <Text style={styles.collapseButtonText}>
            {showControls ? 'Hide controls ▲' : 'Show controls ▼'}
          </Text>
        </Pressable>

        {showControls && (
          <View style={styles.controlsWrap}>
            {/* 
          in: ημερομηνια/συντεταγμένες (default "τώρα"/αθήνα)
          out: ημερομηνία/συντεταγμένες με +- ωρες/μερες/μηνες/χρονια
          και render των αντίστοιχων btns
          */}
            <TimeControls date={date} setDate={setDate} coords={coords} />

            {/* 
          in: λίστα διαλεγμένων πλανητών (στην αρχή όλοι) και setter
          κάνει toggle τους διαλεγμένους πλανήτες και render το ui
          */}
            <PlanetSelector
              selected={visiblePlanets}
              setSelected={setVisiblePlanets}
            />

            {/* απο εδω ξεκινάει το userOrb που καταλήγει στο getAngleAspects.ts. Το state του είναι στο useHome */}
            <UserOrbPicker userOrb={userOrb} setUserOrb={setUserOrb} />

            {/* 
          in: παίρνει μια onSubmit με date/lat/lang τα οποία οταν αλλαχθούν εδώ προκαλούν trigger να δείξει το chart
          */}
            <ChartForm onSubmit={onSubmit} />
          </View>
        )}
      </GlassPanel>
    </View>
  )
}

export default BasicControls

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 4,
    borderRadius: 10,
    // backgroundColor: '#000',
    gap: 8,
  },
  webviewWrap: {
    width: '100%',
    height: 420,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    // backgroundColor: '#000',
  },
  webview: {
    flex: 1,
    // backgroundColor: '#000',
  },
  webFallback: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  webFallbackText: {
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 13,
  },
  webFallbackUrl: {
    color: '#9ecbff',
    fontSize: 11,
  },
  collapseButton: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  collapseButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  controlsWrap: {
    gap: 6,
    backgroundColor: '#000',
  },
})
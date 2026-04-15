// astro-native/components/controls/BasicControls.tsx

import { View, Text, StyleSheet, Platform } from 'react-native'
import { WebView } from 'react-native-webview'
import { useMemo } from 'react'

import TimeControls from './TimeControls'
import PlanetSelector from './PlanetSelector'

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
  // το webview route παίρνει primitive params
  // και το web page κάνει μόνο του fetch το chart + render το AstroChart
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
    <View style={styles.container}>
      {/* 
      in: ημερομηνια/συντεταγμένες (default "τώρα"/αθήνα)
      out: ημερομηνία/συντεταγμένες με +- ωρες/μερες/μηνες/χρονια
      και render των αντίστοιχων btns
      */}
      <TimeControls date={date} setDate={setDate} coords={coords} />

      {/* 
      εδώ δείχνουμε το chart μέσω webview
      το chart έρχεται απο το υπάρχον web AstroChart route
      */}
      <View style={styles.webviewWrap}>
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
      </View>

      {/* 
      in: λίστα διαλεγμένων πλανητών (στην αρχή όλοι) και setter
      κάνει toggle τους διαλεγμένους πλανήτες και render το ui
      */}
      <PlanetSelector
        selected={visiblePlanets}
        setSelected={setVisiblePlanets}
      />

      {/* απο εδω ξεκινάει το userOrb που καταλήγει στο getAngleAspects.ts. Το state του είναι στο useHome */}
      {/* <UserOrbPicker userOrb={userOrb} setUserOrb={setUserOrb} /> */}

      {/* 
      in: παίρνει μια onSubmit με date/lat/lang τα οποία οταν αλλαχθούν εδώ προκαλούν trigger να δείξει το chart
      */}
      {/* <ChartForm onSubmit={onSubmit} /> */}
    </View>
  )
}

export default BasicControls

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 5,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'column',
    gap: 5,
  },
  webviewWrap: {
    width: '100%',
    height: 420,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
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
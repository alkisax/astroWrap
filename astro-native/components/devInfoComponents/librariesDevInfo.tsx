// astro-native/components/devInfoComponents/LibrariesDevInfo.tsx

import {
  Pressable,
  Text,
  View,
  StyleSheet,
} from 'react-native'

import { useState } from 'react'
import { globalStyles } from '@/layout/global'
import { colors } from '@/constants/constants'

const LibrariesDevInfo = () => {
  const [showAstroLibs, setShowAstroLibs] = useState(false)

  return (
    <View style={globalStyles.card}>

      <Pressable
        onPress={() => setShowAstroLibs(!showAstroLibs)}
      >
        <Text style={globalStyles.sectionTitle}>
          🪐 Astrology Engine & Chart Rendering
          {' '}
          {showAstroLibs ? '▲' : '▼'}
        </Text>
      </Pressable>

      {showAstroLibs && (
        <>
          <Text style={globalStyles.paragraph}>
            Astro Lark uses two main astrology libraries:
          </Text>

          <Text style={globalStyles.bullet}>
            • @astrodraw/astrochart
          </Text>

          <Text style={globalStyles.bullet}>
            • circular-natal-horoscope-js
          </Text>

          <Text style={globalStyles.paragraph}>
            The chart rendering itself is done using
            @astrodraw/astrochart.
          </Text>

          <Text style={globalStyles.paragraph}>
            Because the library is web-based,
            the React Native application renders charts
            through a WebView bridge.
          </Text>

          <Text style={globalStyles.subTitle}>
            Chart Flow
          </Text>

          <Text style={globalStyles.paragraph}>
            1. User enters birth date and coordinates.
          </Text>

          <Text style={globalStyles.paragraph}>
            2. Backend calculates planetary positions.
          </Text>

          <Text style={globalStyles.paragraph}>
            3. Frontend converts data into chart format.
          </Text>

          <Text style={globalStyles.paragraph}>
            4. WebView loads the chart renderer page.
          </Text>

          <Text style={globalStyles.subTitle}>
            Input Example
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`{
  year: 1995,
  month: 6,
  day: 15,
  hour: 13,
  minute: 30,
  latitude: 37.98,
  longitude: 23.72,
  zodiac: 'tropical',
  houseSystem: 'placidus'
}`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Output Example
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`{
  ascendant: {
    sign: 'Leo',
    longitude: 140.20
  },

  sun: {
    sign: 'Taurus',
    house: 10,
    longitude: 43.67,
    retrograde: false
  },

  moon: {
    sign: 'Capricorn',
    house: 5,
    longitude: 287.11
  },

  venus: {
    sign: 'Gemini',
    house: 10,
    longitude: 76.04
  },

  aspects: [
    {
      point1: 'Sun',
      point2: 'Moon',
      type: 'trine',
      orb: 2.14
    },

    {
      point1: 'Moon',
      point2: 'Mars',
      type: 'square',
      orb: 1.02
    }
  ],

  houses: [
    {
      house: 1,
      sign: 'Leo',
      longitude: 140.20
    },

    {
      house: 10,
      sign: 'Taurus',
      longitude: 43.19
    }
  ]
}`}
            </Text>
          </View>

          <Text style={globalStyles.paragraph}>
            Most astrological calculations inside the application
            are later derived from these longitude values.
          </Text>

          <Text style={globalStyles.paragraph}>
            Planetary aspects, chart rendering,
            house overlays, synastry calculations
            and prediction systems are primarily based on
            angular relationships between longitudes.
          </Text>

          <Text style={globalStyles.subTitle}>
            WebView Render Example
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.code}>
{`<WebView
  source={{ uri: chartUrl }}
  style={{ flex: 1 }}
/>`}
            </Text>
          </View>

          <Text style={globalStyles.subTitle}>
            Libraries
          </Text>

          <Text style={globalStyles.paragraph}>
            circular-natal-horoscope-js is mainly responsible
            for astrological calculations and structured chart data.
          </Text>

          <Text style={globalStyles.paragraph}>
            @astrodraw/astrochart is responsible for SVG chart rendering.
          </Text>
        </>
      )}

    </View>
  )
}

export default LibrariesDevInfo

const styles = StyleSheet.create({
  codeBlock: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  code: {
    color: colors.text,
    fontSize: 13,
    lineHeight: 20,
    fontFamily: 'monospace',
  },
})
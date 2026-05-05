// astro-native\app\relationship.tsx
import { View, Text, Platform, ScrollView } from 'react-native'
import { useContext, useEffect, useMemo, useState } from 'react'
import { WebView } from 'react-native-webview'
import ScreenWrapper from '../components/layout/ScreenWrapper'
import { globalStyles } from '../layout/global'
import { UserAuthContext } from '@/authLogin/context/UserAuthContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { backendUrl } from '@/constants/constants'
import type { IUser } from '@/authLogin/types/types'
import type { ChartSummary } from '@/types/types'
import BiwheelBasicChartInfo from '@/components/chartInfo/biwheel/BiwheelBasicChartInfo.native'
import { useBiwheelPage } from '@/hooks/componentHooks/useBiwheelPage'

type ParsedChart = {
  meta?: {
    date?: string
    location?: {
      lat?: number
      lng?: number
    }
  }
}

const Relationship = () => {
  const [fullUser, setFullUser] = useState<IUser | null>(null)
  const [radixData, setRadixData] = useState<ChartSummary | null>(null)
  const [transitData, setTransitData] = useState<ChartSummary | null>(null)

  const { user } = useContext(UserAuthContext)
  const {
    selectedPlanets,
    setSelectedPlanets,
  } = useBiwheelPage()

  // fetch full user 
  useEffect(() => {
    const run = async () => {
      try {
        const token = await AsyncStorage.getItem('token')
        const userId = user?._id || user?.id
        if (!token || !userId) return

        const res = await axios.get(
          `${backendUrl}/api/sqlite/users/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        setFullUser(res.data.data)
      } catch (err) {
        console.log(err)
      }
    }

    run()
  }, [user])

  let parsed: ParsedChart | null = null

  try {
    if (fullUser?.natalChart) {
      parsed = JSON.parse(fullUser.natalChart) as ParsedChart
    }
  } catch { }

  const date1 = useMemo(() => {
    return parsed?.meta?.date
      ? new Date(parsed.meta.date)
      : new Date()
  }, [parsed?.meta?.date])

  const coords1 = useMemo(() => ({
    lat: parsed?.meta?.location?.lat ?? 37.9838,
    lng: parsed?.meta?.location?.lng ?? 23.7275,
  }), [
    parsed?.meta?.location?.lat,
    parsed?.meta?.location?.lng
  ])

  // fetch YOU chart
  useEffect(() => {
    const run = async () => {
      try {
        const res = await axios.post(`${backendUrl}/api/astro/calculate`, {
          year: date1.getFullYear(),
          month: date1.getMonth() + 1,
          day: date1.getDate(),
          hour: date1.getHours(),
          minute: date1.getMinutes(),
          latitude: coords1.lat,
          longitude: coords1.lng,
          houseSystem: "placidus",
          zodiac: "tropical",
        })

        setRadixData(res.data)
      } catch (err) {
        console.log(err)
      }
    }

    run()
  }, [date1, coords1.lat, coords1.lng])


  const date2 = useMemo(() => new Date(), [])

  const coords2 = useMemo(() => ({
    lat: 40.7128,
    lng: -74.0060,
  }), [])
  // fetch OTHER chart
  useEffect(() => {
    const run = async () => {
      try {
        const res = await axios.post(`${backendUrl}/api/astro/calculate`, {
          year: date2.getFullYear(),
          month: date2.getMonth() + 1,
          day: date2.getDate(),
          hour: date2.getHours(),
          minute: date2.getMinutes(),
          latitude: coords2.lat,
          longitude: coords2.lng,
          houseSystem: "placidus",
          zodiac: "tropical",
        })

        setTransitData(res.data)
      } catch (err) {
        console.log(err)
      }
    }

    run()
  }, [date2, coords2.lat, coords2.lng])

  const userOrb = 1

  const chartUrl1 = useMemo(() => {
    const params = new URLSearchParams({
      date: date1.toISOString(),
      lat: String(coords1.lat),
      lng: String(coords1.lng),
      userOrb: String(userOrb),
      planets: selectedPlanets.join(','),
    })

    return `https://astro.portfolio-projects.space/chart-mobile?${params.toString()}`
  }, [coords1.lat, coords1.lng, date1, selectedPlanets])

  const chartUrl2 = useMemo(() => {
    const params = new URLSearchParams({
      date: date2.toISOString(),
      lat: String(coords2.lat),
      lng: String(coords2.lng),
      userOrb: String(userOrb),
      planets: selectedPlanets.join(','),
    })

    return `https://astro.portfolio-projects.space/chart-mobile?${params.toString()}`
  }, [coords2.lat, coords2.lng, date2, selectedPlanets])

  const formatInfo = (date: Date, coords: { lat: number; lng: number }) => {
    return `${date.toISOString().slice(0, 16)} | ${coords.lat.toFixed(2)}, ${coords.lng.toFixed(2)}`
  }

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 8 }}>

        <Text style={globalStyles.title}>
          Relationship Analysis
        </Text>

        {/* chart 1 */}
        <View style={globalStyles.webviewWrap}>
          {Platform.OS === 'web' ? (
            <Text>WebView not supported</Text>
          ) : (
            <>
              <Text style={[globalStyles.text, { color: '#fff' }]}>
                You · {formatInfo(date1, coords1)}
              </Text>
              <WebView
                key={chartUrl1}
                source={{ uri: chartUrl1 }}
                injectedJavaScript={`
                document.body.style.background = 'transparent';
                document.documentElement.style.background = 'transparent';
                true;
              `}
                style={{ flex: 1, backgroundColor: 'transparent' }}
                containerStyle={{ backgroundColor: 'transparent' }}
              />
            </>
          )}
        </View>

        {/* chart 2 */}
        <View style={[globalStyles.webviewWrap]}>
          {Platform.OS === 'web' ? (
            <Text>WebView not supported</Text>
          ) : (
            <>
              <Text style={[globalStyles.text, { color: '#fff', marginTop: 8 }]}>
                👤 The Other · {formatInfo(date2, coords2)}
              </Text>
              <WebView
                key={chartUrl2}
                source={{ uri: chartUrl2 }}
                injectedJavaScript={`
                document.body.style.background = 'transparent';
                document.documentElement.style.background = 'transparent';
                true;
              `}
                style={{ flex: 1, backgroundColor: 'transparent' }}
                containerStyle={{ backgroundColor: 'transparent' }}
              />
            </>
          )}
        </View>

        {radixData && transitData && (
          <BiwheelBasicChartInfo
            data1={radixData}
            data2={transitData}
            userOrb={1}
            selectedPlanets={selectedPlanets}
            setSelectedPlanets={setSelectedPlanets}
          />
        )}

      </ScrollView>
    </ScreenWrapper>
  )
}

export default Relationship
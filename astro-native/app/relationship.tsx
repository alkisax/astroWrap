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
import ChartForm from '@/components/controls/ChartForm'
import BiwheelBasicChartInfo from '@/components/chartInfo/biwheel/BiwheelBasicChartInfo.native'
import { useBiwheelPage } from '@/hooks/componentHooks/useBiwheelPage'
import { formatChartDate } from '@/utils/formatChartDate'
import tzLookup from 'tz-lookup'

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

  const { user } = useContext(UserAuthContext)
  const {
    radixData,
    transitData,
    setTransitInput,
    selectedPlanets,
    setSelectedPlanets,
    transitInput,
    setRadixInput,
    radixCustomAspects,
    transitCustomAspects,
    houseOverlay,
    compatibility,
    llmLoading,
    llmError,
    handleBiwheelLLMClick,
    showLLM,
    llmResult,
    loaded,
    isProcessing,
  } = useBiwheelPage()

  const toChartInputString = (date: Date, coords: { lat: number; lng: number }) => {
    const timezone = tzLookup(coords.lat, coords.lng)

    return date.toLocaleString('sv-SE', {
      timeZone: timezone,
    }).replace(' ', 'T').slice(0, 16)
  }

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

  const parsed = useMemo(() => {
    try {
      if (!fullUser?.natalChart) return null
      return JSON.parse(fullUser.natalChart) as ParsedChart
    } catch {
      return null
    }
  }, [fullUser?.natalChart])

  useEffect(() => {
    if (!parsed?.meta?.date) return

    setRadixInput({
      date: new Date(parsed.meta.date),
      lat: parsed.meta.location?.lat ?? 37.9838,
      lng: parsed.meta.location?.lng ?? 23.7275,
    })
  }, [parsed, setRadixInput])

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

  const userOrb = 1

  const chartUrl1 = useMemo(() => {
    const params = new URLSearchParams({
      date: toChartInputString(date1, coords1),
      lat: String(coords1.lat),
      lng: String(coords1.lng),
      userOrb: String(userOrb),
      planets: selectedPlanets.join(','),
    })

    return `https://astro.portfolio-projects.space/chart-mobile?${params.toString()}`
  }, [coords1, date1, selectedPlanets])

  const chartUrl2 = useMemo(() => {
    if (!transitInput) return ''

    const params = new URLSearchParams({
      date: toChartInputString(transitInput.date, {
        lat: transitInput.lat,
        lng: transitInput.lng,
      }),
      lat: String(transitInput.lat),
      lng: String(transitInput.lng),
      userOrb: String(userOrb),
      planets: selectedPlanets.join(','),
    })

    return `https://astro.portfolio-projects.space/chart-mobile?${params.toString()}`
  }, [transitInput, selectedPlanets])


  const formatBirthTime = (date: Date) => {
    return `${date.getUTCFullYear()}-${String(
      date.getUTCMonth() + 1
    ).padStart(2, '0')}-${String(
      date.getUTCDate()
    ).padStart(2, '0')} ${String(
      date.getUTCHours()
    ).padStart(2, '0')}:${String(
      date.getUTCMinutes()
    ).padStart(2, '0')}`
  }


  const formatInfo = (
    date: Date,
    coords: { lat: number; lng: number }
  ) => {
    return `${formatBirthTime(date)} | ${coords.lat.toFixed(2)},
          ${coords.lng.toFixed(2)}`
  }

  // console.log('⌚ date1 local hour:', date1.getHours())
  // console.log('⌚ date1 utc hour:', date1.getUTCHours())
  // console.log('⌛ chart hour:', formatChartDate(date1, coords1))
  // console.log('timezone offset:', new Date().getTimezoneOffset())
  // console.log('🧪 RADIX RAW ISO:', date1.toISOString())
  // console.log('🧪 RADIX DISPLAY:', formatBirthTime(date1))
  // console.log('🧪 RADIX WEBVIEW:', toChartInputString(date1, coords1))
  // console.log('🧪 RADIX TZ:', tzLookup(coords1.lat, coords1.lng))
  // console.log('🧪 RADIX URL:', chartUrl1)
  // console.log('🧪 RADIX RAW ISO:', date1.toISOString())
  // console.log('🧪 RADIX DISPLAY:', formatBirthTime(date1))
  // console.log('🧪 RADIX WEBVIEW:', toChartInputString(date1, coords1))
  // console.log('🧪 RADIX TZ:', tzLookup(coords1.lat, coords1.lng))
  // console.log('🧪 RADIX URL:', chartUrl1)
  // if (transitInput) {
  //   console.log('🧪 TRANSIT RAW ISO:', transitInput.date.toISOString())
  //   console.log(
  //     '🧪 TRANSIT DISPLAY:',
  //     formatBirthTime(transitInput.date)
  //   )
  //   console.log(
  //     '🧪 TRANSIT WEBVIEW:',
  //     toChartInputString(transitInput.date, {
  //       lat: transitInput.lat,
  //       lng: transitInput.lng,
  //     })
  //   )
  //   console.log(
  //     '🧪 TRANSIT TZ:',
  //     tzLookup(transitInput.lat, transitInput.lng)
  //   )
  //   console.log('🧪 TRANSIT URL:', chartUrl2)
  // }

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
              {transitInput && (
                <Text style={[globalStyles.text, { color: '#fff', marginTop: 8 }]}>
                  👤 The Other · {formatInfo(transitInput.date, {
                    lat: transitInput.lat,
                    lng: transitInput.lng,
                  })}
                </Text>
              )}
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

        <ChartForm
          onSubmit={({ date, lat, lng }) => {
            setTransitInput({ date, lat, lng })
          }}
        />

        {radixData && transitData && (
          <BiwheelBasicChartInfo
            data1={radixData}
            data2={transitData}
            userOrb={1}
            selectedPlanets={selectedPlanets}
            setSelectedPlanets={setSelectedPlanets}
            radixCustomAspects={radixCustomAspects}
            transitCustomAspects={transitCustomAspects}
            houseOverlay={houseOverlay}
            compatibility={compatibility}
            handleBiwheelLLMClick={handleBiwheelLLMClick}
            llmLoading={llmLoading}
            llmError={llmError}
            showLLM={showLLM}
            llmResult={llmResult}
            loaded={loaded}
            isProcessing={isProcessing}
          />
        )}

      </ScrollView>
    </ScreenWrapper>
  )
}

export default Relationship
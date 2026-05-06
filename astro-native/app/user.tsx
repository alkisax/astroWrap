import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Modal,
  Platform,
} from 'react-native'
import { useEffect, useState, useContext, useCallback } from 'react'
import { WebView } from 'react-native-webview'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Markdown from 'react-native-markdown-display'

import { backendUrl, colors } from '../constants/constants'
import { UserAuthContext } from '../authLogin/context/UserAuthContext'
import ScreenWrapper from '../components/layout/ScreenWrapper'
import GlassPanel from '../components/ui/GlassPanel'
import DeleteAccountButton from '@/components/DeleteAccountButton.native'
import { formatChartDate } from '@/utils/formatChartDate'
import tzLookup from 'tz-lookup'

/* ICON MAPPINGS */

const signIcons: Record<string, string> = {
  Aries: '♈',
  Taurus: '♉',
  Gemini: '♊',
  Cancer: '♋',
  Leo: '♌',
  Virgo: '♍',
  Libra: '♎',
  Scorpio: '♏',
  Sagittarius: '♐',
  Capricorn: '♑',
  Aquarius: '♒',
  Pisces: '♓',
}

const planetIcons: Record<string, string> = {
  sun: '☉',
  moon: '☾',
  mercury: '☿',
  venus: '♀',
  mars: '♂',
  jupiter: '♃',
  saturn: '♄',
  uranus: '♅',
  neptune: '♆',
  pluto: '♇',
  asc: '↑',
  mc: '✦',
}

const aspectIcons: Record<string, string> = {
  conjunction: '☌',
  opposition: '☍',
  trine: '△',
  square: '□',
  sextile: '⚹',
}

/* 🔥 HELPERS */

const normalize = (s: string) => s?.toLowerCase()

const getPlanetIcon = (name: string) =>
  planetIcons[normalize(name)] || '•'

const getAspectIcon = (type: string) =>
  aspectIcons[normalize(type)] || '•'

/* 🔥 TYPES */

type UserData = {
  id: number
  username: string
  role?: string
  roles?: string[]
  natalChart?: string
  natalDelineation?: string
}

type Chart = {
  meta?: {
    date?: string
    location?: {
      lat?: number
      lng?: number
    }
  }
  planets: { planet: string; sign: string; house: number }[]
  houses: { house: number; sign: string }[]
  chartRuler: { planet: string; sign: string; house: number }
  balance: {
    elements: Record<string, number>
    modalities: Record<string, number>
  }
  aspects: {
    point1: string
    point2: string
    type: string
    orb: number
  }[]
}

/* COMPONENT */

export default function UserPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [showLLM, setShowLLM] = useState(false)
  const [modal, setModal] = useState<null | { type: string; payload?: any }>(
    null
  )

  const { user: authUser } = useContext(UserAuthContext)
  const userId = authUser?._id || authUser?.id

  const fetchUser = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      if (!userId) return

      const res = await axios.get(
        `${backendUrl}/api/sqlite/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setUser(res.data.data)
    } catch (err) {
      console.log(err)
    }
  }, [userId])

  useEffect(() => {
    if (userId) fetchUser()
  }, [fetchUser, userId])

  // 💻💻 logger can be removed but keep commented out
  // useEffect(() => {
  //   if (user) {
  //     console.log('🔥 USER FULL:', user)
  //   }
  // }, [user])
  // useEffect(() => {
  //   if (user?.natalChart) {
  //     try {
  //       const parsed = JSON.parse(user.natalChart)
  //       const d = new Date(parsed?.meta?.date)

  //       console.log('RAW:', parsed?.meta?.date)
  //       console.log('LOCAL:', d.toString())
  //       console.log('UTC:', d.toISOString())
  //       console.log('HOURS local:', d.getHours())
  //       console.log('HOURS utc:', d.getUTCHours())
  //     } catch (e) {
  //       console.log('parse error', e)
  //     }
  //   }
  // }, [user])

  if (!user) {
    return (
      <ScreenWrapper>
        <Text style={{ color: colors.text }}>Loading...</Text>
      </ScreenWrapper>
    )
  }

  let chart: Chart | null = null
  try {
    chart = user.natalChart ? JSON.parse(user.natalChart) : null
  } catch (err) {
    console.log('Failed to parse natalChart:', err)
    chart = null
  }

  const chartDate = chart?.meta?.date
    ? new Date(chart.meta.date)
    : null

  const chartCoords =
    typeof chart?.meta?.location?.lat === 'number' &&
      typeof chart?.meta?.location?.lng === 'number'
      ? {
        lat: chart.meta.location.lat,
        lng: chart.meta.location.lng,
      }
      : null

  const chartLocalInfo =
    chartDate && chartCoords
      ? formatChartDate(chartDate, chartCoords)
      : null

  const chartTimezone = chartCoords
    ? tzLookup(chartCoords.lat, chartCoords.lng)
    : null

  const chartUtcInfo = chartDate
    ? chartDate.toISOString()
    : null

  // chart webview
  const toChartInputString = (
    date: Date,
    coords: { lat: number; lng: number }
  ) => {
    const timezone = tzLookup(coords.lat, coords.lng)

    return date
      .toLocaleString('sv-SE', { timeZone: timezone })
      .replace(' ', 'T')
      .slice(0, 16)
  }

const chartUrl =
  chartDate && chartCoords
    ? `https://astro.portfolio-projects.space/chart-mobile?${new URLSearchParams({
        date: chartDate.toISOString(),
        lat: String(chartCoords.lat),
        lng: String(chartCoords.lng),
        userOrb: '1',
        planets: [
          'Sun',
          'Moon',
          'Mercury',
          'Venus',
          'Mars',
          'Jupiter',
          'Saturn',
          'Uranus',
          'Neptune',
          'Pluto',
        ].join(','),
      }).toString()}`
    : null

  if (chartDate && chartCoords) {
    console.log('USERPAGE CHART URL:', chartUrl)
    console.log('USERPAGE SAVED UTC:', chartDate.toISOString())
    console.log('USERPAGE WEBVIEW LOCAL:', toChartInputString(chartDate, chartCoords))
    console.log('USERPAGE TABLE SUN:', chart?.planets?.find(p => p.planet === 'sun'))
    console.log('USERPAGE TABLE MOON:', chart?.planets?.find(p => p.planet === 'moon'))
  }

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>

        {/* 👤 USER */}
        <GlassPanel>
          <Text style={styles.title}>{user.username}</Text>
          <Text style={styles.value}>
            {user.role || user.roles?.[0]}
          </Text>
        </GlassPanel>

        {chartLocalInfo && chartCoords && (
          <>
            <Text style={styles.valueLeft}>
              Local: {chartLocalInfo} · {chartCoords.lat.toFixed(2)}, {chartCoords.lng.toFixed(2)}
            </Text>
            {chartTimezone && (
              <Text style={styles.dimValueLeft}>
                Timezone: {chartTimezone}
              </Text>
            )}

            {chartUtcInfo && (
              <Text style={styles.dimValueLeft}>
                UTC: {chartUtcInfo}
              </Text>
            )}
          </>
        )}

        {/* webview chart */}
        {chartUrl && (
          <GlassPanel>
            <Text style={styles.sectionTitle}>Natal Chart</Text>

            <View style={styles.webviewWrap}>
              {Platform.OS === 'web' ? (
                <Text style={styles.valueLeft}>
                  WebView not supported
                </Text>
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
          </GlassPanel>
        )}

        {chart && (
          <>
            {/* 🪐 PLANETS */}
            <GlassPanel>
              <Text style={styles.sectionTitle}>Planets</Text>

              {chart.planets.map((p) => (
                <Pressable
                  key={p.planet}
                  onPress={() => setModal({ type: 'planet', payload: p })}
                  style={styles.row}
                >
                  <Text style={styles.label}>
                    {getPlanetIcon(p.planet)} {p.planet}
                  </Text>

                  <Text style={styles.value}>
                    {signIcons[p.sign]} {p.sign} · H{p.house}
                  </Text>
                </Pressable>
              ))}
            </GlassPanel>

            {/* ⚖️ BALANCE */}
            <GlassPanel>
              <Text style={styles.sectionTitle}>Balance</Text>

              <Text style={styles.value}>
                🔥 {chart.balance.elements.Fire} · 🌱 {chart.balance.elements.Earth} · 💨 {chart.balance.elements.Air} · 💧 {chart.balance.elements.Water}
              </Text>

              <Text style={styles.value}>
                🚀 {chart.balance.modalities.Cardinal} · 🧱 {chart.balance.modalities.Fixed} · 🔄 {chart.balance.modalities.Mutable}
              </Text>
            </GlassPanel>

            {/* 👑 RULER */}
            <GlassPanel>
              <Text style={styles.sectionTitle}>Chart Ruler</Text>

              <Pressable
                onPress={() =>
                  setModal({ type: 'planet', payload: chart.chartRuler })
                }
              >
                <Text style={styles.value}>
                  {getPlanetIcon(chart.chartRuler.planet)}{' '}
                  {chart.chartRuler.planet} ·{' '}
                  {signIcons[chart.chartRuler.sign]}{' '}
                  {chart.chartRuler.sign} · H{chart.chartRuler.house}
                </Text>
              </Pressable>
            </GlassPanel>

            {/* 🏠 HOUSES */}
            <GlassPanel>
              <Text style={styles.sectionTitle}>Houses</Text>

              {chart.houses.map((h) => (
                <Pressable
                  key={h.house}
                  onPress={() => setModal({ type: 'house', payload: h })}
                  style={styles.row}
                >
                  <Text style={styles.label}>H{h.house}</Text>
                  <Text style={styles.value}>
                    {signIcons[h.sign]} {h.sign}
                  </Text>
                </Pressable>
              ))}
            </GlassPanel>

            {/* 🔗 ASPECTS */}
            <GlassPanel>
              <Text style={styles.sectionTitle}>Aspects</Text>

              {chart.aspects.map((a, i) => (
                <Pressable
                  key={i}
                  onPress={() => setModal({ type: 'aspect', payload: a })}
                  style={styles.row}
                >
                  <Text style={styles.label}>
                    {getPlanetIcon(a.point1)} {a.point1}{' '}
                    {getAspectIcon(a.type)}{' '}
                    {getPlanetIcon(a.point2)} {a.point2}
                  </Text>

                  <Text style={styles.value}>
                    ({a.orb.toFixed(2)}°)
                  </Text>
                </Pressable>
              ))}
            </GlassPanel>
          </>
        )}

        {/* 🧠 LLM */}
        <GlassPanel>
          <Pressable onPress={() => setShowLLM(!showLLM)}>
            <Text style={styles.sectionTitle}>
              Interpretation {showLLM ? '▲' : '▼'}
            </Text>
          </Pressable>

          {showLLM && (
            <Markdown style={markdownStyles}>
              {user.natalDelineation || 'No interpretation'}
            </Markdown>
          )}
        </GlassPanel>
      </ScrollView>

      {/* 🔥 MODAL */}
      {modal && (
        <Modal
          visible
          transparent
          animationType="fade"
          onRequestClose={() => setModal(null)}
        >
          <View style={styles.overlay}>
            <View style={styles.modal}>

              {modal.type === 'planet' && (
                <>
                  <Text style={styles.modalTitle}>
                    {getPlanetIcon(modal.payload.planet)} {modal.payload.planet}
                  </Text>
                  <Text style={styles.modalText}>
                    {signIcons[modal.payload.sign]} {modal.payload.sign} · House {modal.payload.house}
                  </Text>
                </>
              )}

              {modal.type === 'aspect' && (
                <>
                  <Text style={styles.modalTitle}>
                    {getAspectIcon(modal.payload.type)} {modal.payload.type}
                  </Text>
                  <Text style={styles.modalText}>
                    {getPlanetIcon(modal.payload.point1)} {modal.payload.point1} ↔ {getPlanetIcon(modal.payload.point2)} {modal.payload.point2}
                  </Text>
                </>
              )}

              {modal.type === 'house' && (
                <>
                  <Text style={styles.modalTitle}>
                    House {modal.payload.house}
                  </Text>
                  <Text style={styles.modalText}>
                    {signIcons[modal.payload.sign]} {modal.payload.sign}
                  </Text>
                </>
              )}

              <Pressable onPress={() => setModal(null)}>
                <Text style={styles.closeText}>Close</Text>
              </Pressable>

            </View>
          </View>
        </Modal>
      )}

      <DeleteAccountButton userId={user.id} />

    </ScreenWrapper>
  )
}

/* STYLES */

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },

  title: { fontSize: 22, color: colors.text },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.secondary,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  label: { color: colors.secondary },

  value: { color: colors.text },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modal: {
    width: '85%',
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.panel,
  },

  modalTitle: {
    color: colors.text,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },

  modalText: {
    color: colors.dim,
    textAlign: 'center',
  },

  closeText: {
    marginTop: 12,
    textAlign: 'center',
    color: colors.primary,
  },

  valueLeft: {
    color: colors.text,
    width: '100%',
    textAlign: 'left',
  },

  dimValueLeft: {
    color: colors.dim,
    fontSize: 12,
    marginTop: 4,
    width: '100%',
    textAlign: 'left',
  },

  webviewWrap: {
    width: '100%',
    height: 330,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
})

const markdownStyles = {
  body: { color: colors.text },
}


/*
FULL USER STRUCTURE (from backend)

user = {
  id: number,
  username: string,
  email: string,
  name: string,
  role?: string,
  roles?: string[],

  createdAt: string,
  updatedAt: string,

  // 🔮 chart data (stringified JSON)
  natalChart: string,

  // 🧠 LLM interpretation (plain text / markdown)
  natalDelineation: string
}


----------------------------------------
natalChart (JSON.parse(user.natalChart))
----------------------------------------

{
  meta: {
    date: string, // ISO date e.g. "1981-01-01T21:30:00.000Z"
    location: {
      lat: number,
      lng: number
    },
    zodiac: string,
    houseSystem: string
  },

  planets: [
    {
      planet: string,
      sign: string,
      house: number
    }
  ],

  houses: [
    {
      house: number,
      sign: string,
      longitude: number
    }
  ],

  chartRuler: {
    planet: string,
    sign: string,
    house: number
  },

  balance: {
    elements: Record<string, number>,
    modalities: Record<string, number>
  },

  aspects: [
    {
      point1: string,
      point2: string,
      type: string,
      orb: number
    }
  ],

  dignities: [
    {
      planet: string,
      dignity: string
    }
  ],

  dispositors: {
    loops: string[],
    backbone: string[]
  }
}


----------------------------------------
natalDelineation
----------------------------------------

string (LLM generated analysis, markdown-ready text)
*/
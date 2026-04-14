// frontend\src\pages\MobileNativeChartPage.tsx

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'

import AstroChart from '../components/AstroChart'
import { backendUrl } from '../constants/constants'
import { mapToChartData } from '../utils/mapToChart'
import { getAngleAspects } from '../utils/getAngleAspects'

import type { ChartSummary, CustomAspect } from '../types/types'

const MobileNativeChartPage = () => {
  const [searchParams] = useSearchParams()

  const [data, setData] = useState<ChartSummary | null>(null)
  const [loading, setLoading] = useState(true)

  // παίρνουμε input απο query params για να μπορεί το native app να στείλει date/coords στο webview
  const dateParam = searchParams.get('date')
  const latParam = searchParams.get('lat')
  const lngParam = searchParams.get('lng')
  const userOrbParam = searchParams.get('userOrb')

  // κάνουμε parse σε primitive values / memoized values για να μην έχουμε endless rerender
  const parsedDate = useMemo(() => {
    if (!dateParam) return new Date()
    const d = new Date(dateParam)
    return Number.isNaN(d.getTime()) ? new Date() : d
  }, [dateParam])

  const lat = useMemo(() => {
    const value = Number(latParam)
    return Number.isNaN(value) ? 37.9838 : value
  }, [latParam])

  const lng = useMemo(() => {
    const value = Number(lngParam)
    return Number.isNaN(value) ? 23.7275 : value
  }, [lngParam])

  const userOrb = useMemo(() => {
    const value = Number(userOrbParam)
    return Number.isNaN(value) ? 1 : value
  }, [userOrbParam])

  // προς το παρόν δείχνουμε όλους τους βασικούς πλανήτες
  const visiblePlanets = useMemo(
    () => [
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
    ],
    []
  )

  useEffect(() => {
    let cancelled = false

    const fetchChart = async () => {
      try {
        setLoading(true)

        const res = await axios.post(`${backendUrl}/api/astro/calculate`, {
          year: parsedDate.getFullYear(),
          month: parsedDate.getMonth() + 1,
          day: parsedDate.getDate(),
          hour: parsedDate.getHours(),
          minute: parsedDate.getMinutes(),
          latitude: lat,
          longitude: lng,
          houseSystem: 'placidus',
          zodiac: 'tropical',
        })

        if (!cancelled) {
          setData(res.data)
        }
      } catch (err) {
        console.error('❌ mobile chart fetch error', err)

        if (!cancelled) {
          setData(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchChart()

    return () => {
      cancelled = true
    }
  }, [parsedDate, lat, lng])

  // το AstroChart θέλει planets/cusps format
  const chartData = useMemo(() => {
    if (!data) return null
    return mapToChartData(data, visiblePlanets)
  }, [data, visiblePlanets])

  // custom aspects με το δικό σου orb logic
  const customAspects = useMemo<CustomAspect[]>(() => {
    if (!data) return []

    return getAngleAspects(data, userOrb).map((a) => ({
      point1: a.point1Key,
      point2: a.point2Key,
      type: a.type,
      orb: a.orb ?? null,
    }))
  }, [data, userOrb])

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'black',
          color: 'white',
        }}
      >
        Loading chart...
      </div>
    )
  }

  if (!data || !chartData) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'black',
          color: 'white',
        }}
      >
        Failed to load chart
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        padding: '10px',
        boxSizing: 'border-box',
        background: 'black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <div style={{ width: '100%', maxWidth: '700px' }}>
        {/* 
        αυτό είναι ένα hook που συνεργάζεται με το AstroChart.tsx και κάνουν render το chart σε svg.
        Περα απο την βιβλιοθήκη έχουμε προσθεσει στο svg και δικά μας render
        */}
        <AstroChart
          {...chartData}
          data={data}
          userOrb={userOrb}
          customAspects={customAspects}
        />
      </div>
    </div>
  )
}

export default MobileNativeChartPage
// src/components/ChartDataDebug.tsx
import { useChartDataDebug } from '../hooks/componentHooks/useChartDataDebug'
// import { natalChartShakeJSONTreeHelper } from '../utils/natalChartShakeJSONTreeHelper'
import type { ChartSummary, CustomPlanetInfo, CustomChartRuler, CustomBalance, CustomHouseRuler, CustomAspect, CustomDignity, CustomDispositor, CustomDynamics } from '../types/types'
// import { useEffect, useMemo, type Dispatch, type SetStateAction } from 'react'

type Props = {
  data: ChartSummary
  visiblePlanets: string[]
  date: Date
  coords: { lat: number; lng: number }
  customPlanetInfo: CustomPlanetInfo[]
  customChartRuler: CustomChartRuler | null
  customBalance: CustomBalance | null
  customHouseRulers: CustomHouseRuler[]
  customAspects: CustomAspect[]
  customDignities: CustomDignity[]
  customDispositors: CustomDispositor[]
  customDynamics: CustomDynamics | null
  // setShaken: Dispatch<SetStateAction<unknown>>
}

const ChartDataDebug = ({
  data,
  visiblePlanets,
  date,
  coords,
  customPlanetInfo,
  customChartRuler,
  customBalance,
  customHouseRulers,
  customAspects,
  customDignities,
  customDispositors,
  customDynamics,
  // setShaken
}: Props) => {

  const payload = useChartDataDebug({
    data,
    visiblePlanets,
    date,
    coords,
    customPlanetInfo,
    customChartRuler,
    customBalance,
    customHouseRulers,
    customAspects,
    customDignities,
    customDispositors,
    customDynamics,
  })

  // const shaken = useMemo(() => {
  //   return natalChartShakeJSONTreeHelper(payload);
  // }, [payload]);
  // console.log('SHAKEN:', shaken)
  // useEffect(() => {
  //   setShaken(shaken);
  // }, [shaken, setShaken]);


  return (
    <>
      <div
        style={{
          padding: '16px',
          borderRadius: '12px',
          background: 'rgba(0,0,0,0.6)',
          border: '1px solid rgba(255,255,255,0.1)',
          overflow: 'auto',
          maxHeight: '400px'
        }}
      >
        <pre style={{ fontSize: '12px', color: '#ccc' }}>
          {JSON.stringify(payload, null, 2)}
        </pre>
      </div>
    </>
  )
}

export default ChartDataDebug
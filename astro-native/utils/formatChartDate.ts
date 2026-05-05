import tzLookup from 'tz-lookup'

type Coords = {
  lat: number
  lng: number
}

// 🔥 central formatter για ΟΛΑ τα charts
export const formatChartDate = (date: Date, coords: Coords) => {
  const timezone = tzLookup(coords.lat, coords.lng)

  return date.toLocaleString('el-GR', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
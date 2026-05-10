type Coords = {
  lat: number
  lng: number
}

// 🔥 central formatter για ΟΛΑ τα charts
export const formatChartDate = (
  date: Date,
  _coords: Coords,
) => {

  const pad = (n: number) => n.toString().padStart(2, '0')

  const day = pad(date.getDate())
  const month = pad(date.getMonth() + 1)
  const year = date.getFullYear()

  const hours = date.getHours()
  const minutes = pad(date.getMinutes())

  const displayHour =
    hours % 12 === 0 ? 12 : hours % 12

  const ampm =
    hours >= 12 ? 'μ.μ.' : 'π.μ.'

  return `${day}/${month}/${year}, ${displayHour}:${minutes} ${ampm}`
}
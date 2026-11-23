import type { Phase, Season, Weather } from './highway.js'

// Chapel Hill, NC.
export const LAT = 35.9132
export const LON = -79.0558

const rad = Math.PI / 180

const nthSunday = (year: number, month: number, n: number): number => {
  const first = new Date(Date.UTC(year, month, 1)).getUTCDay()

  return 1 + ((7 - first) % 7) + 7 * (n - 1)
}

// US Eastern time: UTC-5, or UTC-4 from the second Sunday of March (2 am) to the first Sunday of November (2 am).
export const easternOffsetHours = (utcMs: number): number => {
  const year = new Date(utcMs).getUTCFullYear()
  const starts = Date.UTC(year, 2, nthSunday(year, 2, 2), 7)
  const ends = Date.UTC(year, 10, nthSunday(year, 10, 1), 6)

  return utcMs >= starts && utcMs < ends ? -4 : -5
}

export const localClock = (utcMs: number): string => {
  const d = new Date(utcMs + easternOffsetHours(utcMs) * 3_600_000)
  const h = d.getUTCHours()
  const m = d.getUTCMinutes()

  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`
}

// Chapel Hill's day and date, like SAT NOV 23.
export const localDate = (utcMs: number): string => {
  const d = new Date(utcMs + easternOffsetHours(utcMs) * 3_600_000)

  return `${['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][d.getUTCDay()]} ${['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][d.getUTCMonth()]} ${d.getUTCDate()}`
}

// The sun's height above the horizon in degrees, for Chapel Hill (a standard low-precision formula).
export const sunElevation = (utcMs: number): number => {
  const n = utcMs / 86_400_000 + 2440587.5 - 2451545.0
  const L = (280.46 + 0.9856474 * n) % 360
  const g = ((357.528 + 0.9856003 * n) % 360) * rad
  const lambda = (L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * rad
  const eps = (23.439 - 0.0000004 * n) * rad
  const decl = Math.asin(Math.sin(eps) * Math.sin(lambda))
  const ra = Math.atan2(Math.cos(eps) * Math.sin(lambda), Math.cos(lambda))
  const gmst = (18.697374558 + 24.06570982441908 * n) % 24
  const ha = ((gmst * 15 + LON) * rad - ra)
  const elev = Math.asin(Math.sin(LAT * rad) * Math.sin(decl) + Math.cos(LAT * rad) * Math.cos(decl) * Math.cos(ha))

  return elev / rad
}

// Day above the horizon, dusk and dawn down to 6 degrees below it, night after that.
export const phaseAt = (utcMs: number): Phase => {
  const e = sunElevation(utcMs)

  return e > 0 ? 'day' : e > -6 ? 'dusk' : 'night'
}

// WMO weather codes as Open-Meteo reports them.
export const weatherFromCode = (code: number, cloud: number): Weather => {
  if (code >= 95) return 'storm'
  if (code === 45 || code === 48) return 'fog'
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow'
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain'
  if (code >= 2 || cloud >= 70) return 'cloudy'

  return 'clear'
}

export const WEATHER_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=35.9132&longitude=-79.0558&current=temperature_2m,weather_code,cloud_cover&temperature_unit=fahrenheit&timezone=America%2FNew_York'

// The National Weather Service's latest observation at Raleigh-Durham airport, the nearest station.
export const NWS_URL = 'https://api.weather.gov/stations/KRDU/observations/latest'

export const weatherFromText = (text: string): Weather => {
  const t = text.toLowerCase()

  if (t.includes('thunder')) return 'storm'
  if (t.includes('snow') || t.includes('sleet') || t.includes('flurr')) return 'snow'
  if (t.includes('rain') || t.includes('drizzle') || t.includes('shower')) return 'rain'
  if (t.includes('fog') || t.includes('mist') || t.includes('haze')) return 'fog'
  if (t.includes('cloud') || t.includes('overcast')) return 'cloudy'

  return 'clear'
}

// The season from the date (Chapel Hill's calendar months), for the foliage and fields.
export const seasonAt = (utcMs: number): Season => {
  const m = new Date(utcMs + easternOffsetHours(utcMs) * 3_600_000).getUTCMonth()

  return m <= 1 || m === 11 ? 'winter' : m <= 4 ? 'spring' : m <= 7 ? 'summer' : 'fall'
}

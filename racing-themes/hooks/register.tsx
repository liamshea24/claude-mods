import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, ThemeMessageRule, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildHighway } from './highway.js'
import type { Phase, Weather } from './highway.js'
import { localClock, localDate, twilightAt, NWS_URL, phaseAt, seasonAt, WEATHER_URL, weatherFromCode, weatherFromText } from './sky.js'
import { WHEEL, WORDS } from './spinner.js'

type Color = NonNullable<ThemeMessageRule['color']>

type Hex = `#${string}`
const WHITE: Hex = '#ffffff'
const BLACK: Hex = '#141c12'
type Anchors4 = [Hex, Hex, Hex, Hex]
type Anchors5 = [Hex, Hex, Hex, Hex, Hex]

// One palette per mode. The message colors (user bubble, assistant bubble) are set
// from the same anchors as the page, so the chat and the text box always agree.
const mk = (label: string, accent: Hex, light: Anchors4, dark: Anchors5, bright = false) => {
  const roles = { accent, danger: '#d63a2f', success: '#3f9a52', warning: '#c98a10', pro: '#8a5fc9' }
  const lightMode = {
    gray: {
      anchors: {
        'surface-0': light[0],
        'surface-1': light[1],
        'surface-2': light[2],
        'text-primary': light[3],
        'text-secondary': '#4a4a4a',
        'text-muted': '#626262',
      },
    },
  }
  const darkMode = {
    gray: {
      anchors: {
        'surface-0': dark[0],
        'surface-1': dark[1],
        'surface-2': dark[2],
        'surface-3': dark[3],
        'text-primary': dark[4],
        'text-secondary': bright ? '#e6e6ea' : '#c9c9c9',
        'text-muted': bright ? '#c2c2ca' : '#a3a3a3',
      },
    },
  }
  // A look made for one mode (white text on dark panels) is declared dark-only; a light half with white
  // text is refused by the theme builder, and a refused theme keeps the previous version running.
  const { theme } = makeColors(bright ? { label, roles, only: 'dark', dark: darkMode } : { label, roles, light: lightMode, dark: darkMode })
  const messages = { 'bg-user-message': BLACK, 'text-user-message': WHITE, 'bg-assistant-message': BLACK, 'text-assistant-message': WHITE }

  return {
    ...theme,
    inputs: bright
      ? { dark: { ...theme.inputs.dark, ...messages } }
      : { light: { ...theme.inputs.light, ...messages }, dark: { ...theme.inputs.dark, ...messages } },
  }
}

// Smoked glass. The app only accepts a text style whose colours all keep white text readable, so every
// colour here is dark or mid-tone: a translucent dark-navy body, a mid-blue rim, a lighter highlight along
// the top and left, a depth line along the bottom and a glint in the corner. No white fills.
const rr = (i: number, r: number) =>
  `M${i + r} ${i}H${96 - i - r}A${r} ${r} 0 0 1 ${96 - i} ${i + r}V${96 - i - r}A${r} ${r} 0 0 1 ${96 - i - r} ${96 - i}H${i + r}A${r} ${r} 0 0 1 ${i} ${96 - i - r}V${i + r}A${r} ${r} 0 0 1 ${i + r} ${i}Z`
const GLASS_FRAME = {
  viewBox: 96,
  slice: 28,
  paths: [
    { d: rr(0.5, 27), color: '#0d0d0d99' },
    { d: rr(1, 26), strokeWidth: 1.2, color: '#8a8a8a' },
    { d: rr(4, 23), strokeWidth: 1, color: '#333333' },
    { d: 'M2 28A26 26 0 0 1 28 2H68', strokeWidth: 1.8, color: '#a0a0a0' },
    { d: 'M94 68A26 26 0 0 1 68 94H28', strokeWidth: 1.4, color: '#666666' },
    { d: 'M30 91H66', strokeWidth: 3, color: '#00000052' },
    { d: 'M14 12A12 12 0 0 1 26 8Q18 10 14 18Z', color: '#9a9a9a' },
  ],
} as const
const GLASS_SHEEN = { angle: 135, stops: [{ at: 0, color: '#242424a6' }, { at: 0.6, color: '#0d0d0d99' }, { at: 1, color: '#181818a6' }] } as const
type Frame = 'frame' | 'sheen' | 'clear'
const pane = (tint: Color, kind: Frame): ThemeMessageRule =>
  kind === 'clear'
    ? { radius: 22, padding: 14, backgroundColor: '#0000', borderColor: '#0000', borderWidth: 0, color: '#ffffff' }
    : {
        radius: 22,
        padding: 16,
        backgroundColor: tint,
        fill: kind === 'frame' ? { vector: GLASS_FRAME } : { gradient: GLASS_SHEEN },
        borderColor: '#8a8a8a',
        borderWidth: 1,
        shadow: { x: 0, y: 8, blur: 26, color: '#00000066' },
        color: '#ffffff',
      }
const user = (kind: Frame): ThemeMessageRule => pane('#1a1a1a99', kind)
const reply = (kind: Frame): ThemeMessageRule => pane('#0d0d0d99', kind)

// If the app refuses any of that, the same look is applied without the box styling.
const plain = (look: ThemeSetArgs): ThemeSetArgs => {
  const copy = JSON.parse(JSON.stringify(look)) as { style?: Record<string, unknown>; backdrop?: Record<string, unknown> }

  if (copy.style !== undefined) {
    delete copy.style.UserMessage
    delete copy.style.AssistantMessage
    delete copy.style.ToolUse
  }
  if (copy.backdrop !== undefined) {
    delete copy.backdrop.glass
  }

  return copy as ThemeSetArgs
}

// Tool-use rows: the same glass, tighter. Built without a padding key (an undefined value is refused).
const tool = (kind: Frame): ThemeMessageRule => {
  const { padding: _padding, ...rest } = pane('#0d0d0d66', kind)

  return { ...rest, radius: 14, paddingX: 12, paddingY: 6, shadow: 'none' }
}

const racing = (kind: Frame): ThemeSetArgs => ({
  colors: mk('Highway', '#2563b0', ['#141c12', '#182016', '#1c261a', '#ffffff'], ['#141c12', '#182016', '#1c261a', '#212c1f', '#ffffff'], true),
  overrideColorScheme: 'dark',
  // No blur: the app's panels (behind the type box, the sidebar strip) are a light dark tint, so the road shows through.
  backdrop: { scene: 'racing', glass: { blur: 0, tint: '#0d0d0d', opacity: 0.18 } },
  style: {
    Text: { fontFamily: ['mono'], color: '#ffffff' },
    UserMessage: user(kind),
    AssistantMessage: reply(kind),
    ToolUse: tool(kind),
  },
})

// A quiet road hum with distant passing cars, and short cues (the app plays them only once the person
// turns the theme's sound on; a build without sound support refuses the set, so the look is also tried without it).
const SOUND: NonNullable<ThemeSetArgs['sound']> = {
  ambience: {
    layers: [
      { wave: 'brown', drone: true, gain: 0.2, filter: { type: 'lowpass', hz: 320 } },
      { wave: 'pink', scatter: 0.25, gain: 0.07, filter: { type: 'bandpass', hz: 700, to: 300 }, attack: 1.2, release: 1.6 },
    ],
  },
  cues: {
    send: { layers: [{ wave: 'triangle', notes: ['C6'], gain: 0.12 }] },
    done: { layers: [{ wave: 'sine', notes: ['E5', 'A5'], step: 0.12, gain: 0.22 }] },
    ask: { layers: [{ wave: 'triangle', notes: ['A4', 'A4'], step: 0.16, gain: 0.2 }] },
    error: { layers: [{ wave: 'saw', notes: ['A3', 'E3'], step: 0.15, gain: 0.14 }] },
  },
}
const racingVariants = (): ThemeSetArgs[] => [{ ...racing('frame'), sound: SOUND }, racing('frame'), racing('sheen'), racing('clear')]

const LOOKS: Record<string, ThemeSetArgs> = {
  racing: racing('frame'),
  synthwave: {
    colors: mk('Synthwave', '#ff3ec8', ['#f1e9fb', '#f7f1fd', '#fcf9ff', '#22103a'], ['#150a26', '#1d0f33', '#26143f', '#2e1a4a', '#f4e8ff']),
    backdrop: { color: 'surface-0' },
    style: { UserMessage: user('sheen'), AssistantMessage: reply('sheen') },
  },
  forest: {
    colors: mk('Forest', '#3f8f5a', ['#e6ecdf', '#eef3e8', '#f6f9f1', '#1c2a1d'], ['#0f1a12', '#16241a', '#1d2d21', '#243627', '#e6f0e4']),
  },
  ocean: {
    colors: mk('Ocean', '#2b7fc4', ['#e2edf3', '#ebf3f8', '#f4f9fc', '#10222e'], ['#0a1822', '#10212d', '#162b3a', '#1c3547', '#e2f0f8']),
  },
}

const sky = atom({ plugin: 'racing-themes', key: 'sky' } as const, { phase: 'day', wx: 'clear', tempF: null, note: '', ctx: 0, usd: 0, five: 0, msg: '', busy: false })

// What the person forced with /time and /weather; otherwise the real Chapel Hill sky.
let forcedPhase: Phase | undefined
let forcedWx: Weather | undefined
let tick = 0
const SCENES = new Map<string, string>()

const WX_WORD: Record<Weather, string> = { clear: 'CLEAR', cloudy: 'CLOUDY', fog: 'FOG', rain: 'RAIN', storm: 'STORM', snow: 'SNOW' }

// The message sign's pages (up to three lines each). The time is rounded to 5 minutes so the sign
// repaints (and restarts its cycle) rarely, and the chat stats page waits until there are numbers.
const pagesFor = (s: { wx: Weather; tempF: number | null; ctx?: number; usd?: number; five?: number; msg?: string; busy?: boolean }, now: number): string[][] => {
  const stamp = now - (now % 300_000)
  const pages: string[][] = [
    ['CHAPEL HILL', s.tempF === null ? WX_WORD[s.wx] : `${Math.round(s.tempF)}F ${WX_WORD[s.wx]}`],
    [localDate(stamp), localClock(stamp)],
  ]

  if ((s.ctx ?? 0) > 0 || (s.usd ?? 0) > 0) {
    pages.push([`CONTEXT ${Math.round(s.ctx ?? 0)}%`, `COST $${(s.usd ?? 0).toFixed(2)}`, `5H LIMIT ${Math.round(s.five ?? 0)}%`])
  }

  pages.push(['CLAUDE', s.busy === true ? 'WORKING' : 'READY'])
  if ((s.msg ?? '') !== '') {
    pages.unshift(s.msg!.toUpperCase().split('|').slice(0, 3).map(l => l.trim().slice(0, 14)))
  }

  return pages
}

// The highway runs three 15-minute schedules (each with its own traffic stop and crash, plus different extras) that
// take turns. The picture is redrawn whenever the sign or the sky changes, so every animation is started
// part-way in (a negative delay), which keeps the road's timeline running instead of restarting it.
const SCHEDULE_S = 912
const VARIANTS = 3
let variant = 0
let variantStart = 0
let lastTw = ''

const rephase = (svg: string, off: number): string => {
  const o = off.toFixed(2)

  return svg
    .replace(/animation-delay:(-?\d+(?:\.\d+)?)s/g, (_, d: string) => `animation-delay:${(Number(d) - off).toFixed(2)}s`)
    .replace(/\{([^{}]*animation:[^{}]*)\}/g, (all, body: string) => (body.includes('animation-delay') ? all : `{${body};animation-delay:-${o}s}`))
}

const sceneFor = (phase: Phase, wx: Weather, pages: string[][], season: ReturnType<typeof seasonAt>, off: number, tw: { color: string; opacity: number } | null): string => {
  const key = `${phase}/${wx}/${JSON.stringify(pages)}/${season}/${variant}/${JSON.stringify(tw)}`
  let base = SCENES.get(key)

  if (base === undefined) {
    base = buildHighway(phase, wx, pages, season, variant, tw)
    SCENES.clear()
    SCENES.set(key, base)
  }
  let out = rephase(base, off)
  let shown = pages

  // The picture has a hard size limit; if the sign's lettering would push it over, draw fewer pages.
  while (out.length > 130_900 && shown.length > 0) {
    shown = shown.slice(0, -1)
    out = rephase(buildHighway(phase, wx, shown, season, variant, tw), off)
  }

  return out
}

// Works out Chapel Hill's time of day from the clock, and every 15 minutes asks Open-Meteo for the weather.
async function refreshSky($: EngineInterface, withWeather: boolean) {
  const now = await $.clock.now()
  const phase = forcedPhase ?? phaseAt(now)

  await update($, sky, s => ({ ...s, phase }))
  if (!withWeather) {
    return
  }
  let note = 'weather unavailable'

  // First choice: Open-Meteo. If it refuses (it rate-limits shared networks), the National Weather
  // Service's Raleigh-Durham station is the backup.
  try {
    const res = await $.http.fetch(WEATHER_URL)

    if (res.ok) {
      const cur = (JSON.parse(res.text) as { current?: { temperature_2m?: number; weather_code?: number; cloud_cover?: number } }).current
      const wx = forcedWx ?? weatherFromCode(cur?.weather_code ?? 0, cur?.cloud_cover ?? 0)

      await update($, sky, s => ({ ...s, wx, tempF: cur?.temperature_2m ?? null, note: 'live, Open-Meteo' }))

      return
    }
    note = `Open-Meteo HTTP ${res.status}`
  } catch (error) {
    note = `Open-Meteo: ${String(error).slice(0, 260)}`
  }
  try {
    const res = await $.http.fetch(NWS_URL, { headers: { 'User-Agent': 'claude-mods-highway', Accept: 'application/geo+json' } })

    if (res.ok) {
      const props = (JSON.parse(res.text) as { properties?: { textDescription?: string; temperature?: { value?: number | null } } }).properties
      const c = props?.temperature?.value
      const wx = forcedWx ?? weatherFromText(props?.textDescription ?? '')

      await update($, sky, s => ({ ...s, wx, tempF: typeof c === 'number' ? (c * 9) / 5 + 32 : null, note: 'live, National Weather Service (RDU)' }))

      return
    }
    note = `${note}; NWS HTTP ${res.status}`
  } catch (error) {
    note = `${note}; NWS: ${String(error).slice(0, 260)}`
  }
  await update($, sky, s => ({ ...s, wx: forcedWx ?? s.wx, note }))
}

// Applies the first look the app accepts: glass frames, then the sheen, then no box styling at all.
async function applyLook($: EngineInterface, variants: ThemeSetArgs[]) {
  for (const v of variants) {
    try {
      return await $.theme.set(v)
    } catch (error) {
      $.ui.log(String(error))
    }
  }
  const first = variants[0]

  return $.theme.set(first === undefined ? {} : plain(first))
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'look', description: `Switch look: ${Object.keys(LOOKS).join(', ')}` })
    await $.command.register({ name: 'weather', description: 'Chapel Hill time and weather for the highway; /weather rain forces it, /weather auto goes back to live' })
    await $.command.register({ name: 'sign', description: 'Put your own words on the highway sign: /sign GOOD LUCK | SHIP IT (use | for new lines, /sign off clears it)' })
    await $.command.register({ name: 'time', description: 'Force the highway to day, dusk or night; /time auto goes back to the real Chapel Hill time' })
    // Apply the look first, so a slow weather request can never hold it up.
    try {
      const set = await applyLook($, racingVariants())

      $.ui.toast(set.isDrawn ? 'Highway look applied' : `Highway backdrop not drawn here: ${set.reason}`)
    } catch (error) {
      $.ui.log(String(error))
    }
    // Time of day now (no network), weather in the background, and a redraw so a reloaded mod repaints.
    try {
      await update($, sky, s => ({ ...s, phase: phaseAt(Date.now()) }))
    } catch (error) {
      $.ui.log(String(error))
    }
    refreshSky($, true).catch(error => $.ui.log(String(error)))
    variant = Math.floor(Math.random() * VARIANTS)
    variantStart = Date.now() - Math.random() * SCHEDULE_S * 1000
    $.clock.every(5000, () => {
      if (Date.now() - variantStart >= SCHEDULE_S * 1000) {
        variant = (variant + 1) % VARIANTS
        variantStart += SCHEDULE_S * 1000
        $.ui.invalidate('ui.render')
      }
    })
    $.clock.every(60_000, () => {
      const tw = JSON.stringify(forcedPhase === undefined ? twilightAt(Date.now()) : null)

      if (tw !== lastTw) {
        lastTw = tw
        $.ui.invalidate('ui.render')
      }
      tick += 1
      refreshSky($, tick % 15 === 0).catch(error => $.ui.log(String(error)))
    })
    $.ui.invalidate('ui.render')

    return next(e)
  })

  on('command.run', { command: 'sign' }, async ($, e) => {
    const arg = e.args.trim()
    const msg = arg.toLowerCase() === 'off' ? '' : arg

    await update($, sky, s => ({ ...s, msg }))
    $.ui.invalidate('ui.render')

    return { text: msg === '' ? 'Sign message cleared.' : `Sign now shows: ${msg.toUpperCase()}` }
  })

  // The sign's status page: WORKING while Claude is on a turn, READY after.
  on('prompt.submit', async ($, e, next) => {
    try {
      await update($, sky, s => ({ ...s, busy: true }))
      $.ui.invalidate('ui.render')
    } catch (error) {
      $.ui.log(String(error))
    }

    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    const result = await next(e)

    try {
      await update($, sky, s => ({ ...s, busy: false }))
      $.ui.invalidate('ui.render')
    } catch (error) {
      $.ui.log(String(error))
    }

    return result
  })

  on('command.run', { command: 'look' }, async ($, e) => {
    const name = e.args.trim().toLowerCase()
    const look = LOOKS[name]

    if (look === undefined) {
      return { text: `Looks: ${Object.keys(LOOKS).join(', ')}. Usage: /look racing` }
    }
    try {
      const set = await applyLook($, name === 'racing' ? racingVariants() : [look])

      return { text: set.isDrawn ? `Look: ${name}` : `Set, but nothing draws it here: ${set.reason}` }
    } catch (error) {
      return { text: `Could not set ${name}: ${String(error)}` }
    }
  })

  on('command.run', { command: 'weather' }, async ($, e) => {
    const arg = e.args.trim().toLowerCase()
    const choices = ['clear', 'cloudy', 'fog', 'rain', 'storm', 'snow']

    if (arg === 'auto') {
      forcedWx = undefined
      await refreshSky($, true)
    } else if (choices.includes(arg)) {
      forcedWx = arg as Weather
      await update($, sky, s => ({ ...s, wx: arg as Weather }))
    }
    const s = await read($, sky)
    const now = await $.clock.now()
    const temp = s.tempF === null ? 'unknown temperature' : `${Math.round(s.tempF)}°F`

    return { text: `Chapel Hill, ${localClock(now)}: ${s.phase}, ${s.wx}, ${temp} (${s.note || 'no weather yet'}). Options: /weather ${choices.join(' | ')} | auto` }
  })

  on('command.run', { command: 'time' }, async ($, e) => {
    const arg = e.args.trim().toLowerCase()

    if (arg === 'auto') {
      forcedPhase = undefined
      await refreshSky($, false)
    } else if (arg === 'day' || arg === 'dusk' || arg === 'night') {
      forcedPhase = arg
      await update($, sky, s => ({ ...s, phase: arg as Phase }))
    }
    const s = await read($, sky)

    return { text: `Highway time of day: ${s.phase}${forcedPhase === undefined ? ' (real Chapel Hill time)' : ' (forced)'}. Options: /time day | dusk | night | auto` }
  })

  // Chat stats for the sign: repaint only when they move a good step, so the sign keeps cycling.
  on('session.measure', async ($, e, next) => {
    const five = e.rateLimits.find(l => l.kind.includes('five'))
    const ctx = Math.round(e.context.percent ?? 0)
    const usd = e.cost?.usd ?? 0
    const fivePct = Math.round(five?.percentUsed ?? 0)

    try {
      const before = await read($, sky)
      const moved =
        Math.floor(ctx / 5) !== Math.floor((before.ctx ?? 0) / 5) ||
        Math.floor(usd * 2) !== Math.floor((before.usd ?? 0) * 2) ||
        Math.floor(fivePct / 5) !== Math.floor((before.five ?? 0) / 5) ||
        (before.ctx ?? 0) + (before.usd ?? 0) === 0

      await update($, sky, s => ({ ...s, ctx, usd, five: fivePct }))
      if (moved) {
        $.ui.invalidate('ui.render')
      }
    } catch (error) {
      $.ui.log(String(error))
    }

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, async ($, e, next) => {
    if (e.props.scene !== 'racing' || (e.surface !== 'desktop' && e.surface !== 'mobile')) {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)
    const s = await read($, sky)

    return <Svg source={sceneFor(s.phase, s.wx, pagesFor(s, Date.now()), seasonAt(Date.now()), ((Date.now() - variantStart) / 1000) % SCHEDULE_S, forcedPhase === undefined ? twilightAt(Date.now()) : null)} alt={`A top-down highway at ${s.phase}, ${s.wx}, with police chasing sports cars through traffic`} isInteractive />
  })

  // The working line: a wheel doing a burnout, with a driving word for what the turn is doing.
  on('ui.render', { component: 'Spinner' }, ($, e, next) => {
    if (e.surface === 'terminal') {
      return next(e)
    }
    const { Box, Svg, Text } = $.ui.resolve(e)

    return (
      <Box>
        <Svg source={WHEEL} alt="A wheel spinning in a burnout" width={40} height={32} />
        <Text>{WORDS[e.props.mode] ?? 'Revving'}...</Text>
      </Box>
    )
  })
}

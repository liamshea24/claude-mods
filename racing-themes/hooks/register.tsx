import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, ThemeMessageRule, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildHighway } from './highway.js'
import type { Phase, Weather } from './highway.js'
import { localClock, NWS_URL, phaseAt, WEATHER_URL, weatherFromCode, weatherFromText } from './sky.js'
import { WHEEL, WORDS } from './spinner.js'

type Color = NonNullable<ThemeMessageRule['color']>

type Hex = `#${string}`
const WHITE: Hex = '#ffffff'
const BLACK: Hex = '#000000'
type Anchors4 = [Hex, Hex, Hex, Hex]
type Anchors5 = [Hex, Hex, Hex, Hex, Hex]

// One palette per mode. The message colors (user bubble, assistant bubble) are set
// from the same anchors as the page, so the chat and the text box always agree.
const mk = (label: string, accent: Hex, light: Anchors4, dark: Anchors5) => {
  const { theme } = makeColors({
    label,
    roles: { accent, danger: '#d63a2f', success: '#3f9a52', warning: '#c98a10', pro: '#8a5fc9' },
    light: {
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
    },
    dark: {
      gray: {
        anchors: {
          'surface-0': dark[0],
          'surface-1': dark[1],
          'surface-2': dark[2],
          'surface-3': dark[3],
          'text-primary': dark[4],
          'text-secondary': '#c9c9c9',
          'text-muted': '#a3a3a3',
        },
      },
    },
  })

  return {
    ...theme,
    inputs: {
      light: {
        ...theme.inputs.light,
        'bg-user-message': BLACK,
        'text-user-message': WHITE,
        'bg-assistant-message': BLACK,
        'text-assistant-message': WHITE,
      },
      dark: {
        ...theme.inputs.dark,
        'bg-user-message': BLACK,
        'text-user-message': WHITE,
        'bg-assistant-message': BLACK,
        'text-assistant-message': WHITE,
      },
    },
  }
}

const base = { radius: 10, padding: 12, borderWidth: 1 } as const
const user = (accent: Color): ThemeMessageRule => ({ ...base, backgroundColor: '#000000', color: '#ffffff', borderColor: accent })
// Every text box is black with white text; the user's bubble keeps a thin accent border.
const reply: ThemeMessageRule = { ...base, backgroundColor: '#000000', color: '#ffffff', borderColor: '#2b2b2b' }

const LOOKS: Record<string, ThemeSetArgs> = {
  racing: {
    colors: mk('Highway', '#2563b0', ['#e9eaec', '#f1f2f4', '#f8f9fa', '#16181d'], ['#000000', '#000000', '#050505', '#0b0b0b', '#f2f2f2']),
    backdrop: { scene: 'racing', glass: false },
    style: {
      Text: { fontFamily: ['mono'] },
      UserMessage: user('#2563b0'),
      AssistantMessage: reply,
      ToolUse: { color: '#ffffff', backgroundColor: '#000000', radius: 6, paddingX: 8 },
    },
  },
  synthwave: {
    colors: mk('Synthwave', '#ff3ec8', ['#f1e9fb', '#f7f1fd', '#fcf9ff', '#22103a'], ['#150a26', '#1d0f33', '#26143f', '#2e1a4a', '#f4e8ff']),
    backdrop: { color: 'surface-0' },
    style: { UserMessage: user('#9a2bc4'), AssistantMessage: reply },
  },
  forest: {
    colors: mk('Forest', '#3f8f5a', ['#e6ecdf', '#eef3e8', '#f6f9f1', '#1c2a1d'], ['#0f1a12', '#16241a', '#1d2d21', '#243627', '#e6f0e4']),
  },
  ocean: {
    colors: mk('Ocean', '#2b7fc4', ['#e2edf3', '#ebf3f8', '#f4f9fc', '#10222e'], ['#0a1822', '#10212d', '#162b3a', '#1c3547', '#e2f0f8']),
  },
}

const sky = atom({ plugin: 'racing-themes', key: 'sky' } as const, { phase: 'day', wx: 'clear', tempF: null, note: '' })

// What the person forced with /time and /weather; otherwise the real Chapel Hill sky.
let forcedPhase: Phase | undefined
let forcedWx: Weather | undefined
let tick = 0
const SCENES = new Map<string, string>()

const sceneFor = (phase: Phase, wx: Weather): string => {
  const key = `${phase}/${wx}`
  const hit = SCENES.get(key)

  if (hit !== undefined) {
    return hit
  }
  const built = buildHighway(phase, wx)

  SCENES.set(key, built)

  return built
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
    note = `Open-Meteo: ${String(error).slice(0, 60)}`
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
    note = `${note}; NWS: ${String(error).slice(0, 60)}`
  }
  await update($, sky, s => ({ ...s, wx: forcedWx ?? s.wx, note }))
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'look', description: `Switch look: ${Object.keys(LOOKS).join(', ')}` })
    await $.command.register({ name: 'weather', description: 'Chapel Hill time and weather for the highway; /weather rain forces it, /weather auto goes back to live' })
    await $.command.register({ name: 'time', description: 'Force the highway to day, dusk or night; /time auto goes back to the real Chapel Hill time' })
    await refreshSky($, true)
    $.clock.every(60_000, () => {
      tick += 1
      void refreshSky($, tick % 15 === 0)
    })
    try {
      const racing = LOOKS.racing

      if (racing !== undefined) {
        const set = await $.theme.set(racing)

        $.ui.toast(set.isDrawn ? 'Highway look applied: look between the chat and the Environment panel' : `Highway backdrop not drawn here: ${set.reason}`)
      }
    } catch (error) {
      $.ui.log(String(error))
    }

    return next(e)
  })

  on('command.run', { command: 'look' }, async ($, e) => {
    const name = e.args.trim().toLowerCase()
    const look = LOOKS[name]

    if (look === undefined) {
      return { text: `Looks: ${Object.keys(LOOKS).join(', ')}. Usage: /look racing` }
    }
    try {
      const set = await $.theme.set(look)

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

  on('ui.render', { component: 'Backdrop' }, async ($, e, next) => {
    if (e.props.scene !== 'racing' || (e.surface !== 'desktop' && e.surface !== 'mobile')) {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)
    const s = await read($, sky)

    return <Svg source={sceneFor(s.phase, s.wx)} alt={`A top-down highway at ${s.phase}, ${s.wx}, with police chasing sports cars through traffic`} isInteractive />
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

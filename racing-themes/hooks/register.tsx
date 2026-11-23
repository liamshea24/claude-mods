import type { Register, ThemeMessageRule, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildHighway } from './highway.js'
import { WHEEL, WORDS } from './spinner.js'

type Color = NonNullable<ThemeMessageRule['color']>

type Hex = `#${string}`
const WHITE: Hex = '#ffffff'
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
        'bg-user-message': accent,
        'text-user-message': WHITE,
        'bg-assistant-message': light[1],
        'text-assistant-message': light[3],
      },
      dark: {
        ...theme.inputs.dark,
        'bg-user-message': accent,
        'text-user-message': WHITE,
        'bg-assistant-message': dark[1],
        'text-assistant-message': dark[4],
      },
    },
  }
}

const base = { radius: 10, padding: 12, borderWidth: 1 } as const
const user = (accent: Color): ThemeMessageRule => ({ ...base, backgroundColor: accent, color: '#ffffff', borderColor: accent })
// Palette names follow light and dark, so these match the text box in both modes.
const reply: ThemeMessageRule = { ...base, backgroundColor: 'surface-1', color: 'text-primary', borderColor: 'surface-3' }

const LOOKS: Record<string, ThemeSetArgs> = {
  racing: {
    colors: mk('Highway', '#2563b0', ['#e9eaec', '#f1f2f4', '#f8f9fa', '#16181d'], ['#101216', '#171a20', '#1e222a', '#262b35', '#eef0f3']),
    backdrop: { scene: 'racing', glass: false },
    style: {
      Text: { fontFamily: ['mono'] },
      UserMessage: user('#2563b0'),
      AssistantMessage: reply,
      ToolUse: { color: 'text-secondary', backgroundColor: 'surface-2', radius: 6, paddingX: 8 },
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

const SCENE = buildHighway()

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'look', description: `Switch look: ${Object.keys(LOOKS).join(', ')}` })
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

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.props.scene !== 'racing' || (e.surface !== 'desktop' && e.surface !== 'mobile')) {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="A top-down highway with police chasing sports cars through traffic, night with lit lamps and day with lamps off" isInteractive />
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

import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Reading } from '../types'

const PANE = 'meter'
const COLD_MS = 5 * 60 * 1000
const reading = atom({ plugin: 'meter', key: 'reading' } as const, null)
const lastTurnAt = atom({ plugin: 'meter', key: 'lastTurnAt' } as const, 0)

const bar = (pct: number, n = 20) =>
  '█'.repeat(Math.round((Math.min(pct, 100) / 100) * n)).padEnd(n, '░')

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'meter', description: 'Open the context / cost / cache meter pane' })

    return next(e)
  })

  on('command.run', { command: 'meter' }, async $ => {
    await $.ui.open({ id: PANE, title: 'Meter' })

    return { text: 'Meter pane opened.' }
  })

  on('session.measure', async ($, e, next) => {
    const pct = Math.round(e.context.percent ?? 0)
    const limits = e.rateLimits.map(l => `${l.kind} ${Math.round(l.percentUsed)}%`).join(' · ')
    const r: Reading = {
      pct,
      tokens: e.context.tokens ?? 0,
      window: e.context.window,
      usd: e.cost?.usd ?? 0,
      limits,
    }
    await update($, reading, () => r)
    $.ui.status(`ctx ${pct}% · $${r.usd.toFixed(2)}${limits ? ' · ' + limits : ''}`)

    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    const now = await $.clock.now()
    await update($, lastTurnAt, () => now)

    return next(e)
  })

  // Cold-cache warning before a follow-up goes out.
  on('prompt.submit', async ($, e, next) => {
    const last = await read($, lastTurnAt)

    if (last > 0 && (await $.clock.now()) - last > COLD_MS) {
      $.ui.toast('Prompt cache is probably cold (5m+ idle): this follow-up re-reads the whole context at full price.')
    }

    return next(e)
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text } = $.ui.resolve(e)
    const r = await read($, reading)
    const last = await read($, lastTurnAt)
    const idle = last > 0 ? Math.round(((await $.clock.now()) - last) / 1000) : null

    if (r === null) {
      return <Text dimColor>No reading yet. Send a message.</Text>
    }
    const cache =
      idle === null ? 'n/a' : idle * 1000 > COLD_MS ? 'cold' : `warm (${Math.max(0, 300 - idle)}s left)`

    return (
      <Box flexDirection="column">
        <Text>
          Context {bar(r.pct)} {r.pct}%
        </Text>
        <Text dimColor>
          {r.tokens.toLocaleString()} / {r.window.toLocaleString()} tokens
        </Text>
        <Text>Cost ${r.usd.toFixed(3)}</Text>
        <Text dimColor>{r.limits || 'no rate-limit windows'}</Text>
        <Text>Cache {cache}</Text>
      </Box>
    )
  })
}

import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Dash } from '../types'

const COLD_MS = 5 * 60 * 1000
const INITIAL: Dash = {
  edits: 0, logged: 0, isLaterOn: false,
  fixBefore: '', fixAfter: '', isFixHidden: true, isFixOpen: false,
  sessionUsd: 0, startUsd: 0, lastUsd: 0, lastSecs: 0, reusePct: 0,
  ctxPct: 0, fiveHourPct: 0, lastTurnAt: 0,
  budget: 0, isBudgetWarned: false, startedAt: 0,
}
const dash = atom({ plugin: 'dashboard', key: 's' } as const, INITIAL)
const log = atom({ plugin: 'dashboard', key: 'log' } as const, { items: [], idx: 0 })

const clip = (text: string, n = 500): string => (text.length > n ? `${text.slice(0, n)}...` : text)

const FIXES: [RegExp, string][] = [
  [/\bi\b/g, 'I'],
  [/\bdont\b/gi, "don't"], [/\bcant\b/gi, "can't"], [/\bwont\b/gi, "won't"],
  [/\bdoesnt\b/gi, "doesn't"], [/\bdidnt\b/gi, "didn't"], [/\bim\b/gi, "I'm"],
  [/\bive\b/gi, "I've"], [/\bthats\b/gi, "that's"], [/\bisnt\b/gi, "isn't"],
]

// Tidies a message without changing its meaning: whitespace, "i" -> "I", missing apostrophes.
const tidy = (text: string): string => {
  let out = text.trim().replace(/[ \t]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n')

  for (const [pattern, to] of FIXES) {
    out = out.replace(pattern, to)
  }

  return out.charAt(0).toUpperCase() + out.slice(1)
}

const LOG_PROMPT =
  'Append a short entry to brain-log.md in the project root (create it if missing): today\'s date, the files changed in this chat and why, and decisions made. Keep it under 10 lines.'

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const now = await $.clock.now()

    await update($, dash, s => ({ ...s, startedAt: s.startedAt > 0 ? s.startedAt : now }))
    await $.command.register({ name: 'budget', description: 'Warn when this chat passes a dollar amount: /budget 5 (or /budget off)' })
    await $.command.register({ name: 'edits', description: 'Step through the file edits made in this chat, one at a time' })
    await $.command.register({ name: 'wrapup', description: 'Summarize this chat: what changed, what it cost, what is left' })

    return next(e)
  })

  on('command.run', { command: 'budget' }, async ($, e) => {
    const arg = e.args.trim().toLowerCase()
    const usd = Number(arg.replace('$', ''))

    if (arg === 'off' || arg === '0') {
      await update($, dash, s => ({ ...s, budget: 0, isBudgetWarned: false }))

      return { text: 'Budget alarm off.' }
    }
    if (!Number.isFinite(usd) || usd <= 0) {
      const s = await read($, dash)

      return { text: s.budget > 0 ? `Budget alarm: $${s.budget.toFixed(2)}. Change with /budget 10, turn off with /budget off.` : 'No budget set. Try /budget 5. (Costs are estimates, not the bill.)' }
    }
    await update($, dash, s => ({ ...s, budget: usd, isBudgetWarned: false }))

    return { text: `Budget alarm set to $${usd.toFixed(2)} (estimated cost; the bill is the authority).` }
  })

  on('command.run', { command: 'edits' }, async $ => {
    await $.ui.open({ id: 'edits', title: 'Edits' })

    return { text: 'Edit replayer opened.' }
  })

  on('command.run', { command: 'wrapup' }, async $ => {
    const s = await read($, dash)
    const now = await $.clock.now()
    const mins = s.startedAt > 0 ? Math.round((now - s.startedAt) / 60000) : 0

    return {
      text: `Wrap-up: ${s.edits} file edits, about $${s.sessionUsd.toFixed(2)} estimated cost, ${mins} minutes, context ${s.ctxPct}%.`,
      context: ['Give a short recap of this chat: what was done, which files changed and why, what is unfinished, and the next step. Keep it under 12 lines.'],
    }
  })

  on('prompt.submit', async ($, e, next) => {
    const now = await read($, dash)

    await update($, dash, s => ({ ...s, startUsd: now.sessionUsd }))
    if (e.origin.kind !== 'composer' || e.text.startsWith('/') || e.text.startsWith('!raw ')) {
      return next(e)
    }
    const after = tidy(e.text)

    if (after === e.text) {
      return next(e)
    }
    await update($, dash, s => ({ ...s, fixBefore: e.text, fixAfter: after, isFixHidden: false, isFixOpen: false }))
    $.ui.status('Prompt fixer on · cleaned your last prompt')

    return next({ ...e, text: after })
  })

  on('tool.call', { tool: 'Edit' }, async ($, e, next) => {
    await update($, dash, s => ({ ...s, edits: s.edits + 1, isLaterOn: false }))
    await update($, log, l => ({ items: [...l.items, { tool: 'Edit', file: e.file_path, before: clip(e.old_string), after: clip(e.new_string) }].slice(-30), idx: Math.min(l.items.length, 29) }))

    return next(e)
  })

  on('tool.call', { tool: 'Write' }, async ($, e, next) => {
    await update($, dash, s => ({ ...s, edits: s.edits + 1, isLaterOn: false }))
    await update($, log, l => ({ items: [...l.items, { tool: 'Write', file: e.file_path, before: '', after: clip(e.content) }].slice(-30), idx: Math.min(l.items.length, 29) }))

    return next(e)
  })

  on('session.measure', async ($, e, next) => {
    const five = e.rateLimits.find(l => l.kind.includes('five'))
    const cur = await read($, dash)
    const usd = e.cost?.usd ?? cur.sessionUsd

    if ((cur.budget ?? 0) > 0 && usd >= cur.budget && !cur.isBudgetWarned) {
      $.ui.toast(`Budget alarm: this chat is at about $${usd.toFixed(2)} (limit $${cur.budget.toFixed(2)}). Estimate only.`, { timeoutMs: 10000 })
      await update($, dash, s => ({ ...s, isBudgetWarned: true }))
    }
    await update($, dash, s => ({
      ...s,
      sessionUsd: e.cost?.usd ?? s.sessionUsd,
      ctxPct: Math.round(e.context.percent ?? 0),
      fiveHourPct: Math.round(five?.percentUsed ?? s.fiveHourPct),
    }))

    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    const result = await next(e)
    const now = await $.clock.now()
    const u = result.usage

    await update($, dash, s => {
      const total = u === undefined ? 0 : u.cache_read_input_tokens + u.cache_creation_input_tokens + u.input_tokens

      return {
        ...s,
        lastUsd: Math.max(0, s.sessionUsd - s.startUsd),
        lastSecs: s.lastTurnAt > 0 ? Math.round((now - s.lastTurnAt) / 1000) : 0,
        reusePct: u === undefined || total === 0 ? s.reusePct : Math.round((u.cache_read_input_tokens / total) * 100),
        lastTurnAt: now,
      }
    })

    return result
  })

  // The edit replayer: step back and forward through the edits made in this chat.
  on('ui.render', { component: 'Pane', requestId: 'edits' }, async ($, e) => {
    const { Box, Button, Text } = $.ui.resolve(e)
    const l = await read($, log)
    const rec = l.items[l.idx]

    if (rec === undefined) {
      return <Text dimColor>No edits yet in this chat.</Text>
    }

    return (
      <Box flexDirection="column" gap={1}>
        <Box gap={1} alignItems="center">
          <Button key="prev" label="Prev" onPress={() => update($, log, d => ({ ...d, idx: Math.max(0, d.idx - 1) }))} />
          <Text size="footnote">{l.idx + 1} / {l.items.length}</Text>
          <Button key="next" label="Next" onPress={() => update($, log, d => ({ ...d, idx: Math.min(d.items.length - 1, d.idx + 1) }))} />
        </Box>
        <Text weight="medium">{rec.tool} {rec.file}</Text>
        {rec.before !== '' && <Text dimColor>was: {rec.before}</Text>}
        <Text>{rec.tool === 'Write' ? 'wrote' : 'now'}: {rec.after}</Text>
      </Box>
    )
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const s = await read($, dash)

    if (e.props.hasSurvey) {
      return next(e)
    }
    const { Box, Button, Text } = $.ui.resolve(e)
    const now = await $.clock.now()
    const isCold = s.lastTurnAt > 0 && now - s.lastTurnAt > COLD_MS
    const unlogged = s.edits - s.logged
    const mins = Math.floor(s.lastSecs / 60)
    const took = mins > 0 ? `${mins}m ${s.lastSecs % 60}s` : `${s.lastSecs}s`
    const lastTurn = s.lastSecs > 0 ? `last turn $${s.lastUsd.toFixed(2)} in ${took}, ${s.reusePct}% cached` : ''

    return (
      <Box flexDirection="column" paddingX={2} paddingY={1} gap={1} backgroundColor="#0d0d0d99" borderColor="#8a8a8a" borderStyle="round">
        {unlogged > 0 && !s.isLaterOn && (
          <Box gap={1} alignItems="center">
            <Text size="footnote">{unlogged} file edits not logged yet</Text>
            <Button key="log" label="Log it" onPress={async () => {
              await update($, dash, d => ({ ...d, logged: d.edits }))
              await $.prompt.submit({ text: LOG_PROMPT, asUser: true })
            }} />
            <Button key="later" label="Later" onPress={() => update($, dash, d => ({ ...d, isLaterOn: true }))} />
          </Box>
        )}
        {!s.isFixHidden && (
          <Box flexDirection="column">
            <Box gap={1} alignItems="center">
              <Text size="footnote">Prompt fixer tidied your last message</Text>
              <Button key="see" label={s.isFixOpen ? 'Hide' : 'See changes'} onPress={() => update($, dash, d => ({ ...d, isFixOpen: !d.isFixOpen }))} />
              <Button key="x" label="x" onPress={() => update($, dash, d => ({ ...d, isFixHidden: true }))} />
            </Box>
            {s.isFixOpen && (
              <Box flexDirection="column" paddingLeft={2}>
                <Text size="footnote" dimColor>was: {s.fixBefore.slice(0, 300)}</Text>
                <Text size="footnote">now: {s.fixAfter.slice(0, 300)}</Text>
              </Box>
            )}
          </Box>
        )}
        <Box justifyContent="space-between" alignItems="center">
          <Box gap={2} alignItems="center">
            <Text size="footnote" weight="medium">{isCold ? '○ cache cold' : '● cache warm'}</Text>
            <Text size="footnote" tabular>${s.sessionUsd.toFixed(2)}</Text>
            <Text size="footnote" dimColor tabular>ctx {s.ctxPct}%</Text>
            <Text size="footnote" dimColor tabular>5h {s.fiveHourPct}%</Text>
            {lastTurn !== '' && <Text size="footnote" dimColor>{lastTurn}</Text>}
          </Box>
          <Box gap={1}>
            <Button key="review" label="Review" onPress={() => $.prompt.submit({ text: 'Review the changes made in this chat for bugs and missed edge cases.', asUser: true })} />
            <Button key="audit" label="Audit" onPress={() => $.prompt.submit({ text: 'Audit the changes made in this chat for security issues and risky assumptions.', asUser: true })} />
            <Button key="handoff" label="Handoff" onPress={() => $.prompt.submit({ text: 'Write a handoff prompt for a fresh session: the goal, files touched and why, decisions made, what is done, remaining tasks in order, and gotchas. Output it in one fenced block.', asUser: true })} />
            <Button key="tests" label="Tests" onPress={() => $.prompt.submit({ text: "Run this project's tests (find the right command first). Reply with one line: passed or failed, and what failed.", asUser: true })} />
            <Button key="edits" label="Edits" onPress={() => $.ui.open({ id: 'edits', title: 'Edits' })} />
            <Button key="details" label="Details" onPress={() => $.ui.open({ id: 'meter', title: 'Meter' })} />
          </Box>
        </Box>
      </Box>
    )
  })
}

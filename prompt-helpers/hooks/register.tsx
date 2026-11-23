import { atom, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Chip } from '../types'

const chips = atom({ plugin: 'prompt-helpers', key: 'chips' } as const, [])

const STRUCTURE =
  'The user pasted a long, unstructured brain dump. Before acting: (1) restate it as a short spec with Goal, Requirements, Non-goals and Guardrails; (2) ask up to 3 clarifying questions if anything is ambiguous, and wait for answers; (3) only then proceed. Skip this if the request is already trivially clear.'
const HANDOFF =
  'Write a handoff prompt for a fresh session: the goal, files touched and why, decisions made, what is done, remaining tasks in order, and gotchas. Output it in one fenced block ready to paste.'
const HEAVY = /\b(refactor|architecture|design|debug|investigate|migrate|security)\b/i

export const register: Register = on => {
  let edited = 0
  let ranBash = false

  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'handoff',
      description: 'Summarize the session into a starter prompt for a new one',
    })

    return next(e)
  })

  on('command.run', { command: 'handoff' }, () => ({ text: 'Building handoff...', context: [HANDOFF] }))

  on('prompt.submit', async ($, e, next) => {
    edited = 0
    ranBash = false
    await update($, chips, () => [])

    if (e.text.startsWith('!raw ')) {
      return next({ ...e, text: e.text.slice(5) })
    }
    if (e.text.length > 600) {
      $.ui.toast('Long prompt: asking Claude to structure it into a spec first (prefix "!raw " to skip).')

      return next({ ...e, context: [...(e.context ?? []), STRUCTURE] })
    }
    if (HEAVY.test(e.text)) {
      $.ui.toast('Heavy task: consider higher effort or a stronger model.')
    } else if (e.text.length < 80) {
      $.ui.toast('Simple ask: a lighter model or effort would do.')
    }

    return next(e)
  })

  on('tool.call', async ($, e, next) => {
    if (e.tool === 'Edit' || e.tool === 'Write') {
      edited += 1
    }
    if (e.tool === 'Bash') {
      ranBash = true
    }

    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    const list: Chip[] = []

    if (edited > 0) {
      list.push({ label: 'Run tests', prompt: 'Run the relevant tests and fix failures.' })
      list.push({ label: 'Review diff', prompt: 'Review the diff you just made for bugs and missed edge cases.' })
    }
    if (ranBash && edited === 0) {
      list.push({ label: 'Explain', prompt: 'Explain what that output means and suggest next steps.' })
    }
    list.push({ label: 'Handoff', prompt: HANDOFF })
    await update($, chips, () => list)

    return next(e)
  })

  // The chips row was folded into the dashboard's single row (Review, Audit, Handoff, Details).
}

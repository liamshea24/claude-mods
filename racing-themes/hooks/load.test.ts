import { expect, test } from 'claude-code/testing'

test('the mod loads and applies its look without throwing', async ($, on) => {
  let looks = 0

  on('command.register', () => ({ value: { command: 'look' } }))
  on('theme.set', () => {
    looks += 1

    return { value: { isDrawn: true, requestId: 'test' } }
  })
  on('http.fetch', () => ({ value: { status: 503, ok: false, headers: {}, text: '' } }))
  on('clock.now', () => ({ value: Date.parse('2026-11-23T20:00:00Z') }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  expect(looks).toBeGreaterThan(0)
})

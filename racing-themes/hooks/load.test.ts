import { expect, test } from 'claude-code/testing'

test('the mod loads and applies its look without throwing', async ($, on) => {
  let looks = 0

  on('command.register', () => ({ value: { command: 'look' } }))
  const holes: string[] = []
  let nodes = 0
  const walk = (v: unknown, path: string): void => {
    nodes += 1
    if (v === undefined) {
      holes.push(path)
    } else if (v !== null && typeof v === 'object') {
      Object.entries(v).forEach(([k, x]) => walk(x, `${path}.${k}`))
    }
  }

  on('theme.set', (...args: unknown[]) => {
    looks += 1
    walk(args[0], 'arg')
    walk(args[1], 'arg1')

    return { value: { isDrawn: true, requestId: 'test' } }
  })
  on('http.fetch', () => ({ value: { status: 503, ok: false, headers: {}, text: '' } }))
  on('clock.now', () => ({ value: Date.parse('2026-11-23T20:00:00Z') }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  expect(looks).toBeGreaterThan(0)
  expect(holes).toEqual([])
  expect(nodes).toBeGreaterThan(40)
})

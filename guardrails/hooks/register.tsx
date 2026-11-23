import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

const DESTRUCTIVE =
  /\brm\s+(-[a-z]*r[a-z]*f|-[a-z]*f[a-z]*r)\b|\bgit\s+(reset\s+--hard|clean\s+-[a-z]*f|push\s+(-f|--force))|\bdrop\s+(table|database)\b|\bmkfs\b|\bdd\s+if=|>\s*\/dev\/sd|chmod\s+-R\s+777/i
const SECRET =
  /(sk-[A-Za-z0-9_-]{20,}|ghp_[A-Za-z0-9]{30,}|AKIA[0-9A-Z]{16}|xox[baprs]-[A-Za-z0-9-]{10,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/

// Pushing or deploying leaves your machine, so a person confirms it too.
const OUTBOUND = /\bgit\s+push\b|\bnpm\s+publish\b|\b(vercel|netlify|fly|wrangler|firebase)\s+(deploy|publish)\b|\bgh\s+(release|pr)\s+(create|merge)\b/i

// Files Claude is not allowed to edit; change the list with /protect and /unprotect.
const protectedFiles = atom({ plugin: 'guardrails', key: 'protected' } as const, ['.env', 'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'])

const isProtected = (list: readonly string[], path: string): string | undefined =>
  list.find(name => path === name || path.endsWith(`/${name}`))

const touched = new Map<string, number>()

// Collision guard: warn if a file changed on disk moments ago, not by this session.
async function check($: EngineInterface, path: string) {
  try {
    const { mtimeMs } = await $.fs.stat(path)

    if ((await $.clock.now()) - mtimeMs < 30_000 && touched.get(path) !== mtimeMs) {
      $.ui.toast(`Collision guard: ${path} changed on disk <30s ago, not by this session.`)
    }
  } catch {
    /* new file */
  }
}

async function remember($: EngineInterface, path: string) {
  try {
    touched.set(path, (await $.fs.stat(path)).mtimeMs)
  } catch {
    /* ignore */
  }
}

export const register: Register = on => {
  // Blast radius: make a person confirm anything destructive.
  on('tool.check', { tool: 'Bash' }, ($, e, next) => {
    const command = (e.input as { command?: string } | null)?.command ?? ''

    if (OUTBOUND.test(command)) {
      return { decision: 'ask', reason: `guardrails: this sends your work out (push, publish or deploy): ${command.slice(0, 120)}` }
    }

    return DESTRUCTIVE.test(command)
      ? { decision: 'ask', reason: `guardrails: destructive command: ${command.slice(0, 120)}` }
      : next(e)
  }).catch(() => ({ decision: 'deny' as const }))

  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'protect', description: 'Stop Claude editing a file: /protect secrets.json (no argument lists them)' })
    await $.command.register({ name: 'unprotect', description: 'Allow edits to a file again: /unprotect secrets.json' })

    return next(e)
  })

  on('command.run', { command: 'protect' }, async ($, e) => {
    const name = e.args.trim()

    if (name !== '') {
      await update($, protectedFiles, list => (list.includes(name) ? list : [...list, name]))
    }

    return { text: `Protected from edits: ${(await read($, protectedFiles)).join(', ')}` }
  })

  on('command.run', { command: 'unprotect' }, async ($, e) => {
    const name = e.args.trim()

    await update($, protectedFiles, list => list.filter(item => item !== name))

    return { text: `Protected from edits: ${(await read($, protectedFiles)).join(', ') || 'nothing'}` }
  })

  on('tool.call', { tool: 'Edit' }, async ($, e, next) => {
    const hit = isProtected(await read($, protectedFiles), e.file_path)

    if (hit !== undefined) {
      return { deny: `guardrails: ${hit} is protected. Ask the user to run /unprotect ${hit} first.` }
    }
    await check($, e.file_path)
    const ran = await next(e)
    await remember($, e.file_path)

    return ran
  })

  on('tool.call', { tool: 'Write' }, async ($, e, next) => {
    const hit = isProtected(await read($, protectedFiles), e.file_path)

    if (hit !== undefined) {
      return { deny: `guardrails: ${hit} is protected. Ask the user to run /unprotect ${hit} first.` }
    }
    await check($, e.file_path)
    const ran = await next(e)
    await remember($, e.file_path)

    return ran
  })

  // Secret guard: stop keys going into a prompt, mask them in Bash output.
  on('prompt.submit', ($, e, next) =>
    SECRET.test(e.text)
      ? { drop: 'guardrails: that looks like a secret/API key. Remove it and resend.' }
      : next(e),
  )

  on('tool.call', { tool: 'Bash' }, async ($, e, next) => {
    const ran = await next(e)

    if (typeof ran.text === 'string' && SECRET.test(ran.text)) {
      return { ...ran, text: ran.text.replace(new RegExp(SECRET.source, 'g'), '[masked]') }
    }

    return ran
  })
}

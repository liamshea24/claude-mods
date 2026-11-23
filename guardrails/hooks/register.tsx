import type { EngineInterface, Register } from 'claude-code'

const DESTRUCTIVE =
  /\brm\s+(-[a-z]*r[a-z]*f|-[a-z]*f[a-z]*r)\b|\bgit\s+(reset\s+--hard|clean\s+-[a-z]*f|push\s+(-f|--force))|\bdrop\s+(table|database)\b|\bmkfs\b|\bdd\s+if=|>\s*\/dev\/sd|chmod\s+-R\s+777/i
const SECRET =
  /(sk-[A-Za-z0-9_-]{20,}|ghp_[A-Za-z0-9]{30,}|AKIA[0-9A-Z]{16}|xox[baprs]-[A-Za-z0-9-]{10,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/

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

    return DESTRUCTIVE.test(command)
      ? { decision: 'ask', reason: `guardrails: destructive command: ${command.slice(0, 120)}` }
      : next(e)
  }).catch(() => ({ decision: 'deny' as const }))

  on('tool.call', { tool: 'Edit' }, async ($, e, next) => {
    await check($, e.file_path)
    const ran = await next(e)
    await remember($, e.file_path)

    return ran
  })

  on('tool.call', { tool: 'Write' }, async ($, e, next) => {
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

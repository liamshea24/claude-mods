export type Dash = {
  edits: number
  logged: number
  isLaterOn: boolean
  fixBefore: string
  fixAfter: string
  isFixHidden: boolean
  isFixOpen: boolean
  sessionUsd: number
  startUsd: number
  lastUsd: number
  lastSecs: number
  reusePct: number
  ctxPct: number
  fiveHourPct: number
  lastTurnAt: number
}

declare module 'claude-code' {
  interface PluginState {
    dashboard: { s: Dash }
  }
}

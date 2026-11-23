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
  budget: number
  isBudgetWarned: boolean
  startedAt: number
}

export type EditRec = { tool: string; file: string; before: string; after: string }
export type EditLog = { items: EditRec[]; idx: number }

declare module 'claude-code' {
  interface PluginState {
    dashboard: { s: Dash; log: EditLog }
  }
}

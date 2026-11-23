export type Reading = { pct: number; tokens: number; window: number; usd: number; limits: string }

declare module 'claude-code' {
  interface PluginState {
    meter: { reading: Reading | null; lastTurnAt: number }
  }
}

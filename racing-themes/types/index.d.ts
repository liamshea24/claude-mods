export type Sky = {
  phase: 'day' | 'dusk' | 'night'
  wx: 'clear' | 'cloudy' | 'fog' | 'rain' | 'storm' | 'snow'
  tempF: number | null
  note: string
}

declare module 'claude-code' {
  interface PluginState {
    'racing-themes': { sky: Sky }
  }
}

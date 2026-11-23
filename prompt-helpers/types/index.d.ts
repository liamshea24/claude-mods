export type Chip = { label: string; prompt: string }

declare module 'claude-code' {
  interface PluginState {
    'prompt-helpers': { chips: Chip[] }
  }
}

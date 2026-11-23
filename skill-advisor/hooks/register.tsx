import type { Register } from 'claude-code'

// Edit this table: pattern on the prompt -> skill to suggest (names as the Skill tool lists them).
const RULES: { test: RegExp; skill: string; why: string }[] = [
  { test: /\b(ui|ux|design|layout|landing page|css|tailwind|component style)\b/i, skill: 'frontend-design:frontend-design', why: 'distinctive UI design' },
  { test: /\b(review|audit|critique)\b.*\b(ui|screen|page|design)\b/i, skill: 'ui-design-review:ui-review', why: 'senior-designer UI review' },
  { test: /\b(a11y|accessib|screen reader|aria|contrast)\b/i, skill: 'audit-suite:audit-as-a11y-eng', why: 'accessibility audit' },
  { test: /\b(animation|animate|easing|transition|spring|motion)\b/i, skill: 'audit-suite:web-animation-design', why: 'animation craft' },
  { test: /\b(react|next\.?js|hooks?|re-?render|bundle size)\b/i, skill: 'audit-suite:vercel-react-best-practices', why: 'React performance patterns' },
  { test: /\b(code review|review (my|this) (pr|diff|changes?)|pull request)\b/i, skill: 'code-review', why: 'bug-focused diff review' },
  { test: /\b(simplify|clean ?up|dedupe|refactor)\b/i, skill: 'simplify', why: 'reuse and simplification pass' },
  { test: /\b(security|vulnerab|xss|injection|secrets?)\b/i, skill: 'security-review', why: 'security review of pending changes' },
  { test: /\b(claude api|anthropic|sdk|prompt caching|tool use|model id)\b/i, skill: 'claude-api', why: 'current Claude API reference' },
  { test: /\b(chart|graph|plot|dashboard|visuali[sz]e)\b/i, skill: 'dataviz', why: 'consistent, accessible charts' },
  { test: /\b(pdf)\b/i, skill: 'anthropic-skills:pdf', why: 'PDF handling' },
  { test: /\b(excel|spreadsheet|xlsx|csv)\b/i, skill: 'anthropic-skills:xlsx', why: 'spreadsheet files' },
  { test: /\b(slides?|deck|powerpoint|pptx)\b/i, skill: 'anthropic-skills:pptx', why: 'slide decks' },
  { test: /\b(word doc|docx)\b/i, skill: 'anthropic-skills:docx', why: 'Word documents' },
  { test: /\b(research|compare options|market|literature)\b/i, skill: 'anthropic-skills:deep-research', why: 'multi-source research report' },
  { test: /\b(mod|theme|status ?line|hook on tool)\b/i, skill: 'plugin-authoring', why: 'building Claude mods' },
  { test: /\b(settings\.json|permission|allowlist|env var)\b/i, skill: 'update-config', why: 'harness settings' },
  { test: /\b(run the app|start the app|screenshot the app)\b/i, skill: 'run', why: 'launching and driving the app' },
]

export const register: Register = on => {
  on('prompt.submit', ($, e, next) => {
    // Skip the plugin's own prompts (chips, etc.) and trivial ones.
    if (e.origin.kind !== 'composer' || e.text.length < 15) {
      return next(e)
    }
    const hits = RULES.filter(r => r.test.test(e.text)).slice(0, 3)

    if (hits.length === 0) {
      return next(e)
    }
    $.ui.toast(`Skills that fit: ${hits.map(h => h.skill).join(', ')}`)

    const hint = `skill-advisor: these skills look relevant to this request; load them with the Skill tool before starting if they apply: ${hits
      .map(h => `${h.skill} (${h.why})`)
      .join('; ')}.`

    return next({ ...e, context: [...(e.context ?? []), hint] })
  })
}

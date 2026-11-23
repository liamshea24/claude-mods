# claude-mods

A set of Claude Code mods. Install any of them from this repository.

| Mod | What it does |
| --- | --- |
| racing-themes | Top-down pixel highway backdrop with day and night, police chases, a wheel burnout spinner, and `/look` to switch looks |
| dashboard | One clean row above the prompt: cache, cost, context and limit stats, plus Review, Audit, Handoff and Details buttons |
| meter | Live context, cost and rate-limit meter in the status line and a pane, with cold-cache warnings |
| guardrails | Confirms destructive commands, warns about file collisions, and guards secrets |
| prompt-helpers | Structures long prompts, adds `/handoff`, and hints at effort level |
| skill-advisor | Suggests relevant skills from what you ask |

## Install

At the prompt of a terminal session (replace `<owner>/<repo>` with this repository):

```
/plugin install racing-themes --marketplace <owner>/<repo>
```

Repeat for each mod. In the desktop app, where `/plugin` does not run: click + next to the prompt box, then Plugins, Add marketplace with `<owner>/<repo>`, then Add plugin.

The look, spinner and backdrop only draw in the desktop, web and mobile apps, not the terminal.

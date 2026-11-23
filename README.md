# claude-mods

A set of Claude Code mods. Install any of them from this repository.

| Mod | What it does |
| --- | --- |
| racing-themes | Top-down pixel highway, three lanes each way, that follows Chapel Hill's real time and weather. A still road; cars merge using blinkers; breakdowns pull over and get towed; occasional crashes block a lane, leave debris and make the traffic queue up behind them while police, an ambulance and tow trucks respond; police chase five named cars (RX-7, GT40, Rexy, R34, Charger). Farmland fills the left side and the bottom. A wheel-burnout spinner, black text boxes, and `/look`, `/weather`, `/time` |
| dashboard | One clean row above the prompt (cache, cost, limits, Review, Audit, Handoff, Tests, Edits, Details), a prompt fixer, an edit replayer (`/edits`), `/budget`, and `/wrapup` |
| meter | Live context, cost and rate-limit meter in the status line and a pane (`/meter`), with cold-cache warnings |
| guardrails | Confirms destructive commands and pushes or deploys, protects files (`/protect`, `/unprotect`), warns about file collisions, and guards secrets |
| prompt-helpers | Structures long prompts, adds `/handoff`, and hints at effort level |
| skill-advisor | Suggests relevant skills from what you ask |

## Install

At the prompt of a terminal session (replace `<owner>/<repo>` with this repository):

```
/plugin install racing-themes --marketplace <owner>/<repo>
```

Repeat for each mod. In the desktop app, where `/plugin` does not run: click + next to the prompt box, then Plugins, Add marketplace with `<owner>/<repo>`, then Add plugin.

The look, spinner and backdrop only draw in the desktop, web and mobile apps, not the terminal.

## Weather

The highway reads Chapel Hill's time from the clock and the weather from Open-Meteo, falling back to the National Weather Service. In a cloud environment, allow the hosts `api.open-meteo.com` and `api.weather.gov`. `/weather rain` and `/time night` force a sky for testing; `auto` goes back to live.

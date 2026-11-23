# claude-mods

A set of Claude Code mods. Install any of them from this repository.

| Mod | What it does |
| --- | --- |
| racing-themes | A top-down pixel highway that fills the window from a tunnel at the top to a tunnel at the bottom, with dimmed farmland and grass all around. Three lanes each way, following Chapel Hill's real time, weather and season. Headlights at night, brake lights in the jam, a drifting overhead sign showing the live weather, wet-road reflections in rain. Merging cars with blinkers, five named cars chased by police, and a 30-minute cycle of rare scenarios along the road: a traffic stop, a deer crossing, a breakdown (a tow truck loads the car), a jogger, a helicopter, a hitchhiker pickup, a road crew, an ambulance and fire engine run, a speed trap, a road rager, and a crash that blocks a lane so traffic queues. Smoked-glass text boxes with white text, a burnout-wheel spinner, and `/look`, `/weather`, `/time` |
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

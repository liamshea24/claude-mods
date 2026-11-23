// Top-down highway filling the window: three lanes down, three lanes up, a lamp-lit median.
// Dark mode is night (lamps lit); light mode is day (lamps off). A soft veil keeps it calm.
// The plan below (traffic, five fleeing cars, five police) was computed offline and re-checked
// at a fine time step with the real animation easing: no two cars ever overlap (closest gap
// while sharing a lane: about 16 units). Do not edit PLAN by hand; re-plan instead.

type Keys = [number, number][]
type Traffic = { x0: number; lane: number; len: number; kind: string }
type Runner = { x0: number; keys: Keys }

const PLAN: { traffic: Traffic[]; heroes: Runner[]; police: Runner[] } = {"traffic": [{"lane": 0, "x0": 44.4, "len": 40, "kind": "car"}, {"lane": 0, "x0": 469.2, "len": 40, "kind": "car"}, {"lane": 0, "x0": 904.7, "len": 40, "kind": "car"}, {"lane": 0, "x0": 1339.8, "len": 72, "kind": "truck"}, {"lane": 1, "x0": 1580.9, "len": 40, "kind": "car"}, {"lane": 1, "x0": 201.2, "len": 72, "kind": "truck"}, {"lane": 1, "x0": 599.8, "len": 40, "kind": "car"}, {"lane": 1, "x0": 1085.1, "len": 40, "kind": "car"}, {"lane": 2, "x0": 431.3, "len": 40, "kind": "car"}, {"lane": 2, "x0": 915.3, "len": 72, "kind": "truck"}, {"lane": 2, "x0": 1385.5, "len": 72, "kind": "truck"}, {"lane": 2, "x0": 79.5, "len": 40, "kind": "car"}], "heroes": [{"x0": 27.0, "keys": [[0.0, 1], [2.083, 1], [4.167, 0], [9.375, 0], [11.458, 1], [13.021, 1], [15.104, 0], [17.708, 0], [19.792, 1], [21.875, 2], [23.958, 1], [26.562, 1], [28.646, 0], [30.729, 0], [32.812, 1], [34.896, 2], [36.979, 1], [40.104, 1], [42.188, 0], [44.271, 0], [46.354, 1], [48.438, 2], [50.521, 1], [52.083, 1], [54.167, 0], [59.375, 0], [61.458, 1], [63.021, 1], [65.104, 0], [67.708, 0], [69.792, 1], [71.875, 2], [73.958, 1], [76.562, 1], [78.646, 0], [80.729, 0], [82.812, 1], [84.896, 2], [86.979, 1], [90.104, 1], [92.188, 2], [97.917, 2], [100.0, 1]]}, {"x0": 362.7, "keys": [[0.0, 0], [2.083, 1], [3.646, 1], [5.729, 0], [8.333, 0], [10.417, 1], [12.5, 2], [14.583, 1], [17.188, 1], [19.271, 0], [21.354, 0], [23.438, 1], [25.521, 2], [27.604, 1], [30.729, 1], [32.812, 0], [34.896, 0], [36.979, 1], [39.062, 2], [41.146, 1], [42.708, 1], [44.792, 0], [50.0, 0], [52.083, 1], [53.646, 1], [55.729, 0], [58.333, 0], [60.417, 1], [62.5, 2], [64.583, 1], [67.188, 1], [69.271, 0], [71.354, 0], [73.438, 1], [75.521, 2], [77.604, 1], [80.729, 1], [82.812, 0], [84.896, 0], [86.979, 1], [89.062, 2], [91.146, 1], [92.708, 1], [94.792, 0], [100.0, 0]]}, {"x0": 741.4, "keys": [[0.0, 1], [2.083, 2], [4.167, 1], [6.771, 1], [8.854, 0], [10.938, 0], [13.021, 1], [15.104, 2], [17.188, 1], [20.312, 1], [22.396, 0], [24.479, 0], [26.562, 1], [28.646, 2], [30.729, 1], [32.292, 1], [34.375, 0], [39.583, 0], [41.667, 1], [43.229, 1], [45.312, 0], [47.917, 0], [50.0, 1], [52.083, 2], [54.167, 1], [56.771, 1], [58.854, 0], [60.938, 0], [63.021, 1], [65.104, 2], [67.188, 1], [70.312, 1], [72.396, 0], [74.479, 0], [76.562, 1], [78.646, 2], [80.729, 1], [82.292, 1], [84.375, 0], [89.583, 0], [91.667, 1], [93.229, 1], [95.312, 0], [97.917, 0], [100.0, 1]]}, {"x0": 1082.6, "keys": [[0.0, 2], [1.562, 2], [3.646, 1], [5.729, 2], [7.812, 1], [10.938, 1], [13.021, 0], [15.104, 0], [17.188, 1], [19.271, 2], [21.354, 1], [22.396, 1], [24.479, 0], [30.208, 0], [32.292, 1], [33.854, 1], [35.938, 0], [38.021, 0], [40.104, 1], [42.188, 0], [44.271, 1], [47.396, 1], [49.479, 0], [51.562, 0], [53.646, 1], [55.729, 2], [57.812, 1], [60.938, 1], [63.021, 0], [65.104, 0], [67.188, 1], [69.271, 2], [71.354, 1], [72.396, 1], [74.479, 0], [80.208, 0], [82.292, 1], [83.854, 1], [85.938, 0], [88.021, 0], [90.104, 1], [92.188, 0], [94.271, 1], [97.396, 1], [99.479, 2], [100.0, 2]]}, {"x0": 1405.2, "keys": [[0.0, 1], [2.083, 1], [4.167, 0], [6.25, 0], [8.333, 1], [10.417, 2], [12.5, 1], [13.542, 1], [15.625, 0], [20.833, 0], [22.917, 1], [24.479, 1], [26.562, 2], [29.167, 2], [31.25, 1], [33.333, 0], [35.417, 1], [38.021, 1], [40.104, 0], [42.188, 0], [44.271, 1], [46.354, 2], [48.438, 1], [52.083, 1], [54.167, 0], [56.25, 0], [58.333, 1], [60.417, 2], [62.5, 1], [63.542, 1], [65.625, 0], [70.833, 0], [72.917, 1], [74.479, 1], [76.562, 2], [79.167, 2], [81.25, 1], [83.333, 0], [85.417, 1], [88.021, 1], [90.104, 0], [92.188, 0], [94.271, 1], [96.354, 2], [98.438, 1], [100.0, 1]]}], "police": [{"x0": 1677.0, "keys": [[0.0, 2], [0.521, 2], [2.604, 1], [5.729, 1], [7.812, 0], [11.979, 0], [14.062, 1], [17.188, 1], [19.271, 0], [20.833, 0], [22.917, 1], [25.0, 2], [27.083, 1], [29.167, 1], [31.25, 0], [34.375, 0], [36.458, 1], [38.542, 2], [40.625, 1], [42.708, 1], [44.792, 0], [48.438, 0], [50.521, 1], [55.729, 1], [57.812, 0], [61.979, 0], [64.062, 1], [67.188, 1], [69.271, 0], [70.833, 0], [72.917, 1], [75.0, 2], [77.083, 1], [79.167, 1], [81.25, 0], [84.375, 0], [86.458, 1], [88.542, 2], [90.625, 1], [93.75, 1], [95.833, 2], [100.0, 2]]}, {"x0": 212.7, "keys": [[0.0, 0], [2.604, 0], [4.688, 1], [7.812, 1], [9.896, 0], [11.458, 0], [13.542, 1], [15.625, 2], [17.708, 1], [20.312, 1], [22.396, 0], [25.0, 0], [27.083, 1], [29.167, 2], [31.25, 1], [33.333, 1], [35.417, 0], [39.062, 0], [41.146, 1], [46.354, 1], [48.438, 0], [52.604, 0], [54.688, 1], [57.812, 1], [59.896, 0], [61.458, 0], [63.542, 1], [65.625, 2], [67.708, 1], [70.312, 1], [72.396, 0], [75.0, 0], [77.083, 1], [79.167, 2], [81.25, 1], [83.333, 1], [85.417, 0], [89.062, 0], [91.146, 1], [96.354, 1], [98.438, 0], [100.0, 0]]}, {"x0": 591.4, "keys": [[0.0, 0], [1.042, 0], [3.125, 1], [5.208, 2], [7.292, 1], [9.375, 1], [11.458, 0], [14.583, 0], [16.667, 1], [18.75, 2], [20.833, 1], [22.917, 1], [25.0, 0], [28.125, 0], [30.208, 1], [32.292, 2], [34.375, 1], [35.417, 1], [37.5, 0], [42.188, 0], [44.271, 1], [47.396, 1], [49.479, 0], [51.042, 0], [53.125, 1], [55.208, 2], [57.292, 1], [59.375, 1], [61.458, 0], [64.583, 0], [66.667, 1], [68.75, 2], [70.833, 1], [72.917, 1], [75.0, 0], [78.125, 0], [80.208, 1], [82.292, 2], [84.375, 1], [85.417, 1], [87.5, 0], [92.188, 0], [94.271, 1], [97.396, 1], [99.479, 0], [100.0, 0]]}, {"x0": 932.6, "keys": [[0.0, 1], [1.042, 1], [3.125, 2], [8.333, 2], [10.417, 1], [13.542, 1], [15.625, 0], [18.75, 0], [20.833, 1], [22.917, 2], [25.0, 1], [26.042, 1], [28.125, 0], [32.812, 0], [34.896, 1], [38.021, 1], [40.104, 0], [44.792, 0], [46.875, 1], [50.0, 1], [52.083, 0], [55.208, 0], [57.292, 1], [59.375, 2], [61.458, 1], [63.542, 1], [65.625, 0], [68.75, 0], [70.833, 1], [72.917, 2], [75.0, 1], [76.042, 1], [78.125, 0], [82.812, 0], [84.896, 1], [88.021, 1], [90.104, 0], [94.792, 0], [96.875, 1], [100.0, 1]]}, {"x0": 1255.2, "keys": [[0.0, 2], [2.083, 1], [4.688, 1], [6.771, 0], [9.896, 0], [11.979, 1], [14.062, 2], [16.146, 1], [17.188, 1], [19.271, 0], [23.438, 0], [25.521, 1], [28.125, 1], [30.208, 2], [32.812, 2], [34.896, 1], [36.979, 0], [39.062, 1], [41.146, 1], [43.229, 0], [46.354, 0], [48.438, 1], [54.688, 1], [56.771, 0], [59.896, 0], [61.979, 1], [64.062, 2], [66.146, 1], [67.188, 1], [69.271, 0], [73.438, 0], [75.521, 1], [78.125, 1], [80.208, 2], [82.812, 2], [84.896, 1], [86.979, 0], [89.062, 1], [92.188, 1], [94.271, 2], [100.0, 2]]}]}

const RING = 1800
const PITCH = 52
const S = 4
const DOWN_X = 760
const UP_X = 944

const CAR = ['.Y...Y.', 'KBBBBBK', 'KBWWWBK', '.BWWWB.', '.BBBBB.', '.BBBBB.', 'KBBBBBK', 'KBWWWBK', '.BBBBB.', '.T...T.']
const SEMI = ['.Y...Y.', 'KBBBBBK', 'KBWWWBK', '.BBBBB.', 'KBBBBBK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', '.T...T.']
const POLICE = ['.Y...Y.', 'KDDDDDK', 'KDWWWDK', '.DRRLLD', '.BBBBB.', '.BBBBB.', 'KDDDDDK', 'KDWWWDK', '.DDDDD.', '.T...T.']
// Mazda RX-7 (orange, black hood and roof, big wing)
const RX7 = ['.Y...Y.', 'KBDDDBK', 'KBDDDBK', '.BWWWB.', '.BDDDB.', '.BBBBB.', 'KBWWWBK', '.BBBBB.', 'SSSSSSS', '.T...T.']
// Ford GT40 (low, white with two blue stripes)
const GT40 = ['.YBBBY.', 'KBDBDBK', 'KBDBDBK', '.BWWWB.', '.BDBDB.', '.BDBDB.', 'KBBBBBK', '.BBBBB.', '.T...T.']
// Rexy: Ford Mustang GTD in a green T-rex livery (black stripes, white teeth, big rear wing)
const REXY = ['.EYBYE.', 'KBDBDBK', 'KBDBDBK', '.BWWWB.', '.BBBBB.', 'KBBBBBK', 'KBWWWBK', '.BBBBB.', 'SSSSSSS', '.T...T.']
// Nissan Skyline R34 (silver, blue stripe, wing)
const R34 = ['.Y...Y.', 'KBBDBBK', 'KBBDBBK', '.BWWWB.', '.BBBBB.', '.BBBBB.', 'KBWWWBK', '.BBBBB.', 'SSSSSSS', '.T...T.']
// Dodge Charger (black, hood scoop)
const CHARGER = ['.Y...Y.', 'KBBBBBK', 'KBDDDBK', 'KBDDDBK', '.BWWWB.', '.BBBBB.', 'KBBBBBK', 'KBWWWBK', '.BBBBB.', '.T...T.']

const HEROES: { rows: string[]; colors: Record<string, string> }[] = [
  { rows: RX7, colors: { B: '#ff7a1a', D: '#17171c' } },
  { rows: GT40, colors: { B: '#f4f4f0', D: '#1b4fb5' } },
  { rows: REXY, colors: { B: '#3f9a3a', D: '#17171c', E: '#ffffff' } },
  { rows: R34, colors: { B: '#c9d3e0', D: '#2b6cd0' } },
  { rows: CHARGER, colors: { B: '#18181e', D: '#4a4a55' } },
]

const CIV = ['#7a8896', '#b5651d', '#8e5ea2', '#5b7fb5', '#b8b8c0', '#a34a4a', '#4f8a8b', '#c9b458']

// Each colour is one path of merged horizontal runs, which keeps the scene small.
const sprite = (rows: string[], colors: Record<string, string>): string => {
  const paths = new Map<string, string>()

  rows.forEach((row, y) => {
    let x = 0

    while (x < row.length) {
      const fill = colors[row[x] ?? '.']
      let end = x + 1

      while (end < row.length && colors[row[end] ?? '.'] === fill) {
        end += 1
      }
      if (fill !== undefined) {
        paths.set(fill, `${paths.get(fill) ?? ''}M${x} ${y}h${end - x}v1h-${end - x}z`)
      }
      x = end
    }
  })

  let out = ''

  paths.forEach((d, fill) => {
    out += fill.startsWith('class:') ? `<path class="${fill.slice(6)}" d="${d}"/>` : `<path fill="${fill}" d="${d}"/>`
  })

  return out
}

const BASE = { K: '#111111', W: '#9fe8ff', Y: '#fff7a8', T: '#ff4040', S: '#1a1a22', L: '#c9c9d4', R: 'class:pr' }

const car = (rows: string[], colors: Record<string, string>, down: boolean): string => {
  const w = (rows[0]?.length ?? 7) * S
  const h = rows.length * S
  const turn = down ? `rotate(180 ${w / 2} ${h / 2})` : ''

  return `<g transform="${turn}"><g transform="scale(${S})">${sprite(rows, { ...BASE, ...colors })}</g></g>`
}

const delay = (x0: number, period: number) => `-${((x0 / RING) * period).toFixed(2)}s`

const build = () => {
  let markup = ''
  let rules = ''

  PLAN.traffic.forEach((c, i) => {
    const rows = c.kind === 'truck' ? SEMI : CAR
    const body = CIV[i % CIV.length] ?? '#888888'

    rules += `.c${i}{animation-name:tdown;animation-duration:48s;animation-delay:${delay(c.x0, 48)}}\n`
    markup += `<g transform="translate(${DOWN_X + c.lane * PITCH} 0)"><g class="td c${i}">${car(rows, { B: body, D: body }, true)}</g></g>`
  })

  // Oncoming traffic: three lanes up, one speed, spaced far apart.
  const up = [
    { lane: 0, y0: 100, truck: false }, { lane: 0, y0: 550, truck: true },
    { lane: 0, y0: 1000, truck: false }, { lane: 0, y0: 1450, truck: false },
  ]

  up.forEach((c, i) => {
    const body = CIV[(i + 3) % CIV.length] ?? '#888888'

    rules += `.u${i}{animation-name:tup;animation-duration:40s;animation-delay:${delay(c.y0, 40)}}\n`
    markup += `<g transform="translate(${UP_X + c.lane * PITCH} 0)"><g class="td u${i}">${car(c.truck ? SEMI : CAR, { B: body, D: body }, false)}</g></g>`
  })

  // Chases are occasional: one pass per car every CYCLE seconds, staggered. A pass is one
  // full lap of the ring (16 s), which matches the planned lane changes; the rest of the cycle
  // the car waits off-screen. The police car starts GAP/speed seconds after its target.
  const CYCLE = 240
  const LAP = 16
  const LAG = 150 / (RING / LAP)

  const passStart = (r: Runner, i: number): number => {
    const phase = (((-r.x0 / (RING / LAP)) % LAP) + LAP) % LAP
    const target = 12 + 45 * i

    return phase + LAP * Math.round((target - phase) / LAP)
  }

  const runner = (r: Runner, id: string, rows: string[], colors: Record<string, string>, startS: number) => {
    const start = r.keys[0]?.[1] ?? 0
    const frames = r.keys.map(([pct, lane]) => `${pct}%{transform:translateX(${lane * PITCH}px)}`).join('')
    const a = ((startS / CYCLE) * 100).toFixed(3)
    const b = (((startS + LAP) / CYCLE) * 100).toFixed(3)

    rules += `.${id}{animation:m${id} ${CYCLE}s linear infinite}\n@keyframes m${id}{0%{transform:translateY(-200px)}${a}%{transform:translateY(-200px)}${b}%{transform:translateY(1600px)}100%{transform:translateY(1600px)}}\n`
    rules += `.x${id}{animation:k${id} 48s infinite;animation-timing-function:cubic-bezier(.42,0,.58,1)}\n@keyframes k${id}{${frames}}\n`

    return `<g transform="translate(${DOWN_X} 0)"><g class="td ${id}"><g class="x${id}" transform="translate(${start * PITCH} 0)">${car(rows, colors, true)}</g></g></g>`
  }

  PLAN.heroes.forEach((r, i) => {
    const h = HEROES[i % HEROES.length] ?? HEROES[0]

    if (h !== undefined) {
      markup += runner(r, `h${i}`, h.rows, h.colors, passStart(r, i))
    }
  })
  PLAN.police.forEach((r, i) => {
    const lead = PLAN.heroes[i]

    if (lead !== undefined) {
      markup += runner(r, `p${i}`, POLICE, { B: '#f2f2f2', D: '#1a1a22' }, passStart(lead, i) + LAG)
    }
  })

  return { markup, rules }
}

const lamps = (): string => {
  let out = ''

  for (let i = 0; i < 9; i++) {
    const y = 40 + i * 150

    for (const x of [744, 918, 988]) {
      out += `<circle class="glow" cx="${x}" cy="${y}" r="80" fill="url(#lg)"/><rect class="lamp" x="${x - 3}" y="${y - 3}" width="6" height="6"/>`
    }
  }

  return out
}

const trees = (): string => {
  let out = ''

  for (let i = 0; i < 16; i++) {
    const y = 20 + i * 90 + ((i * 37) % 4) * 6
    const x = 668 + ((i * 53) % 4) * 14

    out += `<rect class="tree" x="${x}" y="${y}" width="22" height="22"/><rect class="tree2" x="${x + 4}" y="${y + 4}" width="10" height="10"/>`
  }

  return out
}

const dashes = (xs: number[]): string => {
  let out = ''

  for (const x of xs) {
    for (let i = -2; i < 26; i++) {
      out += `<rect class="dash" x="${x - 1}" y="${i * 60}" width="3" height="30"/>`
    }
  }

  return out
}

export const buildHighway = (): string => {
  const { markup, rules } = build()

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="430 0 1000 1300" preserveAspectRatio="xMaxYMid meet" shape-rendering="crispEdges">
<defs>
<linearGradient id="vg" gradientUnits="userSpaceOnUse" x1="560" y1="0" x2="722" y2="0"><stop offset="0" class="vgs" stop-opacity="0"/><stop offset="1" class="vgs" stop-opacity="1"/></linearGradient>
<linearGradient id="fb" gradientUnits="userSpaceOnUse" x1="0" y1="1010" x2="0" y2="1130"><stop offset="0" class="pgs" stop-opacity="0"/><stop offset="1" class="pgs" stop-opacity="1"/></linearGradient>
<radialGradient id="lg"><stop offset="0" stop-color="#ffe9a0" stop-opacity=".5"/><stop offset="1" stop-color="#ffe9a0" stop-opacity="0"/></radialGradient>
</defs>
<style>
.pgs{stop-color:#e9eaec}.vgs{stop-color:#6b9e5e}.grass2{fill:#6b9e5e}.tree{fill:#3f7a3a}.tree2{fill:#5fa055}.road{fill:#58585f}.med{fill:#7f8a78}.edge{fill:#e8e8e8}.yel{fill:#e0b020}.dash{fill:#f0f0f0;fill-opacity:.7}
.glow{opacity:0}.lamp{fill:#8a8a92}.veil{fill:#f7f4ee;fill-opacity:.12}
@media (prefers-color-scheme: dark){
.pgs{stop-color:#101216}.vgs{stop-color:#112417}.grass2{fill:#112417}.tree{fill:#0c1c10}.tree2{fill:#173321}.road{fill:#1b1b21}.med{fill:#232a22}.edge{fill:#8a8a90}.yel{fill:#8a6a10}.dash{fill:#cfcfd4;fill-opacity:.5}
.glow{opacity:1}.lamp{fill:#ffe9a0}.veil{fill:#0d0e12;fill-opacity:.12}
}
.td{animation-timing-function:linear;animation-iteration-count:infinite}
.dd{animation:ddown 3s linear infinite}
.pr{animation:fa 1s steps(1) infinite;fill:#ff2a2a}
@keyframes tdown{from{transform:translateY(-200px)}to{transform:translateY(1600px)}}
@keyframes tup{from{transform:translateY(1600px)}to{transform:translateY(-200px)}}
@keyframes ddown{from{transform:translateY(0)}to{transform:translateY(60px)}}
@keyframes fa{0%{fill:#ff2a2a}50%{fill:#2a6bff}}
${rules}</style>
<rect x="560" y="-4000" width="3000" height="9000" fill="url(#vg)"/>
<rect class="grass2" x="722" y="-4000" width="3000" height="9000"/>
${trees()}
<rect class="road" x="746" y="-4000" width="240" height="9000"/>
<rect class="med" x="904" y="-4000" width="28" height="9000"/>
<rect class="edge" x="744" y="-4000" width="3" height="9000"/>
<rect class="edge" x="985" y="-4000" width="3" height="9000"/>
<rect class="yel" x="902" y="-4000" width="3" height="9000"/>
<rect class="yel" x="931" y="-4000" width="3" height="9000"/>
<g class="dd">${dashes([800, 852])}</g>
${lamps()}
${markup}
<rect x="-4000" y="1010" width="9000" height="800" fill="url(#fb)"/>
<rect class="veil" x="-4000" y="-4000" width="9000" height="9000"/>
</svg>`
}

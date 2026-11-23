// Pixel-art highway scene. Dark mode is night (lamps lit), light mode is day (lamps off).
// The traffic and the two weaving sports cars follow a planned schedule that was checked
// offline: no two cars ever overlap (smallest gap while lanes are shared: about 21 units,
// cars are 80 long). Do not edit PLAN by hand; the weavers' lane changes were planned
// against the traffic's lanes and positions.

type Traffic = { x0: number; lane: number; len: number }
type Weaver = { x0: number; keys: [number, number][] }

const PLAN: { traffic: Traffic[]; weavers: Weaver[] } = {
  traffic: [
    { x0: 711.2, lane: 0, len: 120 },
    { x0: 156.5, lane: 1, len: 80 },
    { x0: 1099.1, lane: 2, len: 80 },
    { x0: 568.9, lane: 3, len: 80 },
    { x0: 697.0, lane: 1, len: 80 },
  ],
  weavers: [
    { x0: 726.7, keys: [[0, 2], [4.167, 3], [8.333, 2], [12.5, 3], [25, 3], [29.167, 2], [33.333, 1], [37.5, 0], [41.667, 1], [45.833, 2], [47.917, 2], [52.083, 3], [56.25, 2], [60.417, 1], [64.583, 0], [68.75, 1], [72.917, 2], [79.167, 2], [83.333, 1], [87.5, 0], [91.667, 1], [95.833, 2], [100, 2]] },
    { x0: 192.1, keys: [[0, 2], [1.042, 2], [5.208, 3], [9.375, 2], [13.542, 1], [17.708, 2], [20.833, 2], [25, 3], [29.167, 2], [33.333, 1], [37.5, 0], [41.667, 1], [45.833, 2], [51.042, 2], [55.208, 3], [59.375, 2], [63.542, 1], [67.708, 2], [70.833, 2], [75, 3], [79.167, 2], [83.333, 1], [87.5, 0], [91.667, 1], [95.833, 2], [100, 2]] },
  ],
}

const RING = 1200
const TRAFFIC_SECONDS = 24
const WEAVER_SECONDS = 8
const LANE_H = 44
const ROAD_TOP = 130
const CAR_TOP = ROAD_TOP + 7

const CAR = [
  '....BBBBBB......',
  '...BWWBBWWB.....',
  '..BBBBBBBBBBBB..',
  '.BBBBBBBBBBBBBBY',
  '.BKKBBBBBBBKKBBB',
  '..KKK......KKK..',
]

const POLICE = [
  '....RRRLLL......',
  '...BWWBBWWB.....',
  '..BBBBBBBBBBBB..',
  '.DDDDDDDDDDDDDDY',
  '.DKKDDDDDDDKKDDD',
  '..KKK......KKK..',
]

const SPORT = [
  'SS.....BBBBB....',
  'SBBBBBBWWWBBBB..',
  'SBBBBBBBBBBBBBBY',
  'BBBBBBBBBBBBBBBY',
  '.KKBBBBBBBBBKKB.',
  '..KK.GGGGGG.KK..',
]

const TRUCK = [
  'TTTTTTTTTTTTTTTT..BBBB..',
  'TTTTTTTTTTTTTTTT.BWWBBB.',
  'TTTTTTTTTTTTTTTT.BWWBBBB',
  'TTTTTTTTTTTTTTTT.BBBBBBY',
  'TTKKTTTTTTKKTTTT.BKKBBKB',
  '.KKK....KKK.....', // padded below
].map(row => row.padEnd(24, '.'))

const sprite = (rows: string[], colors: Record<string, string>): string => {
  let out = ''

  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const fill = colors[row[x] ?? '.']

      if (fill !== undefined) {
        out += fill.startsWith('class:')
          ? `<rect class="${fill.slice(6)}" x="${x}" y="${y}" width="1" height="1"/>`
          : `<rect x="${x}" y="${y}" width="1" height="1" fill="${fill}"/>`
      }
    }
  })

  return out
}

const TRAFFIC_COLORS = ['#7a8896', '#b5651d', '#5b8c5a', '#8e5ea2', '#b8b8c0']
const SPORTS = [
  { body: '#ff2e93', neon: '#00f0ff' },
  { body: '#ffd600', neon: '#ff2e93' },
]

const seconds = (n: number) => `${n}s`
const delay = (x0: number, period: number) => `-${((x0 / RING) * period).toFixed(2)}s`

const trafficCars = (): string =>
  PLAN.traffic
    .map((c, i) => {
      const rows = i === 0 ? TRUCK : CAR
      const body = TRAFFIC_COLORS[i % TRAFFIC_COLORS.length] ?? '#888888'
      const art = sprite(rows, { B: body, T: '#d6d6de', W: '#9fe8ff', K: '#111111', Y: '#ffee58' })

      return `<g transform="translate(0 ${CAR_TOP + c.lane * LANE_H})"><g class="run t${i}"><g transform="scale(5)">${art}</g></g></g>`
    })
    .join('')

const weaverCars = (): string =>
  PLAN.weavers
    .map((w, i) => {
      const s = SPORTS[i % SPORTS.length] ?? { body: '#ff2e93', neon: '#00f0ff' }
      const art = sprite(SPORT, { B: s.body, S: '#1a1a22', W: '#bff6ff', K: '#111111', Y: '#fff7a8', G: s.neon })
      const start = w.keys[0]?.[1] ?? 0

      return `<g transform="translate(0 ${CAR_TOP})"><g class="run w${i}"><g class="wy wy${i}" transform="translate(0 ${start * LANE_H})"><g transform="scale(5)">${art}</g></g></g></g>`
    })
    .join('')

const css = (): string => {
  const rules: string[] = []

  PLAN.traffic.forEach((c, i) => {
    rules.push(`.t${i}{animation-duration:${seconds(TRAFFIC_SECONDS)};animation-delay:${delay(c.x0, TRAFFIC_SECONDS)}}`)
  })
  PLAN.weavers.forEach((w, i) => {
    rules.push(`.w${i}{animation-duration:${seconds(WEAVER_SECONDS)};animation-delay:${delay(w.x0, WEAVER_SECONDS)}}`)
    rules.push(`.wy${i}{animation:wy${i} ${seconds(TRAFFIC_SECONDS)} infinite;animation-timing-function:cubic-bezier(.42,0,.58,1)}`)
    const frames = w.keys.map(([pct, lane]) => `${pct}%{transform:translateY(${lane * LANE_H}px)}`).join('')

    rules.push(`@keyframes wy${i}{${frames}}`)
  })

  return rules.join('\n')
}

const skyline = (): string => {
  let out = ''

  for (let i = 0; i < 22; i++) {
    const x = i * 40
    const h = 24 + ((i * 37) % 5) * 12
    const top = 122 - h

    out += `<rect class="${i % 2 === 0 ? 'bld' : 'bld2'}" x="${x}" y="${top}" width="40" height="${h}"/>`
    for (let k = 0; k < 3; k++) {
      const wx = x + 6 + k * 11
      const wy = top + 6 + ((i + k) % 3) * 10

      if ((i * 3 + k) % 4 !== 0 && wy < 116) {
        out += `<rect class="win" x="${wx}" y="${wy}" width="5" height="5"/>`
      }
    }
  }

  return out
}

const stars = (): string => {
  let out = ''

  for (let i = 0; i < 18; i++) {
    out += `<rect class="star" x="${(i * 97 + 31) % 790}" y="${(i * 53 + 11) % 62}" width="3" height="3"/>`
  }

  return out
}

const lamps = (): string => {
  let out = ''

  for (let i = 0; i < 5; i++) {
    const x = 60 + i * 160

    out +=
      `<polygon class="glow" points="${x + 24},48 ${x + 40},48 ${x + 112},306 ${x - 48},306" fill="url(#cone)"/>` +
      `<ellipse class="glow" cx="${x + 32}" cy="290" rx="86" ry="10" fill="#ffe9a0" fill-opacity=".18"/>` +
      `<rect class="pole" x="${x}" y="44" width="5" height="82"/>` +
      `<rect class="pole" x="${x}" y="44" width="30" height="4"/>` +
      `<rect class="lamp" x="${x + 24}" y="48" width="16" height="6"/>`
  }

  return out
}

const barrier = (y: number): string => {
  let out = ''

  for (let i = 0; i < 40; i++) {
    out += `<rect class="${i % 2 === 0 ? 'bar' : 'bar2'}" x="${i * 20}" y="${y}" width="20" height="8"/>`
  }

  return out
}

const dashes = (): string => {
  let out = ''

  for (let lane = 1; lane < 4; lane++) {
    for (let i = 0; i < 12; i++) {
      out += `<rect class="dash" x="${i * 80}" y="${ROAD_TOP + lane * LANE_H - 2}" width="40" height="4" fill-opacity=".7"/>`
    }
  }

  return out
}

export const buildScene = (): string => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" shape-rendering="crispEdges">
<defs>
<linearGradient id="cone" x1="0" y1="48" x2="0" y2="306" gradientUnits="userSpaceOnUse">
<stop offset="0" stop-color="#ffe9a0" stop-opacity=".45"/>
<stop offset="1" stop-color="#ffe9a0" stop-opacity="0"/>
</linearGradient>
</defs>
<style>
.sky{fill:#8fd3ff}.sky2{fill:#bfe8ff}.bld{fill:#7d93ad}.bld2{fill:#6a809a}
.win{opacity:0;fill:#ffe9a0}.star{opacity:0;fill:#ffffff}.sun{opacity:1}.moon{opacity:0}
.ground{fill:#5aa05a}.road{fill:#4b4b55}.bar{fill:#c4c7cf}.bar2{fill:#9ea2ad}
.lamp{fill:#8c8c94}.pole{fill:#5b5b66}.glow{opacity:0}.dash{fill:#f2f2f2}
@media (prefers-color-scheme: dark){
.sky{fill:#080819}.sky2{fill:#14143a}.bld{fill:#14142e}.bld2{fill:#1b1b3d}
.win{opacity:.85}.star{opacity:1}.sun{opacity:0}.moon{opacity:1}
.ground{fill:#0d2616}.road{fill:#1e1e26}.bar{fill:#3c3e48}.bar2{fill:#2c2e38}
.lamp{fill:#ffe9a0}.pole{fill:#2f2f3a}.glow{opacity:1}.dash{fill:#d8d8d8}
}
.run{animation-name:run;animation-timing-function:linear;animation-iteration-count:infinite}
.dg{animation:dash 2.4s linear infinite}
@keyframes run{from{transform:translateX(-200px)}to{transform:translateX(1000px)}}
@keyframes dash{from{transform:translateX(0)}to{transform:translateX(-80px)}}
${css()}
</style>
<rect class="sky" width="800" height="120"/>
<rect class="sky2" y="60" width="800" height="60"/>
${stars()}
<g class="sun"><rect x="656" y="14" width="24" height="44" fill="#ffd54a"/><rect x="650" y="20" width="36" height="32" fill="#ffd54a"/><rect x="644" y="26" width="48" height="20" fill="#ffd54a"/></g>
<g class="moon"><rect x="656" y="14" width="24" height="44" fill="#f3f1d0"/><rect x="650" y="20" width="36" height="32" fill="#f3f1d0"/><rect x="644" y="26" width="48" height="20" fill="#f3f1d0"/><rect x="660" y="24" width="6" height="6" fill="#cfcca6"/><rect x="668" y="38" width="8" height="6" fill="#cfcca6"/></g>
${skyline()}
<rect class="ground" y="120" width="800" height="330"/>
<rect class="road" y="${ROAD_TOP}" width="800" height="${LANE_H * 4}"/>
${barrier(ROAD_TOP - 8)}
${barrier(ROAD_TOP + LANE_H * 4)}
<g class="dg">${dashes()}</g>
${lamps()}
${trafficCars()}
${weaverCars()}
</svg>`

// Calm variant: a flat page colour (matches the palette) with a slim two-lane road along
// the top. Each lane holds cars of one speed, so nothing can ever overlap.
const STRIP_RING = 1000
const STRIP_LANES: { period: number; cars: { x0: number; kind: 'car' | 'sport' | 'truck' | 'police'; color: string; neon?: string }[] }[] = [
  { period: 40, cars: [
    { x0: 40, kind: 'car', color: '#7a8896' },
    { x0: 360, kind: 'truck', color: '#8f84a6' },
    { x0: 700, kind: 'car', color: '#b5651d' },
  ] },
  { period: 26, cars: [
    { x0: 40, kind: 'police', color: '#f2f2f2' },
    { x0: 150, kind: 'sport', color: '#00e5d0', neon: '#ff2e93' },
    { x0: 540, kind: 'police', color: '#f2f2f2' },
    { x0: 650, kind: 'sport', color: '#ff8a3d', neon: '#7a2bd6' },
  ] },
]

const stripCars = (): { markup: string; rules: string } => {
  let markup = ''
  let rules = ''
  let n = 0

  STRIP_LANES.forEach((lane, li) => {
    lane.cars.forEach(c => {
      const rows = c.kind === 'truck' ? TRUCK : c.kind === 'sport' ? SPORT : c.kind === 'police' ? POLICE : CAR
      const art = sprite(rows, { R: 'class:pr', L: 'class:pl', D: '#1a1a22', B: c.color, T: '#8f84a6', S: '#1a1a22', G: c.neon ?? '#00f0ff', W: '#9fe8ff', K: '#111111', Y: '#ffee58' })
      const id = n++

      rules += `.s${id}{animation-duration:${lane.period}s;animation-delay:-${((c.x0 / STRIP_RING) * lane.period).toFixed(2)}s}\n`
      markup += `<g transform="translate(0 ${10 + li * 30})"><g class="sr s${id}"><g transform="scale(3)">${art}</g></g></g>`
    })
  })

  return { markup, rules }
}

export const buildStrip = (): string => {
  const { markup, rules } = stripCars()
  let dash = ''

  for (let i = 0; i < 14; i++) {
    dash += `<rect class="sd" x="${i * 80}" y="33" width="36" height="3" fill-opacity=".5"/>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" preserveAspectRatio="xMidYMin meet" shape-rendering="crispEdges">
<style>
.bg{fill:#f7ebe3}.rd{fill:#e7d3cc}.br{fill:#ff2e93}.bb{fill:#00c9b8}.sd{fill:#a58a9a}
@media (prefers-color-scheme: dark){.bg{fill:#140b24}.rd{fill:#1d1030}.br{fill:#ff2e93}.bb{fill:#00f0ff}.sd{fill:#6a4a8a}}
.sr{animation-name:srun;animation-timing-function:linear;animation-iteration-count:infinite}
.sg{animation:sdash 4s linear infinite}
.pr{animation:fa 1s steps(1) infinite}.pl{animation:fb 1s steps(1) infinite}
@keyframes fa{0%{fill:#ff2a2a}50%{fill:#5a1010}}@keyframes fb{0%{fill:#10205a}50%{fill:#2a6bff}}
@keyframes srun{from{transform:translateX(-100px)}to{transform:translateX(900px)}}
@keyframes sdash{from{transform:translateX(0)}to{transform:translateX(-80px)}}
${rules}</style>
<rect class="bg" x="-4000" y="-4000" width="9000" height="9000"/>
<rect class="br" x="-4000" y="0" width="9000" height="4"/>
<defs><linearGradient id="sun" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff8a3d"/><stop offset=".5" stop-color="#ff2e93"/><stop offset="1" stop-color="#7a2bd6"/></linearGradient></defs>
<rect x="-4000" y="68" width="9000" height="6" fill="url(#sun)"/>
<rect class="rd" x="-4000" y="4" width="9000" height="60"/>
<rect class="bb" x="-4000" y="64" width="9000" height="4"/>
<g class="sg">${dash}</g>
${markup}
</svg>`
}

// Top-down highway down the left edge. Three lanes: two drive down, one drives up. Each lane
// holds cars of one speed, so nothing overlaps. Sprites are drawn facing up and turned
// half-way round for the lanes that drive down.
const TD_CAR = ['.Y...Y.', 'KBBBBBK', 'KBWWWBK', '.BWWWB.', '.BBBBB.', '.BBBBB.', 'KBBBBBK', 'KBWWWBK', '.BBBBB.', '.T...T.']
const TD_SPORT = ['.Y...Y.', 'KBBBBBK', 'GBWWWBG', 'GBBBBBG', 'GBSSSBG', 'GBBBBBG', 'KBWWWBK', '.BBBBB.', 'SSSSSSS', '.T...T.']
const TD_POLICE = ['.Y...Y.', 'KDDDDDK', 'KDWWWDK', '.DRRLLD', '.BBBBB.', '.BBBBB.', 'KDDDDDK', 'KDWWWDK', '.DDDDD.', '.T...T.']
const TD_TRUCK = ['.Y...Y.', 'KBBBBBK', 'KBWWWBK', '.BBBBB.', 'KBBBBBK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', '.LLLLL.', '.T...T.']

type TdKind = 'car' | 'sport' | 'police' | 'truck'
const TD_RING = 700
const TD_S = 4
const TD_LANES: { x: number; down: boolean; period: number; cars: { y0: number; kind: TdKind; color: string; neon?: string }[] }[] = [
  { x: 26, down: true, period: 36, cars: [
    { y0: 100, kind: 'car', color: '#7a8896' },
    { y0: 360, kind: 'car', color: '#b5651d' },
    { y0: 560, kind: 'car', color: '#8e5ea2' },
  ] },
  { x: 78, down: true, period: 22, cars: [
    { y0: 230, kind: 'police', color: '#f2f2f2' },
    { y0: 300, kind: 'sport', color: '#00e5d0', neon: '#ff2e93' },
    { y0: 550, kind: 'police', color: '#f2f2f2' },
    { y0: 620, kind: 'sport', color: '#ff8a3d', neon: '#7a2bd6' },
  ] },
  { x: 130, down: false, period: 30, cars: [
    { y0: 150, kind: 'truck', color: '#5b8c5a' },
    { y0: 400, kind: 'car', color: '#5b7fb5' },
    { y0: 560, kind: 'car', color: '#b8b8c0' },
  ] },
]

const tdCars = (): { markup: string; rules: string } => {
  let markup = ''
  let rules = ''
  let n = 0

  TD_LANES.forEach(lane => {
    lane.cars.forEach(c => {
      const rows = c.kind === 'truck' ? TD_TRUCK : c.kind === 'sport' ? TD_SPORT : c.kind === 'police' ? TD_POLICE : TD_CAR
      const art = sprite(rows, {
        B: c.color, D: '#1a1a22', S: '#1a1a22', G: c.neon ?? '#00f0ff', W: '#9fe8ff', K: '#111111',
        Y: '#fff7a8', T: '#ff4040', L: '#c9c9d4', R: 'class:pr', 
      }).replace(/class="pr"/g, 'class="pr"')
      const id = n++
      const w = (rows[0]?.length ?? 7) * TD_S
      const h = rows.length * TD_S
      const turn = lane.down ? ` rotate(180 ${w / 2} ${h / 2})` : ''

      rules += `.d${id}{animation-name:${lane.down ? 'tdown' : 'tup'};animation-duration:${lane.period}s;animation-delay:-${((c.y0 / TD_RING) * lane.period).toFixed(2)}s}\n`
      markup += `<g transform="translate(${lane.x} 0)"><g class="td d${id}"><g transform="${turn.trim()}"><g transform="scale(${TD_S})">${art}</g></g></g></g>`
    })
  })

  return { markup, rules }
}

export const buildSide = (): string => {
  const { markup, rules } = tdCars()
  let dash = ''

  for (let lane = 1; lane < 3; lane++) {
    for (let i = -2; i < 12; i++) {
      dash += `<rect class="sd" x="${14 + lane * 52 - 1}" y="${i * 60}" width="3" height="30" fill-opacity=".6"/>`
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 600" preserveAspectRatio="xMinYMid meet" shape-rendering="crispEdges">
<defs><linearGradient id="sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8a3d"/><stop offset=".5" stop-color="#ff2e93"/><stop offset="1" stop-color="#7a2bd6"/></linearGradient></defs>
<style>
.bg{fill:#f7ebe3}.rd{fill:#e7d3cc}.br{fill:#ff2e93}.bb{fill:#00c9b8}.sd{fill:#a58a9a}
@media (prefers-color-scheme: dark){.bg{fill:#140b24}.rd{fill:#1d1030}.br{fill:#ff2e93}.bb{fill:#00f0ff}.sd{fill:#6a4a8a}}
.td{animation-timing-function:linear;animation-iteration-count:infinite}
.sg{animation:vdash 3s linear infinite}
.pr{animation:fa 1s steps(1) infinite;fill:#ff2a2a}
@keyframes tdown{from{transform:translateY(-70px)}to{transform:translateY(630px)}}
@keyframes tup{from{transform:translateY(630px)}to{transform:translateY(-70px)}}
@keyframes vdash{from{transform:translateY(0)}to{transform:translateY(60px)}}
@keyframes fa{0%{fill:#ff2a2a}50%{fill:#2a6bff}}
${rules}</style>
<rect class="bg" x="-4000" y="-4000" width="9000" height="9000"/>
<rect class="br" x="8" y="-4000" width="5" height="9000"/>
<rect class="rd" x="13" y="-4000" width="156" height="9000"/>
<rect class="bb" x="169" y="-4000" width="5" height="9000"/>
<rect x="174" y="-4000" width="6" height="9000" fill="url(#sun)"/>
<g class="sg">${dash}</g>
${markup}
</svg>`
}

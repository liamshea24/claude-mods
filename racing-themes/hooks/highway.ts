// Top-down highway, three lanes each way, for Chapel Hill's real time of day and weather.
// The road itself is still; only the cars, incidents and farm animals move. The traffic merges,
// the five chases and the police were planned offline and re-checked at a fine time step with the
// real easing: no two cars ever overlap (closest gap about 17 units). Do not edit PLAN by hand.

export type Phase = 'day' | 'dusk' | 'night'
export type Weather = 'clear' | 'cloudy' | 'fog' | 'rain' | 'storm' | 'snow'

type Keys = [number, number][]
type Traffic = { x0: number; lane: number; len: number; kind: string; keys: Keys | null; changes: { t: number; dir: number }[] }
type Runner = { x0: number; keys: Keys }

type Ent = { kind: string; w: number; h: number; body: string | null; rot: boolean; hazard: boolean; run: boolean; pts: number[][] }
const DATA: {
  P: number
  plan: { traffic: Traffic[]; heroes: Runner[]; police: Runner[] }
  hide: [number, number][]
  ent: Record<string, Ent>
  crash: { tc: number; tend: number; tf: number; yc: number; tlb: number; trel: number }
  lane0: { i: number; tl: [number, number][] }[]
  pass_start: { h: number; p: number }[]
} = {"P": 1824, "plan": {"traffic": [{"x0": 1670.9, "lane": 0, "len": 72, "kind": "truck", "keys": null, "changes": []}, {"x0": 361.8, "lane": 0, "len": 40, "kind": "car", "keys": null, "changes": []}, {"x0": 748.6, "lane": 0, "len": 40, "kind": "car", "keys": null, "changes": []}, {"x0": 1251.3, "lane": 0, "len": 40, "kind": "car", "keys": null, "changes": []}, {"x0": 558.2, "lane": 1, "len": 40, "kind": "car", "keys": [[0.0, 1], [38.021, 1], [40.104, 2], [78.125, 2], [80.208, 1], [100.0, 1]], "changes": [{"t": 18.25, "dir": 1}, {"t": 37.5, "dir": -1}]}, {"x0": 1084.2, "lane": 1, "len": 72, "kind": "truck", "keys": [[0.0, 1], [30.208, 1], [32.292, 0], [80.208, 0], [82.292, 1], [100.0, 1]], "changes": [{"t": 14.5, "dir": -1}, {"t": 38.5, "dir": 1}]}, {"x0": 1510.3, "lane": 1, "len": 40, "kind": "car", "keys": [[0.0, 1], [22.917, 1], [25.0, 0], [76.042, 0], [78.125, 1], [100.0, 1]], "changes": [{"t": 11.0, "dir": -1}, {"t": 36.5, "dir": 1}]}, {"x0": 166.1, "lane": 1, "len": 40, "kind": "car", "keys": [[0.0, 1], [40.625, 1], [42.708, 0], [65.104, 0], [67.188, 1], [100.0, 1]], "changes": [{"t": 19.5, "dir": -1}, {"t": 31.25, "dir": 1}]}, {"x0": 410.2, "lane": 2, "len": 72, "kind": "truck", "keys": null, "changes": []}, {"x0": 843.0, "lane": 2, "len": 40, "kind": "car", "keys": null, "changes": []}, {"x0": 1300.4, "lane": 2, "len": 40, "kind": "car", "keys": null, "changes": []}, {"x0": 1757.7, "lane": 2, "len": 72, "kind": "truck", "keys": null, "changes": []}], "heroes": [{"x0": 1764.2, "keys": [[0.0, 1], [2.083, 1], [4.167, 2], [8.854, 2], [10.938, 1], [13.021, 1], [15.104, 0], [18.229, 0], [20.312, 1], [23.438, 1], [25.521, 0], [27.604, 1], [29.688, 2], [33.333, 2], [35.417, 1], [39.062, 1], [41.146, 2], [46.354, 2], [48.438, 1], [52.083, 1], [54.167, 2], [58.854, 2], [60.938, 1], [63.021, 1], [65.104, 0], [68.229, 0], [70.312, 1], [73.438, 1], [75.521, 0], [77.604, 1], [79.688, 2], [83.333, 2], [85.417, 1], [89.062, 1], [91.146, 2], [96.354, 2], [98.438, 1], [100.0, 1]]}, {"x0": 397.3, "keys": [[0.0, 1], [0.521, 1], [2.604, 0], [6.25, 0], [8.333, 1], [10.938, 1], [13.021, 0], [15.104, 1], [17.188, 2], [21.354, 2], [23.438, 1], [27.083, 1], [29.167, 2], [33.854, 2], [35.938, 1], [40.104, 1], [42.188, 2], [46.875, 2], [48.958, 1], [50.521, 1], [52.604, 0], [56.25, 0], [58.333, 1], [60.938, 1], [63.021, 0], [65.104, 1], [67.188, 2], [71.354, 2], [73.438, 1], [77.083, 1], [79.167, 2], [83.854, 2], [85.938, 1], [90.104, 1], [92.188, 2], [96.875, 2], [98.958, 1], [100.0, 1]]}, {"x0": 738.6, "keys": [[0.0, 1], [1.562, 1], [3.646, 0], [5.729, 1], [7.812, 2], [11.979, 2], [14.062, 1], [17.708, 1], [19.792, 2], [24.479, 2], [26.562, 1], [30.208, 1], [32.292, 0], [35.938, 0], [38.021, 1], [41.146, 1], [43.229, 0], [46.354, 0], [48.438, 1], [51.562, 1], [53.646, 0], [55.729, 1], [57.812, 2], [61.979, 2], [64.062, 1], [67.708, 1], [69.792, 2], [74.479, 2], [76.562, 1], [80.208, 1], [82.292, 0], [85.938, 0], [88.021, 1], [91.146, 1], [93.229, 0], [96.354, 0], [98.438, 1], [100.0, 1]]}, {"x0": 1056.6, "keys": [[0.0, 2], [3.125, 2], [5.208, 1], [8.854, 1], [10.938, 2], [15.625, 2], [17.708, 1], [21.354, 1], [23.438, 0], [27.083, 0], [29.167, 1], [32.292, 1], [34.375, 0], [37.5, 0], [39.583, 1], [42.708, 1], [44.792, 0], [46.875, 1], [48.958, 2], [53.125, 2], [55.208, 1], [58.854, 1], [60.938, 2], [65.625, 2], [67.708, 1], [71.354, 1], [73.438, 0], [77.083, 0], [79.167, 1], [82.292, 1], [84.375, 0], [87.5, 0], [89.583, 1], [92.708, 1], [94.792, 0], [96.875, 1], [98.958, 2], [100.0, 2]]}, {"x0": 1424.3, "keys": [[0.0, 2], [5.729, 2], [7.812, 1], [11.458, 1], [13.542, 2], [18.229, 2], [20.312, 1], [22.396, 1], [24.479, 0], [27.604, 0], [29.688, 1], [32.812, 1], [34.896, 0], [36.979, 1], [39.062, 2], [42.708, 2], [44.792, 1], [48.438, 1], [50.521, 2], [55.729, 2], [57.812, 1], [61.458, 1], [63.542, 2], [68.229, 2], [70.312, 1], [72.396, 1], [74.479, 0], [77.604, 0], [79.688, 1], [82.812, 1], [84.896, 0], [86.979, 1], [89.062, 2], [92.708, 2], [94.792, 1], [97.917, 1], [100.0, 2]]}], "police": [{"x0": 1594.2, "keys": [[0.0, 2], [2.083, 1], [6.771, 1], [8.854, 2], [11.979, 2], [14.062, 1], [17.188, 1], [19.271, 0], [22.396, 0], [24.479, 1], [30.729, 1], [32.812, 2], [38.021, 2], [40.104, 1], [43.229, 1], [45.312, 2], [49.479, 2], [51.562, 1], [56.771, 1], [58.854, 2], [61.979, 2], [64.062, 1], [67.188, 1], [69.271, 0], [72.396, 0], [74.479, 1], [80.729, 1], [82.812, 2], [88.021, 2], [90.104, 1], [93.229, 1], [95.312, 2], [100.0, 2]]}, {"x0": 227.3, "keys": [[0.0, 2], [2.083, 1], [5.208, 1], [7.292, 0], [10.417, 0], [12.5, 1], [18.75, 1], [20.833, 2], [26.042, 2], [28.125, 1], [31.25, 1], [33.333, 2], [36.979, 2], [39.062, 1], [44.792, 1], [46.875, 2], [50.0, 2], [52.083, 1], [55.208, 1], [57.292, 0], [60.417, 0], [62.5, 1], [68.75, 1], [70.833, 2], [76.042, 2], [78.125, 1], [81.25, 1], [83.333, 2], [86.979, 2], [89.062, 1], [94.792, 1], [96.875, 2], [100.0, 2]]}, {"x0": 568.6, "keys": [[0.0, 0], [1.042, 0], [3.125, 1], [8.854, 1], [10.938, 2], [16.667, 2], [18.75, 1], [21.875, 1], [23.958, 2], [27.604, 2], [29.688, 1], [33.333, 1], [35.417, 0], [40.104, 0], [42.188, 1], [45.833, 1], [47.917, 0], [51.042, 0], [53.125, 1], [58.854, 1], [60.938, 2], [66.667, 2], [68.75, 1], [71.875, 1], [73.958, 2], [77.604, 2], [79.688, 1], [83.333, 1], [85.417, 0], [90.104, 0], [92.188, 1], [95.833, 1], [97.917, 0], [100.0, 0]]}, {"x0": 886.6, "keys": [[0.0, 1], [2.083, 2], [7.812, 2], [9.896, 1], [13.021, 1], [15.104, 2], [18.75, 2], [20.833, 1], [24.479, 1], [26.562, 0], [31.25, 0], [33.333, 1], [36.979, 1], [39.062, 0], [42.188, 0], [44.271, 1], [50.0, 1], [52.083, 2], [57.812, 2], [59.896, 1], [63.021, 1], [65.104, 2], [68.75, 2], [70.833, 1], [74.479, 1], [76.562, 0], [81.25, 0], [83.333, 1], [86.979, 1], [89.062, 0], [92.188, 0], [94.271, 1], [100.0, 1]]}, {"x0": 1254.3, "keys": [[0.0, 1], [2.604, 1], [4.688, 2], [8.854, 2], [10.938, 1], [16.146, 1], [18.229, 2], [21.354, 2], [23.438, 1], [26.562, 1], [28.646, 0], [32.292, 0], [34.375, 1], [40.104, 1], [42.188, 2], [47.396, 2], [49.479, 1], [52.604, 1], [54.688, 2], [58.854, 2], [60.938, 1], [66.146, 1], [68.229, 2], [71.354, 2], [73.438, 1], [76.562, 1], [78.646, 0], [82.292, 0], [84.375, 1], [90.104, 1], [92.188, 2], [97.396, 2], [99.479, 1], [100.0, 1]]}]}, "hide": [[112, 188.25], [322.0, 347.0], [508, 608.75], [1088, 1172.25], [1208, 1314.5], [1442.0, 1470.0], [1525.5, 1741.1]], "ent": {"s1car": {"kind": "car", "w": 28, "h": 40, "body": "#2f8fb5", "rot": false, "hazard": false, "run": false, "pts": [[119.0, 730, -100.0], [123.5, 730, 68.75], [123.75, 728.88, 78.12], [124.25, 721.36, 96.88], [125.25, 698.64, 134.38], [125.75, 691.12, 153.12], [127.0, 690, 200.0], [127.5, 690, 216.12], [128.25, 690, 237.25], [128.75, 690, 248.12], [129.25, 690, 255.5], [130.0, 690, 260.0], [148.25, 690, 260.0], [148.75, 690, 261.88], [149.25, 690, 266.25], [149.75, 690, 273.12], [150.5, 690, 288.12], [151.25, 690, 308.75], [152.25, 691.12, 344.38], [152.75, 698.64, 363.12], [154.0, 725.84, 410.0], [154.5, 730.0, 428.75], [177.5, 730, 1291.25]]}, "s1pol": {"kind": "police", "w": 28, "h": 40, "body": null, "rot": false, "hazard": false, "run": false, "pts": [[121.4, 730, -100.0], [125.15, 730, 40.62], [125.4, 728.88, 50.0], [125.9, 721.36, 68.75], [127.15, 694.16, 115.62], [127.65, 690.0, 134.38], [128.15, 690, 152.25], [128.9, 690, 172.5], [129.4, 690, 181.62], [129.9, 690, 187.25], [130.4, 690, 189.38], [153.25, 690, 189.38], [153.75, 690, 191.25], [154.25, 690, 195.62], [154.75, 690, 202.5], [155.25, 690, 211.88], [155.75, 690, 223.75], [156.25, 690, 238.12], [157.25, 691.12, 273.75], [157.75, 698.64, 292.5], [159.0, 725.84, 339.38], [159.5, 730.0, 358.12], [184.25, 730, 1286.25]]}, "s1off": {"kind": "person", "w": 8, "h": 16, "body": null, "rot": false, "hazard": false, "run": false, "pts": [[132.25, 684, 198], [137.25, 684, 256], [146.25, 684, 256], [151.25, 684, 198]]}, "deer": {"kind": "deer", "w": 26, "h": 12, "body": null, "rot": false, "hazard": false, "run": false, "pts": [[327.0, 610, 540], [343.0, 1010, 540]]}, "s3car": {"kind": "car", "w": 28, "h": 40, "body": "#a34a4a", "rot": false, "hazard": true, "run": false, "pts": [[516.0, 730, -100.0], [520.75, 730, 78.12], [521.25, 725.84, 96.88], [522.5, 698.64, 143.75], [523.0, 691.12, 162.5], [523.25, 690.0, 171.88], [528.0, 690, 350.0], [528.5, 690, 366.12], [529.5, 690, 393.12], [530.0, 690, 402.25], [530.5, 690, 407.88], [531.0, 690, 410.0], [572.75, 690, 410.0], [578.75, 690, 462.0], [581.0, 690, 462.62], [581.5, 690, 465.75], [582.25, 690, 475.12], [582.75, 690, 484.5], [583.5, 690, 503.25], [584.0, 690, 518.88], [584.75, 691.12, 546.38], [585.25, 698.64, 565.12], [586.5, 725.84, 612.0], [587.0, 730.0, 630.75], [604.75, 730, 1296.38]]}, "s3tow": {"kind": "tow", "w": 28, "h": 60, "body": null, "rot": false, "hazard": false, "run": false, "pts": [[536.25, 730, -100.0], [551.25, 730, 462.5], [551.75, 725.84, 481.25], [553.0, 698.64, 528.12], [553.5, 691.12, 546.88], [554.25, 690, 575.0], [554.75, 690, 591.12], [555.25, 690, 603.75], [556.0, 690, 616.12], [556.75, 690, 620.62], [559.0, 690, 620.0], [570.5, 690, 459.0], [580.75, 690, 458.0], [581.25, 690, 459.88], [581.75, 690, 464.25], [582.25, 690, 471.12], [582.75, 690, 480.5], [583.25, 690, 492.38], [583.75, 690, 506.75], [584.75, 691.12, 542.38], [585.25, 698.64, 561.12], [586.5, 725.84, 608.0], [587.0, 730.0, 626.75], [604.75, 730, 1292.38]]}, "s3person": {"kind": "person", "w": 8, "h": 16, "body": null, "rot": false, "hazard": false, "run": false, "pts": [[533.75, 692, 420.0], [536.25, 679, 424.0], [578.75, 679, 424.0]]}, "s3tri": {"kind": "triangle", "w": 14, "h": 10, "body": null, "rot": false, "hazard": false, "run": false, "pts": [[537.25, 698, 376.0], [578.75, 698, 376.0]]}, "jog": {"kind": "person", "w": 8, "h": 16, "body": null, "rot": false, "hazard": false, "run": true, "pts": [[760, 684, -60], [842, 684, 1100]]}, "crew": {"kind": "crewtruck", "w": 28, "h": 40, "body": null, "rot": false, "hazard": false, "run": false, "pts": [[1300, 690, -90], [1435, 690, 1130]]}, "cone0": {"kind": "cone", "w": 8, "h": 8, "body": null, "rot": false, "hazard": false, "run": false, "pts": [[1316.67, 708, 60], [1440, 708, 60]]}, "cone1": {"kind": "cone", "w": 8, "h": 8, "body": null, "rot": false, "hazard": false, "run": false, "pts": [[1333.33, 708, 210], [1440, 708, 210]]}, "cone2": {"kind": "cone", "w": 8, "h": 8, "body": null, "rot": false, "hazard": false, "run": false, "pts": [[1350.0, 708, 360], [1440, 708, 360]]}, "cone3": {"kind": "cone", "w": 8, "h": 8, "body": null, "rot": false, "hazard": false, "run": false, "pts": [[1366.67, 708, 510], [1440, 708, 510]]}, "cone4": {"kind": "cone", "w": 8, "h": 8, "body": null, "rot": false, "hazard": false, "run": false, "pts": [[1383.33, 708, 660], [1440, 708, 660]]}, "cone5": {"kind": "cone", "w": 8, "h": 8, "body": null, "rot": false, "hazard": false, "run": false, "pts": [[1400.0, 708, 810], [1440, 708, 810]]}, "cone6": {"kind": "cone", "w": 8, "h": 8, "body": null, "rot": false, "hazard": false, "run": false, "pts": [[1416.67, 708, 960], [1440, 708, 960]]}, "heli": {"kind": "heli", "w": 60, "h": 60, "body": null, "rot": false, "hazard": false, "run": false, "pts": [[900, -80, 120], [934, 1100, 880]]}, "s6car": {"kind": "car", "w": 28, "h": 40, "body": "#c9b458", "rot": false, "hazard": false, "run": false, "pts": [[1112.0, 730, -100.0], [1116.5, 730, 68.75], [1116.75, 728.88, 78.12], [1117.25, 721.36, 96.88], [1118.5, 694.16, 143.75], [1119.0, 690.0, 162.5], [1132.25, 690, 659.38], [1133.0, 690, 682.25], [1133.75, 690, 697.25], [1134.25, 690, 702.88], [1134.75, 690, 705.0], [1151.0, 690, 705.0], [1151.75, 690, 708.75], [1152.5, 690, 718.12], [1153.0, 690, 727.5], [1153.75, 690, 746.25], [1154.25, 690, 761.88], [1155.0, 691.12, 789.38], [1155.5, 698.64, 808.12], [1156.75, 725.84, 855.0], [1157.25, 730.0, 873.75], [1168.25, 730, 1286.25]]}, "s6person": {"kind": "person", "w": 8, "h": 16, "body": null, "rot": false, "hazard": false, "run": false, "pts": [[1096, 682, 610], [1112, 682, 708], [1137.0, 682, 708], [1141.1, 690, 712]]}, "s9amb": {"kind": "amb", "w": 28, "h": 40, "body": null, "rot": false, "hazard": false, "run": false, "pts": [[1182, 690, -120], [1201, 690, 1285]]}, "s9fire": {"kind": "fire", "w": 28, "h": 72, "body": null, "rot": false, "hazard": false, "run": false, "pts": [[1186, 690, -170], [1205, 690, 1285]]}, "s10cruiser": {"kind": "police", "w": 28, "h": 40, "body": null, "rot": false, "hazard": false, "run": false, "pts": [[1215.0, 730, -100.0], [1219.5, 730, 68.75], [1219.75, 728.88, 78.12], [1220.25, 721.36, 96.88], [1221.5, 694.16, 143.75], [1222.0, 690.0, 162.5], [1239.25, 690, 809.38], [1240.25, 690, 841.62], [1240.75, 690, 854.25], [1241.25, 690, 863.38], [1241.75, 690, 869.0], [1242.25, 690, 871.12], [1297.5, 690, 871.12], [1298.0, 690, 873.0], [1298.5, 690, 877.38], [1299.25, 690, 888.62], [1300.0, 690, 905.5], [1300.75, 690, 928.0], [1301.25, 690, 946.12], [1301.75, 694.16, 964.88], [1303.0, 721.36, 1011.75], [1303.5, 728.88, 1030.5], [1303.75, 730.0, 1039.88], [1310.5, 730, 1293.0]]}, "s11rager": {"kind": "rager", "w": 28, "h": 40, "body": null, "rot": false, "hazard": false, "run": false, "pts": [[1448.0, 770, -120.0], [1448.5, 770, -81.0], [1449.0, 780.37, -42.0], [1449.5, 799.63, -3.0], [1450.0, 810, 36.0], [1450.5, 799.63, 75.0], [1451.0, 780.37, 114.0], [1451.5, 770, 153.0], [1452.0, 770, 192.0], [1452.5, 759.63, 231.0], [1453.0, 740.37, 270.0], [1453.5, 730, 309.0], [1454.0, 740.37, 348.0], [1454.5, 759.63, 387.0], [1455.0, 770, 426.0], [1455.5, 759.63, 465.0], [1456.0, 740.37, 504.0], [1456.5, 730, 543.0], [1458.5, 730, 699.0], [1459.0, 740.37, 738.0], [1459.5, 759.63, 777.0], [1460.5, 780.37, 855.0], [1461.0, 799.63, 894.0], [1461.5, 810, 933.0], [1462.0, 799.63, 972.0], [1462.5, 780.37, 1011.0], [1463.0, 770, 1050.0], [1463.5, 770, 1089.0], [1464.0, 759.63, 1128.0], [1464.5, 740.37, 1167.0], [1465.0, 730, 1206.0], [1465.5, 740.37, 1245.0], [1466.0, 759.63, 1284.0], [1466.5, 770, 1323.0]]}, "s8police": {"kind": "police", "w": 28, "h": 40, "body": null, "rot": false, "hazard": false, "run": false, "pts": [[1526.1, 730, -100.0], [1530.85, 730, 78.12], [1531.1, 728.88, 87.5], [1531.6, 721.36, 106.25], [1532.85, 694.16, 153.12], [1533.35, 690.0, 171.88], [1552.35, 690, 884.38], [1552.85, 690, 900.5], [1553.85, 690, 925.75], [1554.6, 690, 938.12], [1555.35, 690, 942.62], [1578.85, 690, 942.62], [1579.35, 690, 944.5], [1579.85, 690, 948.88], [1580.35, 690, 955.75], [1581.1, 690, 970.75], [1581.85, 690, 991.38], [1582.6, 690, 1017.62], [1583.1, 690, 1038.25], [1588.6, 690, 1285.75]]}, "s8amb": {"kind": "amb", "w": 28, "h": 40, "body": null, "rot": false, "hazard": false, "run": false, "pts": [[1530.35, 730, -100.0], [1535.1, 730, 78.12], [1535.35, 728.88, 87.5], [1535.85, 721.36, 106.03], [1537.1, 694.16, 148.58], [1537.6, 690.0, 164.05], [1538.1, 690, 181.69], [1555.6, 690, 837.94], [1556.1, 690, 854.07], [1557.1, 690, 881.07], [1557.85, 690, 893.44], [1558.6, 690, 897.94], [1582.85, 690, 897.94], [1583.35, 690, 899.82], [1583.85, 690, 904.19], [1584.35, 690, 911.07], [1585.1, 690, 926.07], [1585.85, 690, 946.69], [1586.6, 690, 972.94], [1587.1, 690, 993.57], [1593.6, 690, 1286.07]]}, "s8tow1": {"kind": "tow", "w": 28, "h": 60, "body": null, "rot": false, "hazard": false, "run": false, "pts": [[1576.85, 690, -100.0], [1599.35, 690, 743.75], [1599.85, 690, 759.88], [1600.6, 690, 777.5], [1601.1, 690, 784.88], [1601.6, 690, 788.75], [1612.1, 690, 788], [1612.6, 690, 789.88], [1613.1, 690, 794.25], [1613.6, 690, 801.12], [1614.1, 690, 810.5], [1614.6, 690, 822.38], [1615.1, 690, 836.75], [1615.6, 690, 853.62], [1616.1, 690, 873.0], [1625.35, 690, 1288.62]]}, "s8tow2": {"kind": "tow", "w": 28, "h": 60, "body": null, "rot": false, "hazard": false, "run": false, "pts": [[1613.1, 690, -100.0], [1635.85, 690, 753.12], [1636.85, 690, 787.12], [1637.6, 690, 804.75], [1638.1, 690, 812.12], [1638.6, 690, 816.0], [1639.1, 690, 816.62], [1641.1, 690, 804], [1649.1, 690, 804], [1649.6, 690, 805.88], [1650.1, 690, 810.25], [1650.6, 690, 817.12], [1651.1, 690, 826.5], [1651.6, 690, 838.38], [1652.1, 690, 852.75], [1652.6, 690, 869.62], [1653.1, 690, 889.0], [1662.1, 690, 1293.38]]}, "s8carA": {"kind": "car", "w": 28, "h": 40, "body": "#2f6fbf", "rot": true, "hazard": false, "run": false, "pts": [[1535.49, 728, 792, 12], [1604.1, 728, 792, 12], [1610.1, 690, 792, 0], [1612.1, 690, 792, 0], [1612.6, 690, 793.88, 0], [1613.35, 690, 801.38, 0], [1614.1, 690, 814.5, 0], [1614.85, 690, 833.25, 0], [1615.35, 690, 848.88, 0], [1615.85, 690, 867.0, 0], [1616.35, 690, 887.62, 0], [1625.35, 690, 1292.62, 0]]}, "s8carB": {"kind": "car", "w": 28, "h": 40, "body": "#d6402f", "rot": true, "hazard": false, "run": false, "pts": [[1535.49, 732, 808, -16], [1641.1, 732, 808, -16], [1647.1, 690, 808, 0], [1649.35, 690, 808.62, 0], [1650.1, 690, 814.25, 0], [1650.6, 690, 821.12, 0], [1651.1, 690, 830.5, 0], [1651.85, 690, 849.25, 0], [1652.35, 690, 864.88, 0], [1652.85, 690, 883.0, 0], [1653.35, 690, 903.62, 0], [1662.1, 690, 1297.38, 0]]}}, "crash": {"tc": 1535.5, "tend": 1736.1, "tf": 1527.5, "yc": 792, "tlb": 1647.1, "trel": 1651.1}, "lane0": [{"i": 0, "tl": [[1535.5, 1452.2], [1536.821, 1498.6], [1538.142, 1538.8], [1539.463, 1572.9], [1540.748, 1600.0], [1540.758, -200.0], [1540.784, -199.2], [1542.105, -177.6], [1543.426, -162.1], [1544.747, -152.8], [1546.068, -149.7], [1651.1, -149.7], [1652.1, -146.8], [1653.1, -138.2], [1654.1, -123.8], [1655.1, -103.7], [1656.1, -77.9], [1657.1, -46.2], [1658.1, -8.9], [1659.1, 34.2], [1693.154, 1600.0], [1693.164, -200.0], [1732.302, 1600.0], [1732.312, -200.0], [1736.1, -25.3]]}, {"i": 1, "tl": [[1535.5, 143.1], [1536.821, 189.5], [1538.142, 229.7], [1539.463, 263.8], [1540.784, 291.7], [1542.105, 313.3], [1543.426, 328.8], [1544.747, 338.1], [1546.068, 341.2], [1651.1, 341.2], [1652.1, 344.1], [1653.1, 352.7], [1654.1, 367.1], [1655.1, 387.2], [1656.1, 413.0], [1657.1, 444.7], [1658.1, 482.0], [1659.1, 525.1], [1682.477, 1600.0], [1682.487, -200.0], [1721.625, 1600.0], [1721.635, -200.0], [1736.1, 465.6]]}, {"i": 2, "tl": [[1535.5, 529.8], [1536.821, 576.3], [1538.142, 616.5], [1539.463, 650.6], [1540.784, 678.5], [1542.105, 700.1], [1543.426, 715.6], [1544.747, 724.9], [1546.068, 728.0], [1651.1, 728.0], [1652.1, 730.9], [1653.1, 739.5], [1654.1, 753.9], [1655.1, 774.0], [1656.1, 799.8], [1657.1, 831.5], [1658.1, 868.8], [1659.1, 911.9], [1674.065, 1600.0], [1674.075, -200.0], [1713.213, 1600.0], [1713.223, -200.0], [1736.1, 852.3]]}, {"i": 3, "tl": [[1535.5, 1032.6], [1536.821, 1079.0], [1538.142, 1119.2], [1539.463, 1153.3], [1540.784, 1181.2], [1542.105, 1202.8], [1543.426, 1218.3], [1544.747, 1227.6], [1546.068, 1230.7], [1651.1, 1230.7], [1652.1, 1233.6], [1653.1, 1242.2], [1654.1, 1256.6], [1655.1, 1276.7], [1656.1, 1302.5], [1657.1, 1334.2], [1658.1, 1371.5], [1659.1, 1414.6], [1663.132, 1600.0], [1663.142, -200.0], [1702.28, 1600.0], [1702.29, -200.0], [1736.1, 1355.1]]}], "pass_start": [{"h": 16.318, "p": 17.829}, {"h": 28.468, "p": 29.98}, {"h": 41.435, "p": 42.946}, {"h": 70.608, "p": 72.119}, {"h": 83.34, "p": 84.851}]}

const PLAN = DATA.plan

const RING = 1800
const PITCH = 40
const S = 4
const DOWN_L = 724
const UP_L = 864
const CYCLE = DATA.P

const CAR = ['.Y...Y.', 'KBBBBBK', 'KBWWWBK', '.BWWWB.', '.BBBBB.', '.BBBBB.', 'KBBBBBK', 'KBWWWBK', '.BBBBB.', '.T...T.']
const SEMI = ['.Y...Y.', 'KBBBBBK', 'KBWWWBK', '.BBBBB.', 'KBBBBBK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', '.T...T.']

// Hero cars: 9 wide, 12 long, each with its own colours.
const RX7 = ['.Y...Y.', 'KBDDDBK', 'KBDDDBK', '.BWWWB.', '.BDDDB.', '.BBBBB.', 'KBWWWBK', '.BBBBB.', 'SSSSSSS', '.T...T.']
const GT40 = ['.YBBBY.', 'KBDBDBK', 'KBDBDBK', '.BWWWB.', '.BDBDB.', '.BDBDB.', 'KBDNDBK', '.BDBDB.', '.BBBBB.', '.T...T.']
const REXY = ['.EYBYE.', 'KBDBDBK', 'KBDBDBK', '.BWWWB.', '.BBBBB.', 'KBBBBBK', 'KBWWWBK', '.BBBBB.', 'SSSSSSS', '.T...T.']
const R34 = ['.Y...Y.', 'KBBDBBK', 'KBDDDBK', '.BWWWB.', '.BBBBB.', '.BBBBB.', 'KBWWWBK', '.BBBBB.', 'DDDDDDD', '.T...T.']
const CHARGER = ['.Y...Y.', 'KBBBBBK', 'KBBDBBK', 'KBDDDBK', '.BWWWB.', '.BBBBB.', 'KBBBBBK', 'KBWWWBK', '.BBBBB.', '.T...T.']
const POLICE = ['.Y...Y.', 'KDDDDDK', 'KDWWWDK', '.DPPQDD', '.BBBBB.', '.BBBBB.', 'KDDWWDK', '.DDDDD.', '.DDDDD.', '.T...T.']

const HEROES: { rows: string[]; colors: Record<string, string> }[] = [
  { rows: RX7, colors: { B: '#ff7a1a', D: '#15151a', S: '#15151a' } },
  { rows: GT40, colors: { B: '#f5f5f0', D: '#1b4fb5', N: '#1a1a1a' } },
  { rows: REXY, colors: { B: '#3fae3a', D: '#14141a', E: '#ffffff', S: '#14141a' } },
  { rows: R34, colors: { B: '#1f62d6', D: '#cfd6e0' } },
  { rows: CHARGER, colors: { B: '#1a1a20', D: '#b0b0ba', K: '#07070a' } },
]

const CIV = ['#7a8896', '#b5651d', '#8e5ea2', '#5b7fb5', '#b8b8c0', '#a34a4a', '#4f8a8b', '#c9b458']

// A tiny 3x5 pixel font, used for the farm's sign.
const GLYPHS: Record<string, string[]> = {
  '%': ['X.X', '..X', '.X.', 'X..', 'X.X'],
  '$': ['.XX', 'XX.', '.X.', '.XX', 'XX.'],
  ':': ['...', '.X.', '...', '.X.', '...'],
  '.': ['...', '...', '...', '...', '.X.'],
  '/': ['..X', '..X', '.X.', 'X..', 'X..'],
  'A': ['.X.', 'X.X', 'XXX', 'X.X', 'X.X'],
  'B': ['XX.', 'X.X', 'XX.', 'X.X', 'XX.'],
  'C': ['.XX', 'X..', 'X..', 'X..', '.XX'],
  'D': ['XX.', 'X.X', 'X.X', 'X.X', 'XX.'],
  'E': ['XXX', 'X..', 'XX.', 'X..', 'XXX'],
  'F': ['XXX', 'X..', 'XX.', 'X..', 'X..'],
  'G': ['.XX', 'X..', 'X.X', 'X.X', '.XX'],
  'H': ['X.X', 'X.X', 'XXX', 'X.X', 'X.X'],
  'I': ['XXX', '.X.', '.X.', '.X.', 'XXX'],
  'J': ['..X', '..X', '..X', 'X.X', '.X.'],
  'K': ['X.X', 'X.X', 'XX.', 'X.X', 'X.X'],
  'L': ['X..', 'X..', 'X..', 'X..', 'XXX'],
  'M': ['X.X', 'XXX', 'XXX', 'X.X', 'X.X'],
  'N': ['XX.', 'X.X', 'X.X', 'X.X', 'X.X'],
  'O': ['XXX', 'X.X', 'X.X', 'X.X', 'XXX'],
  'P': ['XX.', 'X.X', 'XX.', 'X..', 'X..'],
  'Q': ['XXX', 'X.X', 'X.X', 'XXX', '..X'],
  'R': ['XX.', 'X.X', 'XX.', 'X.X', 'X.X'],
  'S': ['.XX', 'X..', '.X.', '..X', 'XX.'],
  'T': ['XXX', '.X.', '.X.', '.X.', '.X.'],
  'U': ['X.X', 'X.X', 'X.X', 'X.X', 'XXX'],
  'V': ['X.X', 'X.X', 'X.X', 'X.X', '.X.'],
  'W': ['X.X', 'X.X', 'XXX', 'XXX', 'X.X'],
  'X': ['X.X', 'X.X', '.X.', 'X.X', 'X.X'],
  'Y': ['X.X', 'X.X', '.X.', '.X.', '.X.'],
  'Z': ['XXX', '..X', '.X.', 'X..', 'XXX'],
  '0': ['XXX', 'X.X', 'X.X', 'X.X', 'XXX'],
  '1': ['.X.', 'XX.', '.X.', '.X.', 'XXX'],
  '2': ['XX.', '..X', '.X.', 'X..', 'XXX'],
  '3': ['XXX', '..X', 'XXX', '..X', 'XXX'],
  '4': ['X.X', 'X.X', 'XXX', '..X', '..X'],
  '5': ['XXX', 'X..', 'XX.', '..X', 'XX.'],
  '6': ['.XX', 'X..', 'XXX', 'X.X', 'XXX'],
  '7': ['XXX', '..X', '.X.', '.X.', '.X.'],
  '8': ['XXX', 'X.X', 'XXX', 'X.X', 'XXX'],
  '9': ['XXX', 'X.X', 'XXX', '..X', 'XX.'],
  '-': ['...', '...', 'XXX', '...', '...'],
  ' ': ['...', '...', '...', '...', '...'],
}

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

const BASE = { K: '#111111', W: '#9fe8ff', Y: '#fff7a8', T: '#ff4040', S: '#1a1a22', L: '#c9c9d4', P: 'class:pr', Q: 'class:pq' }

const car = (rows: string[], colors: Record<string, string>, down: boolean): string => {
  const w = (rows[0]?.length ?? 7) * S
  const h = rows.length * S
  const turn = down ? `rotate(180 ${w / 2} ${h / 2})` : ''

  return `<g transform="${turn}"><g transform="scale(${S})">${sprite(rows, { ...BASE, ...colors })}</g></g>`
}

const text = (label: string, u: number, color: string): { svg: string; width: number } => {
  let x = 0
  let cells = ''

  for (const ch of label) {
    const g = GLYPHS[ch]

    if (g === undefined) {
      continue
    }
    g.forEach((row, y) => {
      for (let i = 0; i < 3; i++) {
        if (row[i] === 'X') {
          cells += `M${x + i} ${y}h1v1h-1z`
        }
      }
    })
    x += 4
  }

  return { svg: `<g transform="scale(${u})"><path fill="${color}" d="${cells}"/></g>`, width: (x - 1) * u }
}

// Headlight beams: a soft cone ahead of the car, lit at dusk and night.
const beams = (h: number, down: boolean): string =>
  down
    ? `<path class="hl" fill="url(#hlg)" d="M3 ${h}L25 ${h}L33 ${h + 50}L-5 ${h + 50}Z"/>`
    : '<path class="hl" fill="url(#hlu)" d="M3 0L25 0L33 -50L-5 -50Z"/>'

const delay = (x0: number, period: number) => `-${((x0 / RING) * period).toFixed(2)}s`

let rules = ''

const pct = (t: number) => ((t / CYCLE) * 100).toFixed(4)

// Shown (or hidden) inside each window of the cycle; fade is how long the change takes.
const vis = (name: string, windows: [number, number][], shownInside: boolean, fade = 0.01): void => {
  const on = shownInside ? 1 : 0
  const off = 1 - on
  let frames = `0%{opacity:${off}}`

  windows.forEach(([a, b]) => {
    frames += `${pct(Math.max(0, a - fade))}%{opacity:${off}}${pct(a)}%{opacity:${on}}${pct(b)}%{opacity:${on}}${pct(b + fade)}%{opacity:${off}}`
  })
  frames += `100%{opacity:${off}}`
  rules += `.${name}{animation:${name} ${CYCLE}s linear infinite}\n@keyframes ${name}{${frames}}\n`
}

// A thing that follows a planned path: visible only while the path lasts.
const follow = (name: string, pts: number[][], w: number, h: number, rot: boolean): void => {
  const first = pts[0]
  const last = pts[pts.length - 1]

  if (first === undefined || last === undefined) {
    return
  }
  const at = (p: number[]) =>
    rot
      ? `transform:translate(${(p[1] ?? 0) + w / 2}px,${(p[2] ?? 0) + h / 2}px) rotate(${p[3] ?? 0}deg) translate(${-w / 2}px,${-h / 2}px)`
      : `transform:translate(${p[1] ?? 0}px,${p[2] ?? 0}px)`
  let frames = `0%{${at(first)};opacity:0}${pct(Math.max(0, (first[0] ?? 0) - 0.01))}%{${at(first)};opacity:0}`

  pts.forEach((p, k) => {
    frames += `${pct(p[0] ?? 0)}%{${at(p)}${k === 0 || k === pts.length - 1 ? ';opacity:1' : ''}}`
  })
  frames += `${pct((last[0] ?? 0) + 0.01)}%{${at(last)};opacity:0}100%{${at(last)};opacity:0}`
  rules += `.${name}{animation:${name} ${CYCLE}s linear infinite}\n@keyframes ${name}{${frames}}\n`
}

// Blinkers: orange squares on the side a car is moving toward, flashing for 1.5 s before a lane change.
const blinkerFrames = (changes: { t: number; dir: number }[], dir: number): string => {
  const own = changes.filter(c => c.dir === dir)
  let last = -1
  let frames = ''

  for (let t = 0; t <= 48.01; t += 0.5) {
    const on = own.some(c => t >= c.t - 1.5 && t <= c.t + 1) && Math.floor(t / 0.5) % 2 === 0 ? 1 : 0

    if (on !== last) {
      frames += `${((t / 48) * 100).toFixed(2)}%{opacity:${on}}`
      last = on
    }
  }

  return frames
}

const UPS = [
  { lane: 0, y0: 100, truck: false }, { lane: 0, y0: 700, truck: true },
  { lane: 1, y0: 400, truck: false }, { lane: 1, y0: 1000, truck: false },
  { lane: 2, y0: 250, truck: true }, { lane: 2, y0: 850, truck: false },
]

const traffic = (): string => {
  let out = ''
  const { tc, tend, tf } = DATA.crash
  const jam = new Map(DATA.lane0.map(l => [l.i, l.tl]))

  PLAN.traffic.forEach((c, i) => {
    const rows = c.kind === 'truck' ? SEMI : CAR
    const body = CIV[i % CIV.length] ?? '#888888'
    const h = rows.length * S
    const art = car(rows, { B: body, D: body }, true) + beams(h, true)
    const place = (inner: string, lane: number) => `<g transform="translate(${DOWN_L + 6 + lane * PITCH} 0)"><g class="td c${i}">${inner}</g></g>`

    rules += `.c${i}{animation-name:tdown;animation-duration:48s;animation-delay:${delay(c.x0, 48)}}\n`
    if (c.keys !== null) {
      // A merging car. Version A merges; version B stays in its lane while the jam is on.
      const frames = c.keys.map(([p, lane]) => `${p.toFixed(2)}%{transform:translateX(${lane * PITCH}px)}`).join('')
      let inner = art

      rules += `.xc${i}{animation:kc${i} 48s infinite;animation-timing-function:cubic-bezier(.42,0,.58,1)}\n@keyframes kc${i}{${frames}}\n`
      for (const [side, dir, x] of [['L', -1, -4], ['R', 1, 28]] as const) {
        if (c.changes.some(ch => ch.dir === dir)) {
          rules += `.b${side}${i}{animation:kb${side}${i} 48s infinite steps(1,end)}\n@keyframes kb${side}${i}{${blinkerFrames(c.changes, dir)}}\n`
          inner += `<g class="b${side}${i}" opacity="0"><rect x="${x}" y="${h - 8}" width="4" height="4" fill="#ffb000"/><rect x="${x}" y="3" width="4" height="4" fill="#ffb000"/></g>`
        }
      }
      out += `<g class="va${i}">${place(`<g class="xc${i}" transform="translate(${c.lane * PITCH} 0)">${inner}</g>`, 0)}</g>`
      vis(`va${i}`, [[tf, tend]], false)
      out += `<g class="vb${i}" opacity="0">${place(art, c.lane)}</g>`
      vis(`vb${i}`, [[tf, tend]], true)
    } else if (jam.has(i)) {
      // A car in the blocked lane: free-flowing normally, queueing behind the crash during the jam.
      const tl = jam.get(i) ?? []
      const frames = tl
        .map(([t, y], k) => {
          const next = tl[k + 1]
          const isJump = next !== undefined && next[1] < y - 900

          return `${pct(t)}%{transform:translateY(${y}px)${isJump ? ';animation-timing-function:steps(1,end)' : ''}}`
        })
        .join('')
      const first = tl[0]
      const last = tl[tl.length - 1]

      out += `<g class="vf${i}">${place(art, 0)}</g>`
      vis(`vf${i}`, [[tc, tend]], false)
      rules += `.j${i}{animation:jt${i} ${CYCLE}s linear infinite}\n@keyframes jt${i}{0%{transform:translateY(${first?.[1] ?? 0}px)}${frames}100%{transform:translateY(${last?.[1] ?? 0}px)}}\n`
      const brake = '<rect x="2" y="-3" width="8" height="5" fill="#ff2a2a"/><rect x="18" y="-3" width="8" height="5" fill="#ff2a2a"/><rect x="0" y="-9" width="28" height="7" fill="#ff2a2a" fill-opacity=".3"/>'

      vis(`bk${i}`, [[tc, DATA.crash.trel + 1]], true)
      out += `<g class="vj${i}" opacity="0"><g transform="translate(${DOWN_L + 6} 0)"><g class="j${i}">${art}<g class="bk${i}" opacity="0">${brake}</g></g></g></g>`
      vis(`vj${i}`, [[tc, tend]], true)
    } else {
      out += place(art, c.lane)
    }
  })
  // Oncoming traffic: three lanes up, one speed per lane, spaced far apart.
  UPS.forEach((c, i) => {
    const body = CIV[(i + 3) % CIV.length] ?? '#888888'
    const period = 36 + c.lane * 4

    rules += `.u${i}{animation-name:tup;animation-duration:${period}s;animation-delay:${delay(c.y0, period)}}\n`
    out += `<g transform="translate(${UP_L + 6 + c.lane * PITCH} 0)"><g class="td u${i}">${car(c.truck ? SEMI : CAR, { B: body, D: body }, false)}${beams(c.truck ? 72 : 40, false)}</g></g>`
  })

  return out
}

// The police chases: each of the five cars is chased across the road every 96 s, staggered, and the
// police stand down while something else is happening on the road.
const chases = (): string => {
  const LAP = 16
  const run = (r: Runner, id: string, rows: string[], colors: Record<string, string>, s: number) => {
    const start = r.keys[0]?.[1] ?? 0
    const frames = r.keys.map(([pc, lane]) => `${pc.toFixed(2)}%{transform:translateX(${lane * PITCH}px)}`).join('')

    rules += `.${id}{animation:m${id} 96s linear infinite;animation-delay:${(s - 96).toFixed(2)}s}\n@keyframes m${id}{0%{transform:translateY(-200px)}${((LAP / 96) * 100).toFixed(3)}%{transform:translateY(1600px)}100%{transform:translateY(1600px)}}\n`
    rules += `.x${id}{animation:k${id} 48s infinite;animation-timing-function:cubic-bezier(.42,0,.58,1)}\n@keyframes k${id}{${frames}}\n`

    return `<g transform="translate(${DOWN_L + 6} 0)"><g class="td ${id}"><g class="x${id}" transform="translate(${start * PITCH} 0)">${car(rows, colors, true)}</g></g></g>`
  }
  let out = ''

  PLAN.police.forEach((r, i) => {
    out += run(r, `p${i}`, POLICE, { B: '#f2f2f2', D: '#1a1a22' }, DATA.pass_start[i]?.p ?? 0)
  })
  PLAN.heroes.forEach((r, i) => {
    const h = HEROES[i % HEROES.length] ?? HEROES[0]

    if (h !== undefined) {
      out += run(r, `h${i}`, h.rows, h.colors, DATA.pass_start[i]?.h ?? 0)
    }
  })
  vis('chasehide', DATA.hide, false, 1.5)

  return `<g class="chasehide">${out}</g>`
}

// ---- the scenarios: every path was planned and checked for overlaps offline ----
const PERSON = ['.HH.', '.HH.', 'VVVV', 'VVVV', 'VVVV', '.JJ.', '.JJ.', '.JJ.']
const POLICE7 = ['.Y...Y.', 'KDDDDDK', 'KDWWWDK', '.DPPQDD', '.BBBBB.', '.BBBBB.', 'KDDWWDK', '.DDDDD.', '.DDDDD.', '.T...T.']
const AMBULANCE = ['.Y...Y.', 'KBBBBBK', 'KBWWWBK', '.BPPQB.', '.BBRBB.', '.BRRRB.', '.BBRBB.', 'KBBBBBK', '.BBBBB.', '.T...T.']
// A flatbed tow truck, facing up: cab at the top, a 40-long bed behind it.
const TOWL = ['.Y...Y.', 'KBBBBBK', 'KBWWWBK', '.BBBBB.', 'KEDDDEK', 'KEDDDEK', 'KEDDDEK', 'KEDDDEK', 'KEDDDEK', 'KEDDDEK', 'KEDDDEK', 'KEDDDEK', 'KEDDDEK', 'KEDDDEK', '.T...T.']
const DEER = ['.........A.A.', '.........AAA.', 'WBBBBBBBBBBH.', 'BBBBBBBBBBBHH', '.BBBBBBBBBBH.', '..L.L...L.L..']
const HAZ = '<g class="hz"><rect x="-4" y="3" width="4" height="4" fill="#ffb000"/><rect x="-4" y="33" width="4" height="4" fill="#ffb000"/><rect x="28" y="3" width="4" height="4" fill="#ffb000"/><rect x="28" y="33" width="4" height="4" fill="#ffb000"/></g>'

const entitySvg = (e: Ent): string => {
  switch (e.kind) {
    case 'car':
      return car(CAR, { B: e.body ?? '#888888' }, true) + (e.hazard ? HAZ : '')
    case 'police':
      return car(POLICE7, { B: '#f2f2f2', D: '#1a1a22' }, true)
    case 'amb':
      return car(AMBULANCE, { B: '#f4f4f4', R: '#d62020' }, true)
    case 'tow':
      return car(TOWL, { B: '#f2c230', D: '#4a4a52', E: '#6a6a74' }, true)
    case 'crewtruck':
      return car(CAR, { B: '#f2c230' }, true) + '<g class="hz"><rect x="10" y="16" width="8" height="8" fill="#ff7a1a"/></g><rect x="1" y="-8" width="26" height="7" fill="#ffb000"/><g class="hz"><path fill="#1a1a22" d="M6 -6h4v2h-4zM12 -6h4v2h-4zM18 -6h4v2h-4z"/></g>'
    case 'person': {
      const p = `<g transform="scale(2)">${sprite(PERSON, { H: '#e0b48a', V: '#ff7a1a', J: '#2a3a5a' })}</g>`

      return e.run ? `<g class="bob">${p}</g>` : p
    }
    case 'deer':
      return `<g class="bob"><g transform="scale(2)">${sprite(DEER, { B: '#9a6b3c', H: '#7a4e28', A: '#d8c8a0', L: '#5a3c20', W: '#f4efe8' })}</g></g>`
    case 'heli':
      return '<ellipse cx="44" cy="46" rx="22" ry="9" fill="#000" fill-opacity=".22"/><rect x="2" y="27" width="24" height="3" fill="#2a3340"/><rect x="22" y="22" width="22" height="12" fill="#3a4a5a"/><rect x="38" y="24" width="8" height="8" fill="#9fe8ff"/><rect x="0" y="24" width="4" height="9" fill="#2a3340"/><g class="rot"><rect x="4" y="27" width="52" height="2" fill="#1a1f26" fill-opacity=".8"/><rect x="29" y="2" width="2" height="52" fill="#1a1f26" fill-opacity=".8"/></g>'
    case 'fire':
      return car(SEMI, { B: '#d62020', L: '#e8e8ec' }, true) + '<g class="hz"><rect x="4" y="1" width="20" height="4" fill="#ffffff"/></g>'
    case 'rager':
      return car(CAR, { B: '#b01016', D: '#111111' }, true) + '<g class="hi"><path fill="url(#hlg)" d="M-2 40L30 40L40 96L-12 96Z"/></g><g class="bob"><rect x="2" y="-18" width="5" height="12" fill="#ff2a2a"/><rect x="2" y="-3" width="5" height="4" fill="#ff2a2a"/><rect x="12" y="-18" width="5" height="12" fill="#ff2a2a"/><rect x="12" y="-3" width="5" height="4" fill="#ff2a2a"/></g>'
    case 'cone':
      return '<rect width="8" height="8" fill="#ff7a1a"/><rect x="2" y="2" width="4" height="4" fill="#ffffff"/>'
    case 'triangle':
      return '<path fill="#e11d1d" d="M8 0h2v2h2v2h2v2h2v2H4V6h2V4h2z"/>'
    default:
      return ''
  }
}

const scenarios = (heli: boolean): string => {
  let out = ''

  Object.entries(DATA.ent).forEach(([id, e]) => {
    if ((e.kind === 'heli') !== heli) {
      return
    }
    const f0 = e.pts[0] ?? []
    const l0 = e.pts[e.pts.length - 1] ?? []

    if (e.pts.length === 2 && f0[1] === l0[1] && f0[2] === l0[2]) {
      vis(`e${id}`, [[f0[0] ?? 0, l0[0] ?? 0]], true)
      out += `<g transform="translate(${f0[1]} ${f0[2]})"><g class="e${id}" opacity="0">${entitySvg(e)}</g></g>`

      return
    }
    follow(`e${id}`, e.pts, e.w, e.h, e.rot)
    out += `<g class="e${id}" opacity="0">${entitySvg(e)}</g>`
  })

  return out
}

// The crash itself: impact flash, smoke and debris over the blocked lane.
const crashScene = (): string => {
  const { tc, tlb, yc } = DATA.crash

  vis('crflash', [[tc, tc + 1.5]], true)
  vis('crsmoke', [[tc, tc + 40]], true)
  vis('crdebris', [[tc, tlb + 3]], true)
  const smoke = [0, 1, 2].map(k => `<rect class="sm" style="animation-delay:${k * 0.8}s" x="${736 + k * 6}" y="${yc - 6}" width="8" height="8"/>`).join('')
  const bits = [
    [724, -6, 5, 3, '#cfd6e0'], [760, 2, 4, 4, '#2f6fbf'], [738, 58, 6, 3, '#d6402f'], [727, 72, 4, 4, '#111111'],
    [752, 64, 5, 3, '#fff7a8'], [744, -9, 3, 3, '#9fe8ff'], [730, 40, 3, 3, '#cfd6e0'], [762, 48, 4, 3, '#d6402f'],
    [734, 84, 5, 3, '#cfd6e0'], [748, 26, 3, 3, '#2f6fbf'], [690, 20, 5, 3, '#cfd6e0'], [712, 60, 4, 3, '#d6402f'],
  ] as const

  return (
    `<g class="crdebris" opacity="0">${bits.map(([x, y, w, h, c]) => `<rect x="${x}" y="${yc + y}" width="${w}" height="${h}" fill="${c}"/>`).join('')}<rect x="754" y="${yc + 78}" width="8" height="8" fill="#15151a"/></g>` +
    `<g class="crflash" opacity="0"><path fill="#fff" d="M746 ${yc + 10}h4v-8h4v8h8v4h-8v8h-4v-8h-8z"/></g><g class="crsmoke" opacity="0">${smoke}</g>`
  )
}

const lamps = (): string => {
  let out = ''

  for (let i = 0; i < 5; i++) {
    const y = 40 + i * 300

    for (const x of [720, 854, 988]) {
      out += `<circle class="glow" cx="${x}" cy="${y}" r="80" fill="url(#lg)"/><rect class="lamp" x="${x - 3}" y="${y - 3}" width="6" height="6"/>`
    }
  }

  return out
}

// Static lane lines: the road does not move, only the cars on it.
const dashes = (): string => {
  let d = ''

  for (const x of [764, 804, 904, 944]) {
    for (let i = -2; i < 26; i++) {
      d += `M${x - 1} ${i * 60}h3v30h-3z`
    }
  }

  return `<path class="dash" d="${d}"/>`
}

// The highway passes under a bridge into farmland, seen from above.
// Horses follow routines: graze, walk, trot, gallop, turn round. Three routines, shared by every horse.
const GAITS: number[][][] = [
  [[60, 30, 14, 7], [25, 125, 60, 2], [55, 80, 26, 9], [0, 0, 26, 4]],
  [[30, 140, 26, 8], [65, 60, 60, 2], [10, 70, 14, 10], [0, 0, 26, 3]],
  [[65, 10, 14, 12], [20, 100, 60, 2], [60, 145, 26, 6], [0, 0, 14, 5]],
]
const GAIT_T: number[] = []

const gaitRules = (): void => {
  GAITS.forEach((legs, k) => {
    let t = 0
    let x = 0
    let y = 0
    const pts: number[][] = [[0, 0, 0]]
    const flips: number[][] = [[0, 1]]

    legs.forEach(([lx = 0, ly = 0, sp = 14, dw = 0]) => {
      flips.push([t, lx >= x ? 1 : -1])
      t += Math.hypot(lx - x, ly - y) / sp
      pts.push([t, lx, ly])
      x = lx
      y = ly
      t += dw
      pts.push([t, lx, ly])
    })
    GAIT_T[k] = t
    const p = (n: number) => ((n / t) * 100).toFixed(3)
    const move = pts.map(([pt = 0, px = 0, py = 0]) => `${p(pt)}%{transform:translate(${px.toFixed(0)}px,${py.toFixed(0)}px)}`).join('')
    const flip = flips.map(([ft = 0, fs = 1]) => `${p(ft)}%{transform:scaleX(${fs})}`).join('')

    rules += `.hp${k}{animation:hp${k} ${t.toFixed(1)}s linear infinite}\n@keyframes hp${k}{${move}}\n.hf{transform-box:fill-box;transform-origin:center}\n.hf${k}{animation:hf${k} ${t.toFixed(1)}s steps(1,end) infinite}\n@keyframes hf${k}{${flip}}\n`
  })
}

const horse = (x: number, y: number, body: string, mane: string, k: number, seed: number): string => {
  const t = GAIT_T[k % 3] ?? 40

  return `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})"><g class="hp${k % 3}" style="animation-delay:-${(seed * t).toFixed(1)}s"><g class="hf hf${k % 3}" style="animation-delay:-${(seed * t).toFixed(1)}s"><rect width="16" height="7" fill="${body}"/><rect x="15" y="-1" width="6" height="5" fill="${body}"/><rect x="14" width="3" height="2" fill="${mane}"/><rect x="-4" y="1" width="4" height="3" fill="${mane}"/><rect x="3" y="1" width="2" height="5" fill="${mane}"/></g></g></g>`
}

const stripes = (x: number, y: number, w: number, h: number, step: number, thick: number): string => {
  let d = ''

  for (let k = 0; y + 6 + k * step + thick < y + h; k++) {
    d += `M${x} ${y + 6 + k * step}h${w}v${thick}h-${w}z`
  }

  return d
}

const farm = (): string => {
  let out = ''
  const top = 1062

  out += `<rect class="f1" x="-2400" y="${top}" width="3600" height="400"/>`
  // Crop rows on the left, a ploughed field beyond.
  out += `<path class="f2" d="${stripes(-2400, top + 2, 2880, 250, 14, 6)}"/>`
  out += `<rect class="f3" x="-2400" y="${top}" width="1000" height="400"/><path class="f3b" d="${stripes(-2400, top, 1000, 250, 14, 5)}"/>`
  // A hedgerow along the top edge.
  let hedge = ''
  let hedge2 = ''

  for (let i = -60; i < 26; i++) {
    hedge += `M${i * 28} ${top + 2}h24v12h-24z`
    hedge2 += `M${i * 28 + 5} ${top + 4}h10v6h-10z`
  }
  out += `<path class="tree" d="${hedge}"/><path class="tree2" d="${hedge2}"/>`
  // Hay bales and a yard lamp.
  for (const [x, y] of [[735, 1140], [1000, 1150], [-300, 1180], [-340, 1200], [-120, 1250]] as const) {
    out += `<circle class="hay" cx="${x}" cy="${y}" r="9"/><circle class="hay2" cx="${x}" cy="${y}" r="4"/>`
  }
  // A tractor working the rows.
  out += `<g class="tractor"><rect x="0" y="0" width="22" height="12" fill="#2f8a3a"/><rect x="14" y="2" width="6" height="8" fill="#9fe8ff"/><rect x="2" y="-3" width="8" height="4" fill="#111"/><rect x="2" y="11" width="8" height="4" fill="#111"/><rect x="16" y="-2" width="5" height="3" fill="#111"/><rect x="16" y="11" width="5" height="3" fill="#111"/></g>`

  return out
}

const falling = (kind: 'rain' | 'snow'): string => {
  const step = kind === 'rain' ? 120 : 90
  let d = ''

  for (let row = -1; row < 1400 / step + 1; row++) {
    for (let k = 0; k < 8; k++) {
      const x = 560 + ((k * 61) % 14) * 62 + (k % 3) * 9
      const y = row * step + ((k * 47) % step)

      d += kind === 'rain' ? `M${x} ${y}h2v12h-2z` : `M${x} ${y}h3v3h-3z`
    }
  }

  return `<g class="${kind}"><path d="${d}"/></g>`
}

// Farmland fills the whole left side of the road: a patchwork of fields, pastures and woods.
// Each cell is a few merged paths to keep the scene small.
const hash = (n: number): number => ((n * 2654435761) >>> 0) % 1000 / 1000

const patchwork = (): string => {
  const W = 300
  const H = 260
  let out = ''

  for (let cx = 0; cx < 4; cx++) {
    for (let cy = 0; cy < 5; cy++) {
      const x = -760 + cx * W
      const y = cy * H
      const r = hash(cx * 7 + cy * 13 + 3)

      if (r < 0.3) {
        out += `<rect class="f1" x="${x}" y="${y}" width="${W}" height="${H}"/><path class="f2" d="${stripes(x, y, W, H, 44, 14)}"/>`
      } else if (r < 0.52) {
        out += `<rect class="f3" x="${x}" y="${y}" width="${W}" height="${H}"/><path class="f3b" d="${stripes(x, y, W, H, 44, 12)}"/>`
      } else if (r < 0.78) {
        let posts = ''

        for (let i = 0; i <= W; i += 24) {
          posts += `M${x + i} ${y}h4v4h-4zM${x + i} ${y + H - 4}h4v4h-4z`
        }
        for (let j = 0; j <= H; j += 24) {
          posts += `M${x} ${y + j}h4v4h-4zM${x + W - 4} ${y + j}h4v4h-4z`
        }
        out += `<rect class="pas" x="${x}" y="${y}" width="${W}" height="${H}"/><path class="fence" d="${posts}"/>`
        out += horse(x + 20, y + 16, '#8a4b24', '#3a2010', cx + cy, hash(cx * 3 + cy))
      } else {
        let trees = ''

        for (let i = 0; i < 6; i++) {
          trees += `M${x + 8 + ((i * 53) % 210)} ${y + 8 + ((i * 37) % 170)}h22v22h-22z`
        }
        out += `<rect class="f1" x="${x}" y="${y}" width="${W}" height="${H}"/><path class="tree" d="${trees}"/>`
      }
    }
  }
  return out
}

// The road runs into a tunnel under a hill at the top and another at the bottom, so it fills the window.
const tunnels = (): string => {
  let trees = ''

  for (let i = 0; i < 26; i++) {
    const x = 656 + hash(i + 3) * 340
    const y = i % 2 === 0 ? 2 + hash(i * 7 + 1) * 14 : 1276 + hash(i * 5 + 2) * 14

    trees += `M${x.toFixed(0)} ${y.toFixed(0)}h14v14h-14z`
  }

  return (
    '<rect class="hill" x="650" y="-4000" width="372" height="4020"/><rect class="hill" x="650" y="1270" width="372" height="2400"/>' +
    `<path class="hillt" d="${trees}"/>` +
    '<rect class="mouth" x="684" y="8" width="318" height="12"/><rect class="lip" x="680" y="20" width="326" height="8"/>' +
    '<rect class="lip" x="680" y="1262" width="326" height="8"/><rect class="mouth" x="684" y="1270" width="318" height="14"/>'
  )
}

// An overhead highway sign drifts down the road now and then, showing the live weather. Only the weather
// words and the temperature are in it (not the clock), so the scene is redrawn only when those change.
export type Season = 'spring' | 'summer' | 'fall' | 'winter'

// An electronic message sign over the road, in amber lights on black. It cycles through short pages
// (weather, date and time, chat stats). Each page is up to three lines; the pages are built by the caller.
const gantry = (pages: string[][]): string => {
  const n = pages.length

  if (n === 0) {
    return ''
  }
  const STEP = 5
  const cx = 854
  const top = 100
  const on = (100 / n - 0.01).toFixed(4)

  rules += `.gp{opacity:0;animation:gpg ${STEP * n}s linear infinite}\n@keyframes gpg{0%,${on}%{opacity:1}${(100 / n).toFixed(4)}%,100%{opacity:0}}\n`
  let out =
    `<g transform="translate(0 ${top})"><rect x="724" y="-8" width="260" height="6" fill="#7b7f88"/><rect x="724" y="-8" width="6" height="30" fill="#6a6e78"/><rect x="978" y="-8" width="6" height="30" fill="#6a6e78"/>` +
    `<rect x="${cx - 104}" y="-2" width="208" height="76" fill="#000" fill-opacity=".2"/><rect x="${cx - 108}" y="2" width="216" height="76" fill="#3a3d46"/><rect x="${cx - 105}" y="5" width="210" height="70" fill="#07070a"/>`

  pages.forEach((lines, i) => {
    const h = lines.length * 15 + (lines.length - 1) * 6
    const y0 = 40 - h / 2
    let g = ''

    lines.forEach((line, j) => {
      const t = text(line, 3, '#ffa91f')

      g += `<g transform="translate(${(cx - t.width / 2).toFixed(0)} ${(y0 + j * 21).toFixed(0)})">${t.svg}</g>`
    })
    out += `<g class="gp gp${i}">${g}</g>`
    rules += `.gp${i}{animation-delay:${i * STEP}s}\n`
  })

  return `${out}</g>`
}

// Wet-road reflections under the lamps, only in rain and storms.
const puddles = (): string => {
  let out = ''

  for (let i = 0; i < 5; i++) {
    for (const x of [736, 780, 904, 948]) {
      out += `<rect class="wet" x="${x}" y="${40 + i * 300 + 20}" width="14" height="120" fill="url(#wetg)"/>`
    }
  }

  return out
}

export const buildHighway = (phase: Phase = 'day', wx: Weather = 'clear', pages: string[][] = [], season: Season = 'summer'): string => {
  rules = ''
  gaitRules()
  const sign = gantry(pages)
  const cars = traffic() + chases()
  const land = patchwork()
  const scenes = scenarios(false) + crashScene()
  const heli = scenarios(true)
  const weather = wx === 'rain' || wx === 'storm' ? falling('rain') : wx === 'snow' ? falling('snow') : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" class="p-${phase} w-${wx} s-${season}" viewBox="430 0 1000 1300" preserveAspectRatio="xMaxYMid meet" shape-rendering="crispEdges">
<defs>
<linearGradient id="hlg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3b0" stop-opacity=".7"/><stop offset="1" stop-color="#fff3b0" stop-opacity="0"/></linearGradient><linearGradient id="hlu" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff3b0" stop-opacity=".7"/><stop offset="1" stop-color="#fff3b0" stop-opacity="0"/></linearGradient><linearGradient id="wetg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9a0" stop-opacity=".5"/><stop offset="1" stop-color="#ffe9a0" stop-opacity="0"/></linearGradient>
<linearGradient id="dg" gradientUnits="userSpaceOnUse" x1="560" y1="0" x2="676" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".6"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
<linearGradient id="vg" gradientUnits="userSpaceOnUse" x1="560" y1="0" x2="676" y2="0"><stop offset="0" class="vgs" stop-opacity="0"/><stop offset="1" class="vgs" stop-opacity="1"/></linearGradient>
<radialGradient id="lg"><stop offset="0" stop-color="#ffe9a0" stop-opacity=".5"/><stop offset="1" stop-color="#ffe9a0" stop-opacity="0"/></radialGradient>
</defs>
<style>
.vgs{stop-color:#6b9e5e}.grass2{fill:#6b9e5e}
.road{fill:#58585f}.shld{fill:#6a6a72}.med{fill:#7f8a78}.edge{fill:#e8e8e8}.yel{fill:#e0b020}.dash{fill:#f0f0f0;fill-opacity:.7}
.glow{opacity:0}.lamp{fill:#8a8a92}.veil{fill:#f7f4ee;fill-opacity:.12}.wx{fill-opacity:0}
.deck{fill:#b9bcc4}.deck2{fill:#8f939c}.rl{fill:#e8e8ec}
.hl{opacity:0}.p-dusk .hl{opacity:.4}.p-night .hl{opacity:.85}.hi{animation:hif .8s steps(1) infinite}@keyframes hif{0%{opacity:1}50%{opacity:.15}}.wet{opacity:0}.w-rain .wet,.w-storm .wet{opacity:.55}
.s-fall .tree,.s-fall .hillt{fill:#9a5a1e}.s-fall .tree2{fill:#d98a2b}.s-fall .f1{fill:#a3a45a}.s-fall .f2{fill:#8f9150}.s-fall .grass2,.s-fall .vgs{fill:#8fa052;stop-color:#8fa052}
.s-winter .tree,.s-winter .hillt{fill:#5a5a52}.s-winter .tree2{fill:#7a7a70}.s-winter .f1{fill:#8d9b7c}.s-winter .f2{fill:#7d8b6c}
.s-spring .tree2{fill:#f0b8d0}.s-spring .f1{fill:#8cc060}.s-spring .f2{fill:#7ab050}
.dim{fill:#000;fill-opacity:.6}.hill{fill:#5d8450}.hillt{fill:#3f6b3a}.lip{fill:#c4c7cf}.mouth{fill:#06070a}
.p-night .hill{fill:#122418}.p-night .hillt{fill:#0b1a10}.p-night .lip{fill:#4a4c55}.p-dusk .hill{fill:#46663f}
.f1{fill:#7fb05a}.f2{fill:#6f9f4c}.f3{fill:#8b6a48}.f3b{fill:#755736}.pas{fill:#8ec06a}.dirt{fill:#b59a6b}.shade{fill:#000;fill-opacity:.18}
.meadow{fill:#7da05a}.pine{fill:#2f4a32}.pine2{fill:#3f6140}.pine3{fill:#25402a}.field{fill:#b8a07a}.bare{fill:#6e5a48}.gravel{fill:#bab6a8}.sand{fill:#cdb78f}.roofw{fill:#e9e9e7}.roofg{fill:#8f939c}.bshade{fill:#000;fill-opacity:.2}.ridge2{fill:#b8bac0}.rd2{fill:#bfae92}.edge2{fill:#9a8a70}.fenceline{fill:#ece6d4}
.roofA{fill:#b0402f}.roofB{fill:#8f3225}.ridge{fill:#6f261c}.roofL{fill:#000;fill-opacity:.14}.fence{fill:#e8e2d0}.rail{fill:#d8d0b8}
.hay{fill:#d8b24a}.hay2{fill:#b08a2c}.tree{fill:#3f7a3a}.tree2{fill:#5fa055}
.p-dusk .vgs,.p-dusk .grass2{fill:#4a6a44;stop-color:#4a6a44}.p-dusk .road{fill:#3d3d46}.p-dusk .shld{fill:#4a4a52}.p-dusk .med{fill:#5d6659}.p-dusk .edge{fill:#b0b0b8}.p-dusk .yel{fill:#b8901a}
.p-dusk .glow{opacity:.6}.p-dusk .lamp{fill:#ffd27a}.p-dusk .veil{fill:#ff9a5a;fill-opacity:.16}
.p-dusk .f1{fill:#5a8040}.p-dusk .f2{fill:#4f7238}.p-dusk .pas{fill:#648f4a}.p-dusk .dirt{fill:#8a7550}
.p-night .vgs,.p-night .grass2{fill:#112417;stop-color:#112417}.p-night .road{fill:#1b1b21}.p-night .shld{fill:#24242b}.p-night .med{fill:#232a22}.p-night .edge{fill:#8a8a90}.p-night .yel{fill:#8a6a10}.p-night .dash{fill:#cfcfd4;fill-opacity:.5}
.p-night .glow{opacity:1}.p-night .lamp{fill:#ffe9a0}.p-night .veil{fill:#0d0e12;fill-opacity:.12}
.p-night .deck{fill:#4a4c55}.p-night .deck2{fill:#2e3038}.p-night .rl{fill:#8a8c96}
.p-night .f1{fill:#14301c}.p-night .f2{fill:#102a18}.p-night .f3{fill:#2a2018}.p-night .f3b{fill:#201810}.p-night .pas{fill:#183a22}.p-night .dirt{fill:#2b2519}
.p-night .meadow{fill:#16301c}.p-night .pine{fill:#0b180f}.p-night .pine2{fill:#112316}.p-night .pine3{fill:#08120c}.p-night .field{fill:#2c2519}.p-night .bare{fill:#1c1710}.p-night .gravel{fill:#2f2f31}.p-night .sand{fill:#34302a}.p-night .roofw{fill:#5a5b60}.p-night .roofg{fill:#34363c}.p-night .ridge2{fill:#46484e}.p-night .rd2{fill:#2c2a26}.p-night .edge2{fill:#242220}.p-night .fenceline{fill:#6b6a64}
.p-night .roofA{fill:#4a1a16}.p-night .roofB{fill:#3a1410}.p-night .ridge{fill:#2a0e0a}.p-night .fence{fill:#6b6a64}.p-night .rail{fill:#55544e}
.p-night .hay{fill:#6b5a24}.p-night .hay2{fill:#4a3d18}.p-night .tree{fill:#0c1c10}.p-night .tree2{fill:#173321}
.w-cloudy .wx{fill:#6b7480;fill-opacity:.16}.w-fog .wx{fill:#e6e9ee;fill-opacity:.42}.p-night.w-fog .wx{fill:#2a2f38;fill-opacity:.4}
.w-rain .wx{fill:#4b5563;fill-opacity:.2}.w-storm .wx{fill:#2b3340;fill-opacity:.36}
.w-snow .vgs,.w-snow .grass2,.w-snow .f1{fill:#e6eef2;stop-color:#e6eef2}.w-snow .f2{fill:#d4e0e8}.w-snow .pas{fill:#eef4f7}.w-snow .meadow{fill:#e4edf1}.w-snow .field{fill:#e8eef0}.w-snow .pine3{fill:#2a4630}.w-snow .tree{fill:#c9d6de}.w-snow .tree2{fill:#f4f8fa}
.rain path{fill:#bcd2e8;fill-opacity:.55}.snow path{fill:#ffffff;fill-opacity:.85}
.rain{animation:fall 0.8s linear infinite}.snow{animation:drift 4s linear infinite}
.td{animation-timing-function:linear;animation-iteration-count:infinite}
.pr{animation:fa 1s steps(1) infinite;fill:#ff2a2a}.pq{animation:fb 1s steps(1) infinite;fill:#2a6bff}
.hz{animation:hzf 1s steps(1) infinite}.sm{fill:#c9ccd2;animation:smoke 2.4s linear infinite;opacity:0}
.tractor{animation:plow 50s ease-in-out infinite alternate}.bob{animation:bob .35s ease-in-out infinite alternate}.rot{transform-box:fill-box;transform-origin:center;animation:spinr .35s linear infinite}
@keyframes tdown{from{transform:translateY(-200px)}to{transform:translateY(1600px)}}
@keyframes tup{from{transform:translateY(1600px)}to{transform:translateY(-200px)}}
@keyframes fa{0%{fill:#ff2a2a}50%{fill:#2a6bff}}
@keyframes fb{0%{fill:#2a6bff}50%{fill:#ff2a2a}}
@keyframes hzf{0%{opacity:1}50%{opacity:.1}}
@keyframes smoke{0%{opacity:.7;transform:translateY(0)}100%{opacity:0;transform:translateY(-34px)}}
@keyframes bob{from{transform:translateY(0)}to{transform:translateY(-1.5px)}}
@keyframes spinr{to{transform:rotate(360deg)}}
@keyframes plow{from{transform:translate(-1900px,1130px)}to{transform:translate(-700px,1130px)}}
@keyframes fall{from{transform:translateY(0)}to{transform:translateY(120px)}}
@keyframes drift{from{transform:translate(0,0)}to{transform:translate(18px,90px)}}
${rules}</style>
<rect class="f1" x="-6000" y="-6000" width="6700" height="14000"/>
${land}
<rect class="dim" x="-6000" y="-6000" width="6560" height="14000"/><rect x="560" y="-6000" width="116" height="14000" fill="url(#dg)"/>
<rect x="560" y="-4000" width="3000" height="9000" fill="url(#vg)"/>
<rect class="grass2" x="676" y="-4000" width="3000" height="9000"/>
<rect class="shld" x="680" y="-4000" width="42" height="9000"/>
<rect class="road" x="722" y="-4000" width="262" height="9000"/>
<rect class="med" x="844" y="-4000" width="20" height="9000"/>
<rect class="edge" x="721" y="-4000" width="3" height="9000"/>
<rect class="edge" x="983" y="-4000" width="3" height="9000"/>
<rect class="yel" x="842" y="-4000" width="3" height="9000"/>
<rect class="yel" x="863" y="-4000" width="3" height="9000"/>
${dashes()}
${lamps()}
${scenes}
${cars}
${puddles()}
${sign}
${tunnels()}
${heli}
${weather}
<rect class="wx" x="-4000" y="-4000" width="9000" height="9000"/>
<rect class="veil" x="-4000" y="-4000" width="9000" height="9000"/>
</svg>`
}

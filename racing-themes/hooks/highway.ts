// Top-down highway, three lanes each way, for Chapel Hill's real time of day and weather.
// The road itself is still; only the cars, incidents and farm animals move. The traffic merges,
// the five chases and the police were planned offline and re-checked at a fine time step with the
// real easing: no two cars ever overlap (closest gap about 17 units). Do not edit PLAN by hand.

export type Phase = 'day' | 'dusk' | 'night'
export type Weather = 'clear' | 'cloudy' | 'fog' | 'rain' | 'storm' | 'snow'

type Keys = [number, number][]
type Traffic = { x0: number; lane: number; len: number; kind: string; keys: Keys | null; keys288?: [number, number][]; changes: { t: number; dir: number }[] }
type Runner = { x0: number; keys: Keys }

type Pt = [number, number, number]
type Path = { pts: Pt[]; h?: number; t_stop?: number }
const DATA: {
  plan: { traffic: Traffic[]; heroes: Runner[]; police: Runner[] }
  ytl: [number, number][][]
  phi: [number, number][]
  Vc: number
  tfreeze: number
  yc: number
  tc: number
  t_clear: number
  bd: { pts: Pt[]; t_stop: number; y_stop: number; t_load: number }
  tow1: { pts: Pt[] }
  resp: Record<string, Path>
} = {"plan": {"traffic": [{"x0": 1670.9, "lane": 0, "len": 72, "kind": "truck", "keys": null, "changes": []}, {"x0": 361.8, "lane": 0, "len": 40, "kind": "car", "keys": null, "changes": []}, {"x0": 748.6, "lane": 0, "len": 40, "kind": "car", "keys": null, "changes": []}, {"x0": 1251.3, "lane": 0, "len": 40, "kind": "car", "keys": null, "changes": []}, {"x0": 558.2, "lane": 1, "len": 40, "kind": "car", "keys": [[0.0, 1], [38.021, 1], [40.104, 2], [78.125, 2], [80.208, 1], [100.0, 1]], "changes": [{"t": 18.25, "dir": 1}, {"t": 37.5, "dir": -1}, {"t": 66.25, "dir": 1}, {"t": 85.5, "dir": -1}, {"t": 114.25, "dir": 1}, {"t": 133.5, "dir": -1}, {"t": 162.25, "dir": 1}, {"t": 181.5, "dir": -1}], "keys288": [[0.0, 1], [18.25, 1], [19.25, 2], [37.5, 2], [38.5, 1], [48.0, 1], [66.25, 1], [67.25, 2], [85.5, 2], [86.5, 1], [96.0, 1], [114.25, 1], [115.25, 2], [133.5, 2], [134.5, 1], [144.0, 1], [162.25, 1], [163.25, 2], [181.5, 2], [182.5, 1], [192.0, 1], [197.5, 1], [288, 1]]}, {"x0": 1084.2, "lane": 1, "len": 72, "kind": "truck", "keys": [[0.0, 1], [30.208, 1], [32.292, 0], [80.208, 0], [82.292, 1], [100.0, 1]], "changes": [{"t": 14.5, "dir": -1}, {"t": 38.5, "dir": 1}, {"t": 62.5, "dir": -1}, {"t": 86.5, "dir": 1}, {"t": 110.5, "dir": -1}, {"t": 134.5, "dir": 1}, {"t": 158.5, "dir": -1}, {"t": 182.5, "dir": 1}], "keys288": [[0.0, 1], [14.5, 1], [15.5, 0], [38.5, 0], [39.5, 1], [48.0, 1], [62.5, 1], [63.5, 0], [86.5, 0], [87.5, 1], [96.0, 1], [110.5, 1], [111.5, 0], [134.5, 0], [135.5, 1], [144.0, 1], [158.5, 1], [159.5, 0], [182.5, 0], [183.5, 1], [192.0, 1], [197.5, 1], [288, 1]]}, {"x0": 1510.3, "lane": 1, "len": 40, "kind": "car", "keys": [[0.0, 1], [22.917, 1], [25.0, 0], [76.042, 0], [78.125, 1], [100.0, 1]], "changes": [{"t": 11.0, "dir": -1}, {"t": 36.5, "dir": 1}, {"t": 59.0, "dir": -1}, {"t": 84.5, "dir": 1}, {"t": 107.0, "dir": -1}, {"t": 132.5, "dir": 1}, {"t": 155.0, "dir": -1}, {"t": 180.5, "dir": 1}], "keys288": [[0.0, 1], [11.0, 1], [12.0, 0], [36.5, 0], [37.5, 1], [48.0, 1], [59.0, 1], [60.0, 0], [84.5, 0], [85.5, 1], [96.0, 1], [107.0, 1], [108.0, 0], [132.5, 0], [133.5, 1], [144.0, 1], [155.0, 1], [156.0, 0], [180.5, 0], [181.5, 1], [192.0, 1], [197.5, 1], [288, 1]]}, {"x0": 166.1, "lane": 1, "len": 40, "kind": "car", "keys": [[0.0, 1], [40.625, 1], [42.708, 0], [65.104, 0], [67.188, 1], [100.0, 1]], "changes": [{"t": 19.5, "dir": -1}, {"t": 31.25, "dir": 1}, {"t": 67.5, "dir": -1}, {"t": 79.25, "dir": 1}, {"t": 115.5, "dir": -1}, {"t": 127.25, "dir": 1}, {"t": 163.5, "dir": -1}, {"t": 175.25, "dir": 1}], "keys288": [[0.0, 1], [19.5, 1], [20.5, 0], [31.25, 0], [32.25, 1], [48.0, 1], [67.5, 1], [68.5, 0], [79.25, 0], [80.25, 1], [96.0, 1], [115.5, 1], [116.5, 0], [127.25, 0], [128.25, 1], [144.0, 1], [163.5, 1], [164.5, 0], [175.25, 0], [176.25, 1], [192.0, 1], [197.5, 1], [288, 1]]}, {"x0": 410.2, "lane": 2, "len": 72, "kind": "truck", "keys": null, "changes": []}, {"x0": 843.0, "lane": 2, "len": 40, "kind": "car", "keys": null, "changes": []}, {"x0": 1300.4, "lane": 2, "len": 40, "kind": "car", "keys": null, "changes": []}, {"x0": 1757.7, "lane": 2, "len": 72, "kind": "truck", "keys": null, "changes": []}], "heroes": [{"x0": 1764.2, "keys": [[0.0, 1], [2.083, 1], [4.167, 2], [8.854, 2], [10.938, 1], [13.021, 1], [15.104, 0], [18.229, 0], [20.312, 1], [23.438, 1], [25.521, 0], [27.604, 1], [29.688, 2], [33.333, 2], [35.417, 1], [39.062, 1], [41.146, 2], [46.354, 2], [48.438, 1], [52.083, 1], [54.167, 2], [58.854, 2], [60.938, 1], [63.021, 1], [65.104, 0], [68.229, 0], [70.312, 1], [73.438, 1], [75.521, 0], [77.604, 1], [79.688, 2], [83.333, 2], [85.417, 1], [89.062, 1], [91.146, 2], [96.354, 2], [98.438, 1], [100.0, 1]]}, {"x0": 397.3, "keys": [[0.0, 1], [0.521, 1], [2.604, 0], [6.25, 0], [8.333, 1], [10.938, 1], [13.021, 0], [15.104, 1], [17.188, 2], [21.354, 2], [23.438, 1], [27.083, 1], [29.167, 2], [33.854, 2], [35.938, 1], [40.104, 1], [42.188, 2], [46.875, 2], [48.958, 1], [50.521, 1], [52.604, 0], [56.25, 0], [58.333, 1], [60.938, 1], [63.021, 0], [65.104, 1], [67.188, 2], [71.354, 2], [73.438, 1], [77.083, 1], [79.167, 2], [83.854, 2], [85.938, 1], [90.104, 1], [92.188, 2], [96.875, 2], [98.958, 1], [100.0, 1]]}, {"x0": 738.6, "keys": [[0.0, 1], [1.562, 1], [3.646, 0], [5.729, 1], [7.812, 2], [11.979, 2], [14.062, 1], [17.708, 1], [19.792, 2], [24.479, 2], [26.562, 1], [30.208, 1], [32.292, 0], [35.938, 0], [38.021, 1], [41.146, 1], [43.229, 0], [46.354, 0], [48.438, 1], [51.562, 1], [53.646, 0], [55.729, 1], [57.812, 2], [61.979, 2], [64.062, 1], [67.708, 1], [69.792, 2], [74.479, 2], [76.562, 1], [80.208, 1], [82.292, 0], [85.938, 0], [88.021, 1], [91.146, 1], [93.229, 0], [96.354, 0], [98.438, 1], [100.0, 1]]}, {"x0": 1056.6, "keys": [[0.0, 2], [3.125, 2], [5.208, 1], [8.854, 1], [10.938, 2], [15.625, 2], [17.708, 1], [21.354, 1], [23.438, 0], [27.083, 0], [29.167, 1], [32.292, 1], [34.375, 0], [37.5, 0], [39.583, 1], [42.708, 1], [44.792, 0], [46.875, 1], [48.958, 2], [53.125, 2], [55.208, 1], [58.854, 1], [60.938, 2], [65.625, 2], [67.708, 1], [71.354, 1], [73.438, 0], [77.083, 0], [79.167, 1], [82.292, 1], [84.375, 0], [87.5, 0], [89.583, 1], [92.708, 1], [94.792, 0], [96.875, 1], [98.958, 2], [100.0, 2]]}, {"x0": 1424.3, "keys": [[0.0, 2], [5.729, 2], [7.812, 1], [11.458, 1], [13.542, 2], [18.229, 2], [20.312, 1], [22.396, 1], [24.479, 0], [27.604, 0], [29.688, 1], [32.812, 1], [34.896, 0], [36.979, 1], [39.062, 2], [42.708, 2], [44.792, 1], [48.438, 1], [50.521, 2], [55.729, 2], [57.812, 1], [61.458, 1], [63.542, 2], [68.229, 2], [70.312, 1], [72.396, 1], [74.479, 0], [77.604, 0], [79.688, 1], [82.812, 1], [84.896, 0], [86.979, 1], [89.062, 2], [92.708, 2], [94.792, 1], [97.917, 1], [100.0, 2]]}], "police": [{"x0": 1594.2, "keys": [[0.0, 2], [2.083, 1], [6.771, 1], [8.854, 2], [11.979, 2], [14.062, 1], [17.188, 1], [19.271, 0], [22.396, 0], [24.479, 1], [30.729, 1], [32.812, 2], [38.021, 2], [40.104, 1], [43.229, 1], [45.312, 2], [49.479, 2], [51.562, 1], [56.771, 1], [58.854, 2], [61.979, 2], [64.062, 1], [67.188, 1], [69.271, 0], [72.396, 0], [74.479, 1], [80.729, 1], [82.812, 2], [88.021, 2], [90.104, 1], [93.229, 1], [95.312, 2], [100.0, 2]]}, {"x0": 227.3, "keys": [[0.0, 2], [2.083, 1], [5.208, 1], [7.292, 0], [10.417, 0], [12.5, 1], [18.75, 1], [20.833, 2], [26.042, 2], [28.125, 1], [31.25, 1], [33.333, 2], [36.979, 2], [39.062, 1], [44.792, 1], [46.875, 2], [50.0, 2], [52.083, 1], [55.208, 1], [57.292, 0], [60.417, 0], [62.5, 1], [68.75, 1], [70.833, 2], [76.042, 2], [78.125, 1], [81.25, 1], [83.333, 2], [86.979, 2], [89.062, 1], [94.792, 1], [96.875, 2], [100.0, 2]]}, {"x0": 568.6, "keys": [[0.0, 0], [1.042, 0], [3.125, 1], [8.854, 1], [10.938, 2], [16.667, 2], [18.75, 1], [21.875, 1], [23.958, 2], [27.604, 2], [29.688, 1], [33.333, 1], [35.417, 0], [40.104, 0], [42.188, 1], [45.833, 1], [47.917, 0], [51.042, 0], [53.125, 1], [58.854, 1], [60.938, 2], [66.667, 2], [68.75, 1], [71.875, 1], [73.958, 2], [77.604, 2], [79.688, 1], [83.333, 1], [85.417, 0], [90.104, 0], [92.188, 1], [95.833, 1], [97.917, 0], [100.0, 0]]}, {"x0": 886.6, "keys": [[0.0, 1], [2.083, 2], [7.812, 2], [9.896, 1], [13.021, 1], [15.104, 2], [18.75, 2], [20.833, 1], [24.479, 1], [26.562, 0], [31.25, 0], [33.333, 1], [36.979, 1], [39.062, 0], [42.188, 0], [44.271, 1], [50.0, 1], [52.083, 2], [57.812, 2], [59.896, 1], [63.021, 1], [65.104, 2], [68.75, 2], [70.833, 1], [74.479, 1], [76.562, 0], [81.25, 0], [83.333, 1], [86.979, 1], [89.062, 0], [92.188, 0], [94.271, 1], [100.0, 1]]}, {"x0": 1254.3, "keys": [[0.0, 1], [2.604, 1], [4.688, 2], [8.854, 2], [10.938, 1], [16.146, 1], [18.229, 2], [21.354, 2], [23.438, 1], [26.562, 1], [28.646, 0], [32.292, 0], [34.375, 1], [40.104, 1], [42.188, 2], [47.396, 2], [49.479, 1], [52.604, 1], [54.688, 2], [58.854, 2], [60.938, 1], [66.146, 1], [68.229, 2], [71.354, 2], [73.438, 1], [76.562, 1], [78.646, 0], [82.292, 0], [84.375, 1], [90.104, 1], [92.188, 2], [97.396, 2], [99.479, 1], [100.0, 1]]}]}, "ytl": [[[0.0, 1470.9], [3.443, 1600.0], [3.453, -200.0], [51.443, 1600.0], [51.453, -200.0], [99.443, 1600.0], [99.453, -200.0], [147.443, 1600.0], [147.453, -200.0], [195.443, 1600.0], [195.453, -200.0], [205.5, 177.1], [205.5, 177.1], [205.927, 192.6], [206.353, 207.1], [206.779, 220.6], [207.206, 233.1], [207.632, 244.6], [208.059, 255.1], [208.486, 264.6], [208.912, 273.1], [209.338, 280.6], [209.765, 287.1], [210.191, 292.6], [210.618, 297.1], [211.044, 300.6], [211.471, 303.1], [211.897, 304.6], [212.324, 305.1], [212.324, 305.1], [255.5, 305.1], [255.5, 305.1], [256.0, 305.7], [256.5, 307.7], [257.0, 310.9], [257.5, 315.3], [258.0, 321.1], [258.5, 328.1], [259.0, 336.4], [259.5, 346.0], [260.0, 356.9], [260.5, 369.0], [261.0, 382.4], [261.5, 397.1], [262.0, 413.1], [262.5, 430.4], [263.0, 448.9], [263.5, 468.7], [263.5, 468.7], [288, 1470.9]], [[0.0, 161.8], [38.352, 1600.0], [38.362, -200.0], [86.352, 1600.0], [86.362, -200.0], [134.352, 1600.0], [134.362, -200.0], [182.352, 1600.0], [182.362, -200.0], [205.5, 668.1], [205.5, 668.1], [205.927, 683.5], [206.353, 698.0], [206.779, 711.5], [207.206, 724.0], [207.632, 735.5], [208.059, 746.0], [208.486, 755.5], [208.912, 764.0], [209.338, 771.5], [209.765, 778.0], [210.191, 783.5], [210.618, 788.0], [211.044, 791.5], [211.471, 794.0], [211.897, 795.5], [212.324, 796.0], [212.324, 796.0], [255.5, 796.0], [255.5, 796.0], [256.0, 796.6], [256.5, 798.6], [257.0, 801.8], [257.5, 806.2], [258.0, 812.0], [258.5, 819.0], [259.0, 827.3], [259.5, 836.9], [260.0, 847.8], [260.5, 859.9], [261.0, 873.3], [261.5, 888.0], [262.0, 904.0], [262.5, 921.3], [263.0, 939.8], [263.5, 959.6], [263.5, 959.6], [279.155, 1600.0], [279.165, -200.0], [288, 161.8]], [[0.0, 548.6], [28.037, 1600.0], [28.047, -200.0], [76.037, 1600.0], [76.047, -200.0], [124.037, 1600.0], [124.047, -200.0], [172.037, 1600.0], [172.047, -200.0], [205.5, 1054.9], [205.5, 1054.9], [205.927, 1070.3], [206.353, 1084.8], [206.779, 1098.3], [207.206, 1110.8], [207.632, 1122.3], [208.059, 1132.8], [208.486, 1142.3], [208.912, 1150.8], [209.338, 1158.3], [209.765, 1164.8], [210.191, 1170.3], [210.618, 1174.8], [211.044, 1178.3], [211.471, 1180.8], [211.897, 1182.3], [212.324, 1182.8], [212.324, 1182.8], [255.5, 1182.8], [255.5, 1182.8], [256.0, 1183.4], [256.5, 1185.4], [257.0, 1188.6], [257.5, 1193.0], [258.0, 1198.8], [258.5, 1205.8], [259.0, 1214.1], [259.5, 1223.7], [260.0, 1234.6], [260.5, 1246.7], [261.0, 1260.1], [261.5, 1274.8], [262.0, 1290.8], [262.5, 1308.1], [263.0, 1326.6], [263.5, 1346.4], [263.5, 1346.4], [269.699, 1600.0], [269.709, -200.0], [288, 548.6]], [[0.0, 1051.3], [14.632, 1600.0], [14.642, -200.0], [62.632, 1600.0], [62.642, -200.0], [110.632, 1600.0], [110.642, -200.0], [158.632, 1600.0], [158.642, -200.0], [205.5, 1557.5], [205.5, 1557.5], [205.927, 1573.0], [206.353, 1587.5], [206.747, 1600.0], [206.757, -200.0], [206.779, -199.0], [207.206, -186.5], [207.632, -175.0], [208.059, -164.5], [208.486, -155.0], [208.912, -146.5], [209.338, -139.0], [209.765, -132.5], [210.191, -127.0], [210.618, -122.5], [211.044, -119.0], [211.471, -116.5], [211.897, -115.0], [212.324, -114.5], [212.324, -114.5], [255.5, -114.5], [255.5, -114.5], [256.0, -113.9], [256.5, -111.9], [257.0, -108.7], [257.5, -104.3], [258.0, -98.5], [258.5, -91.5], [259.0, -83.2], [259.5, -73.6], [260.0, -62.7], [260.5, -50.6], [261.0, -37.2], [261.5, -22.5], [262.0, -6.5], [262.5, 10.8], [263.0, 29.3], [263.5, 49.1], [263.5, 49.1], [288, 1051.3]], [[0.0, 358.2], [33.115, 1600.0], [33.125, -200.0], [81.115, 1600.0], [81.125, -200.0], [129.115, 1600.0], [129.125, -200.0], [177.115, 1600.0], [177.125, -200.0], [225.115, 1600.0], [225.125, -200.0], [273.115, 1600.0], [273.125, -200.0], [288, 358.2]], [[0.0, 884.2], [19.088, 1600.0], [19.098, -200.0], [67.088, 1600.0], [67.098, -200.0], [115.088, 1600.0], [115.098, -200.0], [163.088, 1600.0], [163.098, -200.0], [211.088, 1600.0], [211.098, -200.0], [259.088, 1600.0], [259.098, -200.0], [288, 884.2]], [[0.0, 1310.3], [7.725, 1600.0], [7.735, -200.0], [55.725, 1600.0], [55.735, -200.0], [103.725, 1600.0], [103.735, -200.0], [151.725, 1600.0], [151.735, -200.0], [199.725, 1600.0], [199.735, -200.0], [247.725, 1600.0], [247.735, -200.0], [288, 1310.3]], [[0.0, -33.9], [43.571, 1600.0], [43.581, -200.0], [91.571, 1600.0], [91.581, -200.0], [139.571, 1600.0], [139.581, -200.0], [187.571, 1600.0], [187.581, -200.0], [235.571, 1600.0], [235.581, -200.0], [283.571, 1600.0], [283.581, -200.0], [288, -33.9]], [[0.0, 210.2], [37.061, 1600.0], [37.071, -200.0], [85.061, 1600.0], [85.071, -200.0], [133.061, 1600.0], [133.071, -200.0], [181.061, 1600.0], [181.071, -200.0], [229.061, 1600.0], [229.071, -200.0], [277.061, 1600.0], [277.071, -200.0], [288, 210.2]], [[0.0, 643.0], [25.52, 1600.0], [25.53, -200.0], [73.52, 1600.0], [73.53, -200.0], [121.52, 1600.0], [121.53, -200.0], [169.52, 1600.0], [169.53, -200.0], [217.52, 1600.0], [217.53, -200.0], [265.52, 1600.0], [265.53, -200.0], [288, 643.0]], [[0.0, 1100.4], [13.323, 1600.0], [13.333, -200.0], [61.323, 1600.0], [61.333, -200.0], [109.323, 1600.0], [109.333, -200.0], [157.323, 1600.0], [157.333, -200.0], [205.323, 1600.0], [205.333, -200.0], [253.323, 1600.0], [253.333, -200.0], [288, 1100.4]], [[0.0, 1557.7], [1.128, 1600.0], [1.138, -200.0], [49.128, 1600.0], [49.138, -200.0], [97.128, 1600.0], [97.138, -200.0], [145.128, 1600.0], [145.138, -200.0], [193.128, 1600.0], [193.138, -200.0], [241.128, 1600.0], [241.138, -200.0], [288, 1557.7]]], "yc": 860, "tc": 205.5, "t_clear": 249.5, "tfreeze": 197.5, "Vc": 40.91, "phi": [[0, 0.0], [205.5, 7706.2], [212.32399999999998, 7834.2], [255.5, 7834.2], [263.5, 7997.8], [288, 9000.0]], "bd": {"pts": [[108.0, 730, -100.0], [112.75, 730, 78.1], [113.0, 728.9, 87.5], [113.25, 725.8, 96.9], [113.5, 721.4, 106.2], [114.5, 698.6, 143.8], [114.75, 694.2, 153.1], [115.0, 691.1, 162.5], [115.25, 690.0, 171.9], [123.25, 690, 471.9], [123.5, 690, 480.4], [123.75, 690, 488.0], [124.0, 690, 494.8], [124.25, 690, 500.6], [124.5, 690, 505.6], [124.75, 690, 509.8], [125.0, 690, 513.0], [125.75, 690, 521.0], [126.0, 690, 522.5], [126.25, 690, 523.1], [150.5, 690, 523.1]], "t_stop": 126.5, "y_stop": 523.125, "t_load": 150.5}, "tow1": {"pts": [[128.0, 730, -100.0], [132.75, 730, 78.1], [133.0, 728.9, 87.5], [133.25, 725.8, 96.9], [133.5, 721.4, 106.2], [134.5, 698.6, 143.8], [134.75, 694.2, 153.1], [135.0, 691.1, 162.5], [135.25, 690.0, 171.9], [141.75, 690, 415.6], [142.0, 690, 424.1], [142.25, 690, 431.8], [142.5, 690, 438.5], [142.75, 690, 444.4], [143.0, 690, 449.4], [143.25, 690, 453.5], [143.5, 690, 456.8], [143.75, 690, 459.1], [144.0, 690, 460.6], [144.25, 690, 461.2], [153.5, 690, 461.2], [153.75, 690, 461.9], [154.25, 690, 465.0], [154.5, 690, 467.5], [155.0, 690, 474.4], [155.5, 690, 483.8], [155.75, 690, 489.4], [156.25, 690, 502.5], [156.5, 690, 510.0], [157.0, 690, 526.9], [157.25, 690, 536.2], [157.75, 690, 556.9], [170.5, 690, 1130.6]]}, "resp": {"police": {"pts": [[196.1, 730, -100.0], [200.85, 730, 78.1], [201.1, 728.9, 87.5], [201.35, 725.8, 96.9], [201.6, 721.4, 106.2], [202.6, 698.6, 143.8], [202.85, 694.2, 153.1], [203.1, 691.1, 162.5], [203.35, 690.0, 171.9], [203.6, 690, 182.1], [203.85, 690, 193.2], [204.1, 690, 205.2], [204.35, 690, 218.1], [204.6, 690, 231.9], [204.85, 690, 246.5], [205.1, 690, 262.0], [205.35, 690, 278.4], [212.6, 690, 785.6], [212.85, 690, 802.2], [213.1, 690, 818.0], [213.35, 690, 832.9], [213.6, 690, 846.9], [213.85, 690, 860.0], [214.1, 690, 872.2], [214.35, 690, 883.6], [214.6, 690, 894.1], [214.85, 690, 903.8], [215.1, 690, 912.5], [215.35, 690, 920.4], [215.6, 690, 927.4], [215.85, 690, 933.5], [216.1, 690, 938.8], [216.35, 690, 943.1], [217.1, 690, 954.5], [217.35, 690, 957.1], [217.6, 690, 958.9], [217.85, 690, 959.8], [247.5, 690, 959.8], [248.0, 690, 961.6], [248.5, 690, 966.0], [248.75, 690, 969.1], [249.25, 690, 977.2], [249.75, 690, 987.9], [250.0, 690, 994.1], [250.5, 690, 1008.5], [251.0, 690, 1025.4], [251.5, 690, 1044.8], [251.75, 690, 1055.4], [253.25, 690, 1122.9]], "h": 40, "t_stop": 218.1}, "amb": {"pts": [[199.35, 730, -100.0], [204.1, 730, 78.1], [204.35, 728.9, 87.5], [204.6, 725.8, 96.9], [204.85, 721.4, 106.2], [205.85, 698.6, 143.4], [206.1, 694.2, 152.1], [206.35, 691.1, 160.5], [206.6, 690.0, 168.6], [206.85, 690, 177.3], [207.1, 690, 186.9], [207.35, 690, 197.4], [207.6, 690, 208.7], [207.85, 690, 221.0], [208.1, 690, 234.1], [208.35, 690, 248.0], [208.6, 690, 262.9], [208.85, 690, 278.6], [209.1, 690, 295.2], [215.6, 690, 750.2], [215.85, 690, 766.9], [216.1, 690, 782.6], [216.35, 690, 797.5], [216.6, 690, 811.5], [216.85, 690, 824.6], [217.1, 690, 836.9], [217.35, 690, 848.2], [217.6, 690, 858.7], [217.85, 690, 868.4], [218.1, 690, 877.1], [218.35, 690, 885.0], [218.6, 690, 892.0], [218.85, 690, 898.1], [219.1, 690, 903.4], [219.35, 690, 907.7], [219.6, 690, 911.2], [219.85, 690, 913.9], [220.1, 690, 915.6], [220.35, 690, 916.5], [251.5, 690, 916.5], [252.0, 690, 918.4], [252.5, 690, 922.7], [252.75, 690, 925.9], [253.25, 690, 934.0], [253.5, 690, 939.0], [254.0, 690, 950.9], [254.25, 690, 957.7], [254.75, 690, 973.4], [255.25, 690, 991.5], [255.75, 690, 1012.1], [258.25, 690, 1124.6]], "h": 40, "t_stop": 220.6}, "tow2a": {"pts": [[215.5, 690, -100.0], [215.75, 690, -89.8], [216.0, 690, -78.6], [216.25, 690, -66.6], [216.5, 690, -53.8], [216.75, 690, -40.0], [217.0, 690, -25.4], [229.75, 690, 739.6], [230.0, 690, 753.8], [230.25, 690, 767.0], [230.5, 690, 779.4], [230.75, 690, 790.9], [231.0, 690, 801.5], [231.25, 690, 811.2], [231.5, 690, 820.1], [231.75, 690, 828.1], [232.0, 690, 835.2], [232.25, 690, 841.5], [232.5, 690, 846.9], [232.75, 690, 851.4], [233.0, 690, 855.0], [233.25, 690, 857.8], [233.5, 690, 859.6], [233.75, 690, 860.6], [255.5, 690, 860.8], [255.75, 690, 861.4], [256.25, 690, 864.5], [256.75, 690, 870.1], [257.0, 690, 873.9], [257.5, 690, 883.2], [257.75, 690, 888.9], [258.25, 690, 902.0], [258.5, 690, 909.5], [259.0, 690, 926.4], [259.25, 690, 935.8], [259.75, 690, 956.4], [263.5, 690, 1125.1]], "h": 36, "t_stop": 234.0}, "tow2b": {"pts": [[221.5, 690, -100.0], [221.75, 690, -89.8], [222.0, 690, -78.6], [222.25, 690, -66.6], [222.5, 690, -53.8], [222.75, 690, -40.0], [223.0, 690, -25.4], [235.0, 690, 694.6], [235.25, 690, 708.8], [235.5, 690, 722.0], [235.75, 690, 734.4], [236.0, 690, 745.9], [236.25, 690, 756.5], [236.5, 690, 766.2], [236.75, 690, 775.1], [237.0, 690, 783.1], [237.25, 690, 790.2], [237.5, 690, 796.5], [237.75, 690, 801.9], [238.0, 690, 806.4], [238.25, 690, 810.0], [238.5, 690, 812.8], [238.75, 690, 814.6], [239.0, 690, 815.6], [259.5, 690, 815.8], [260.0, 690, 817.6], [260.5, 690, 822.0], [261.0, 690, 828.9], [261.25, 690, 833.2], [261.75, 690, 843.9], [262.0, 690, 850.1], [262.5, 690, 864.5], [262.75, 690, 872.6], [263.25, 690, 890.8], [263.75, 690, 911.4], [268.5, 690, 1125.1]], "h": 36, "t_stop": 239.25}}}

const PLAN = DATA.plan

const RING = 1800
const PITCH = 40
const S = 4
const DOWN_L = 724
const UP_L = 864
const CYCLE = 288

const CAR = ['.Y...Y.', 'KBBBBBK', 'KBWWWBK', '.BWWWB.', '.BBBBB.', '.BBBBB.', 'KBBBBBK', 'KBWWWBK', '.BBBBB.', '.T...T.']
const SEMI = ['.Y...Y.', 'KBBBBBK', 'KBWWWBK', '.BBBBB.', 'KBBBBBK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', 'KLLLLLK', '.T...T.']

// Hero cars: 9 wide, 12 long, each with its own colours.
const RX7 = ['.Y.....Y.', 'KBBBBBBBK', 'KBBDDDBBK', 'KBBDDDBBK', '.BBWWWBB.', '.BDDDDDB.', '.BDDDDDB.', 'KBBWWWBBK', 'KBBBBBBBK', '.BBBBBBB.', 'SSSSSSSSS', '.T.....T.']
const GT40 = ['..YBBBY..', '.BBDBDBB.', 'KBBDBDBBK', 'KBBDBDBBK', '.BBWWWBB.', '.BBDBDBB.', '.BBDBDBB.', 'KBBDNDBBK', 'KBBDBDBBK', '.BBDBDBB.', '.BBBBBBB.', '.T.....T.']
const REXY = ['.EYBBBYE.', 'KBBDBDBBK', 'KBBDBDBBK', 'KBBDBDBBK', '.BBWWWBB.', '.BBBBBBB.', 'KBBBBBBBK', 'KBBWWWBBK', '.BBBBBBB.', 'SSSSSSSSS', 'SSSSSSSSS', '.TT...TT.']
const R34 = ['.Y.....Y.', 'KBBBBBBBK', 'KBBBDBBBK', 'KBBDDDBBK', '.BBWWWBB.', '.BBBBBBB.', '.BBBBBBB.', 'KBBWWWBBK', 'KBBBBBBBK', '.BBBBBBB.', 'DDDDDDDDD', '.T.....T.']
const CHARGER = ['.Y.....Y.', 'KBBBBBBBK', 'KBBBDBBBK', 'KBBDDDBBK', 'KBBDDDBBK', '.BBWWWBB.', '.BBBBBBB.', 'KBBBBBBBK', 'KBBWWWBBK', '.BBBBBBB.', '.BBBBBBB.', '.T.....T.']
const POLICE = ['.Y.....Y.', 'KDDDDDDDK', 'KDDBBBDDK', '.DDWWWDD.', '.DPPQQDD.', '.BBBBBBB.', '.BBBBBBB.', 'KDDWWWDDK', 'KDDBBBDDK', '.DDDDDDD.', '.DDDDDDD.', '.T.....T.']

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
  H: ['X.X', 'X.X', 'XXX', 'X.X', 'X.X'], I: ['XXX', '.X.', '.X.', '.X.', 'XXX'], G: ['.XX', 'X..', 'X.X', 'X.X', '.XX'],
  L: ['X..', 'X..', 'X..', 'X..', 'XXX'], N: ['X.X', 'XXX', 'XXX', 'X.X', 'X.X'], E: ['XXX', 'X..', 'XX.', 'X..', 'XXX'],
  T: ['XXX', '.X.', '.X.', '.X.', '.X.'], A: ['.X.', 'X.X', 'XXX', 'X.X', 'X.X'], C: ['.XX', 'X..', 'X..', 'X..', '.XX'],
  K: ['X.X', 'X.X', 'XX.', 'X.X', 'X.X'], ' ': ['...', '...', '...', '...', '...'],
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

const delay = (x0: number, period: number) => `-${((x0 / RING) * period).toFixed(2)}s`

let rules = ''

const pct = (t: number) => ((t / CYCLE) * 100).toFixed(4)

// A timeline over the 240 s cycle: each step names a time and how the thing looks then.
type Step = { t: number; tf?: string; op?: number; ease?: string }

const timeline = (name: string, steps: Step[]): void => {
  const frames = steps
    .map(s => `${((s.t / CYCLE) * 100).toFixed(3)}%{${s.tf !== undefined ? `transform:${s.tf};` : ''}${s.op !== undefined ? `opacity:${s.op};` : ''}${s.ease !== undefined ? `animation-timing-function:${s.ease};` : ''}}`)
    .join('')

  rules += `.${name}{animation:${name} ${CYCLE}s linear infinite}\n@keyframes ${name}{${frames}}\n`
}

const Y = (n: number) => `translateY(${n}px)`
const EASE_OUT = 'cubic-bezier(.2,.7,.3,1)'
const EASE_IN = 'cubic-bezier(.6,0,.8,.4)'

// Blinkers: orange squares at the corners on the side the car is moving toward, flashing for
// 1.5 s before a lane change and until it finishes.
const blinkerFrames = (changes: { t: number; dir: number }[], dir: number): string => {
  const own = changes.filter(c => c.dir === dir)
  let last = -1
  let frames = ''

  for (let t = 0; t <= CYCLE + 0.01; t += 0.5) {
    const on = own.some(c => t >= c.t - 1.5 && t <= c.t + 1) && Math.floor(t / 0.5) % 2 === 0 ? 1 : 0

    if (on !== last) {
      frames += `${pct(t)}%{opacity:${on}}`
      last = on
    }
  }

  return frames
}

const build = () => {
  let markup = ''

  PLAN.traffic.forEach((c, i) => {
    const rows = c.kind === 'truck' ? SEMI : CAR
    const body = CIV[i % CIV.length] ?? '#888888'
    const h = rows.length * S
    let inner = car(rows, { B: body, D: body }, true)

    const tl = DATA.ytl[i] ?? []
    const yf = tl
      .map(([t, y], k) => {
        const next = tl[k + 1]
        const isJump = next !== undefined && next[1] < y - 900

        return `${((t / CYCLE) * 100).toFixed(4)}%{transform:translateY(${y}px)${isJump ? ';animation-timing-function:steps(1,end)' : ''}}`
      })
      .join('')

    rules += `.c${i}{animation:ytl${i} ${CYCLE}s linear infinite}\n@keyframes ytl${i}{${yf}}\n`
    if (c.keys !== null) {
      const frames = (c.keys288 ?? []).map(([t, lane]) => `${pct(t)}%{transform:translateX(${lane * PITCH}px)}`).join('')

      rules += `.xc${i}{animation:kc${i} ${CYCLE}s infinite;animation-timing-function:cubic-bezier(.42,0,.58,1)}\n@keyframes kc${i}{${frames}}\n`
      for (const [side, dir, x] of [['L', -1, -4], ['R', 1, 28]] as const) {
        if (c.changes.some(ch => ch.dir === dir)) {
          rules += `.b${side}${i}{animation:kb${side}${i} ${CYCLE}s infinite steps(1,end)}\n@keyframes kb${side}${i}{${blinkerFrames(c.changes, dir)}}\n`
          inner += `<g class="b${side}${i}" opacity="0"><rect x="${x}" y="${h - 8}" width="4" height="4" fill="#ffb000"/><rect x="${x}" y="3" width="4" height="4" fill="#ffb000"/></g>`
        }
      }
      inner = `<g class="xc${i}" transform="translate(${c.lane * PITCH} 0)">${inner}</g>`
    }
    markup += `<g transform="translate(${DOWN_L + 6 + (c.keys === null ? c.lane * PITCH : 0)} 0)"><g class="td c${i}">${inner}</g></g>`
  })

  // Oncoming traffic: three lanes up, one speed per lane, spaced far apart.
  const up = [
    { lane: 0, y0: 100, truck: false }, { lane: 0, y0: 700, truck: true }, { lane: 0, y0: 1300, truck: false },
    { lane: 1, y0: 400, truck: false }, { lane: 1, y0: 1000, truck: false }, { lane: 1, y0: 1600, truck: true },
    { lane: 2, y0: 250, truck: true }, { lane: 2, y0: 850, truck: false }, { lane: 2, y0: 1450, truck: false },
  ]

  up.forEach((c, i) => {
    const body = CIV[(i + 3) % CIV.length] ?? '#888888'
    const period = 36 + (i % 3) * 4

    rules += `.u${i}{animation-name:tup;animation-duration:${period}s;animation-delay:${delay(c.y0, period)}}\n`
    markup += `<g transform="translate(${UP_L + 6 + c.lane * PITCH} 0)"><g class="td u${i}">${car(c.truck ? SEMI : CAR, { B: body, D: body }, false)}</g></g>`
  })

  // Chases are occasional: one pass per car every CYCLE seconds, staggered. A pass is one lap of the
  // ring (16 s), which matches the planned lane changes; the rest of the cycle the car waits off-screen.
  const LAP = 16
  const LAG = 170 / (RING / LAP)

  const passStart = (r: Runner, i: number): number => {
    const phase = (((-r.x0 / (RING / LAP)) % LAP) + LAP) % LAP
    const target = 10 + 22 * i

    return phase + LAP * Math.round((target - phase) / LAP)
  }

  const runner = (r: Runner, id: string, rows: string[], colors: Record<string, string>, startS: number) => {
    const start = r.keys[0]?.[1] ?? 0
    const frames = r.keys.map(([pct, lane]) => `${pct}%{transform:translateX(${lane * PITCH}px)}`).join('')
    const a = ((startS / CYCLE) * 100).toFixed(3)
    const b = (((startS + LAP) / CYCLE) * 100).toFixed(3)

    rules += `.${id}{animation:m${id} ${CYCLE}s linear infinite}\n@keyframes m${id}{0%{transform:translateY(-200px)}${a}%{transform:translateY(-200px)}${b}%{transform:translateY(1600px)}100%{transform:translateY(1600px)}}\n`
    rules += `.x${id}{animation:k${id} 48s infinite;animation-timing-function:cubic-bezier(.42,0,.58,1)}\n@keyframes k${id}{${frames}}\n`

    return `<g transform="translate(${DOWN_L + 2} 0)"><g class="td ${id}"><g class="x${id}" transform="translate(${start * PITCH} 0)">${car(rows, colors, true)}</g></g></g>`
  }

  PLAN.police.forEach((r, i) => {
    const lead = PLAN.heroes[i]

    if (lead !== undefined) {
      markup += runner(r, `p${i}`, POLICE, { B: '#f2f2f2', D: '#1a1a22' }, passStart(lead, i) + LAG)
    }
  })
  PLAN.heroes.forEach((r, i) => {
    const h = HEROES[i % HEROES.length] ?? HEROES[0]

    if (h !== undefined) {
      markup += runner(r, `h${i}`, h.rows, h.colors, passStart(r, i))
    }
  })

  return markup
}

// Incidents. The breakdown pulls out of lane 0 and slows to a stop on the shoulder; the crash blocks
// lane 0, which slows every lane (the jam); responders come down lane 0 and pull over; tow trucks
// haul everything away. Every path here was planned and checked for overlaps offline.
const PERSON = ['.HH.', '.HH.', 'VVVV', 'VVVV', 'VVVV', '.JJ.', '.JJ.', '.JJ.']
const POLICE7 = ['.Y...Y.', 'KDDDDDK', 'KDWWWDK', '.DPPQDD', '.BBBBB.', '.BBBBB.', 'KDDWWDK', '.DDDDD.', '.DDDDD.', '.T...T.']
const AMBULANCE = ['.Y...Y.', 'KBBBBBK', 'KBWWWBK', '.BPPQB.', '.BBRBB.', '.BRRRB.', '.BBRBB.', 'KBBBBBK', '.BBBBB.', '.T...T.']
const TOW = ['.Y...Y.', 'KBBBBBK', 'KBWWWBK', '.BBBBB.', 'KDDDDDK', 'KDDDDDK', 'KDDDDDK', 'KDDDDDK', '.T...T.']

// A vehicle that follows a planned path: visible only while the path lasts.
const follow = (name: string, pts: Pt[]): void => {
  const first = pts[0]
  const last = pts[pts.length - 1]

  if (first === undefined || last === undefined) {
    return
  }
  const at = (p: Pt) => `transform:translate(${p[1]}px,${p[2]}px)`
  let frames = `0%{${at(first)};opacity:0}${pct(Math.max(0, first[0] - 0.01))}%{${at(first)};opacity:0}`

  pts.forEach(p => {
    frames += `${pct(p[0])}%{${at(p)};opacity:1}`
  })
  frames += `${pct(last[0] + 0.01)}%{${at(last)};opacity:0}100%{${at(last)};opacity:0}`
  rules += `.${name}{animation:${name} ${CYCLE}s linear infinite}\n@keyframes ${name}{${frames}}\n`
}

// Something that appears at one time and goes at another.
const shown = (name: string, from: number, to: number): void => {
  rules += `.${name}{animation:${name} ${CYCLE}s linear infinite}\n@keyframes ${name}{0%{opacity:0}${pct(from - 0.01)}%{opacity:0}${pct(from)}%{opacity:1}${pct(to)}%{opacity:1}${pct(to + 0.01)}%{opacity:0}100%{opacity:0}}\n`
}

const incidents = (): string => {
  const { bd, tow1, resp, yc, tc, t_clear: tClear } = DATA
  const hazard = '<g class="hz"><rect x="-4" y="3" width="4" height="4" fill="#ffb000"/><rect x="-4" y="33" width="4" height="4" fill="#ffb000"/><rect x="28" y="3" width="4" height="4" fill="#ffb000"/><rect x="28" y="33" width="4" height="4" fill="#ffb000"/></g>'

  follow('bdcar', bd.pts)
  follow('bdtow', tow1.pts)
  const stop = bd.t_stop
  const walk: Pt[] = [[stop + 2.5, 692, bd.y_stop + 10], [stop + 5, 679, bd.y_stop + 14], [bd.t_load, 679, bd.y_stop + 14]]

  follow('bdperson', walk)
  shown('bdtri', stop + 6, bd.t_load)
  Object.entries(resp).forEach(([k, v]) => follow(`r${k}`, v.pts))
  shown('crashcars', tc, tc + 44)
  shown('crashflash', tc, tc + 1.5)
  shown('crashsmoke', tc, tc + 30)
  shown('crashdebris', tc, tClear + 4)

  const smoke = [0, 1, 2].map(k => `<rect class="sm" style="animation-delay:${k * 0.8}s" x="${736 + k * 6}" y="${yc - 6}" width="8" height="8"/>`).join('')
  const debris = [
    [724, -6, 5, 3, '#cfd6e0'], [760, 2, 4, 4, '#2f6fbf'], [738, 58, 6, 3, '#d6402f'], [727, 72, 4, 4, '#111111'],
    [752, 64, 5, 3, '#fff7a8'], [744, -9, 3, 3, '#9fe8ff'], [730, 40, 3, 3, '#cfd6e0'], [762, 48, 4, 3, '#d6402f'],
    [734, 84, 5, 3, '#cfd6e0'], [748, 26, 3, 3, '#2f6fbf'],
  ] as const
  const bits = debris.map(([x, y, w, h, c]) => `<rect x="${x}" y="${yc + y}" width="${w}" height="${h}" fill="${c}"/>`).join('') +
    `<rect x="754" y="${yc + 78}" width="8" height="8" fill="#15151a"/><rect x="756" y="${yc + 80}" width="4" height="4" fill="#5a5a66"/>`

  return (
    `<g class="bdcar">${car(CAR, { B: '#a34a4a' }, true)}${hazard}</g>` +
    `<g class="bdperson"><g transform="scale(2)">${sprite(PERSON, { H: '#e0b48a', V: '#ff7a1a', J: '#2a3a5a' })}</g></g>` +
    `<g class="bdtri" opacity="0" transform="translate(698 ${bd.y_stop - 34})"><path fill="#e11d1d" d="M8 0h2v2h2v2h2v2h2v2H4V6h2V4h2z"/></g>` +
    `<g class="bdtow">${car(TOW, { B: '#f2c230', D: '#4a4a52' }, true)}</g>` +
    `<g class="crashcars" opacity="0"><g transform="translate(728 ${yc})"><g transform="rotate(12 14 20)">${car(CAR, { B: '#2f6fbf' }, true)}</g></g><g transform="translate(732 ${yc + 16})"><g transform="rotate(-16 14 20)">${car(CAR, { B: '#d6402f' }, true)}</g></g></g>` +
    `<g class="crashdebris" opacity="0">${bits}</g>` +
    `<g class="crashflash" opacity="0"><path fill="#fff" d="M746 ${yc + 10}h4v-8h4v8h8v4h-8v8h-4v-8h-8z"/></g>` +
    `<g class="crashsmoke" opacity="0">${smoke}</g>` +
    `<g class="rpolice">${car(POLICE7, { B: '#f2f2f2', D: '#1a1a22' }, true)}</g>` +
    `<g class="ramb">${car(AMBULANCE, { B: '#f4f4f4', R: '#d62020' }, true)}</g>` +
    `<g class="rtow2a">${car(TOW, { B: '#f2c230', D: '#4a4a52' }, true)}</g>` +
    `<g class="rtow2b">${car(TOW, { B: '#e8e8ec', D: '#4a4a52' }, true)}</g>`
  )
}

const lamps = (): string => {
  let out = ''

  for (let i = 0; i < 9; i++) {
    const y = 40 + i * 150

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
const horse = (x: number, y: number, body: string, mane: string, cls: string): string =>
  `<g class="${cls}"><rect x="${x}" y="${y}" width="16" height="7" fill="${body}"/><rect x="${x + 15}" y="${y - 1}" width="6" height="5" fill="${body}"/><rect x="${x + 14}" y="${y}" width="3" height="2" fill="${mane}"/><rect x="${x - 4}" y="${y + 1}" width="4" height="3" fill="${mane}"/><rect x="${x + 3}" y="${y + 1}" width="2" height="5" fill="${mane}"/></g>`

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
    for (let k = 0; k < 12; k++) {
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
  const W = 240
  const H = 204
  let out = ''

  for (let cx = 0; cx < 6; cx++) {
    for (let cy = 0; cy < 5; cy++) {
      const x = -760 + cx * W
      const y = cy * H
      const r = hash(cx * 7 + cy * 13 + 3)

      if (r < 0.3) {
        out += `<rect class="f1" x="${x}" y="${y}" width="${W}" height="${H}"/><path class="f2" d="${stripes(x, y, W, H, 22, 8)}"/>`
      } else if (r < 0.52) {
        out += `<rect class="f3" x="${x}" y="${y}" width="${W}" height="${H}"/><path class="f3b" d="${stripes(x, y, W, H, 22, 7)}"/>`
      } else if (r < 0.78) {
        let posts = ''

        for (let i = 0; i <= W; i += 24) {
          posts += `M${x + i} ${y}h4v4h-4zM${x + i} ${y + H - 4}h4v4h-4z`
        }
        for (let j = 0; j <= H; j += 24) {
          posts += `M${x} ${y + j}h4v4h-4zM${x + W - 4} ${y + j}h4v4h-4z`
        }
        out += `<rect class="pas" x="${x}" y="${y}" width="${W}" height="${H}"/><path class="fence" d="${posts}"/>`
        out += horse(x + 40 + hash(cx + cy) * 60, y + 60, '#8a4b24', '#3a2010', 'hw1') + horse(x + 120 + hash(cx * cy + 5) * 50, y + 130, '#d9b26a', '#f0e6c8', 'hw3')
      } else {
        let trees = ''

        for (let i = 0; i < 8; i++) {
          trees += `M${x + 8 + ((i * 53) % 210)} ${y + 8 + ((i * 37) % 170)}h22v22h-22z`
        }
        out += `<rect class="f1" x="${x}" y="${y}" width="${W}" height="${H}"/><path class="tree" d="${trees}"/>`
      }
    }
  }
  return out
}

export const buildHighway = (phase: Phase = 'day', wx: Weather = 'clear'): string => {
  rules = ''
  const cars = build()
  const land = patchwork()
  const scenes = incidents()
  const weather = wx === 'rain' || wx === 'storm' ? falling('rain') : wx === 'snow' ? falling('snow') : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" class="p-${phase} w-${wx}" viewBox="430 0 1000 1300" preserveAspectRatio="xMaxYMid meet" shape-rendering="crispEdges">
<defs>
<linearGradient id="vg" gradientUnits="userSpaceOnUse" x1="560" y1="0" x2="676" y2="0"><stop offset="0" class="vgs" stop-opacity="0"/><stop offset="1" class="vgs" stop-opacity="1"/></linearGradient>
<radialGradient id="lg"><stop offset="0" stop-color="#ffe9a0" stop-opacity=".5"/><stop offset="1" stop-color="#ffe9a0" stop-opacity="0"/></radialGradient>
</defs>
<style>
.vgs{stop-color:#6b9e5e}.grass2{fill:#6b9e5e}
.road{fill:#58585f}.shld{fill:#6a6a72}.med{fill:#7f8a78}.edge{fill:#e8e8e8}.yel{fill:#e0b020}.dash{fill:#f0f0f0;fill-opacity:.7}
.glow{opacity:0}.lamp{fill:#8a8a92}.veil{fill:#f7f4ee;fill-opacity:.12}.wx{fill-opacity:0}
.deck{fill:#b9bcc4}.deck2{fill:#8f939c}.rl{fill:#e8e8ec}
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
.hw1{animation:wander 14s ease-in-out infinite alternate}.hw2{animation:wander 19s ease-in-out infinite alternate-reverse}.hw3{animation:wander 11s ease-in-out infinite alternate}
.tractor{animation:plow 50s ease-in-out infinite alternate}
@keyframes tdown{from{transform:translateY(-200px)}to{transform:translateY(1600px)}}
@keyframes tup{from{transform:translateY(1600px)}to{transform:translateY(-200px)}}
@keyframes fa{0%{fill:#ff2a2a}50%{fill:#2a6bff}}
@keyframes fb{0%{fill:#2a6bff}50%{fill:#ff2a2a}}
@keyframes hzf{0%{opacity:1}50%{opacity:.1}}
@keyframes smoke{0%{opacity:.7;transform:translateY(0)}100%{opacity:0;transform:translateY(-34px)}}
@keyframes wander{from{transform:translateX(0)}to{transform:translateX(26px)}}
@keyframes plow{from{transform:translate(-1900px,1130px)}to{transform:translate(-700px,1130px)}}
@keyframes fall{from{transform:translateY(0)}to{transform:translateY(120px)}}
@keyframes drift{from{transform:translate(0,0)}to{transform:translate(18px,90px)}}
${rules}</style>
${land}
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
<rect class="deck2" x="680" y="1022" width="330" height="10"/>
<rect class="deck" x="680" y="1032" width="330" height="30"/>
<rect class="rl" x="680" y="1034" width="330" height="3"/><rect class="rl" x="680" y="1057" width="330" height="3"/>
${farm()}
${weather}
<rect class="wx" x="-4000" y="-4000" width="9000" height="9000"/>
<rect class="veil" x="-4000" y="-4000" width="9000" height="9000"/>
</svg>`
}

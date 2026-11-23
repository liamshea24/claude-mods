// A pixel wheel doing a burnout, with tyre smoke, for the "working" row.
export const WHEEL = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 32" shape-rendering="crispEdges">
<style>
.sm{fill:#b9b9c2;opacity:0;animation:puff 1.2s linear infinite}
.sm2{animation-delay:.4s}.sm3{animation-delay:.8s}
.wh{transform-box:view-box;transform-origin:28px 16px;animation:spin .5s steps(8) infinite}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes puff{0%{opacity:.75;transform:translate(0,0)}100%{opacity:0;transform:translate(-14px,-10px)}}
</style>
<rect class="sm" x="12" y="22" width="5" height="5"/>
<rect class="sm sm2" x="14" y="24" width="4" height="4"/>
<rect class="sm sm3" x="16" y="20" width="6" height="6"/>
<g class="wh">
<rect x="22" y="4" width="12" height="24" fill="#17171c"/>
<rect x="18" y="8" width="20" height="16" fill="#17171c"/>
<rect x="20" y="6" width="16" height="20" fill="#17171c"/>
<rect x="24" y="8" width="8" height="16" fill="#b8b8c0"/>
<rect x="22" y="10" width="12" height="12" fill="#b8b8c0"/>
<rect x="26" y="9" width="4" height="14" fill="#5a5a66"/>
<rect x="23" y="14" width="10" height="4" fill="#5a5a66"/>
<rect x="27" y="15" width="2" height="2" fill="#ff4040"/>
<rect x="21" y="4" width="2" height="3" fill="#ffffff"/>
</g>
</svg>`

export const WORDS: Record<string, string> = {
  thinking: 'Revving',
  requesting: 'Hitting the gas',
  'tool-use': 'Shifting gears',
  'tool-input': 'Shifting gears',
  responding: 'Cruising',
}

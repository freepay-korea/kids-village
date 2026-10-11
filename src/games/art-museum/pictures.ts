/**
 * 밑그림. 칸(region)마다 id가 있고, 탭하면 그 칸이 색으로 채워진다.
 * MVP는 단순 도형으로 그렸고 출시 전 일러스트 SVG로 교체한다 (regions의 d만 바꾸면 된다).
 */
export interface Region {
  id: string
  d: string
}

export interface Picture {
  id: string
  name: string
  icon: string
  viewBox: string
  regions: Region[]
  /** 칠하지 않는 선 (눈, 입 등) */
  lines?: string[]
}

export const pictures: Picture[] = [
  {
    id: 'cat',
    name: '고양이',
    icon: '🐱',
    viewBox: '0 0 400 300',
    regions: [
      { id: 'ear-l', d: 'M120 110 L140 40 L190 100 Z' },
      { id: 'ear-r', d: 'M280 110 L260 40 L210 100 Z' },
      { id: 'head', d: 'M200 60 a90 70 0 1 0 0.1 0 Z' },
      { id: 'body', d: 'M110 290 Q110 170 200 170 Q290 170 290 290 Z' },
      { id: 'tail', d: 'M290 250 Q360 240 350 180 Q345 160 330 170 Q335 220 285 230 Z' },
      { id: 'nose', d: 'M190 120 L210 120 L200 132 Z' },
    ],
    lines: [
      'M165 100 a8 8 0 1 0 0.1 0',
      'M235 100 a8 8 0 1 0 0.1 0',
      'M200 132 Q200 145 185 145 M200 132 Q200 145 215 145',
      'M120 125 L160 128 M120 140 L160 136 M280 125 L240 128 M280 140 L240 136',
    ],
  },
  {
    id: 'car',
    name: '자동차',
    icon: '🚗',
    viewBox: '0 0 400 300',
    regions: [
      { id: 'body', d: 'M30 200 L30 150 L110 150 L150 90 L270 90 L320 150 L370 150 L370 200 Q370 215 355 215 L45 215 Q30 215 30 200 Z' },
      { id: 'win-l', d: 'M130 148 L160 105 L205 105 L205 148 Z' },
      { id: 'win-r', d: 'M220 148 L220 105 L262 105 L298 148 Z' },
      { id: 'wheel-l', d: 'M110 215 a32 32 0 1 0 0.1 0 Z' },
      { id: 'wheel-r', d: 'M290 215 a32 32 0 1 0 0.1 0 Z' },
      { id: 'light', d: 'M345 165 a12 12 0 1 0 0.1 0 Z' },
    ],
  },
  {
    id: 'fish',
    name: '물고기',
    icon: '🐟',
    viewBox: '0 0 400 300',
    regions: [
      { id: 'body', d: 'M60 150 Q170 40 290 150 Q170 260 60 150 Z' },
      { id: 'tail', d: 'M285 150 L360 90 L340 150 L360 210 Z' },
      { id: 'fin-top', d: 'M150 92 Q180 40 230 85 Z' },
      { id: 'fin-bottom', d: 'M150 208 Q180 260 230 215 Z' },
      { id: 'eye', d: 'M110 140 a12 12 0 1 0 0.1 0 Z' },
    ],
    lines: ['M60 150 Q100 120 130 150 Q100 180 60 150'],
  },
  {
    id: 'flower',
    name: '꽃',
    icon: '🌷',
    viewBox: '0 0 400 300',
    regions: [
      { id: 'petal-1', d: 'M200 110 Q200 30 240 60 Q260 90 200 110 Z' },
      { id: 'petal-2', d: 'M200 110 Q280 90 270 140 Q250 170 200 110 Z' },
      { id: 'petal-3', d: 'M200 110 Q240 190 200 190 Q160 190 200 110 Z' },
      { id: 'petal-4', d: 'M200 110 Q120 90 130 140 Q150 170 200 110 Z' },
      { id: 'petal-5', d: 'M200 110 Q200 30 160 60 Q140 90 200 110 Z' },
      { id: 'center', d: 'M200 110 a28 28 0 1 0 0.1 0 Z' },
      { id: 'stem', d: 'M192 135 L192 290 L208 290 L208 135 Z' },
      { id: 'leaf', d: 'M208 220 Q270 190 280 240 Q240 250 208 235 Z' },
    ],
  },
]

export const paletteColors = [
  '#ef4444',
  '#f97316',
  '#facc15',
  '#22c55e',
  '#38bdf8',
  '#3b82f6',
  '#a855f7',
  '#f472b6',
  '#92400e',
  '#1f2937',
]

export const stampEmojis = ['⭐', '🌸', '❤️', '🦋']

import { motion } from 'framer-motion'

interface Props {
  id: string
  open: boolean
}

const WINDOW = '#bfe9ff'
const WINDOW_DARK = '#8fd3f4'
const TRIM = '#fff7ed'
const OUTLINE = '#5b3a1e'

/**
 * 건물 그림 (viewBox 0 0 240 240, 바닥선 y=220).
 * 모두 같은 선 색·창문 색을 써서 한 마을처럼 보이게 한다. 문은 open이면 열린다.
 */
export function BuildingArt({ id, open }: Props) {
  switch (id) {
    case 'garage':
      return <Garage open={open} />
    case 'word-school':
      return <School open={open} />
    case 'farm':
      return <Barn open={open} />
    case 'balloon-park':
      return <Park open={open} />
    case 'art-museum':
      return <Museum open={open} />
    default:
      return null
  }
}

function Win({ x, y, w = 34, h = 34 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" fill={WINDOW} stroke={OUTLINE} strokeWidth="4" />
      <path d={`M${x + w / 2} ${y} V${y + h} M${x} ${y + h / 2} H${x + w}`} stroke={WINDOW_DARK} strokeWidth="3" />
      <rect x={x + 5} y={y + 5} width={w / 3} height={h / 3} rx="3" fill="#fff" opacity="0.7" />
    </g>
  )
}

/** 여닫이 문. open이면 왼쪽을 축으로 열린다 */
function Door({ x, y, w = 36, h = 54, open, color = '#92400e' }: { x: number; y: number; w?: number; h?: number; open: boolean; color?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={w / 2} fill="#2b1b10" />
      <motion.g
        style={{ originX: `${x}px`, originY: `${y + h / 2}px` }}
        animate={{ rotateY: open ? -105 : 0 }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
      >
        <rect x={x} y={y} width={w} height={h} rx={w / 2} fill={color} stroke={OUTLINE} strokeWidth="4" />
        <circle cx={x + w - 9} cy={y + h / 2 + 4} r="3.5" fill="#fde047" />
      </motion.g>
    </g>
  )
}

function Garage({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 240 240" className="h-full w-full">
      <defs>
        <linearGradient id="g-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fdba74" />
          <stop offset="1" stopColor="#f97316" />
        </linearGradient>
      </defs>
      {/* 몸체 */}
      <rect x="22" y="92" width="196" height="128" rx="14" fill="url(#g-body)" stroke={OUTLINE} strokeWidth="5" />
      {/* 지붕 */}
      <rect x="10" y="74" width="220" height="30" rx="12" fill="#c2410c" stroke={OUTLINE} strokeWidth="5" />
      <rect x="18" y="80" width="204" height="8" rx="4" fill="#fdba74" opacity="0.5" />
      {/* 간판 */}
      <rect x="86" y="42" width="68" height="40" rx="12" fill={TRIM} stroke={OUTLINE} strokeWidth="5" />
      <text x="120" y="72" fontSize="28" textAnchor="middle">🚗</text>
      {/* 롤업 셔터: 열리면 위로 말려 올라간다 */}
      <rect x="62" y="124" width="116" height="96" rx="6" fill="#1f2937" />
      <motion.g
        style={{ originX: '120px', originY: '124px' }}
        animate={{ scaleY: open ? 0.08 : 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <rect x="62" y="124" width="116" height="96" rx="6" fill="#fde68a" stroke={OUTLINE} strokeWidth="4" />
        {[140, 158, 176, 194].map((y) => (
          <line key={y} x1="66" x2="174" y1={y} y2={y} stroke="#d97706" strokeWidth="4" strokeLinecap="round" />
        ))}
      </motion.g>
      {/* 셔터 박스 */}
      <rect x="56" y="112" width="128" height="20" rx="8" fill="#9a3412" stroke={OUTLINE} strokeWidth="4" />
      {/* 옆 창문 + 타이어 */}
      <Win x={190} y={140} w={20} h={30} />
      <circle cx="40" cy="186" r="18" fill="#1f2937" stroke={OUTLINE} strokeWidth="3" />
      <circle cx="40" cy="186" r="8" fill="#9ca3af" />
    </svg>
  )
}

function School({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 240 240" className="h-full w-full">
      <defs>
        <linearGradient id="s-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="1" stopColor="#facc15" />
        </linearGradient>
      </defs>
      {/* 몸체 */}
      <rect x="20" y="110" width="200" height="110" rx="12" fill="url(#s-body)" stroke={OUTLINE} strokeWidth="5" />
      {/* 지붕 */}
      <path d="M8 114 L120 48 L232 114 Z" fill="#ef4444" stroke={OUTLINE} strokeWidth="5" strokeLinejoin="round" />
      <path d="M40 104 L120 58 L200 104" fill="none" stroke="#fca5a5" strokeWidth="5" strokeLinecap="round" />
      {/* 시계탑 */}
      <rect x="98" y="14" width="44" height="50" rx="8" fill={TRIM} stroke={OUTLINE} strokeWidth="5" />
      <circle cx="120" cy="38" r="14" fill="#fff" stroke={OUTLINE} strokeWidth="4" />
      <motion.path
        d="M120 38 V28"
        stroke={OUTLINE}
        strokeWidth="3"
        strokeLinecap="round"
        style={{ originX: '120px', originY: '38px' }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
      />
      <path d="M120 38 H128" stroke={OUTLINE} strokeWidth="3" strokeLinecap="round" />
      <path d="M120 4 V14" stroke={OUTLINE} strokeWidth="4" strokeLinecap="round" />
      <motion.path d="M112 6 Q120 -2 128 6" fill="#ef4444" animate={{ x: [0, 2, -2, 0] }} transition={{ repeat: Infinity, duration: 2 }} />
      {/* 창문 */}
      <Win x={38} y={130} />
      <Win x={168} y={130} />
      {/* 간판 */}
      <rect x="84" y="118" width="72" height="30" rx="10" fill={TRIM} stroke={OUTLINE} strokeWidth="4" />
      <text x="120" y="141" fontSize="22" textAnchor="middle" fill={OUTLINE} fontFamily="Jua, sans-serif">가 나 다</text>
      {/* 문 (양쪽 여닫이) */}
      <Door x={100} y={160} w={20} h={60} open={open} color="#b45309" />
      <g transform="translate(240 0) scale(-1 1)">
        <Door x={100} y={160} w={20} h={60} open={open} color="#b45309" />
      </g>
      {/* 계단 */}
      <rect x="80" y="214" width="80" height="10" rx="4" fill="#d6d3d1" stroke={OUTLINE} strokeWidth="3" />
    </svg>
  )
}

function Barn({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 240 240" className="h-full w-full">
      <defs>
        <linearGradient id="b-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f87171" />
          <stop offset="1" stopColor="#dc2626" />
        </linearGradient>
      </defs>
      {/* 울타리 */}
      {[6, 26, 206, 226].map((x) => (
        <rect key={x} x={x} y="178" width="10" height="42" rx="4" fill={TRIM} stroke={OUTLINE} strokeWidth="3" />
      ))}
      <rect x="4" y="188" width="36" height="7" rx="3" fill={TRIM} stroke={OUTLINE} strokeWidth="3" />
      <rect x="4" y="204" width="36" height="7" rx="3" fill={TRIM} stroke={OUTLINE} strokeWidth="3" />
      <rect x="200" y="188" width="36" height="7" rx="3" fill={TRIM} stroke={OUTLINE} strokeWidth="3" />
      <rect x="200" y="204" width="36" height="7" rx="3" fill={TRIM} stroke={OUTLINE} strokeWidth="3" />
      {/* 몸체: 헛간 지붕 모양 */}
      <path
        d="M46 220 V120 L68 72 L120 44 L172 72 L194 120 V220 Z"
        fill="url(#b-body)"
        stroke={OUTLINE}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path d="M38 124 L68 68 L120 38 L172 68 L202 124" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M38 124 L68 68 L120 38 L172 68 L202 124" fill="none" stroke={OUTLINE} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      {/* 다락 창 */}
      <circle cx="120" cy="92" r="16" fill={WINDOW} stroke={OUTLINE} strokeWidth="4" />
      <path d="M120 76 V108 M104 92 H136" stroke={WINDOW_DARK} strokeWidth="3" />
      {/* 큰 문 + X 무늬 */}
      <rect x="84" y="130" width="72" height="90" rx="6" fill="#2b1b10" />
      <motion.g style={{ originX: '84px', originY: '175px' }} animate={{ rotateY: open ? -110 : 0 }} transition={{ duration: 0.45 }}>
        <rect x="84" y="130" width="36" height="90" fill="#a16207" stroke={OUTLINE} strokeWidth="4" />
        <path d="M88 134 L116 216 M116 134 L88 216" stroke={TRIM} strokeWidth="5" />
      </motion.g>
      <motion.g style={{ originX: '156px', originY: '175px' }} animate={{ rotateY: open ? 110 : 0 }} transition={{ duration: 0.45 }}>
        <rect x="120" y="130" width="36" height="90" fill="#a16207" stroke={OUTLINE} strokeWidth="4" />
        <path d="M124 134 L152 216 M152 134 L124 216" stroke={TRIM} strokeWidth="5" />
      </motion.g>
      {/* 건초 */}
      <ellipse cx="208" cy="214" rx="22" ry="12" fill="#fbbf24" stroke={OUTLINE} strokeWidth="3" />
      <text x="24" y="174" fontSize="22" textAnchor="middle">🐔</text>
    </svg>
  )
}

function Park({ open }: { open: boolean }) {
  const balloons = [
    { x: 40, y: 70, c: '#ef4444' },
    { x: 66, y: 52, c: '#3b82f6' },
    { x: 174, y: 58, c: '#22c55e' },
    { x: 200, y: 76, c: '#a855f7' },
  ]
  return (
    <svg viewBox="0 0 240 240" className="h-full w-full">
      {/* 나무 */}
      <rect x="30" y="150" width="12" height="70" rx="5" fill="#92400e" />
      <circle cx="36" cy="140" r="30" fill="#16a34a" stroke={OUTLINE} strokeWidth="4" />
      <rect x="198" y="150" width="12" height="70" rx="5" fill="#92400e" />
      <circle cx="204" cy="140" r="30" fill="#22c55e" stroke={OUTLINE} strokeWidth="4" />
      {/* 아치 문 */}
      <path d="M70 220 V140 A50 50 0 0 1 170 140 V220" fill="none" stroke="#0ea5e9" strokeWidth="18" strokeLinecap="round" />
      <path d="M70 220 V140 A50 50 0 0 1 170 140 V220" fill="none" stroke={OUTLINE} strokeWidth="5" />
      <rect x="86" y="104" width="68" height="34" rx="12" fill={TRIM} stroke={OUTLINE} strokeWidth="4" />
      <text x="120" y="130" fontSize="26" textAnchor="middle">🎈</text>
      {/* 쪽문: 열리면 양쪽으로 */}
      <motion.g style={{ originX: '80px', originY: '190px' }} animate={{ rotateY: open ? -100 : 0 }} transition={{ duration: 0.45 }}>
        <rect x="80" y="160" width="38" height="60" rx="6" fill="#f0f9ff" stroke={OUTLINE} strokeWidth="4" />
        {[88, 98, 108].map((x) => <rect key={x} x={x} y="166" width="5" height="48" rx="2" fill="#38bdf8" />)}
      </motion.g>
      <motion.g style={{ originX: '160px', originY: '190px' }} animate={{ rotateY: open ? 100 : 0 }} transition={{ duration: 0.45 }}>
        <rect x="122" y="160" width="38" height="60" rx="6" fill="#f0f9ff" stroke={OUTLINE} strokeWidth="4" />
        {[130, 140, 150].map((x) => <rect key={x} x={x} y="166" width="5" height="48" rx="2" fill="#38bdf8" />)}
      </motion.g>
      {/* 풍선 */}
      {balloons.map((b, i) => (
        <motion.g key={i} animate={{ y: [0, -6, 0], x: [0, i % 2 ? 3 : -3, 0] }} transition={{ repeat: Infinity, duration: 2.4 + i * 0.3, ease: 'easeInOut' }}>
          <path d={`M${b.x} ${b.y + 22} Q${b.x + 6} ${b.y + 50} ${b.x} ${b.y + 80}`} stroke={OUTLINE} strokeWidth="2" fill="none" />
          <ellipse cx={b.x} cy={b.y} rx="14" ry="18" fill={b.c} stroke={OUTLINE} strokeWidth="3" />
          <ellipse cx={b.x - 5} cy={b.y - 6} rx="4" ry="6" fill="#fff" opacity="0.5" />
        </motion.g>
      ))}
    </svg>
  )
}

function Museum({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 240 240" className="h-full w-full">
      <defs>
        <linearGradient id="m-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ddd6fe" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      {/* 계단 */}
      <rect x="20" y="206" width="200" height="14" rx="5" fill="#e9d5ff" stroke={OUTLINE} strokeWidth="4" />
      <rect x="34" y="194" width="172" height="14" rx="5" fill="#f3e8ff" stroke={OUTLINE} strokeWidth="4" />
      {/* 몸체 */}
      <rect x="40" y="100" width="160" height="98" rx="6" fill="url(#m-body)" stroke={OUTLINE} strokeWidth="5" />
      {/* 기둥 */}
      {[56, 92, 148, 184].map((x) => (
        <g key={x}>
          <rect x={x - 8} y="104" width="16" height="92" rx="4" fill="#fff" stroke={OUTLINE} strokeWidth="4" />
          <rect x={x - 12} y="100" width="24" height="8" rx="3" fill="#fff" stroke={OUTLINE} strokeWidth="3" />
        </g>
      ))}
      {/* 박공 지붕 + 돔 */}
      <path d="M26 104 L120 54 L214 104 Z" fill="#7c3aed" stroke={OUTLINE} strokeWidth="5" strokeLinejoin="round" />
      <path d="M86 60 A34 34 0 0 1 154 60 Z" fill="#c4b5fd" stroke={OUTLINE} strokeWidth="5" />
      <circle cx="120" cy="24" r="6" fill="#fde047" stroke={OUTLINE} strokeWidth="3" />
      <text x="120" y="96" fontSize="26" textAnchor="middle">🎨</text>
      {/* 문 */}
      <Door x={102} y={138} w={36} h={58} open={open} color="#6d28d9" />
    </svg>
  )
}

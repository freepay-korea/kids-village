import { motion } from 'framer-motion'
import { useMemo } from 'react'

const COLORS = ['#ef4444', '#f97316', '#facc15', '#22c55e', '#38bdf8', '#a855f7', '#f472b6']
const STARS = ['⭐', '✨', '🌟']

interface Props {
  count?: number
  /** 터지는 중심 (컨테이너 기준 %) */
  x?: number
  y?: number
  /** 작은 버스트(카드 정답)용 */
  small?: boolean
}

/**
 * 색종이 + 별 터짐. 가운데에서 위로 솟았다가 떨어지며 팔랑인다.
 * 화면을 덮지만 터치는 막지 않는다.
 */
export function Celebration({ count = 36, x = 50, y = 55, small }: Props) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (Math.random() - 0.5) * Math.PI * (small ? 1.2 : 1.6)
        const power = (small ? 160 : 420) * (0.5 + Math.random() * 0.7)
        return {
          id: i,
          star: i % 4 === 0,
          icon: STARS[i % STARS.length],
          color: COLORS[i % COLORS.length],
          dx: Math.sin(angle) * power,
          peak: -Math.cos(angle) * power * 0.9,
          fall: (small ? 220 : 520) + Math.random() * 200,
          rot: (Math.random() - 0.5) * 900,
          delay: Math.random() * 0.15,
          w: 8 + Math.random() * 8,
          h: 14 + Math.random() * 10,
          dur: 1.6 + Math.random() * 0.6,
        }
      }),
    [count, small],
  )

  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
      {/* 터지는 순간의 빛 */}
      <motion.div
        className="absolute rounded-full bg-white"
        style={{ left: `${x}%`, top: `${y}%`, width: 20, height: 20, x: '-50%', y: '-50%' }}
        initial={{ scale: 0, opacity: 0.9 }}
        animate={{ scale: small ? 8 : 24, opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute flex items-center justify-center"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: p.star ? 'auto' : p.w,
            height: p.star ? 'auto' : p.h,
            background: p.star ? 'transparent' : p.color,
            borderRadius: 3,
            fontSize: small ? 18 : 30,
          }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.6 }}
          animate={{
            x: [0, p.dx * 0.7, p.dx],
            y: [0, p.peak, p.peak + p.fall],
            rotateZ: p.rot,
            rotateX: [0, 360, 720],
            opacity: [1, 1, 0],
            scale: 1,
          }}
          transition={{ duration: p.dur, delay: p.delay, ease: ['easeOut', 'easeIn'], times: [0, 0.45, 1] }}
        >
          {p.star ? p.icon : ''}
        </motion.span>
      ))}
    </div>
  )
}

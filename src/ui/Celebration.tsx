import { motion } from 'framer-motion'
import { useMemo } from 'react'

const pieces = ['🎉', '⭐', '✨', '🌟', '🎊', '💛', '💙', '💚']

/**
 * 정답·스티커 획득 때 쓰는 큰 축하. 색종이와 별이 가운데에서 터져 나온다.
 * 화면 전체를 덮지만 터치는 막지 않는다.
 */
export function Celebration({ count = 28 }: { count?: number }) {
  const parts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        icon: pieces[i % pieces.length],
        x: (Math.random() - 0.5) * 900,
        y: -200 - Math.random() * 350,
        rotate: (Math.random() - 0.5) * 720,
        delay: Math.random() * 0.2,
        size: 28 + Math.random() * 28,
      })),
    [count],
  )
  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
      {parts.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-1/2 left-1/2"
          style={{ fontSize: p.size }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.4 }}
          animate={{ x: p.x, y: [p.y, p.y + 500], opacity: [1, 1, 0], rotate: p.rotate, scale: 1 }}
          transition={{ duration: 1.8, delay: p.delay, ease: 'easeOut' }}
        >
          {p.icon}
        </motion.span>
      ))}
    </div>
  )
}

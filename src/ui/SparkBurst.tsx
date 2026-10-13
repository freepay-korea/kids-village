import { motion } from 'framer-motion'
import { useMemo } from 'react'

/** 작은 반짝임 터짐. 카드 위 등 좁은 곳에서 탭 반응용. 부모는 relative여야 한다. */
export function SparkBurst({ count = 8, color = '#fde047' }: { count?: number; color?: string }) {
  const parts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2
        const d = 50 + Math.random() * 30
        return { id: i, x: Math.cos(a) * d, y: Math.sin(a) * d, s: 6 + Math.random() * 6 }
      }),
    [count],
  )
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <motion.div
        className="absolute rounded-full border-4"
        style={{ borderColor: color, width: 40, height: 40 }}
        initial={{ scale: 0.4, opacity: 1 }}
        animate={{ scale: 3.2, opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
      {parts.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{ width: p.s, height: p.s, background: color }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.2 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

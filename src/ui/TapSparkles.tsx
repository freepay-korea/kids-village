import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { playSfx } from '@/core/sound'
import { Pic } from './Pic'

interface Spark {
  id: number
  x: number
  y: number
}

let nextId = 0

/** 어디를 눌러도 작은 반짝임과 소리가 난다 (핵심 원칙 3: 탭 한 번에 반응). */
export function TapSparkles() {
  const [sparks, setSparks] = useState<Spark[]>([])

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (!e.isPrimary) return
      const id = nextId++
      setSparks((s) => [...s.slice(-8), { id, x: e.clientX, y: e.clientY }])
      playSfx('tap')
      window.setTimeout(() => setSparks((s) => s.filter((k) => k.id !== id)), 600)
    }
    window.addEventListener('pointerdown', onDown, { passive: true })
    return () => window.removeEventListener('pointerdown', onDown)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-[90]">
      <AnimatePresence>
        {sparks.map((s) => (
          <motion.span
            key={s.id}
            className="absolute"
            style={{ left: s.x - 18, top: s.y - 18 }}
            initial={{ scale: 0.3, opacity: 1 }}
            animate={{ scale: 1.4, opacity: 0, y: -24 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Pic emoji="✨" className="h-9 w-9" />
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}

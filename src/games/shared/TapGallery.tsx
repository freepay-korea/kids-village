import { motion } from 'framer-motion'
import { useState } from 'react'
import { playSfx } from '@/core/sound'
import { say } from '@/core/voice'
import type { Item } from './types'

/**
 * 놀이 모드: 그림을 탭하면 소리가 나고 통통 뛴다. 2세도 할 수 있는 가장 단순한 놀이.
 */
export function TapGallery({ items }: { items: Item[] }) {
  const [active, setActive] = useState<string | null>(null)

  const tap = (item: Item) => {
    playSfx('pop')
    void say(item.voiceKey)
    setActive(item.id)
  }

  return (
    <div className="flex h-full w-full items-center justify-center p-4 pt-20">
      <div className="grid max-w-4xl grid-cols-4 gap-4">
        {items.map((item) => (
          <motion.button
            key={item.id}
            type="button"
            onClick={() => tap(item)}
            aria-label={item.name}
            className="flex h-28 w-28 items-center justify-center rounded-3xl bg-white/80 text-7xl shadow-md"
            whileTap={{ scale: 0.9 }}
            animate={
              active === item.id
                ? { y: [0, -40, 0, -16, 0], rotate: [0, -8, 8, -4, 0] }
                : { y: 0, rotate: 0 }
            }
            transition={{ duration: 0.7 }}
            onAnimationComplete={() => active === item.id && setActive(null)}
          >
            {item.icon}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

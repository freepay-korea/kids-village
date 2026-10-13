import { useState } from 'react'
import { playSfx } from '@/core/sound'
import { say } from '@/core/voice'
import { GameCard } from './GameCard'
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
    window.setTimeout(() => setActive((a) => (a === item.id ? null : a)), 700)
  }

  return (
    <div className="flex h-full w-full justify-center overflow-y-auto p-4 pt-20 pb-6">
      <div className="grid h-fit max-w-4xl grid-cols-4 gap-5 self-center">
        {items.map((item, i) => (
          <GameCard
            key={item.id}
            label={item.name}
            onClick={() => tap(item)}
            size={120}
            delay={i * 0.05}
            burst={active === item.id}
            animate={active === item.id ? { y: [0, -44, 0, -16, 0], rotate: [0, -10, 10, -5, 0] } : undefined}
            transition={active === item.id ? { duration: 0.7, type: 'tween' } : undefined}
          >
            {item.icon}
          </GameCard>
        ))}
      </div>
    </div>
  )
}

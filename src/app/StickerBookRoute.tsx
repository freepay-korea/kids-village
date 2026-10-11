import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { games } from '@/games/registry'
import { stickerCatalog, useStickers, type Sticker } from '@/core/stickers'
import { playSfx } from '@/core/sound'
import { HomeButton } from '@/ui/HomeButton'

/**
 * 스티커북. 건물마다 한 줄, 6칸.
 * 모은 스티커는 그림으로, 아직 없는 칸은 실루엣으로 보인다. 배경판에 붙이기는 첫 업데이트로 미룸.
 */
export function StickerBookRoute() {
  const navigate = useNavigate()
  const earned = useStickers((s) => s.earned)
  const [picked, setPicked] = useState<string | null>(null)

  const total = Object.values(earned).reduce((n, list) => n + list.length, 0)

  const tap = (sticker: Sticker, have: boolean) => {
    playSfx(have ? 'pop' : 'tap')
    setPicked(have ? sticker.id : null)
  }

  return (
    <motion.div
      className="relative h-full w-full overflow-y-auto bg-pink-100"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
    >
      <HomeButton onClick={() => navigate('/')} />

      <div className="fixed top-3 right-4 z-30 flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-2xl text-pink-900">
        ⭐ {total}
      </div>

      <div className="mx-auto flex max-w-4xl flex-col gap-3 px-4 pt-20 pb-8">
        {games.map((game) => {
          const have = earned[game.id] ?? []
          return (
            <div
              key={game.id}
              className="flex items-center gap-3 rounded-3xl bg-white/80 p-3 shadow-sm"
              style={{ borderLeft: `12px solid ${game.color}` }}
            >
              <div className="flex w-20 flex-col items-center text-4xl" aria-label={game.name}>
                {game.icon}
              </div>
              <div className="flex flex-1 flex-wrap gap-2">
                {stickerCatalog[game.id].map((sticker) => {
                  const got = have.includes(sticker.id)
                  return (
                    <motion.button
                      key={sticker.id}
                      type="button"
                      onClick={() => tap(sticker, got)}
                      aria-label={got ? sticker.name : '아직 없는 스티커'}
                      className="flex h-touch w-touch items-center justify-center rounded-2xl bg-pink-50 text-5xl"
                      whileTap={{ scale: 0.9 }}
                      animate={
                        picked === sticker.id
                          ? { rotate: [0, -12, 12, -8, 8, 0], scale: [1, 1.3, 1] }
                          : { rotate: 0, scale: 1 }
                      }
                      onAnimationComplete={() => picked === sticker.id && setPicked(null)}
                      style={
                        got
                          ? undefined
                          : { filter: 'grayscale(1) brightness(0.2)', opacity: 0.25 }
                      }
                    >
                      {sticker.icon}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

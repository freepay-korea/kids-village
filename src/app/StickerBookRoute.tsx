import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { games } from '@/games/registry'
import { stickerCatalog, useStickers, type Sticker } from '@/core/stickers'
import { playSfx } from '@/core/sound'
import { HomeButton } from '@/ui/HomeButton'
import { SparkBurst } from '@/ui/SparkBurst'
import { Pic } from '@/ui/Pic'

/**
 * 스티커북. 책을 펼친 모양에 건물마다 한 줄, 6칸.
 * 모은 스티커는 그림으로, 아직 없는 칸은 실루엣으로 보인다. 배경판에 붙이기는 첫 업데이트로 미룸.
 */
export function StickerBookRoute() {
  const navigate = useNavigate()
  const earned = useStickers((s) => s.earned)
  const [picked, setPicked] = useState<string | null>(null)
  const [burst, setBurst] = useState<string | null>(null)

  const total = Object.values(earned).reduce((n, list) => n + list.length, 0)

  const tap = (sticker: Sticker, have: boolean) => {
    playSfx(have ? 'pop' : 'tap')
    if (have) {
      setPicked(sticker.id)
      setBurst(sticker.id)
      window.setTimeout(() => setBurst((b) => (b === sticker.id ? null : b)), 600)
    }
  }

  return (
    <motion.div
      className="relative h-full w-full overflow-hidden"
      style={{ background: 'linear-gradient(#fbcfe8, #fce7f3)' }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-dots pointer-events-none absolute inset-0 opacity-50" />
      <HomeButton onClick={() => navigate('/')} />

      <motion.div
        className="glass fixed top-3 right-4 z-30 flex items-center gap-2 rounded-full px-5 py-2 text-3xl text-cocoa"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.3 }}
      >
        <Pic emoji="⭐" className="h-9 w-9" /> {total}
      </motion.div>

      {/* 펼친 책 */}
      <motion.div
        className="absolute inset-x-6 top-16 bottom-4 overflow-y-auto rounded-[28px] border-[6px] border-[#8b5e3c] bg-[#fffaf0] p-3 shadow-[0_18px_40px_rgba(0,0,0,0.25),inset_0_0_0_6px_#f3e3c3]"
        initial={{ y: 60, opacity: 0, rotateX: 20 }}
        animate={{ y: 0, opacity: 1, rotateX: 0 }}
        transition={{ type: 'spring', stiffness: 160, damping: 18 }}
      >
        {/* 책 가운데 접힌 선 */}
        <div className="pointer-events-none absolute inset-y-3 left-1/2 w-1 bg-gradient-to-b from-transparent via-[#e7d3b0] to-transparent" />
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 px-2">
          {games.map((game, gi) => {
            const have = earned[game.id] ?? []
            return (
              <motion.div
                key={game.id}
                className="flex items-center gap-3 rounded-2xl bg-white/70 p-2 pl-0"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15 + gi * 0.07, type: 'spring', stiffness: 220, damping: 18 }}
              >
                {/* 탭(색인) */}
                <div
                  className="flex h-16 w-20 items-center justify-center rounded-r-2xl text-4xl shadow-[3px_0_0_rgba(0,0,0,0.08)]"
                  style={{ backgroundColor: game.color }}
                  aria-label={game.name}
                >
                  <Pic emoji={game.icon} className="h-12 w-12" />
                </div>
                <div className="grid flex-1 grid-cols-3 justify-items-center gap-2">
                  {stickerCatalog[game.id].map((sticker, si) => {
                    const got = have.includes(sticker.id)
                    return (
                      <motion.button
                        key={sticker.id}
                        type="button"
                        onClick={() => tap(sticker, got)}
                        aria-label={got ? sticker.name : '아직 없는 스티커'}
                        className={`relative flex h-touch w-touch items-center justify-center rounded-full text-5xl ${
                          got
                            ? 'bg-white shadow-[0_4px_0_#e9d5ff,0_8px_16px_rgba(0,0,0,0.15)] ring-4 ring-white'
                            : 'border-4 border-dashed border-pink-200 bg-pink-50/60'
                        }`}
                        initial={{ scale: 0 }}
                        animate={
                          picked === sticker.id
                            ? { scale: [1, 1.35, 1], rotate: [0, -14, 14, -8, 8, 0] }
                            : { scale: 1, rotate: got ? ((si * 37) % 10) - 5 : 0 }
                        }
                        transition={
                          picked === sticker.id
                            ? { duration: 0.6 }
                            : { type: 'spring', stiffness: 300, damping: 16, delay: 0.25 + gi * 0.07 + si * 0.04 }
                        }
                        whileTap={{ scale: 0.9 }}
                        onAnimationComplete={() => picked === sticker.id && setPicked(null)}
                      >
                        <Pic
                          emoji={sticker.icon}
                          className="h-12 w-12"
                          style={got ? undefined : { filter: 'grayscale(1) brightness(0.3)', opacity: 0.2 }}
                        />
                        {got && <span className="shine pointer-events-none absolute inset-0 overflow-hidden rounded-full" />}
                        {burst === sticker.id && <SparkBurst />}
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}

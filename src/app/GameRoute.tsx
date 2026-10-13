import { lazy, Suspense, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { findGame } from '@/games/registry'
import { useStickers, type Sticker } from '@/core/stickers'
import { playSfx } from '@/core/sound'
import { haptic } from '@/core/haptics'
import { say } from '@/core/voice'
import { HomeButton } from '@/ui/HomeButton'
import { Celebration } from '@/ui/Celebration'
import { Pic } from '@/ui/Pic'

/**
 * 건물(게임) 하나를 동적으로 불러와 보여 준다.
 * 게임은 onComplete / onExit 두 신호만 보내고, 스티커 지급·저장·축하는 여기(core)가 맡는다.
 */
export function GameRoute() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const game = gameId ? findGame(gameId) : undefined
  const award = useStickers((s) => s.award)
  const [earned, setEarned] = useState<Sticker | null>(null)

  const Game = useMemo(() => (game ? lazy(game.load) : null), [game])

  if (!game || !Game) return <Navigate to="/" replace />

  const goHome = () => navigate('/')

  const onComplete = (stickerId: string) => {
    if (earned) return
    const sticker = award(game.id, stickerId)
    setEarned(sticker)
    playSfx('sticker')
    haptic([40, 60, 40])
    void say('sticker')
    window.setTimeout(goHome, 3000)
  }

  return (
    <motion.div
      className="relative h-full w-full overflow-hidden"
      style={{
        background: `radial-gradient(circle at 50% 30%, color-mix(in srgb, ${game.color} 55%, white) 0%, ${game.color} 70%)`,
      }}
      initial={{ clipPath: 'circle(0% at 50% 50%)', opacity: 1 }}
      animate={{ clipPath: 'circle(120% at 50% 50%)' }}
      exit={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="bg-dots pointer-events-none absolute inset-0 opacity-60" />
      <HomeButton onClick={goHome} />
      <Suspense fallback={<Loading icon={game.icon} />}>
        <Game onExit={goHome} onComplete={onComplete} />
      </Suspense>

      <AnimatePresence>
        {earned && (
          <motion.div
            className="absolute inset-0 z-40 flex flex-col items-center justify-center overflow-hidden bg-[#fffbe6]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* 뒤에서 도는 햇살 */}
            <motion.div
              className="absolute h-[160vmax] w-[160vmax] rounded-full"
              style={{
                background:
                  'repeating-conic-gradient(from 0deg, #fde68a 0deg 12deg, #fff7ed 12deg 24deg)',
              }}
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ scale: { duration: 0.6, ease: 'easeOut' }, rotate: { repeat: Infinity, duration: 18, ease: 'linear' } }}
            />
            <Celebration count={48} y={45} />
            <motion.div
              className="relative flex h-56 w-56 items-center justify-center rounded-full bg-white shadow-[0_0_0_10px_#fde68a,0_20px_40px_rgba(0,0,0,0.25)]"
              initial={{ scale: 0, rotate: -40 }}
              animate={{ scale: [0, 1.25, 1], rotate: [-40, 8, 0] }}
              transition={{ duration: 0.7, type: 'spring', bounce: 0.5 }}
            >
              <motion.div
                className="drop-shadow-xl"
                animate={{ y: [0, -8, 0], rotate: [0, -4, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
              >
                <Pic emoji={earned.icon} className="h-40 w-40" />
              </motion.div>
              <div className="shine pointer-events-none absolute inset-0 overflow-hidden rounded-full" />
            </motion.div>
            <motion.div
              className="text-outline relative mt-6 text-5xl"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35, type: 'spring', stiffness: 200, damping: 14 }}
            >
              {earned.name} 스티커!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function Loading({ icon }: { icon: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <motion.div animate={{ y: [0, -20, 0], scaleX: [1, 0.9, 1] }} transition={{ repeat: Infinity, duration: 0.7 }}>
        <Pic emoji={icon} className="h-28 w-28" />
      </motion.div>
    </div>
  )
}

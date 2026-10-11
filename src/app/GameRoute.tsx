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
    window.setTimeout(goHome, 2600)
  }

  return (
    <motion.div
      className="relative h-full w-full"
      style={{ backgroundColor: game.color }}
      initial={{ opacity: 0, scale: 1.15 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.35 }}
    >
      <HomeButton onClick={goHome} />
      <Suspense fallback={<Loading icon={game.icon} />}>
        <Game onExit={goHome} onComplete={onComplete} />
      </Suspense>

      <AnimatePresence>
        {earned && (
          <motion.div
            className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-white/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Celebration />
            <motion.div
              className="text-[9rem] drop-shadow-xl"
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: [0, 1.3, 1], rotate: 0 }}
              transition={{ duration: 0.7, type: 'spring' }}
            >
              {earned.icon}
            </motion.div>
            <div className="text-3xl text-amber-900">{earned.name} 스티커!</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function Loading({ icon }: { icon: string }) {
  return (
    <div className="flex h-full w-full animate-bounce items-center justify-center text-8xl">{icon}</div>
  )
}

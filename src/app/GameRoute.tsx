import { lazy, Suspense, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { findGame } from '@/games/registry'
import { HomeButton } from '@/ui/HomeButton'

/**
 * 건물(게임) 하나를 동적으로 불러와 보여 준다.
 * 게임은 onComplete / onExit 두 신호만 보내고, 스티커 지급·저장은 core가 맡는다(3·4단계).
 */
export function GameRoute() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const game = gameId ? findGame(gameId) : undefined

  const Game = useMemo(() => (game ? lazy(game.load) : null), [game])

  if (!game || !Game) return <Navigate to="/" replace />

  const goHome = () => navigate('/')

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
        <Game
          onExit={goHome}
          onComplete={(stickerId) => {
            // 4단계에서 core 스티커북이 받도록 연결
            console.info(`[${game.id}] sticker earned: ${stickerId}`)
            goHome()
          }}
        />
      </Suspense>
    </motion.div>
  )
}

function Loading({ icon }: { icon: string }) {
  return (
    <div className="flex h-full w-full animate-bounce items-center justify-center text-8xl">{icon}</div>
  )
}

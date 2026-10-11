import { motion } from 'framer-motion'
import type { GameMeta } from '@/games/types'

interface Props {
  game: GameMeta
  /** 이 건물에서 모은 스티커 수 (4단계에서 스티커북과 연결) */
  stickerCount: number
  entering: boolean
  onTap: () => void
}

/** 마을 지도에 놓이는 건물 한 채. 탭하면 문이 열리고 확대되며 게임으로 들어간다. */
export function Building({ game, stickerCount, entering, onTap }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onTap}
      aria-label={game.name}
      className="relative flex w-52 flex-col items-center"
      whileTap={{ scale: 0.95 }}
      animate={entering ? { scale: 1.6, zIndex: 20 } : { scale: 1, zIndex: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      {/* 모은 스티커 별 */}
      <div className="flex h-8 gap-0.5 text-xl" aria-label={`스티커 ${stickerCount}개`}>
        {Array.from({ length: stickerCount }, (_, i) => (
          <span key={i}>⭐</span>
        ))}
      </div>

      {/* 지붕 */}
      <div
        className="h-0 w-0 border-x-[96px] border-b-[56px] border-x-transparent"
        style={{ borderBottomColor: game.color }}
      />
      {/* 몸통 */}
      <div
        className="flex h-36 w-44 flex-col items-center justify-end rounded-b-2xl shadow-lg"
        style={{ backgroundColor: game.color }}
      >
        <div className="text-6xl drop-shadow">{game.icon}</div>
        {/* 문: 탭하면 열린다 */}
        <motion.div
          className="mt-1 h-12 w-10 origin-left rounded-t-full bg-amber-900"
          animate={entering ? { rotateY: -110 } : { rotateY: 0 }}
          transition={{ duration: 0.4 }}
        />
      </div>
      <div className="mt-2 text-xl text-amber-900">{game.name}</div>
    </motion.button>
  )
}

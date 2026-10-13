import { motion } from 'framer-motion'
import type { GameMeta } from '@/games/types'
import { BuildingArt } from './BuildingArt'

interface Props {
  game: GameMeta
  stickerCount: number
  entering: boolean
  index: number
  onTap: () => void
}

/** 마을 지도에 놓이는 건물 한 채. 탭하면 찌그러졌다 튀어 오르고, 문이 열리며 확대된다. */
export function Building({ game, stickerCount, entering, index, onTap }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onTap}
      aria-label={game.name}
      className="relative flex w-60 flex-col items-center"
      initial={{ y: 80, opacity: 0, scale: 0.8 }}
      animate={
        entering
          ? { scale: 1.7, zIndex: 20, y: 30, opacity: 1 }
          : { y: 0, opacity: 1, scale: 1, zIndex: 0 }
      }
      transition={
        entering
          ? { type: 'spring', stiffness: 160, damping: 20 }
          : { type: 'spring', stiffness: 220, damping: 16, delay: 0.08 * index }
      }
      whileTap={{ scaleX: 1.06, scaleY: 0.92, y: 6 }}
    >
      {/* 모은 스티커 별: 건물 위에 호 모양으로 */}
      <div className="relative flex h-10 items-end gap-0.5" aria-label={`스티커 ${stickerCount}개`}>
        {Array.from({ length: stickerCount }, (_, i) => (
          <motion.span
            key={i}
            className="text-xl drop-shadow"
            initial={{ scale: 0 }}
            animate={{ scale: 1, y: [0, -3, 0] }}
            transition={{ scale: { type: 'spring', delay: 0.3 + i * 0.05 }, y: { repeat: Infinity, duration: 1.6, delay: i * 0.2 } }}
          >
            ⭐
          </motion.span>
        ))}
      </div>

      <motion.div
        className="h-56 w-56 drop-shadow-[0_14px_10px_rgba(0,0,0,0.22)]"
        animate={{ y: [0, -3, 0] }}
        transition={{ repeat: Infinity, duration: 3 + index * 0.4, ease: 'easeInOut' }}
      >
        <BuildingArt id={game.id} open={entering} />
      </motion.div>

      {/* 이름표 */}
      <div
        className="-mt-1 rounded-full border-[3px] border-white px-5 py-1 text-xl text-white shadow-[0_4px_0_rgba(0,0,0,0.15)]"
        style={{ backgroundColor: game.color, textShadow: '0 2px 0 rgba(0,0,0,0.25)' }}
      >
        {game.name}
      </div>
    </motion.button>
  )
}

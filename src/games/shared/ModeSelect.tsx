import { motion } from 'framer-motion'
import { playSfx } from '@/core/sound'

interface Props {
  color: string
  icon: string
  onPlay: () => void
  onMission: () => void
}

/**
 * 건물에 들어오면 처음 보는 화면. 글자 없이 두 개의 큰 버튼:
 * 🎵 놀이 모드(자유롭게 탭), ⭐ 미션 모드(짧은 과제 후 스티커)
 */
export function ModeSelect({ color, icon, onPlay, onMission }: Props) {
  const pick = (fn: () => void) => () => {
    playSfx('pop')
    fn()
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6">
      <div className="text-8xl drop-shadow">{icon}</div>
      <div className="flex gap-8">
        <motion.button
          type="button"
          onClick={pick(onPlay)}
          aria-label="놀이 모드"
          className="flex h-36 w-36 items-center justify-center rounded-full bg-white text-7xl shadow-xl"
          whileTap={{ scale: 0.9 }}
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
        >
          🎵
        </motion.button>
        <motion.button
          type="button"
          onClick={pick(onMission)}
          aria-label="미션 모드"
          className="flex h-36 w-36 items-center justify-center rounded-full text-7xl shadow-xl"
          style={{ backgroundColor: color, filter: 'brightness(1.15)' }}
          whileTap={{ scale: 0.9 }}
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, delay: 0.4 }}
        >
          ⭐
        </motion.button>
      </div>
    </div>
  )
}

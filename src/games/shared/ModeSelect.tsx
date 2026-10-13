import { motion } from 'framer-motion'
import { playSfx } from '@/core/sound'

interface Props {
  color: string
  icon: string
  onPlay: () => void
  onMission: () => void
  /** 세 번째 버튼(미술관 갤러리 등) */
  extra?: { icon: string; label: string; onClick: () => void }
}

/**
 * 건물에 들어오면 처음 보는 화면. 글자 없이 큰 버튼:
 * 🎵 놀이 모드(자유롭게 탭), ⭐ 미션 모드(짧은 과제 후 스티커)
 */
export function ModeSelect({ color, icon, onPlay, onMission, extra }: Props) {
  const pick = (fn: () => void) => () => {
    playSfx('pop')
    fn()
  }
  const buttons = [
    { icon: '🎵', label: '놀이 모드', onClick: pick(onPlay), color: '#ffffff', sub: '놀이' },
    { icon: '⭐', label: '미션 모드', onClick: pick(onMission), color, sub: '미션' },
    ...(extra ? [{ icon: extra.icon, label: extra.label, onClick: pick(extra.onClick), color: '#ffffff', sub: extra.label }] : []),
  ]
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8">
      <motion.div
        className="text-[7rem] leading-none drop-shadow-[0_10px_8px_rgba(0,0,0,0.25)]"
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0, y: [0, -10, 0] }}
        transition={{ scale: { type: 'spring', stiffness: 260, damping: 14 }, y: { repeat: Infinity, duration: 2.4, ease: 'easeInOut' } }}
      >
        {icon}
      </motion.div>
      <div className="flex gap-8">
        {buttons.map((b, i) => (
          <motion.button
            key={b.label}
            type="button"
            onClick={b.onClick}
            aria-label={b.label}
            className="btn-3d relative flex h-40 w-40 flex-col items-center justify-center gap-1 overflow-hidden rounded-[36px]"
            style={{ ['--btn' as string]: b.color }}
            initial={{ y: 80, opacity: 0, scale: 0.7 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.15 + i * 0.12 }}
            whileTap={{ scale: 0.93 }}
          >
            <span className="text-7xl leading-none drop-shadow">{b.icon}</span>
            <span className="text-xl text-cocoa/80">{b.sub}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

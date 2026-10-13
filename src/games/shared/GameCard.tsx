import { motion, type TargetAndTransition } from 'framer-motion'
import type { ReactNode } from 'react'
import { SparkBurst } from '@/ui/SparkBurst'

interface Props {
  label: string
  onClick: () => void
  children: ReactNode
  size?: number
  /** 추가 애니메이션 상태 */
  animate?: TargetAndTransition
  transition?: object
  burst?: boolean
  burstColor?: string
  delay?: number
  className?: string
  highlight?: boolean
}

/** 게임에서 쓰는 그림 카드. 입체 그림자, 통통 튀는 등장, 탭하면 찌그러짐 + 반짝 터짐 */
export function GameCard({ label, onClick, children, size = 128, animate, transition, burst, burstColor, delay = 0, className = '', highlight }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`card-pop relative flex items-center justify-center rounded-[28px] ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.55, lineHeight: 1 }}
      initial={{ scale: 0, y: 40, rotate: -6 }}
      animate={{ scale: 1, y: 0, rotate: 0, ...(animate ?? {}) }}
      transition={{ type: 'spring', stiffness: 300, damping: 16, delay, ...(transition ?? {}) }}
      whileTap={{ scaleX: 1.08, scaleY: 0.9 }}
    >
      {highlight && (
        <motion.span
          className="pointer-events-none absolute -inset-2 rounded-[34px]"
          style={{ boxShadow: '0 0 0 6px #fde047, 0 0 30px 10px rgba(253,224,71,0.8)' }}
          animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.04, 1] }}
          transition={{ repeat: Infinity, duration: 0.9 }}
        />
      )}
      <span className="drop-shadow-[0_6px_4px_rgba(0,0,0,0.18)]">{children}</span>
      {burst && <SparkBurst color={burstColor} />}
    </motion.button>
  )
}

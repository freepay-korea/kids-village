import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  onClick: () => void
  label: string
  children: ReactNode
  /** 버튼 색 (CSS 색) */
  color?: string
  className?: string
  disabled?: boolean
  /** 둥근 원형(기본) / 둥근 사각 */
  shape?: 'circle' | 'rounded'
}

/** 공통 입체 버튼. 최소 64px, 누르면 내려앉고 손을 떼면 통통 튄다. 글자 대신 그림을 넣는다. */
export function BigButton({ onClick, label, children, color = '#ffffff', className = '', disabled, shape = 'circle' }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 500, damping: 18 }}
      className={`btn-3d flex min-h-touch min-w-touch items-center justify-center ${
        shape === 'circle' ? 'rounded-full' : 'rounded-3xl'
      } disabled:opacity-50 ${className}`}
      style={{ ['--btn' as string]: color }}
    >
      {children}
    </motion.button>
  )
}

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  onClick: () => void
  label: string
  children: ReactNode
  color?: string
  className?: string
  disabled?: boolean
}

/** 공통 큰 버튼. 최소 64px, 눌리면 살짝 작아진다. 글자 대신 그림을 넣는다. */
export function BigButton({ onClick, label, children, color, className = '', disabled }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.92 }}
      className={`flex min-h-touch min-w-touch items-center justify-center rounded-3xl shadow-md disabled:opacity-50 ${className}`}
      style={color ? { backgroundColor: color } : undefined}
    >
      {children}
    </motion.button>
  )
}

import { motion } from 'framer-motion'

/** 모든 게임 화면 왼쪽 위에 항상 있는 집 버튼. 누르면 마을로 돌아간다. */
export function HomeButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label="마을로 돌아가기"
      className="btn-3d absolute top-3 left-3 z-50 flex h-touch w-touch items-center justify-center rounded-full"
      style={{ ['--btn' as string]: '#ffffff' }}
      initial={{ scale: 0, rotate: -40 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.2 }}
      whileTap={{ scale: 0.9 }}
    >
      <svg viewBox="0 0 48 48" className="h-9 w-9">
        <path d="M6 24 L24 8 L42 24" stroke="#5b3a1e" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 22 V40 H37 V22" fill="#fb923c" stroke="#5b3a1e" strokeWidth="4" strokeLinejoin="round" />
        <rect x="20" y="28" width="8" height="12" rx="3" fill="#5b3a1e" />
      </svg>
    </motion.button>
  )
}

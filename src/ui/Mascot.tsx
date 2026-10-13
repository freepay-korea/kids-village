import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  say?: string
  /** 픽셀 크기 (기본 110) */
  size?: number
  /** 말풍선을 왼쪽에 둘지 (기본 오른쪽) */
  bubbleLeft?: boolean
  className?: string
}

/**
 * 마을 안내 마스코트 "삐약이"(가칭). 캐릭터 확정 전 임시 병아리.
 * 숨 쉬듯 통통 뛰고 가끔 눈을 깜빡인다. 말풍선 글자는 장식용(실제 안내는 음성).
 */
export function Mascot({ say, size = 110, bubbleLeft, className = '' }: Props) {
  return (
    <div className={`flex items-end gap-2 ${bubbleLeft ? 'flex-row-reverse' : ''} ${className}`}>
      <motion.div
        style={{ width: size, height: size }}
        animate={{ y: [0, -7, 0], rotate: [0, -2, 0, 2, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
      >
        <ChickSvg />
      </motion.div>
      <AnimatePresence>
        {say && (
          <motion.div
            key={say}
            initial={{ opacity: 0, scale: 0.4, y: 16, originX: bubbleLeft ? 1 : 0, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: 'spring', stiffness: 420, damping: 22 }}
            className="relative mb-10 rounded-3xl bg-white px-5 py-3 text-2xl text-cocoa shadow-[0_6px_0_#e5e7eb,0_10px_24px_rgba(0,0,0,.15)]"
          >
            {say}
            <span
              className={`absolute bottom-2 h-5 w-5 rotate-45 bg-white ${bubbleLeft ? '-right-2' : '-left-2'}`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ChickSvg() {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full drop-shadow-[0_8px_8px_rgba(0,0,0,0.2)]">
      <defs>
        <radialGradient id="chick-body" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#fff3a3" />
          <stop offset="0.6" stopColor="#fcd34d" />
          <stop offset="1" stopColor="#f59e0b" />
        </radialGradient>
      </defs>
      {/* 발 */}
      <g stroke="#f97316" strokeWidth="4" strokeLinecap="round" fill="none">
        <path d="M46 104 v10 m-7 -2 l7 2 l7 -2" />
        <path d="M74 104 v10 m-7 -2 l7 2 l7 -2" />
      </g>
      {/* 몸 */}
      <ellipse cx="60" cy="72" rx="36" ry="34" fill="url(#chick-body)" />
      {/* 날개 */}
      <motion.ellipse
        cx="28"
        cy="76"
        rx="12"
        ry="18"
        fill="#fbbf24"
        style={{ originX: '28px', originY: '60px' }}
        animate={{ rotate: [0, -18, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
      />
      <ellipse cx="92" cy="76" rx="12" ry="18" fill="#fbbf24" />
      {/* 머리 */}
      <circle cx="60" cy="44" r="30" fill="url(#chick-body)" />
      {/* 머리털 */}
      <path d="M52 16 q4 -10 10 -2 q4 -10 10 0" stroke="#f59e0b" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* 볼 */}
      <circle cx="40" cy="52" r="6" fill="#fca5a5" opacity="0.8" />
      <circle cx="80" cy="52" r="6" fill="#fca5a5" opacity="0.8" />
      {/* 눈 (깜빡임) */}
      <motion.g
        style={{ originY: '44px' }}
        animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
        transition={{ repeat: Infinity, duration: 3.6, times: [0, 0.82, 0.86, 0.9, 1] }}
      >
        <circle cx="49" cy="42" r="5" fill="#1f2937" />
        <circle cx="71" cy="42" r="5" fill="#1f2937" />
        <circle cx="51" cy="40" r="1.8" fill="#fff" />
        <circle cx="73" cy="40" r="1.8" fill="#fff" />
      </motion.g>
      {/* 부리 */}
      <path d="M54 52 l6 7 l6 -7 z" fill="#fb923c" />
      <path d="M54 52 h12" stroke="#ea580c" strokeWidth="1.5" />
    </svg>
  )
}

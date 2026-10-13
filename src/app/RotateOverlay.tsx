import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Mascot } from '@/ui/Mascot'
import { Pic, SvgPic } from '@/ui/Pic'

const query = '(orientation: portrait)'

/**
 * 세로로 들면 덮는 화면. 웹은 가로 고정이 안 되므로 그림으로 돌려 달라고 안내한다.
 * 앱(Capacitor)은 가로 고정이라 뜨지 않는다.
 */
export function RotateOverlay() {
  const [portrait, setPortrait] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = (e: MediaQueryListEvent) => setPortrait(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  if (!portrait) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-gradient-to-b from-sky-200 to-sky-100"
      role="dialog"
      aria-label="폰을 돌려주세요"
    >
      <motion.svg
        viewBox="0 0 120 200"
        className="h-48 drop-shadow-xl"
        animate={{ rotate: [0, 0, -90, -90, 0] }}
        transition={{ repeat: Infinity, duration: 2.6, times: [0, 0.25, 0.5, 0.8, 1], ease: 'easeInOut' }}
      >
        <rect x="10" y="10" width="100" height="180" rx="18" fill="#1f2937" />
        <rect x="18" y="26" width="84" height="148" rx="8" fill="#bae6fd" />
        <circle cx="60" cy="182" r="5" fill="#9ca3af" />
        <SvgPic emoji="🏘️" x={36} y={76} size={48} />
      </motion.svg>
      <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 2.6, ease: 'linear' }}>
        <Pic emoji="🔄" className="h-16 w-16" />
      </motion.div>
      <div className="text-outline text-3xl">폰을 돌려주세요</div>
      <div className="absolute bottom-2 left-2">
        <Mascot size={90} />
      </div>
    </div>
  )
}

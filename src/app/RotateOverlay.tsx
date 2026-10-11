import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

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
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-sky"
      role="dialog"
      aria-label="폰을 돌려주세요"
    >
      <motion.div
        className="text-9xl"
        animate={{ rotate: [0, 0, -90, -90, 0] }}
        transition={{ repeat: Infinity, duration: 2.4, times: [0, 0.2, 0.5, 0.8, 1] }}
      >
        📱
      </motion.div>
      <div className="text-6xl">🔄</div>
      <div className="text-2xl text-amber-800">폰을 돌려주세요</div>
    </div>
  )
}

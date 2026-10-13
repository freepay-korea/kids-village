import { motion } from 'framer-motion'
import { useSession } from '@/core/session'
import { unlockAudio } from '@/core/sound'
import { say } from '@/core/voice'
import { Mascot } from '@/ui/Mascot'
import { Clouds, Hills, Sun } from './Scenery'

/**
 * 첫 화면. 큰 버튼 하나만 있다.
 * 웹 브라우저는 사용자의 첫 터치 전에는 소리를 못 내기 때문에, 이 탭에서 소리를 켜고 마을로 들어간다.
 */
export function StartScreen() {
  const start = useSession((s) => s.start)

  const onStart = async () => {
    await unlockAudio()
    start()
    void say('welcome')
  }

  return (
    <motion.main
      className="relative h-full w-full overflow-hidden"
      style={{ background: 'linear-gradient(#7dd3fc 0%, #bae6fd 45%, #e0f2fe 70%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.15, filter: 'blur(6px)' }}
      transition={{ duration: 0.45 }}
    >
      <Sun className="absolute top-6 right-12" />
      <Clouds />
      <Hills />
      {/* 잔디 */}
      <div className="absolute right-0 bottom-0 left-0 h-[28%] bg-gradient-to-b from-[#86efac] to-[#22c55e]" />

      <div className="relative z-10 flex h-full w-full items-center justify-center gap-10 px-8">
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 160, damping: 16, delay: 0.1 }}
        >
          <Mascot size={150} say="안녕!" />
        </motion.div>

        <div className="flex flex-col items-center gap-6">
          <motion.h1
            className="text-outline text-5xl md:text-6xl"
            initial={{ y: -40, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 14 }}
          >
            아이 게임 마을
          </motion.h1>

          <motion.div
            className="relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.25 }}
          >
            {/* 퍼져 나가는 고리 */}
            {[0, 0.7].map((d) => (
              <motion.span
                key={d}
                className="absolute inset-0 rounded-full border-4 border-white/70"
                animate={{ scale: [1, 1.7], opacity: [0.7, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, delay: d, ease: 'easeOut' }}
              />
            ))}
            <motion.button
              type="button"
              onClick={onStart}
              aria-label="탭해서 시작"
              className="btn-3d relative flex h-40 w-40 items-center justify-center overflow-hidden rounded-full shine"
              style={{ ['--btn' as string]: '#fbbf24' }}
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
              whileTap={{ scale: 0.92 }}
            >
              <svg viewBox="0 0 100 100" className="ml-3 h-20 w-20 drop-shadow-[0_3px_0_rgba(0,0,0,0.25)]">
                <path d="M20 12 L88 50 L20 88 Z" fill="#fff" stroke="#5b3a1e" strokeWidth="7" strokeLinejoin="round" />
              </svg>
            </motion.button>
          </motion.div>
          <motion.div
            className="text-2xl text-cocoa/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            탭해서 시작
          </motion.div>
        </div>
      </div>
    </motion.main>
  )
}

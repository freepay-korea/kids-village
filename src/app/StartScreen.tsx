import { motion } from 'framer-motion'
import { useSession } from '@/core/session'
import { unlockAudio } from '@/core/sound'
import { say } from '@/core/voice'

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
      className="flex h-full w-full flex-col items-center justify-center gap-6 bg-sky"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
    >
      <div className="text-7xl">🏘️</div>
      <motion.button
        type="button"
        onClick={onStart}
        aria-label="탭해서 시작"
        className="flex h-40 w-40 items-center justify-center rounded-full bg-amber-400 text-8xl text-white shadow-xl active:scale-90"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
      >
        ▶
      </motion.button>
      <div className="text-2xl text-amber-800">탭해서 시작</div>
    </motion.main>
  )
}

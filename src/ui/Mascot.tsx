import { AnimatePresence, motion } from 'framer-motion'

/**
 * 마을 안내 마스코트. 캐릭터는 아직 미정이라 병아리 이모지로 둔다.
 * 말풍선 글자는 장식용이고, 실제 안내는 3단계에서 음성으로 붙인다.
 */
export function Mascot({ say }: { say?: string }) {
  return (
    <div className="pointer-events-none flex items-end gap-2">
      <motion.div
        className="text-7xl drop-shadow"
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
      >
        🐥
      </motion.div>
      <AnimatePresence>
        {say && (
          <motion.div
            key={say}
            initial={{ opacity: 0, scale: 0.6, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="mb-6 rounded-3xl bg-white px-5 py-3 text-2xl text-amber-900 shadow-md"
          >
            {say}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

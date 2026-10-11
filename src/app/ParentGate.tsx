import { motion } from 'framer-motion'
import { useState } from 'react'
import { makeGateQuestion } from '@/core/parentGate'
import { playSfx } from '@/core/sound'

interface Props {
  onPass: () => void
  onClose: () => void
}

/**
 * 어른만 통과하는 문. 글자로 된 덧셈 문제를 숫자 버튼 중에서 고른다.
 * 틀리면 문제가 바뀌고, 세 번 틀리면 닫힌다.
 */
export function ParentGate({ onPass, onClose }: Props) {
  const [q, setQ] = useState(makeGateQuestion)
  const [misses, setMisses] = useState(0)

  const choose = (n: number) => {
    if (n === q.answer) {
      playSfx('correct')
      onPass()
      return
    }
    playSfx('wrong')
    if (misses + 1 >= 3) onClose()
    else {
      setMisses(misses + 1)
      setQ(makeGateQuestion())
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-label="어른 확인"
    >
      <motion.div
        className="flex flex-col items-center gap-5 rounded-3xl bg-white p-6 shadow-2xl"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-lg text-gray-500">어른에게 물어보세요</div>
        <div className="text-3xl text-gray-800">{q.prompt}</div>
        <div className="flex gap-3">
          {q.choices.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => choose(n)}
              className="h-touch w-touch rounded-2xl bg-gray-100 text-3xl text-gray-800 active:bg-gray-300"
            >
              {n}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="h-touch w-touch rounded-full bg-gray-100 text-2xl"
        >
          ✕
        </button>
      </motion.div>
    </motion.div>
  )
}

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { games } from '@/games/registry'
import { useSession } from '@/core/session'
import { useStickers } from '@/core/stickers'
import { playSfx } from '@/core/sound'
import { lineText, say } from '@/core/voice'
import { Building } from './Building'
import { ParentGate } from './ParentGate'
import { Mascot } from '@/ui/Mascot'

/**
 * 마을 지도. 가로로 살짝 스크롤되는 한 장에
 * 스티커북(마을 입구) + 건물 5개 + 빈 공터(다음 업데이트 예고)가 놓인다.
 */
export function Village() {
  const navigate = useNavigate()
  const [entering, setEntering] = useState<string | null>(null)
  const [bubble, setBubble] = useState<string | undefined>()
  const [gate, setGate] = useState(false)
  const evening = useSession((s) => s.evening)
  const earned = useStickers((s) => s.earned)

  /** 마스코트가 대사 키를 말하고 말풍선에 글자도 띄운다 */
  const speak = (key: string, holdMs = 1500) => {
    setBubble(lineText(key))
    void say(key)
    window.setTimeout(() => setBubble((b) => (b === lineText(key) ? undefined : b)), holdMs)
  }

  const enter = (id: string) => {
    if (entering) return
    setEntering(id)
    playSfx('open')
    speak(`enter.${id}`, 3000)
    // 마스코트가 이름을 말하고 문이 열리는 동안 기다렸다가 들어간다
    window.setTimeout(() => navigate(`/${id}`), 700)
  }

  return (
    <motion.main
      className="relative h-full w-full overflow-x-auto overflow-y-hidden"
      style={{
        background: evening
          ? 'linear-gradient(#fdba74 0%, #fca5a5 60%, #86efac 60%, #4ade80 100%)'
          : 'linear-gradient(#bae6fd 0%, #e0f2fe 60%, #86efac 60%, #4ade80 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 해/달과 구름 */}
      <div className="pointer-events-none absolute top-4 right-8 text-6xl">{evening ? '🌙' : '☀️'}</div>
      <motion.div
        className="pointer-events-none absolute top-8 left-10 text-5xl"
        animate={{ x: [0, 40, 0] }}
        transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
      >
        ☁️
      </motion.div>

      {/* 마을 한 장: 넓어서 좁은 화면에서는 가로 스크롤 */}
      <div className="flex h-full min-w-max items-end gap-6 px-10 pb-10">
        <StickerBookEntrance
          onTap={() => {
            void say('stickerbook')
            navigate('/stickers')
          }}
        />
        {games.map((game) => (
          <Building
            key={game.id}
            game={game}
            stickerCount={(earned[game.id] ?? []).length}
            entering={entering === game.id}
            onTap={() => enter(game.id)}
          />
        ))}
        <EmptyLot onTap={() => speak('soon')} />
      </div>

      {/* 마스코트는 항상 왼쪽 아래 */}
      <div className="pointer-events-none fixed bottom-2 left-4 z-30">
        <Mascot say={bubble} />
      </div>

      {/* 어른용 설정 버튼: 작고 구석에. 눌러도 덧셈 문제를 풀어야 열린다 */}
      <button
        type="button"
        onClick={() => setGate(true)}
        aria-label="부모 설정"
        className="fixed top-3 right-3 z-30 flex h-touch w-touch items-center justify-center rounded-full bg-white/50 text-3xl"
      >
        ⚙️
      </button>
      <AnimatePresence>
        {gate && <ParentGate onPass={() => navigate('/settings')} onClose={() => setGate(false)} />}
      </AnimatePresence>
    </motion.main>
  )
}

/** 마을 입구의 스티커북. 4단계에서 실제 스티커북 화면과 연결된다. */
function StickerBookEntrance({ onTap }: { onTap: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onTap}
      aria-label="스티커북"
      className="mb-8 flex h-40 w-36 flex-col items-center justify-center gap-2 rounded-3xl bg-pink-300 text-7xl shadow-lg"
      whileTap={{ scale: 0.95 }}
    >
      📖
      <span className="text-xl text-pink-900">스티커북</span>
    </motion.button>
  )
}

/** 다음 업데이트 예고용 빈 공터. 탭하면 흔들리며 "곧 열려요". */
function EmptyLot({ onTap }: { onTap: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onTap}
      aria-label="곧 열려요"
      className="mb-8 flex h-40 w-44 flex-col items-center justify-center gap-2 rounded-3xl border-4 border-dashed border-amber-500/60 bg-amber-200/60 text-6xl"
      whileTap={{ rotate: [0, -5, 5, -5, 0] }}
    >
      🚧
      <span className="text-lg text-amber-800">곧 열려요</span>
    </motion.button>
  )
}

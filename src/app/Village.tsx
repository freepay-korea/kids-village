import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { games } from '@/games/registry'
import { useSession } from '@/core/session'
import { useStickers } from '@/core/stickers'
import { playSfx } from '@/core/sound'
import { lineText, say } from '@/core/voice'
import { Building } from './Building'
import { ParentGate } from './ParentGate'
import { Clouds, Flower, Hills, Sun, Tree } from './Scenery'
import { Mascot } from '@/ui/Mascot'

/**
 * 마을 지도. 가로로 살짝 스크롤되는 한 장에
 * 스티커북(마을 입구) + 건물 5개 + 빈 공터(다음 업데이트 예고)가 놓인다.
 * 구름·언덕은 건물보다 느리게 움직여(패럴랙스) 깊이감을 준다.
 */
export function Village() {
  const navigate = useNavigate()
  const [entering, setEntering] = useState<string | null>(null)
  const [bubble, setBubble] = useState<string | undefined>()
  const [gate, setGate] = useState(false)
  const evening = useSession((s) => s.evening)
  const earned = useStickers((s) => s.earned)
  const scroller = useRef<HTMLDivElement>(null)

  const scrollX = useMotionValue(0)
  const cloudsX = useTransform(scrollX, (v) => v * 0.75)
  const hillsX = useTransform(scrollX, (v) => v * 0.45)

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
    window.setTimeout(() => navigate(`/${id}`), 850)
  }

  return (
    <motion.main
      ref={scroller}
      onScroll={(e) => scrollX.set(e.currentTarget.scrollLeft)}
      className="relative h-full w-full overflow-x-auto overflow-y-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 하늘 (스크롤에 고정) */}
      <motion.div
        className="pointer-events-none fixed inset-0 -z-10"
        animate={{
          background: evening
            ? 'linear-gradient(#f59e0b 0%, #fb923c 35%, #fda4af 62%, #4ade80 62%)'
            : 'linear-gradient(#7dd3fc 0%, #bae6fd 40%, #e0f2fe 62%, #4ade80 62%)',
        }}
        transition={{ duration: 2 }}
      />

      {/* 마을 한 장. 넓어서 좁은 화면에서는 가로 스크롤 */}
      <div className="relative h-full min-w-max">
        <Sun evening={evening} className="absolute top-4 right-12" />
        <Clouds x={cloudsX} />
        <Hills x={hillsX} evening={evening} />

        {/* 땅: 잔디 + 길 */}
        <div
          className="absolute right-0 bottom-0 left-0 h-[38%]"
          style={{ background: evening ? 'linear-gradient(#4ade80, #16a34a)' : 'linear-gradient(#86efac, #22c55e)' }}
        >
          <div className="absolute right-0 bottom-[12%] left-0 h-10 bg-[#f5deb3] shadow-[inset_0_4px_0_#e2c38f]">
            <div className="h-full w-full border-y-4 border-dashed border-white/50" />
          </div>
        </div>

        {/* 뒤쪽 나무들 */}
        <div className="pointer-events-none absolute right-0 bottom-[33%] left-0 flex justify-around px-20 opacity-90">
          {Array.from({ length: 9 }, (_, i) => (
            <Tree key={i} size={60 + (i % 3) * 14} dark={i % 2 === 0} />
          ))}
        </div>

        {/* 건물 줄 */}
        <div className="relative flex h-full items-end gap-4 pr-10 pb-16 pl-44">
          <StickerBookEntrance
            onTap={() => {
              void say('stickerbook')
              navigate('/stickers')
            }}
          />
          {games.map((game, i) => (
            <Building
              key={game.id}
              game={game}
              index={i}
              stickerCount={(earned[game.id] ?? []).length}
              entering={entering === game.id}
              onTap={() => enter(game.id)}
            />
          ))}
          <EmptyLot onTap={() => speak('soon')} />
        </div>

        {/* 앞쪽 꽃 */}
        <div className="pointer-events-none absolute right-0 bottom-3 left-0 flex justify-around px-6">
          {['#f472b6', '#fde047', '#f87171', '#c084fc', '#fb923c', '#f472b6', '#60a5fa', '#fde047'].map((c, i) => (
            <Flower key={i} color={c} size={22 + (i % 2) * 8} />
          ))}
        </div>
      </div>

      {/* 마스코트는 항상 왼쪽 아래 */}
      <div className="pointer-events-none fixed bottom-2 left-4 z-30">
        <Mascot say={bubble} size={120} />
      </div>

      {/* 어른용 설정 버튼: 작고 구석에. 눌러도 덧셈 문제를 풀어야 열린다 */}
      <button
        type="button"
        onClick={() => setGate(true)}
        aria-label="부모 설정"
        className="glass fixed top-3 right-3 z-30 flex h-touch w-touch items-center justify-center rounded-full text-3xl opacity-80"
      >
        ⚙️
      </button>
      <AnimatePresence>
        {gate && <ParentGate onPass={() => navigate('/settings')} onClose={() => setGate(false)} />}
      </AnimatePresence>

      {/* 건물에 들어갈 때 하얗게 밝아지는 전환 */}
      <AnimatePresence>
        {entering && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-40 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.35 }}
          />
        )}
      </AnimatePresence>
    </motion.main>
  )
}

/** 마을 입구의 스티커북 */
function StickerBookEntrance({ onTap }: { onTap: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onTap}
      aria-label="스티커북"
      className="mb-6 flex flex-col items-center"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 16 }}
      whileTap={{ scale: 0.94, rotate: -3 }}
    >
      <motion.div
        className="relative h-40 w-36 rounded-2xl rounded-l-md border-[5px] border-[#5b3a1e] bg-gradient-to-br from-pink-300 to-pink-400 shadow-[8px_8px_0_#be185d,0_14px_24px_rgba(0,0,0,0.2)]"
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
      >
        <div className="absolute inset-y-3 left-2 w-2 rounded bg-white/40" />
        <div className="absolute inset-x-5 top-6 rounded-xl bg-white/90 p-2 text-center text-4xl shadow-inner">⭐</div>
        <div className="absolute right-3 bottom-3 left-8 h-2 rounded bg-white/50" />
        <div className="absolute right-3 bottom-7 left-8 h-2 rounded bg-white/50" />
      </motion.div>
      <div className="mt-3 rounded-full border-[3px] border-white bg-pink-400 px-5 py-1 text-xl text-white shadow-[0_4px_0_rgba(0,0,0,0.15)]" style={{ textShadow: '0 2px 0 rgba(0,0,0,0.25)' }}>
        스티커북
      </div>
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
      className="mb-8 flex h-44 w-48 flex-col items-center justify-end gap-2 rounded-3xl border-4 border-dashed border-white/70 bg-white/25 pb-4"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.5 }}
      whileTap={{ rotate: [0, -4, 4, -3, 3, 0], transition: { duration: 0.5 } }}
    >
      <svg viewBox="0 0 120 90" className="h-24 w-32 drop-shadow">
        <rect x="10" y="30" width="100" height="22" rx="6" fill="#fbbf24" stroke="#5b3a1e" strokeWidth="4" />
        {[18, 42, 66, 90].map((x) => <rect key={x} x={x} y="32" width="10" height="18" fill="#1f2937" transform={`skewX(-20) translate(12 0)`} />)}
        <path d="M24 52 L18 86 M96 52 L102 86" stroke="#5b3a1e" strokeWidth="5" strokeLinecap="round" />
        <circle cx="60" cy="18" r="10" fill="#fef3c7" stroke="#5b3a1e" strokeWidth="4" />
      </svg>
      <span className="text-lg text-white" style={{ textShadow: '0 2px 0 rgba(0,0,0,0.3)' }}>곧 열려요</span>
    </motion.button>
  )
}

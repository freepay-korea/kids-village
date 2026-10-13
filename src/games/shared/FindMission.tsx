import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { feedback } from '@/core/feedback'
import { useSettings } from '@/core/settings'
import { playSfx } from '@/core/sound'
import { say } from '@/core/voice'
import { Celebration } from '@/ui/Celebration'
import { Mascot } from '@/ui/Mascot'
import { Pic } from '@/ui/Pic'
import { GameCard } from './GameCard'
import type { Item } from './types'

interface Props {
  items: Item[]
  /** 문제 앞에 말하는 대사 키 (예: "누구 소리지?" / "어디 있지?") */
  promptKey: string
  /** 문제 수 */
  rounds?: number
  /** false면 항목을 먼저 말하고 안내를 나중에 한다 ("사과" → "어디 있지?") */
  promptFirst?: boolean
  /** 다 맞히면 호출. 마지막에 찾은 항목 id를 넘긴다 */
  onDone: (lastItemId: string) => void
}

const ROUND_PAUSE = 1400

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function makeOptions(items: Item[], target: Item, count: number): Item[] {
  const others = shuffle(items.filter((it) => it.id !== target.id)).slice(0, count - 1)
  return shuffle([target, ...others])
}

function choiceCount(streak: number, easy: boolean) {
  return easy ? 2 : Math.min(4, 2 + Math.floor(streak / 2))
}

/**
 * 찾기 미션: 소리를 듣고 2~4장 중 맞는 그림을 찾는다. 5문제 끝나면 스티커.
 * - 보기 수는 2장에서 시작해 연속 정답마다 3장, 4장으로 늘어난다 (쉬움 고정이면 항상 2장)
 * - 보기는 문제가 시작될 때 한 번만 만든다 (문제 도중에 바뀌지 않는다)
 * - 틀리면 그림이 흔들리고 "다시 찾아볼까?", 감점 없음
 * - 같은 문제를 2번 틀리면 정답이 반짝인다
 */
export function FindMission({ items, promptKey, rounds = 5, promptFirst = true, onDone }: Props) {
  const easy = useSettings((s) => s.easyMode)

  const targets = useMemo(() => {
    const picks: Item[] = []
    let pool = shuffle(items)
    for (let i = 0; i < rounds; i++) {
      if (pool.length === 0) pool = shuffle(items.filter((it) => it.id !== picks[i - 1]?.id))
      picks.push(pool.pop()!)
    }
    return picks
  }, [items, rounds])

  const [round, setRound] = useState(0)
  const [streak, setStreak] = useState(0)
  const [options, setOptions] = useState(() => makeOptions(items, targets[0], choiceCount(0, easy)))
  const [misses, setMisses] = useState(0)
  const [shaking, setShaking] = useState<string | null>(null)
  const [solved, setSolved] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const doneRef = useRef(false)

  const target = targets[round]

  const ask = () => {
    const [first, second] = promptFirst ? [promptKey, target.questionKey] : [target.questionKey, promptKey]
    setSpeaking(true)
    void say(first)
      .then(() => say(second))
      .finally(() => setSpeaking(false))
  }

  useEffect(() => {
    const id = window.setTimeout(ask, 500)
    return () => window.clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round])

  const choose = (item: Item) => {
    if (solved) return
    if (item.id === target.id) {
      setSolved(true)
      feedback.correct()
      window.setTimeout(() => {
        if (round + 1 >= rounds) {
          if (!doneRef.current) {
            doneRef.current = true
            onDone(target.id)
          }
          return
        }
        const nextStreak = streak + 1
        setRound(round + 1)
        setStreak(nextStreak)
        setOptions(makeOptions(items, targets[round + 1], choiceCount(nextStreak, easy)))
        setMisses(0)
        setSolved(false)
      }, ROUND_PAUSE)
    } else {
      setShaking(item.id)
      setStreak(0)
      feedback.wrong()
      const m = misses + 1
      setMisses(m)
      if (m >= 2) window.setTimeout(() => feedback.hint(), 900)
      window.setTimeout(() => setShaking((s) => (s === item.id ? null : s)), 500)
    }
  }

  const hint = misses >= 2 && !solved
  const done = round + (solved ? 1 : 0)

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-6 p-4 pt-16">
      {/* 진행: 별 5개가 채워진다 */}
      <div className="glass flex gap-2 rounded-full px-5 py-2 text-3xl" aria-label={`${done} / ${rounds}`}>
        {Array.from({ length: rounds }, (_, i) => (
          <motion.span
            key={i}
            animate={i < done ? { scale: [1, 1.6, 1], filter: 'grayscale(0)', opacity: 1 } : { filter: 'grayscale(1)', opacity: 0.35 }}
            transition={{ duration: 0.5 }}
          >
            <Pic emoji="⭐" className="h-9 w-9" />
          </motion.span>
        ))}
      </div>

      <div className="flex items-center gap-6">
        {/* 마스코트 + 다시 듣기 */}
        <div className="flex flex-col items-center gap-2">
          <motion.div animate={speaking ? { rotate: [0, -6, 6, -6, 0] } : { rotate: 0 }} transition={{ repeat: speaking ? Infinity : 0, duration: 0.6 }}>
            <Mascot size={100} />
          </motion.div>
          <motion.button
            type="button"
            onClick={() => {
              playSfx('tap')
              ask()
            }}
            aria-label="다시 듣기"
            className="btn-3d flex h-touch w-touch items-center justify-center rounded-full text-4xl"
            style={{ ['--btn' as string]: '#ffffff' }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
            whileTap={{ scale: 0.9 }}
          >
            <Pic emoji="🔊" className="h-10 w-10" />
          </motion.button>
        </div>

        <div className="flex gap-5">
          {options.map((item, i) => {
            const isTarget = item.id === target.id
            const correct = solved && isTarget
            return (
              <GameCard
                key={`${round}-${item.id}`}
                label={item.name}
                onClick={() => choose(item)}
                size={136}
                delay={i * 0.08}
                highlight={hint && isTarget}
                burst={correct}
                animate={
                  shaking === item.id
                    ? { x: [0, -14, 14, -10, 10, 0], filter: ['grayscale(0)', 'grayscale(0.6)', 'grayscale(0)'] }
                    : correct
                      ? { scale: [1, 1.35, 1.2], rotate: [0, -8, 8, 0], y: -12 }
                      : solved
                        ? { opacity: 0.4, scale: 0.9 }
                        : undefined
                }
                transition={shaking === item.id ? { duration: 0.45, type: 'tween' } : undefined}
              >
                <Pic emoji={item.icon} className="h-full w-full" />
              </GameCard>
            )
          })}
        </div>
      </div>

      {solved && round + 1 < rounds && <Celebration count={18} small y={55} />}
    </div>
  )
}

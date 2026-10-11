import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { feedback } from '@/core/feedback'
import { useSettings } from '@/core/settings'
import { playSfx } from '@/core/sound'
import { say } from '@/core/voice'
import { Celebration } from '@/ui/Celebration'
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

const ROUND_PAUSE = 1300

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

  // 문제마다 정답 하나. 같은 정답이 연달아 나오지 않게 한다.
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
  const doneRef = useRef(false)

  const target = targets[round]

  const ask = () => {
    const [first, second] = promptFirst ? [promptKey, target.questionKey] : [target.questionKey, promptKey]
    void say(first).then(() => say(second))
  }

  // 새 문제가 나오면 들려준다
  useEffect(() => {
    const id = window.setTimeout(ask, 400)
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
    }
  }

  const hint = misses >= 2 && !solved

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-4 pt-16">
      {/* 진행: 별 5개 */}
      <div className="flex gap-2 text-3xl" aria-label={`${round + (solved ? 1 : 0)} / ${rounds}`}>
        {Array.from({ length: rounds }, (_, i) => (
          <span key={i} style={{ opacity: i < round + (solved ? 1 : 0) ? 1 : 0.25 }}>
            ⭐
          </span>
        ))}
      </div>

      <div className="flex items-center gap-6">
        {/* 다시 듣기 */}
        <motion.button
          type="button"
          onClick={() => {
            playSfx('tap')
            ask()
          }}
          aria-label="다시 듣기"
          className="flex h-touch w-touch items-center justify-center rounded-full bg-white text-4xl shadow-md"
          whileTap={{ scale: 0.9 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          🔊
        </motion.button>

        <div className="flex gap-4">
          {options.map((item) => {
            const isTarget = item.id === target.id
            return (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => choose(item)}
                aria-label={item.name}
                className="flex h-32 w-32 items-center justify-center rounded-3xl bg-white/90 text-7xl shadow-lg"
                whileTap={{ scale: 0.9 }}
                animate={
                  shaking === item.id
                    ? { x: [0, -12, 12, -8, 8, 0] }
                    : solved && isTarget
                      ? { scale: [1, 1.3, 1.15], rotate: [0, -6, 6, 0] }
                      : hint && isTarget
                        ? { scale: [1, 1.12, 1], boxShadow: ['0 0 0 0 #fde047', '0 0 0 14px #fde04700'] }
                        : { x: 0, scale: 1 }
                }
                transition={
                  hint && isTarget && !solved
                    ? { repeat: Infinity, duration: 1 }
                    : { duration: 0.45 }
                }
                onAnimationComplete={() => shaking === item.id && setShaking(null)}
              >
                {item.icon}
              </motion.button>
            )
          })}
        </div>
      </div>

      {solved && round + 1 < rounds && <Celebration count={14} />}
    </div>
  )
}

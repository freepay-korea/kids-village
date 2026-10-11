import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { registerLines } from '@/core/voice'
import { say } from '@/core/voice'
import { playSfx } from '@/core/sound'
import { feedback } from '@/core/feedback'
import { useSettings } from '@/core/settings'
import type { GameProps } from '@/games/types'
import { ModeSelect } from '../shared/ModeSelect'
import { BalloonScene } from './scene'
import { colors, type BalloonColor } from './colors'
import lines from './ko.json'

registerLines(lines)

type Mode = 'select' | 'play' | 'mission'

/**
 * 풍선 공원 (2세~, PixiJS)
 * - 놀이: 떠오르는 풍선 터뜨리기, 터질 때 색 이름 소리
 * - 미션: "빨간 풍선 3개 터뜨려!" 색·숫자 지시 3개 완료 → 스티커
 */
export default function BalloonPark({ onComplete }: GameProps) {
  const [mode, setMode] = useState<Mode>('select')
  if (mode === 'select')
    return (
      <ModeSelect
        color="#38bdf8"
        icon="🎈"
        onPlay={() => setMode('play')}
        onMission={() => setMode('mission')}
      />
    )
  return <Park mission={mode === 'mission'} onComplete={onComplete} />
}

interface Task {
  color: BalloonColor
  count: number
}

const MISSIONS = 3

function Park({ mission, onComplete }: { mission: boolean; onComplete: (id: string) => void }) {
  const host = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<BalloonScene | null>(null)
  const easy = useSettings((s) => s.easyMode)
  const [task, setTask] = useState<Task | null>(null)
  const [popped, setPopped] = useState(0)
  const [done, setDone] = useState(0)
  const taskRef = useRef<Task | null>(null)
  const poppedRef = useRef(0)
  const doneRef = useRef(0)
  const finishedRef = useRef(false)

  const nextTask = (index: number) => {
    const count = easy ? 1 : Math.min(3, index + 1)
    const color = colors[Math.floor(Math.random() * colors.length)]
    const t = { color, count }
    taskRef.current = t
    poppedRef.current = 0
    setTask(t)
    setPopped(0)
    const scene = sceneRef.current
    if (scene) {
      scene.favored = color
      scene.blocked = true
      scene.speed = easy ? 0.8 : 1 + index * 0.25
    }
    void say(`balloon.mission.${color.id}.${count}`)
  }

  const handlePop = (color: BalloonColor) => {
    const t = taskRef.current
    if (!mission || !t) {
      playSfx('pop')
      void say(`balloon.${color.id}`)
      return
    }
    if (color.id !== t.color.id) {
      playSfx('wrong')
      return
    }
    playSfx('pop')
    poppedRef.current += 1
    setPopped(poppedRef.current)
    if (poppedRef.current >= t.count) {
      taskRef.current = null
      doneRef.current += 1
      setDone(doneRef.current)
      feedback.correct()
      if (doneRef.current >= MISSIONS) {
        if (!finishedRef.current) {
          finishedRef.current = true
          window.setTimeout(() => onComplete(t.color.id === 'red' ? 'red' : ''), 1200)
        }
        return
      }
      window.setTimeout(() => nextTask(doneRef.current), 1600)
    } else {
      void say(`balloon.${color.id}`)
    }
  }

  const popRef = useRef(handlePop)
  popRef.current = handlePop

  useEffect(() => {
    const el = host.current
    if (!el) return
    const scene = new BalloonScene({ onPop: (c) => popRef.current(c) })
    sceneRef.current = scene
    let alive = true
    void scene.mount(el).then(() => {
      if (!alive) return
      if (mission) nextTask(0)
    })
    return () => {
      alive = false
      sceneRef.current = null
      scene.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mission])

  return (
    <div className="relative h-full w-full">
      <div ref={host} className="absolute inset-0" />
      {mission && task && (
        <div className="pointer-events-none absolute top-3 left-1/2 flex -translate-x-1/2 items-center gap-4 rounded-full bg-white/85 px-5 py-2 shadow-md">
          <div className="flex gap-1 text-2xl" aria-label={`미션 ${done} / ${MISSIONS}`}>
            {Array.from({ length: MISSIONS }, (_, i) => (
              <span key={i} style={{ opacity: i < done ? 1 : 0.25 }}>
                ⭐
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2" aria-label={`${task.color.adj} 풍선 ${task.count}개`}>
            {Array.from({ length: task.count }, (_, i) => (
              <motion.span
                key={i}
                className="inline-block h-9 w-7 rounded-full"
                style={{ backgroundColor: task.color.css, opacity: i < popped ? 0.3 : 1 }}
                animate={i === popped ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1 }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => say(`balloon.mission.${task.color.id}.${task.count}`)}
            aria-label="다시 듣기"
            className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-2xl"
          >
            🔊
          </button>
        </div>
      )}
    </div>
  )
}

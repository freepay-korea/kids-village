import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { registerLines, say } from '@/core/voice'
import { playSfx } from '@/core/sound'
import { feedback } from '@/core/feedback'
import type { GameProps } from '@/games/types'
import { ModeSelect } from '../shared/ModeSelect'
import { Pic } from '@/ui/Pic'
import { TapGallery } from '../shared/TapGallery'
import { WashScene, type WashStage } from './washScene'
import { vehicles } from './vehicles'
import lines from './ko.json'

registerLines(lines)

/**
 * 부릉부릉 차고 (2세~)
 * - 놀이: 소리 도감, 탈것 탭하면 소리·점프 (React)
 * - 미션: 세차장, 거품 문지르기 → 물 뿌리기 → 반짝 (PixiJS) → 스티커
 */
export default function Garage({ onComplete }: GameProps) {
  const [mode, setMode] = useState<'select' | 'play' | 'mission'>('select')
  if (mode === 'play') return <TapGallery items={vehicles} />
  if (mode === 'mission') return <CarWash onDone={() => onComplete('')} />
  return (
    <ModeSelect
      color="#fb923c"
      icon="🚗"
      onPlay={() => setMode('play')}
      onMission={() => setMode('mission')}
    />
  )
}

const STEPS: { stage: WashStage; icon: string; label: string }[] = [
  { stage: 'scrub', icon: '🧽', label: '거품 문지르기' },
  { stage: 'rinse', icon: '💦', label: '물 뿌리기' },
  { stage: 'shine', icon: '✨', label: '반짝' },
]

function CarWash({ onDone }: { onDone: () => void }) {
  const host = useRef<HTMLDivElement>(null)
  const [stage, setStage] = useState<WashStage>('scrub')
  const doneRef = useRef(false)

  useEffect(() => {
    const el = host.current
    if (!el) return
    const scene = new WashScene({
      onStage: (s) => {
        setStage(s)
        if (s === 'rinse') {
          feedback.correct()
          window.setTimeout(() => say('garage.wash.rinse'), 900)
        } else if (s === 'shine') {
          playSfx('sticker')
          void say('garage.wash.shine')
        } else if (s === 'done' && !doneRef.current) {
          doneRef.current = true
          onDone()
        }
      },
      onTouch: (s) => playSfx(s === 'scrub' ? 'sparkle' : 'pop'),
    })
    void scene.mount(el).then(() => say('garage.wash.scrub'))
    return () => scene.destroy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative h-full w-full" style={{ background: 'linear-gradient(#fdba74, #fed7aa 70%, #9ca3af 70%, #6b7280)' }}>
      <div ref={host} className="absolute inset-0 touch-none" />
      <div className="pointer-events-none absolute top-3 left-1/2 flex -translate-x-1/2 gap-3 rounded-full bg-white/85 px-5 py-2 shadow-md">
        {STEPS.map((s, i) => {
          const current = s.stage === stage || (stage === 'done' && s.stage === 'shine')
          const passed = STEPS.findIndex((x) => x.stage === stage) > i || stage === 'done'
          return (
            <motion.span
              key={s.stage}
              className="flex"
              aria-label={s.label}
              style={{ opacity: current || passed ? 1 : 0.3 }}
              animate={current ? { scale: [1, 1.25, 1] } : { scale: 1 }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <Pic emoji={s.icon} className="h-10 w-10" />
            </motion.span>
          )
        })}
      </div>
    </div>
  )
}

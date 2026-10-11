import { useState } from 'react'
import { registerLines } from '@/core/voice'
import type { GameProps } from '@/games/types'
import { ModeSelect } from '../shared/ModeSelect'
import { TapGallery } from '../shared/TapGallery'
import { FindMission } from '../shared/FindMission'
import { animals } from './animals'
import lines from './ko.json'

registerLines(lines)

/**
 * 동물 농장 (2세~)
 * - 놀이: 동물 탭하면 울음소리·점프
 * - 미션: "음메~ 누구 소리지?" 소리 듣고 동물 찾기 5문제 → 스티커
 */
export default function Farm({ onComplete }: GameProps) {
  const [mode, setMode] = useState<'select' | 'play' | 'mission'>('select')

  if (mode === 'play') return <TapGallery items={animals} />
  if (mode === 'mission')
    return <FindMission items={animals} promptKey="farm.who" onDone={(id) => onComplete(id)} />
  return (
    <ModeSelect
      color="#4ade80"
      icon="🐄"
      onPlay={() => setMode('play')}
      onMission={() => setMode('mission')}
    />
  )
}

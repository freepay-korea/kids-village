import { useState } from 'react'
import { motion } from 'framer-motion'
import { registerLines } from '@/core/voice'
import { playSfx } from '@/core/sound'
import type { GameProps } from '@/games/types'
import { ModeSelect } from '../shared/ModeSelect'
import { TapGallery } from '../shared/TapGallery'
import { FindMission } from '../shared/FindMission'
import { allWords, categories, type WordCategory } from './words'
import lines from './ko.json'

registerLines(lines)

/**
 * 콕콕 단어 학교 (2세~). 동물 농장과 같은 구조.
 * - 놀이: 분류를 고르고 그림을 탭하면 단어 소리
 * - 미션: "사과 어디 있지?" 2~4장 중 찾기 5문제 → 스티커
 */
export default function WordSchool({ onComplete }: GameProps) {
  const [mode, setMode] = useState<'select' | 'play' | 'mission'>('select')
  const [category, setCategory] = useState<WordCategory | null>(null)

  if (mode === 'play') {
    if (!category) return <CategoryPicker onPick={setCategory} />
    return (
      <>
        <TapGallery items={category.words} />
        <BackToCategories onClick={() => setCategory(null)} />
      </>
    )
  }
  if (mode === 'mission')
    return (
      <FindMission
        items={allWords}
        promptKey="word.where"
        promptFirst={false}
        onDone={(id) => onComplete(id)}
      />
    )
  return (
    <ModeSelect
      color="#facc15"
      icon="🏫"
      onPlay={() => setMode('play')}
      onMission={() => setMode('mission')}
    />
  )
}

function CategoryPicker({ onPick }: { onPick: (c: WordCategory) => void }) {
  return (
    <div className="flex h-full w-full items-center justify-center p-4 pt-16">
      <div className="grid grid-cols-3 gap-5">
        {categories.map((c) => (
          <motion.button
            key={c.id}
            type="button"
            onClick={() => {
              playSfx('pop')
              onPick(c)
            }}
            aria-label={c.name}
            className="flex h-28 w-36 items-center justify-center rounded-3xl bg-white/85 text-7xl shadow-md"
            whileTap={{ scale: 0.9 }}
          >
            {c.icon}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

function BackToCategories({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="다른 그림 보기"
      className="absolute top-3 right-3 z-40 flex h-touch w-touch items-center justify-center rounded-full bg-white/90 text-4xl shadow-lg active:scale-90"
    >
      ↩️
    </button>
  )
}

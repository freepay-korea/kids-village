import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { registerLines, say } from '@/core/voice'
import { playSfx } from '@/core/sound'
import { feedback } from '@/core/feedback'
import { gallery, type Artwork } from '@/core/gallery'
import type { GameProps } from '@/games/types'
import { Celebration } from '@/ui/Celebration'
import { ModeSelect } from '../shared/ModeSelect'
import { Canvas, type Drawing } from './Canvas'
import { paletteColors, pictures, stampEmojis, type Picture } from './pictures'
import lines from './ko.json'

registerLines(lines)

type Mode = 'select' | 'play' | 'mission' | 'gallery'
type Tool = { color: string } | { stamp: string }

const emptyDrawing = (): Drawing => ({ fills: {}, stamps: [] })

/**
 * 미술관 (3세~, React+SVG)
 * - 놀이: 색 고르고 밑그림 칸 탭하면 채워짐, 스탬프 찍기
 * - 미션: 밑그림 칸을 모두 채우면 완성 축하, 갤러리 저장 → 스티커
 * - 갤러리: 저장한 그림 보기 (IndexedDB)
 */
export default function ArtMuseum({ onComplete }: GameProps) {
  const [mode, setMode] = useState<Mode>('select')

  if (mode === 'play') return <Studio mission={false} onDone={() => {}} />
  if (mode === 'mission') return <Studio mission onDone={() => onComplete('')} />
  if (mode === 'gallery') return <Gallery onBack={() => setMode('select')} />

  return (
    <ModeSelect
      color="#c4b5fd"
      icon="🎨"
      onPlay={() => setMode('play')}
      onMission={() => setMode('mission')}
      extra={{ icon: '🖼️', label: '갤러리', onClick: () => setMode('gallery') }}
    />
  )
}

function Studio({ mission, onDone }: { mission: boolean; onDone: () => void }) {
  const [picture, setPicture] = useState<Picture>(
    () => (mission ? pictures[Math.floor(Math.random() * pictures.length)] : pictures[0]),
  )
  const [drawing, setDrawing] = useState<Drawing>(emptyDrawing)
  const [tool, setTool] = useState<Tool>({ color: paletteColors[0] })
  const [finished, setFinished] = useState(false)
  const doneRef = useRef(false)

  useEffect(() => {
    void say('art.pick')
  }, [])

  const allFilled = picture.regions.every((r) => drawing.fills[r.id])

  useEffect(() => {
    if (!mission || !allFilled || doneRef.current) return
    doneRef.current = true
    setFinished(true)
    feedback.correct()
    void say('art.done')
    void gallery.save({ createdAt: Date.now(), pictureId: picture.id, ...drawing })
    window.setTimeout(onDone, 2200)
  }, [mission, allFilled, drawing, picture.id, onDone])

  const changePicture = (p: Picture) => {
    playSfx('tap')
    setPicture(p)
    setDrawing(emptyDrawing())
  }

  const saveAndClear = async () => {
    if (Object.keys(drawing.fills).length === 0 && drawing.stamps.length === 0) return
    playSfx('sticker')
    await gallery.save({ createdAt: Date.now(), pictureId: picture.id, ...drawing })
    setDrawing(emptyDrawing())
  }

  return (
    <div className="flex h-full w-full items-stretch gap-3 p-3 pt-16 pl-20">
      {/* 팔레트 */}
      <div className="flex flex-col flex-wrap content-start gap-2" aria-label="팔레트">
        {paletteColors.map((c) => (
          <ToolButton
            key={c}
            label={`색 ${c}`}
            active={'color' in tool && tool.color === c}
            onClick={() => setTool({ color: c })}
            style={{ backgroundColor: c }}
          />
        ))}
        {stampEmojis.map((s) => (
          <ToolButton
            key={s}
            label={`도장 ${s}`}
            active={'stamp' in tool && tool.stamp === s}
            onClick={() => setTool({ stamp: s })}
            style={{ backgroundColor: '#fff' }}
          >
            {s}
          </ToolButton>
        ))}
      </div>

      {/* 캔버스 */}
      <div className="relative flex flex-1 items-center justify-center">
        <Canvas picture={picture} drawing={drawing} tool={tool} onChange={setDrawing} className="h-full max-w-full" />
        {finished && <Celebration />}
      </div>

      {/* 오른쪽: 밑그림 고르기(놀이) / 저장 */}
      {!mission && (
        <div className="flex flex-col gap-2">
          {pictures.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => changePicture(p)}
              aria-label={p.name}
              className={`btn-3d flex h-touch w-touch items-center justify-center rounded-2xl text-4xl ${
                p.id === picture.id ? 'ring-4 ring-amber-400' : 'opacity-80'
              }`}
              style={{ ['--btn' as string]: '#ffffff' }}
            >
              {p.icon}
            </button>
          ))}
          <button
            type="button"
            onClick={saveAndClear}
            aria-label="그림 저장"
            className="btn-3d mt-auto flex h-touch w-touch items-center justify-center rounded-2xl text-4xl"
            style={{ ['--btn' as string]: '#bbf7d0' }}
          >
            💾
          </button>
        </div>
      )}
    </div>
  )
}

function ToolButton({
  label,
  active,
  onClick,
  style,
  children,
}: {
  label: string
  active: boolean
  onClick: () => void
  style: React.CSSProperties
  children?: string
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={() => {
        playSfx('tap')
        onClick()
      }}
      className={`btn-3d flex h-14 w-14 items-center justify-center rounded-full text-3xl ${
        active ? 'ring-4 ring-cocoa' : ''
      }`}
      style={{ ...style, ['--btn' as string]: String(style.backgroundColor ?? '#fff') }}
      whileTap={{ scale: 0.9 }}
      animate={active ? { scale: 1.18, y: -4 } : { scale: 1, y: 0 }}
    >
      {children}
    </motion.button>
  )
}

function Gallery({ onBack }: { onBack: () => void }) {
  const [works, setWorks] = useState<Artwork[] | null>(null)
  const [open, setOpen] = useState<Artwork | null>(null)

  useEffect(() => {
    void say('art.gallery')
    gallery.list().then(setWorks).catch(() => setWorks([]))
  }, [])

  if (open) {
    const picture = pictures.find((p) => p.id === open.pictureId) ?? pictures[0]
    return (
      <div className="flex h-full w-full items-center justify-center p-4 pt-16" onClick={() => setOpen(null)}>
        <Canvas picture={picture} drawing={open} tool={{ color: '' }} onChange={() => {}} readOnly className="max-h-full" />
      </div>
    )
  }

  return (
    <div className="h-full w-full overflow-y-auto p-4 pt-16 pl-20">
      <button
        type="button"
        onClick={onBack}
        aria-label="뒤로"
        className="absolute top-3 right-3 z-40 flex h-touch w-touch items-center justify-center rounded-full bg-white/90 text-4xl shadow-lg active:scale-90"
      >
        ↩️
      </button>
      {works && works.length === 0 && (
        <div className="flex h-full items-center justify-center text-8xl opacity-60">🖼️</div>
      )}
      <div className="grid grid-cols-3 gap-4 md:grid-cols-4">
        {works?.map((w) => {
          const picture = pictures.find((p) => p.id === w.pictureId) ?? pictures[0]
          return (
            <button key={w.id} type="button" onClick={() => setOpen(w)} aria-label={`저장한 ${picture.name}`} className="active:scale-95">
              <Canvas picture={picture} drawing={w} tool={{ color: '' }} onChange={() => {}} readOnly className="w-full" />
            </button>
          )
        })}
      </div>
    </div>
  )
}

import { motion } from 'framer-motion'
import { useState } from 'react'
import type { Stamp } from '@/core/gallery'
import { playSfx } from '@/core/sound'
import { say } from '@/core/voice'
import type { Picture } from './pictures'
import { SvgPic } from '@/ui/Pic'

export interface Drawing {
  fills: Record<string, string>
  stamps: Stamp[]
}

interface Props {
  picture: Picture
  drawing: Drawing
  /** 선택한 색, 또는 스탬프 */
  tool: { color: string } | { stamp: string }
  onChange: (d: Drawing) => void
  readOnly?: boolean
  className?: string
}

/** 밑그림 SVG. 칸을 탭하면 색이 채워지고, 스탬프 도구면 그 자리에 도장이 찍힌다. */
export function Canvas({ picture, drawing, tool, onChange, readOnly, className = '' }: Props) {
  const [bump, setBump] = useState<string | null>(null)

  const fillRegion = (id: string) => {
    if (readOnly || !('color' in tool)) return
    playSfx('pop')
    setBump(id)
    onChange({ ...drawing, fills: { ...drawing.fills, [id]: tool.color } })
  }

  const stampAt = (e: React.PointerEvent<SVGSVGElement>) => {
    if (readOnly || !('stamp' in tool)) return
    const svg = e.currentTarget
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.getScreenCTM()!.inverse())
    playSfx('sparkle')
    void say('art.stamp')
    onChange({ ...drawing, stamps: [...drawing.stamps, { x: pt.x, y: pt.y, emoji: tool.stamp }] })
  }

  return (
    <svg
      viewBox={picture.viewBox}
      className={`touch-none select-none rounded-3xl bg-white shadow-lg ${className}`}
      onPointerDown={stampAt}
      role="img"
      aria-label={picture.name}
    >
      {picture.regions.map((r) => (
        <motion.path
          key={r.id}
          d={r.d}
          fill={drawing.fills[r.id] ?? '#ffffff'}
          stroke="#374151"
          strokeWidth={4}
          strokeLinejoin="round"
          onPointerDown={(e) => {
            if ('color' in tool) {
              e.stopPropagation()
              fillRegion(r.id)
            }
          }}
          animate={bump === r.id ? { scale: [1, 1.06, 1] } : { scale: 1 }}
          transition={{ duration: 0.25 }}
          onAnimationComplete={() => bump === r.id && setBump(null)}
          style={{ transformOrigin: 'center', transformBox: 'fill-box', cursor: 'pointer' }}
          aria-label={`${r.id} 칸`}
        />
      ))}
      {picture.lines?.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#374151" strokeWidth={4} strokeLinecap="round" />
      ))}
      {drawing.stamps.map((s, i) => (
        <SvgPic key={i} emoji={s.emoji} x={s.x - 22} y={s.y - 22} size={44} />
      ))}
    </svg>
  )
}

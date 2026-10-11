import { Howler } from 'howler'
import { useSettings } from './settings'

/**
 * 효과음.
 * 효과음 파일(Kenney CC0 등)은 아직 출처를 정하지 않았으므로, 지금은 WebAudio로 짧은 소리를 직접 만든다.
 * 파일로 바꿀 때는 이 파일의 play 구현만 교체하고 CREDITS.md에 출처를 적는다.
 */
export type Sfx = 'tap' | 'pop' | 'open' | 'correct' | 'wrong' | 'sticker' | 'sparkle'

let unlocked = false

/** "탭해서 시작"에서 호출. 브라우저가 첫 터치 전에 막아 둔 소리를 켠다. */
export async function unlockAudio() {
  const ctx = Howler.ctx as AudioContext | undefined
  if (ctx && ctx.state !== 'running') {
    try {
      await ctx.resume()
    } catch {
      /* 일부 브라우저는 이후 터치에서 다시 시도한다 */
    }
  }
  unlocked = true
  applyVolume()
}

function applyVolume() {
  Howler.volume(useSettings.getState().volume)
}
useSettings.subscribe(applyVolume)

function ctx(): AudioContext | null {
  const c = Howler.ctx as AudioContext | undefined
  return c && c.state === 'running' ? c : null
}

function tone(
  c: AudioContext,
  freq: number,
  start: number,
  dur: number,
  type: OscillatorType = 'sine',
  gain = 0.25,
) {
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, start)
  g.gain.setValueAtTime(0, start)
  g.gain.linearRampToValueAtTime(gain * useSettings.getState().volume, start + 0.01)
  g.gain.exponentialRampToValueAtTime(0.001, start + dur)
  osc.connect(g).connect(c.destination)
  osc.start(start)
  osc.stop(start + dur + 0.05)
  return osc
}

export function playSfx(name: Sfx) {
  if (!unlocked) return
  const c = ctx()
  if (!c) return
  const t = c.currentTime
  switch (name) {
    case 'tap':
      tone(c, 660, t, 0.08, 'triangle', 0.15)
      break
    case 'sparkle':
      tone(c, 1320, t, 0.12, 'sine', 0.08)
      tone(c, 1760, t + 0.04, 0.12, 'sine', 0.06)
      break
    case 'pop': {
      const o = tone(c, 900, t, 0.12, 'square', 0.12)
      o.frequency.exponentialRampToValueAtTime(200, t + 0.12)
      break
    }
    case 'open': {
      const o = tone(c, 300, t, 0.35, 'triangle', 0.2)
      o.frequency.exponentialRampToValueAtTime(900, t + 0.3)
      break
    }
    case 'correct':
      tone(c, 523, t, 0.18, 'triangle')
      tone(c, 659, t + 0.12, 0.18, 'triangle')
      tone(c, 784, t + 0.24, 0.3, 'triangle')
      break
    case 'wrong':
      // 부드럽게: 낮은 두 음이 살짝 내려감. 벌점 느낌 없음
      tone(c, 330, t, 0.15, 'sine', 0.18)
      tone(c, 294, t + 0.16, 0.25, 'sine', 0.18)
      break
    case 'sticker':
      tone(c, 523, t, 0.15, 'triangle')
      tone(c, 659, t + 0.12, 0.15, 'triangle')
      tone(c, 784, t + 0.24, 0.15, 'triangle')
      tone(c, 1047, t + 0.36, 0.5, 'triangle', 0.3)
      break
  }
}

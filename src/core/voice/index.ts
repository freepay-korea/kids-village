import { Howl } from 'howler'
import common from './ko.json'

/**
 * 마스코트 대사·단어 음성.
 *
 * 규칙: 정해진 대사는 미리 만든 음성 파일(public/assets/voice/ko/<file>.mp3)을 재생한다.
 * 안드로이드 WebView는 Web Speech API를 지원하지 않고 기기마다 목소리가 달라서 기기 TTS에 기대면 안 된다.
 * 다만 개발 중에는 파일이 아직 없는 대사를 브라우저 TTS로 "임시" 재생한다. 출시 전 모두 파일로 교체하고,
 * 임시 TTS 코드는 이 파일 밖으로 나가면 안 된다.
 *
 * 대사는 `문장 ↔ 음성 파일` 쌍으로 ko.json에 둔다. 게임별 대사는 게임이 registerLines로 등록한다.
 * 영어를 추가할 때는 en.json과 영어 음성 파일만 늘린다.
 */
export interface VoiceLine {
  text: string
  /** public/assets/voice/<lang>/<file>.mp3 의 file 부분. 없으면 항상 임시 TTS */
  file?: string
}

export type VoiceLines = Record<string, VoiceLine>

const lang = 'ko'
const lines: VoiceLines = { ...common }
const howls = new Map<string, Howl>()
const missing = new Set<string>()
let current: Howl | null = null

export function registerLines(extra: VoiceLines) {
  Object.assign(lines, extra)
}

export function lineText(key: string): string {
  return lines[key]?.text ?? key
}

function fileUrl(file: string) {
  return `${import.meta.env.BASE_URL}assets/voice/${lang}/${file}.mp3`
}

/** 대사 키를 말한다. 돌아오는 Promise는 재생이 끝나면(또는 못 하면) 해결된다. */
export function say(key: string): Promise<void> {
  const line = lines[key]
  const text = line?.text ?? key
  stop()
  if (line?.file && !missing.has(line.file)) {
    return playFile(line.file).catch(() => {
      missing.add(line.file!)
      if (import.meta.env.DEV) console.warn(`[voice] 음성 파일 없음 → 임시 TTS: ${line.file} ("${text}")`)
      return speakTemporarily(text)
    })
  }
  return speakTemporarily(text)
}

export function stop() {
  current?.stop()
  current = null
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}

function playFile(file: string) {
  return new Promise<void>((resolve, reject) => {
    let howl = howls.get(file)
    if (!howl) {
      howl = new Howl({ src: [fileUrl(file)], preload: true })
      howls.set(file, howl)
    }
    const h = howl
    h.once('loaderror', () => reject(new Error('loaderror')))
    h.once('playerror', () => reject(new Error('playerror')))
    h.once('end', () => resolve())
    current = h
    h.play()
  })
}

/** 개발 중 임시 대체. 파일이 생기면 자연히 쓰이지 않는다. */
function speakTemporarily(text: string) {
  return new Promise<void>((resolve) => {
    if (!('speechSynthesis' in window)) return resolve()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'ko-KR'
    u.rate = 0.95
    u.pitch = 1.2
    u.onend = () => resolve()
    u.onerror = () => resolve()
    window.speechSynthesis.speak(u)
  })
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { deviceStorage } from './storage'

export type PlayTimeMinutes = 0 | 15 | 30

export interface Settings {
  /** 0~1 */
  volume: number
  bgm: boolean
  /** 난이도 쉬움 고정 (보기 수 늘리지 않음) */
  easyMode: boolean
  /** 놀이 시간 알림. 0이면 끔 */
  playTimeMinutes: PlayTimeMinutes
  haptics: boolean
}

interface SettingsState extends Settings {
  set: (patch: Partial<Settings>) => void
}

/** 부모 설정. 기기 안에만 저장된다. */
export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      volume: 0.8,
      bgm: true,
      easyMode: false,
      playTimeMinutes: 0,
      haptics: true,
      set: (patch) => set(patch),
    }),
    { name: 'kv-settings', storage: deviceStorage },
  ),
)

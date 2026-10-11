import { create } from 'zustand'

/**
 * 앱을 켜고 끌 때까지만 유지되는 상태(저장 안 함).
 * started: "탭해서 시작"을 눌렀는지. 웹은 첫 터치 전에 소리를 못 내므로 이 탭에서 소리를 켠다.
 */
interface SessionState {
  started: boolean
  start: () => void
}

export const useSession = create<SessionState>((set) => ({
  started: false,
  start: () => set({ started: true }),
}))

import { createJSONStorage } from 'zustand/middleware'

/**
 * 저장은 기기 안에만 한다(계정·서버 없음).
 * 지금은 localStorage. 12단계 앱 빌드에서 필요하면 Capacitor Preferences로 바꾸되, 이 파일만 고친다.
 */
export const deviceStorage = createJSONStorage(() => localStorage)

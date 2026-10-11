import { useSettings } from './settings'

/** 정답 시 짧은 진동. 웹은 navigator.vibrate, 앱은 12단계에서 Capacitor Haptics로 교체. */
export function haptic(pattern: number | number[] = 30) {
  if (!useSettings.getState().haptics) return
  try {
    navigator.vibrate?.(pattern)
  } catch {
    /* 지원 안 하는 기기 */
  }
}

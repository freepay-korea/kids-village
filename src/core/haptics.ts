import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { useSettings } from './settings'

/**
 * 정답 시 짧은 진동. 앱(Capacitor)에서는 Haptics 플러그인, 웹에서는 navigator.vibrate.
 * 설정에서 끌 수 있다.
 */
export function haptic(pattern: number | number[] = 30) {
  if (!useSettings.getState().haptics) return
  if (Capacitor.isNativePlatform()) {
    const times = Array.isArray(pattern) ? Math.ceil(pattern.length / 2) : 1
    void (async () => {
      for (let i = 0; i < times; i++) {
        await Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {})
        if (i < times - 1) await new Promise((r) => setTimeout(r, 90))
      }
    })()
    return
  }
  try {
    navigator.vibrate?.(pattern)
  } catch {
    /* 지원 안 하는 기기 */
  }
}

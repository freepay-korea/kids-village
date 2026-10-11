import { Capacitor } from '@capacitor/core'
import { App } from '@capacitor/app'
import { stop } from './voice'

/**
 * 앱(Capacitor)에서만 동작하는 것들.
 * - 안드로이드 뒤로가기: 게임 안이면 마을로, 마을이면 아무것도 안 함 (아이가 실수로 앱을 끄지 않게)
 * - 백그라운드로 가면 음성 정지
 */
export function setupNative(goHome: () => void) {
  if (!Capacitor.isNativePlatform()) return
  void App.addListener('backButton', () => {
    if (window.location.hash && window.location.hash !== '#/') goHome()
  })
  void App.addListener('appStateChange', ({ isActive }) => {
    if (!isActive) stop()
  })
}

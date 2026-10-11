import { registerSW } from 'virtual:pwa-register'

/**
 * 서비스 워커 등록. 첫 실행 후에는 인터넷 없이도 동작한다.
 * 새 버전이 있으면 다음 실행 때 조용히 바뀐다 (아이에게 업데이트 안내창을 띄우지 않는다).
 */
export function setupPwa() {
  if (!('serviceWorker' in navigator)) return
  registerSW({ immediate: true })
}

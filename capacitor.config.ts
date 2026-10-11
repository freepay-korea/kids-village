import type { CapacitorConfig } from '@capacitor/cli'

/**
 * 안드로이드 앱 설정. 같은 dist/를 WebView로 감싼다.
 * appId는 출시 후 바꿀 수 없다. 아직 미정이라 임시값이며, `npx cap add android` 하기 전에 확정해야 한다.
 * 앱 안에서는 file:// 대신 https://localhost 로 서빙되므로 Vite base는 '/'로 빌드한다 (npm run build:app).
 */
const config: CapacitorConfig = {
  appId: 'com.example.kidsvillage', // TODO: 앱 ID 확정 후 교체 (12단계)
  appName: '아이 게임 마을',
  webDir: 'dist',
  android: {
    // 자식용: 전체화면, 아이가 확대/축소 못 하게
    allowMixedContent: false,
    backgroundColor: '#bae6fd',
  },
  server: {
    androidScheme: 'https',
  },
}

export default config

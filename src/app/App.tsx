import { HashRouter, Route, Routes } from 'react-router-dom'
import { Village } from './Village'
import { GameRoute } from './GameRoute'

/**
 * 화면 이동은 해시 방식(#/farm)을 쓴다.
 * GitHub Pages 같은 정적 호스팅에서 하위 경로를 새로고침해도 404가 나지 않고,
 * Capacitor WebView(file://)에서도 그대로 동작한다.
 */
export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Village />} />
        <Route path="/:gameId" element={<GameRoute />} />
      </Routes>
    </HashRouter>
  )
}

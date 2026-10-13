import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { HashRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useSession } from '@/core/session'
import { usePlayTimer } from '@/core/playTimer'
import { setupNative } from '@/core/native'
import { Village } from './Village'
import { GameRoute } from './GameRoute'
import { StartScreen } from './StartScreen'
import { RotateOverlay } from './RotateOverlay'
import { StickerBookRoute } from './StickerBookRoute'
import { SettingsRoute } from './SettingsRoute'
import { TapSparkles } from '@/ui/TapSparkles'

/**
 * 화면 이동은 해시 방식(#/farm)을 쓴다.
 * GitHub Pages 같은 정적 호스팅에서 하위 경로를 새로고침해도 404가 나지 않고,
 * Capacitor WebView(file://)에서도 그대로 동작한다.
 */
export function App() {
  return (
    <HashRouter>
      <RotateOverlay />
      <TapSparkles />
      <Screens />
    </HashRouter>
  )
}

function Screens() {
  const started = useSession((s) => s.started)
  const location = useLocation()
  const navigate = useNavigate()
  usePlayTimer()
  useEffect(() => setupNative(() => navigate('/')), [navigate])

  return (
    <AnimatePresence mode="wait" initial={false}>
      {!started ? (
        <StartScreen key="start" />
      ) : (
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Village />} />
          <Route path="/stickers" element={<StickerBookRoute />} />
          <Route path="/settings" element={<SettingsRoute />} />
          <Route path="/:gameId" element={<GameRoute />} />
        </Routes>
      )}
    </AnimatePresence>
  )
}

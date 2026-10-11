import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

// GitHub Pages는 https://<계정>.github.io/kids-village/ 아래에 올라가므로
// base를 저장소 이름으로 맞춘다. 다른 곳(커스텀 도메인, Vercel)에 올릴 때는
// 빌드 시 VITE_BASE=/ 처럼 환경변수로 바꾼다. 화면 이동은 해시 라우팅이라
// base가 무엇이든 새로고침해도 깨지지 않는다. PWA scope/start_url도 같은 base를 쓴다.
const base = process.env.VITE_BASE ?? '/kids-village/'

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png', 'icons/icon.svg', 'assets/**/*'],
      manifest: {
        name: '아이 게임 마을',
        short_name: '게임 마을',
        description: '광고 없는 2~5세 아이용 게임 마을',
        lang: 'ko',
        start_url: base,
        scope: base,
        display: 'fullscreen',
        orientation: 'landscape',
        background_color: '#bae6fd',
        theme_color: '#fde68a',
        categories: ['kids', 'education', 'games'],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // 첫 실행 후 오프라인 플레이: 빌드 결과와 public/assets(그림·소리)를 모두 미리 캐시
        globPatterns: ['**/*.{js,css,html,svg,png,webp,mp3,ogg,json,woff2}'],
        navigateFallback: `${base}index.html`,
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2020',
  },
})

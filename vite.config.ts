import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// GitHub Pages는 https://<계정>.github.io/kids-village/ 아래에 올라가므로
// base를 저장소 이름으로 맞춘다. 다른 곳(커스텀 도메인, Vercel)에 올릴 때는
// 빌드 시 VITE_BASE=/ 처럼 환경변수로 바꾼다. 화면 이동은 해시 라우팅이라
// base가 무엇이든 새로고침해도 깨지지 않는다.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/kids-village/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2020',
  },
})

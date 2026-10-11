import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { deviceStorage } from './storage'

/** 스티커 한 장. 그림은 MVP용 이모지, 출시 전 일러스트로 교체 */
export interface Sticker {
  id: string
  name: string
  icon: string
}

/** 건물마다 6종. 미션을 완료할 때마다 아직 없는 것 중 하나를 받는다. */
export const stickerCatalog: Record<string, Sticker[]> = {
  garage: [
    { id: 'car', name: '자동차', icon: '🚗' },
    { id: 'bus', name: '버스', icon: '🚌' },
    { id: 'fire', name: '소방차', icon: '🚒' },
    { id: 'police', name: '경찰차', icon: '🚓' },
    { id: 'truck', name: '트럭', icon: '🚚' },
    { id: 'tractor', name: '트랙터', icon: '🚜' },
  ],
  'word-school': [
    { id: 'apple', name: '사과', icon: '🍎' },
    { id: 'banana', name: '바나나', icon: '🍌' },
    { id: 'book', name: '책', icon: '📚' },
    { id: 'pencil', name: '연필', icon: '✏️' },
    { id: 'star', name: '별', icon: '⭐' },
    { id: 'bag', name: '가방', icon: '🎒' },
  ],
  farm: [
    { id: 'cow', name: '소', icon: '🐄' },
    { id: 'pig', name: '돼지', icon: '🐷' },
    { id: 'chick', name: '병아리', icon: '🐥' },
    { id: 'sheep', name: '양', icon: '🐑' },
    { id: 'duck', name: '오리', icon: '🦆' },
    { id: 'horse', name: '말', icon: '🐴' },
  ],
  'balloon-park': [
    { id: 'red', name: '빨간 풍선', icon: '🎈' },
    { id: 'kite', name: '연', icon: '🪁' },
    { id: 'rainbow', name: '무지개', icon: '🌈' },
    { id: 'sun', name: '해', icon: '☀️' },
    { id: 'cloud', name: '구름', icon: '☁️' },
    { id: 'butterfly', name: '나비', icon: '🦋' },
  ],
  'art-museum': [
    { id: 'palette', name: '팔레트', icon: '🎨' },
    { id: 'brush', name: '붓', icon: '🖌️' },
    { id: 'crayon', name: '크레용', icon: '🖍️' },
    { id: 'frame', name: '액자', icon: '🖼️' },
    { id: 'flower', name: '꽃', icon: '🌷' },
    { id: 'heart', name: '하트', icon: '💖' },
  ],
}

interface StickerState {
  /** 건물 id → 받은 스티커 id 목록 (받은 순서) */
  earned: Record<string, string[]>
  /** 건물의 스티커를 한 장 지급한다. 특정 id를 주면 그걸, 없으면 아직 없는 것 중 첫 번째. 받은 스티커를 돌려준다. */
  award: (gameId: string, stickerId?: string) => Sticker | null
  count: (gameId: string) => number
  has: (gameId: string, stickerId: string) => boolean
  reset: () => void
}

export const useStickers = create<StickerState>()(
  persist(
    (set, get) => ({
      earned: {},
      award: (gameId, stickerId) => {
        const catalog = stickerCatalog[gameId] ?? []
        const have = get().earned[gameId] ?? []
        const target =
          (stickerId && catalog.find((s) => s.id === stickerId)) ||
          catalog.find((s) => !have.includes(s.id)) ||
          catalog[have.length % Math.max(catalog.length, 1)]
        if (!target) return null
        if (!have.includes(target.id)) {
          set({ earned: { ...get().earned, [gameId]: [...have, target.id] } })
        }
        return target
      },
      count: (gameId) => (get().earned[gameId] ?? []).length,
      has: (gameId, stickerId) => (get().earned[gameId] ?? []).includes(stickerId),
      reset: () => set({ earned: {} }),
    }),
    { name: 'kv-stickers', storage: deviceStorage },
  ),
)

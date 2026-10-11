import type { GameMeta } from './types'

/**
 * 건물 목록. 새 건물은 games/ 아래 폴더를 만들고 여기 한 줄만 추가한다.
 * 순서가 마을 지도에 놓이는 순서다.
 */
export const games: GameMeta[] = [
  {
    id: 'garage',
    name: '부릉부릉 차고',
    icon: '🚗',
    color: '#fb923c',
    minAge: 2,
    locked: false,
    load: () => import('./garage'),
  },
  {
    id: 'word-school',
    name: '콕콕 단어 학교',
    icon: '🏫',
    color: '#facc15',
    minAge: 2,
    locked: false,
    load: () => import('./word-school'),
  },
  {
    id: 'farm',
    name: '동물 농장',
    icon: '🐄',
    color: '#4ade80',
    minAge: 2,
    locked: false,
    load: () => import('./farm'),
  },
  {
    id: 'balloon-park',
    name: '풍선 공원',
    icon: '🎈',
    color: '#38bdf8',
    minAge: 2,
    locked: false,
    load: () => import('./balloon-park'),
  },
  {
    id: 'art-museum',
    name: '미술관',
    icon: '🎨',
    color: '#a78bfa',
    minAge: 3,
    locked: false,
    load: () => import('./art-museum'),
  },
]

export function findGame(id: string): GameMeta | undefined {
  return games.find((g) => g.id === id)
}

import type { Item } from '../shared/types'

/**
 * 콕콕 단어 42단어.
 * 원래 콕콕 단어 앱의 42단어 목록이 저장소에 없어 기본 어휘로 채웠다. 원본 목록이 있으면 여기만 바꾸면 된다.
 * 동물 8종은 동물 농장과 같은 그림을 쓴다.
 */
export interface WordCategory {
  id: string
  icon: string
  name: string
  words: Item[]
}

const w = (id: string, icon: string, name: string): Item => ({
  id,
  icon,
  name,
  voiceKey: `word.${id}`,
  questionKey: `word.${id}`,
})

export const categories: WordCategory[] = [
  {
    id: 'food',
    icon: '🍎',
    name: '먹을 것',
    words: [
      w('apple', '🍎', '사과'),
      w('banana', '🍌', '바나나'),
      w('grape', '🍇', '포도'),
      w('strawberry', '🍓', '딸기'),
      w('watermelon', '🍉', '수박'),
      w('carrot', '🥕', '당근'),
      w('milk', '🥛', '우유'),
      w('bread', '🍞', '빵'),
    ],
  },
  {
    id: 'animal',
    icon: '🐶',
    name: '동물',
    words: [
      w('cow', '🐄', '소'),
      w('pig', '🐷', '돼지'),
      w('chick', '🐥', '병아리'),
      w('sheep', '🐑', '양'),
      w('duck', '🦆', '오리'),
      w('horse', '🐴', '말'),
      w('dog', '🐶', '강아지'),
      w('cat', '🐱', '고양이'),
    ],
  },
  {
    id: 'vehicle',
    icon: '🚗',
    name: '탈것',
    words: [
      w('car', '🚗', '자동차'),
      w('bus', '🚌', '버스'),
      w('train', '🚂', '기차'),
      w('plane', '✈️', '비행기'),
      w('boat', '⛵', '배'),
      w('bike', '🚲', '자전거'),
    ],
  },
  {
    id: 'thing',
    icon: '⚽',
    name: '물건',
    words: [
      w('ball', '⚽', '공'),
      w('book', '📚', '책'),
      w('pencil', '✏️', '연필'),
      w('bag', '🎒', '가방'),
      w('umbrella', '☂️', '우산'),
      w('clock', '⏰', '시계'),
      w('chair', '🪑', '의자'),
      w('cup', '🥤', '컵'),
    ],
  },
  {
    id: 'body',
    icon: '👟',
    name: '몸과 옷',
    words: [
      w('hat', '🧢', '모자'),
      w('shoes', '👟', '신발'),
      w('socks', '🧦', '양말'),
      w('hand', '🖐️', '손'),
      w('eyes', '👀', '눈'),
      w('foot', '🦶', '발'),
    ],
  },
  {
    id: 'nature',
    icon: '🌷',
    name: '자연',
    words: [
      w('sun', '☀️', '해'),
      w('moon', '🌙', '달'),
      w('star', '⭐', '별'),
      w('flower', '🌷', '꽃'),
      w('tree', '🌳', '나무'),
      w('rain', '🌧️', '비'),
    ],
  },
]

export const allWords: Item[] = categories.flatMap((c) => c.words)

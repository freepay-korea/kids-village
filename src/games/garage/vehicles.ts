import type { Item } from '../shared/types'

/** 부릉부릉 차고 소리 도감. 그림은 MVP용 이모지, 소리 파일은 CC0 출처로 준비 후 CREDITS.md에 기록 */
export const vehicles: Item[] = [
  { id: 'car', icon: '🚗', name: '자동차', voiceKey: 'garage.car', questionKey: 'garage.car' },
  { id: 'bus', icon: '🚌', name: '버스', voiceKey: 'garage.bus', questionKey: 'garage.bus' },
  { id: 'fire', icon: '🚒', name: '소방차', voiceKey: 'garage.fire', questionKey: 'garage.fire' },
  { id: 'police', icon: '🚓', name: '경찰차', voiceKey: 'garage.police', questionKey: 'garage.police' },
  { id: 'truck', icon: '🚚', name: '트럭', voiceKey: 'garage.truck', questionKey: 'garage.truck' },
  { id: 'tractor', icon: '🚜', name: '트랙터', voiceKey: 'garage.tractor', questionKey: 'garage.tractor' },
  { id: 'train', icon: '🚂', name: '기차', voiceKey: 'garage.train', questionKey: 'garage.train' },
  { id: 'plane', icon: '✈️', name: '비행기', voiceKey: 'garage.plane', questionKey: 'garage.plane' },
]
